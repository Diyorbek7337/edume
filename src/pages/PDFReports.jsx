import { useState, useEffect } from 'react';
import { 
  FileText, Download, Users, Calendar, TrendingUp, CreditCard,
  Filter, Printer, BarChart3, PieChart, Award, Clock
} from 'lucide-react';
import { Card, Button, Select, Badge, Loading } from '../components/common';
import { 
  studentsAPI, groupsAPI, gradesAPI, attendanceAPI, paymentsAPI, 
  teachersAPI, homeworkAPI, quizAPI 
} from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { ROLES } from '../utils/constants';
import { formatDate, formatMoney, toISODateString } from '../utils/helpers';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const PDFReports = () => {
  const { userData, role } = useAuth();
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [groups, setGroups] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [reportType, setReportType] = useState('student-progress');
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  const isAdmin = role === ROLES.ADMIN || role === ROLES.DIRECTOR;

  useEffect(() => { fetchData(); }, []);
  useEffect(() => { if (selectedGroup) fetchStudents(); }, [selectedGroup]);

  const fetchData = async () => {
    try {
      const groupsData = await groupsAPI.getAll();
      setGroups(groupsData);
      if (groupsData.length > 0) {
        setSelectedGroup(groupsData[0].id);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchStudents = async () => {
    try {
      const studentsData = await studentsAPI.getByGroup(selectedGroup);
      setStudents(studentsData);
    } catch (err) { console.error(err); }
  };

  // ==================== PDF GENERATSIYA ====================

  const generateStudentProgressReport = async () => {
    setGenerating(true);
    try {
      const student = students.find(s => s.id === selectedStudent);
      if (!student) {
        toast.error("O'quvchini tanlang");
        return;
      }

      const [grades, attendance, payments, homework, quizResults] = await Promise.all([
        gradesAPI.getByGroup(selectedGroup),
        attendanceAPI.getByGroup(selectedGroup),
        paymentsAPI.getAll(),
        homeworkAPI.getByGroup(selectedGroup),
        quizAPI.getByGroup(selectedGroup)
      ]);

      // O'quvchining ma'lumotlarini filter
      const myGrades = grades.filter(g => g.studentId === selectedStudent);
      const myAttendance = attendance.filter(a => a.studentId === selectedStudent);
      const myPayments = payments.filter(p => p.studentId === selectedStudent);
      
      // Homework submissions
      const homeworkWithSubs = await Promise.all(
        homework.map(async (hw) => {
          const subs = await homeworkAPI.getSubmissions(hw.id);
          return { ...hw, submission: subs.find(s => s.studentId === selectedStudent) };
        })
      );

      // Quiz results
      const quizWithResults = await Promise.all(
        quizResults.map(async (q) => {
          const results = await quizAPI.getResults(q.id);
          return { ...q, result: results.find(r => r.studentId === selectedStudent) };
        })
      );

      // PDF yaratish
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      
      // Header
      doc.setFontSize(20);
      doc.setTextColor(59, 130, 246);
      doc.text("O'quvchi Progress Hisoboti", pageWidth / 2, 20, { align: 'center' });
      
      doc.setFontSize(12);
      doc.setTextColor(100);
      doc.text(`Sana: ${formatDate(new Date())}`, pageWidth / 2, 28, { align: 'center' });

      // O'quvchi ma'lumotlari
      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.text("O'quvchi ma'lumotlari", 14, 45);
      
      doc.setFontSize(11);
      doc.text(`Ism: ${student.fullName}`, 14, 55);
      doc.text(`Telefon: ${student.phone || '-'}`, 14, 62);
      doc.text(`Guruh: ${groups.find(g => g.id === selectedGroup)?.name || '-'}`, 14, 69);

      // Statistika
      const gradeAvg = myGrades.length > 0 
        ? Math.round(myGrades.reduce((sum, g) => sum + (g.grade / g.maxGrade) * 100, 0) / myGrades.length)
        : 0;
      
      const attendancePresent = myAttendance.filter(a => a.status === 'present').length;
      const attendanceTotal = myAttendance.length;
      const attendancePercent = attendanceTotal > 0 ? Math.round((attendancePresent / attendanceTotal) * 100) : 0;
      
      const totalPaid = myPayments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
      const totalDebt = myPayments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);

      doc.setFontSize(14);
      doc.text("Umumiy statistika", 14, 85);
      
      // Statistika jadval
      doc.autoTable({
        startY: 90,
        head: [['Ko\'rsatkich', 'Qiymat']],
        body: [
          ["O'rtacha baho", `${gradeAvg}%`],
          ['Davomat', `${attendancePercent}% (${attendancePresent}/${attendanceTotal})`],
          ["To'langan", formatMoney(totalPaid)],
          ['Qarzdorlik', formatMoney(totalDebt)],
          ['Uy vazifalari', `${homeworkWithSubs.filter(h => h.submission).length}/${homeworkWithSubs.length}`],
          ['Testlar', `${quizWithResults.filter(q => q.result).length}/${quizWithResults.length}`],
        ],
        theme: 'grid',
        headStyles: { fillColor: [59, 130, 246] },
      });

      // Baholar
      if (myGrades.length > 0) {
        doc.addPage();
        doc.setFontSize(14);
        doc.text("Baholar", 14, 20);

        doc.autoTable({
          startY: 25,
          head: [['Sana', 'Mavzu', 'Baho', 'Max', 'Foiz']],
          body: myGrades.slice(-20).map(g => [
            formatDate(g.date || g.createdAt),
            g.topic || '-',
            g.grade,
            g.maxGrade,
            `${Math.round((g.grade / g.maxGrade) * 100)}%`
          ]),
          theme: 'striped',
          headStyles: { fillColor: [59, 130, 246] },
        });
      }

      // Davomat
      if (myAttendance.length > 0) {
        const currentY = doc.lastAutoTable?.finalY || 25;
        if (currentY > 200) doc.addPage();
        
        doc.setFontSize(14);
        doc.text("Davomat", 14, currentY > 200 ? 20 : currentY + 15);

        const statusMap = { present: 'Keldi', absent: 'Kelmadi', late: 'Kechikdi', excused: 'Sababli' };
        
        doc.autoTable({
          startY: currentY > 200 ? 25 : currentY + 20,
          head: [['Sana', 'Holat']],
          body: myAttendance.slice(-30).map(a => [
            a.date,
            statusMap[a.status] || a.status
          ]),
          theme: 'striped',
          headStyles: { fillColor: [59, 130, 246] },
        });
      }

      // Saqlash
      doc.save(`${student.fullName}_progress_${formatDate(new Date(), 'yyyy-MM-dd')}.pdf`);
      toast.success("Hisobot yaratildi!");
      
    } catch (err) {
      console.error(err);
      toast.error("Xatolik yuz berdi");
    }
    finally { setGenerating(false); }
  };

  const generateGroupReport = async () => {
    setGenerating(true);
    try {
      const group = groups.find(g => g.id === selectedGroup);
      if (!group) return;

      const [studentsData, grades, attendance] = await Promise.all([
        studentsAPI.getByGroup(selectedGroup),
        gradesAPI.getByGroup(selectedGroup),
        attendanceAPI.getByGroup(selectedGroup)
      ]);

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();

      // Header
      doc.setFontSize(20);
      doc.setTextColor(59, 130, 246);
      doc.text("Guruh Hisoboti", pageWidth / 2, 20, { align: 'center' });
      
      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.text(`Guruh: ${group.name}`, pageWidth / 2, 30, { align: 'center' });
      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(`Sana: ${formatDate(new Date())}`, pageWidth / 2, 38, { align: 'center' });

      // O'quvchilar statistikasi
      const studentStats = studentsData.map(student => {
        const myGrades = grades.filter(g => g.studentId === student.id);
        const myAttendance = attendance.filter(a => a.studentId === student.id);
        
        const gradeAvg = myGrades.length > 0 
          ? Math.round(myGrades.reduce((sum, g) => sum + (g.grade / g.maxGrade) * 100, 0) / myGrades.length)
          : 0;
        
        const attendancePresent = myAttendance.filter(a => a.status === 'present').length;
        const attendanceTotal = myAttendance.length;
        const attendancePercent = attendanceTotal > 0 ? Math.round((attendancePresent / attendanceTotal) * 100) : 0;

        return {
          name: student.fullName,
          gradeAvg,
          attendancePercent,
          gradesCount: myGrades.length,
          attendanceCount: attendanceTotal
        };
      });

      // Jadval
      doc.autoTable({
        startY: 50,
        head: [["O'quvchi", "O'rtacha baho", 'Davomat', 'Baholar soni']],
        body: studentStats
          .sort((a, b) => b.gradeAvg - a.gradeAvg)
          .map((s, idx) => [
            `${idx + 1}. ${s.name}`,
            `${s.gradeAvg}%`,
            `${s.attendancePercent}%`,
            s.gradesCount
          ]),
        theme: 'grid',
        headStyles: { fillColor: [59, 130, 246] },
      });

      // Umumiy statistika
      const avgGrade = studentStats.length > 0
        ? Math.round(studentStats.reduce((sum, s) => sum + s.gradeAvg, 0) / studentStats.length)
        : 0;
      const avgAttendance = studentStats.length > 0
        ? Math.round(studentStats.reduce((sum, s) => sum + s.attendancePercent, 0) / studentStats.length)
        : 0;

      const finalY = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(12);
      doc.text(`Guruh o'rtacha bahosi: ${avgGrade}%`, 14, finalY);
      doc.text(`Guruh o'rtacha davomati: ${avgAttendance}%`, 14, finalY + 7);
      doc.text(`Jami o'quvchilar: ${studentsData.length}`, 14, finalY + 14);

      doc.save(`${group.name}_hisobot_${formatDate(new Date(), 'yyyy-MM-dd')}.pdf`);
      toast.success("Hisobot yaratildi!");
      
    } catch (err) {
      console.error(err);
      toast.error("Xatolik yuz berdi");
    }
    finally { setGenerating(false); }
  };

  const generateFinancialReport = async () => {
    setGenerating(true);
    try {
      const [payments, studentsData, groupsData] = await Promise.all([
        paymentsAPI.getAll(),
        studentsAPI.getAll(),
        groupsAPI.getAll()
      ]);

      // Sana bo'yicha filter
      const filteredPayments = payments.filter(p => {
        const date = toISODateString(p.paidAt || p.createdAt);
        return date >= dateRange.start && date <= dateRange.end;
      });

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();

      // Header
      doc.setFontSize(20);
      doc.setTextColor(59, 130, 246);
      doc.text("Moliyaviy Hisobot", pageWidth / 2, 20, { align: 'center' });
      
      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(`Davr: ${formatDate(dateRange.start)} - ${formatDate(dateRange.end)}`, pageWidth / 2, 28, { align: 'center' });

      // Umumiy statistika
      const totalPaid = filteredPayments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
      const totalPending = filteredPayments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
      const paidCount = filteredPayments.filter(p => p.status === 'paid').length;

      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.text("Umumiy ko'rsatkichlar", 14, 45);

      doc.autoTable({
        startY: 50,
        head: [['Ko\'rsatkich', 'Qiymat']],
        body: [
          ["Jami to'lovlar", formatMoney(totalPaid)],
          ['Qarzdorliklar', formatMoney(totalPending)],
          ["To'lovlar soni", paidCount],
          ["O'quvchilar soni", studentsData.length],
          ['Guruhlar soni', groupsData.length],
        ],
        theme: 'grid',
        headStyles: { fillColor: [34, 197, 94] },
      });

      // Guruhlar bo'yicha
      const groupPayments = groupsData.map(group => {
        const groupStudents = studentsData.filter(s => s.groupId === group.id);
        const groupPaid = filteredPayments
          .filter(p => p.status === 'paid' && groupStudents.some(s => s.id === p.studentId))
          .reduce((sum, p) => sum + p.amount, 0);
        const groupPending = filteredPayments
          .filter(p => p.status === 'pending' && groupStudents.some(s => s.id === p.studentId))
          .reduce((sum, p) => sum + p.amount, 0);
        
        return {
          name: group.name,
          students: groupStudents.length,
          paid: groupPaid,
          pending: groupPending
        };
      });

      doc.addPage();
      doc.setFontSize(14);
      doc.text("Guruhlar bo'yicha", 14, 20);

      doc.autoTable({
        startY: 25,
        head: [['Guruh', "O'quvchilar", "To'langan", 'Qarzdorlik']],
        body: groupPayments
          .sort((a, b) => b.paid - a.paid)
          .map(g => [
            g.name,
            g.students,
            formatMoney(g.paid),
            formatMoney(g.pending)
          ]),
        theme: 'striped',
        headStyles: { fillColor: [34, 197, 94] },
      });

      // So'nggi to'lovlar
      const recentPayments = filteredPayments
        .filter(p => p.status === 'paid')
        .sort((a, b) => new Date(b.paidAt || b.createdAt) - new Date(a.paidAt || a.createdAt))
        .slice(0, 20);

      if (recentPayments.length > 0) {
        const currentY = doc.lastAutoTable.finalY + 15;
        
        doc.setFontSize(14);
        doc.text("So'nggi to'lovlar", 14, currentY);

        doc.autoTable({
          startY: currentY + 5,
          head: [['Sana', "O'quvchi", 'Summa', 'Oy']],
          body: recentPayments.map(p => [
            formatDate(p.paidAt || p.createdAt),
            p.studentName,
            formatMoney(p.amount),
            p.month
          ]),
          theme: 'striped',
          headStyles: { fillColor: [34, 197, 94] },
        });
      }

      doc.save(`moliyaviy_hisobot_${formatDate(new Date(), 'yyyy-MM-dd')}.pdf`);
      toast.success("Hisobot yaratildi!");
      
    } catch (err) {
      console.error(err);
      toast.error("Xatolik yuz berdi");
    }
    finally { setGenerating(false); }
  };

  const handleGenerateReport = () => {
    switch (reportType) {
      case 'student-progress':
        generateStudentProgressReport();
        break;
      case 'group-report':
        generateGroupReport();
        break;
      case 'financial':
        generateFinancialReport();
        break;
      default:
        toast.error("Hisobot turini tanlang");
    }
  };

  if (loading) return <Loading fullScreen text="Yuklanmoqda..." />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">PDF Hisobotlar</h1>
          <p className="text-gray-500">Turli hisobotlarni PDF formatda yuklab oling</p>
        </div>
      </div>

      {/* Hisobot turlari */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card 
          padding="p-6"
          className={`cursor-pointer transition ${
            reportType === 'student-progress' 
              ? 'ring-2 ring-blue-500 bg-blue-50' 
              : 'hover:bg-gray-50'
          }`}
          onClick={() => setReportType('student-progress')}
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold">O'quvchi Progress</h3>
              <p className="text-sm text-gray-500">
                Baholar, davomat, to'lovlar
              </p>
            </div>
          </div>
        </Card>

        <Card 
          padding="p-6"
          className={`cursor-pointer transition ${
            reportType === 'group-report' 
              ? 'ring-2 ring-green-500 bg-green-50' 
              : 'hover:bg-gray-50'
          }`}
          onClick={() => setReportType('group-report')}
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
              <Users className="w-7 h-7 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold">Guruh Hisoboti</h3>
              <p className="text-sm text-gray-500">
                Barcha o'quvchilar statistikasi
              </p>
            </div>
          </div>
        </Card>

        {isAdmin && (
          <Card 
            padding="p-6"
            className={`cursor-pointer transition ${
              reportType === 'financial' 
                ? 'ring-2 ring-purple-500 bg-purple-50' 
                : 'hover:bg-gray-50'
            }`}
            onClick={() => setReportType('financial')}
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
                <CreditCard className="w-7 h-7 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold">Moliyaviy Hisobot</h3>
                <p className="text-sm text-gray-500">
                  To'lovlar va qarzdorliklar
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Parametrlar */}
      <Card>
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-500" />
          Hisobot parametrlari
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {(reportType === 'student-progress' || reportType === 'group-report') && (
            <Select
              label="Guruh"
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              options={groups.map(g => ({ value: g.id, label: g.name }))}
            />
          )}

          {reportType === 'student-progress' && (
            <Select
              label="O'quvchi"
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              options={students.map(s => ({ value: s.id, label: s.fullName }))}
              placeholder="Tanlang"
            />
          )}

          {reportType === 'financial' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Boshlanish sanasi
                </label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tugash sanasi
                </label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </>
          )}
        </div>

        <div className="mt-6 flex gap-3">
          <Button 
            icon={Download} 
            onClick={handleGenerateReport}
            loading={generating}
            disabled={
              (reportType === 'student-progress' && !selectedStudent) ||
              ((reportType === 'student-progress' || reportType === 'group-report') && !selectedGroup)
            }
          >
            PDF Yuklab olish
          </Button>
        </div>
      </Card>

      {/* Ma'lumot */}
      <Card className="bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <FileText className="w-6 h-6 text-blue-500 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-800">Hisobotlar haqida</h4>
            <ul className="mt-2 space-y-1 text-sm text-blue-700">
              <li>• <b>O'quvchi Progress</b> - individual o'quvchi bo'yicha to'liq ma'lumot</li>
              <li>• <b>Guruh Hisoboti</b> - guruh bo'yicha barcha o'quvchilar reytingi</li>
              {isAdmin && <li>• <b>Moliyaviy Hisobot</b> - to'lovlar va qarzdorliklar tahlili</li>}
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PDFReports;
