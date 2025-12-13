import { useState, useEffect } from 'react';
import { Download, FileText, Users, CreditCard, CalendarCheck, TrendingUp } from 'lucide-react';
import { Card, Button, Select, Loading, StatsCard } from '../components/common';
import { studentsAPI, teachersAPI, groupsAPI, paymentsAPI } from '../services/api';
import { formatMoney, formatDate } from '../utils/helpers';

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState('general');
  const [period, setPeriod] = useState('month');
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    groups: 0,
    revenue: 0,
  });
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [studentsData, teachersData, groupsData, paymentsData] = await Promise.all([
        studentsAPI.getAll(),
        teachersAPI.getAll(),
        groupsAPI.getAll(),
        paymentsAPI.getAll()
      ]);
      setStudents(studentsData);
      setPayments(paymentsData);
      setStats({
        students: studentsData.length,
        teachers: teachersData.length,
        groups: groupsData.length,
        revenue: paymentsData.filter(p => p.status === 'paid').reduce((sum, p) => sum + (p.amount || 0), 0)
      });
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const exportStudentsCSV = () => {
    const headers = ["#", "Ism", "Telefon", "Email", "Guruh", "Ota-ona", "Ota-ona tel"];
    const rows = students.map((s, i) => [i + 1, s.fullName, s.phone, s.email, s.groupName, s.parentName, s.parentPhone]);
    downloadCSV(headers, rows, 'students-report.csv');
  };

  const exportPaymentsCSV = () => {
    const headers = ["#", "O'quvchi", "Guruh", "Summa", "Usul", "Holat", "Sana"];
    const rows = payments.map((p, i) => [i + 1, p.studentName, p.groupName, p.amount, p.method, p.status, formatDate(p.createdAt)]);
    downloadCSV(headers, rows, 'payments-report.csv');
  };

  const downloadCSV = (headers, rows, filename) => {
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  const exportGeneralReport = () => {
    const report = [
      ['UMUMIY HISOBOT'],
      [''],
      ['Ko\'rsatkich', 'Qiymat'],
      ['Jami o\'quvchilar', stats.students],
      ['Jami o\'qituvchilar', stats.teachers],
      ['Jami guruhlar', stats.groups],
      ['Jami tushum', stats.revenue + ' so\'m'],
      [''],
      ['Hisobot sanasi', formatDate(new Date())],
    ];
    const csv = report.map(r => r.join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'general-report.csv';
    link.click();
  };

  if (loading) return <Loading fullScreen text="Yuklanmoqda..." />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hisobotlar</h1>
          <p className="text-gray-500">Statistika va hisobotlar</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard title="O'quvchilar" value={stats.students} icon={Users} color="primary" />
        <StatsCard title="O'qituvchilar" value={stats.teachers} icon={Users} color="success" />
        <StatsCard title="Guruhlar" value={stats.groups} icon={CalendarCheck} color="info" />
        <StatsCard title="Jami tushum" value={formatMoney(stats.revenue)} icon={TrendingUp} color="warning" />
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="hover:shadow-md transition cursor-pointer" onClick={exportGeneralReport}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Umumiy hisobot</h3>
              <p className="text-sm text-gray-500">Barcha ko'rsatkichlar</p>
            </div>
            <Download className="w-5 h-5 text-gray-400" />
          </div>
        </Card>

        <Card className="hover:shadow-md transition cursor-pointer" onClick={exportStudentsCSV}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">O'quvchilar ro'yxati</h3>
              <p className="text-sm text-gray-500">{stats.students} ta o'quvchi</p>
            </div>
            <Download className="w-5 h-5 text-gray-400" />
          </div>
        </Card>

        <Card className="hover:shadow-md transition cursor-pointer" onClick={exportPaymentsCSV}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">To'lovlar hisoboti</h3>
              <p className="text-sm text-gray-500">{payments.length} ta to'lov</p>
            </div>
            <Download className="w-5 h-5 text-gray-400" />
          </div>
        </Card>
      </div>

      {/* Info */}
      <Card className="bg-blue-50 border-blue-100">
        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">Hisobotlarni yuklab olish</h4>
            <p className="text-sm text-blue-700 mt-1">
              Yuqoridagi kartochkalarni bosib, tegishli hisobotni CSV formatida yuklab olishingiz mumkin.
              CSV fayllarni Excel yoki Google Sheets dasturlarida ochishingiz mumkin.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Reports;
