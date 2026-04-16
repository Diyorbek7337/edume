import { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Check, X, Clock, AlertCircle, Save, Users, History } from 'lucide-react';
import { Card, Button, Select, Badge, Avatar, Loading } from '../components/common';
import { groupsAPI, studentsAPI, attendanceAPI, teachersAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { ROLES, ATTENDANCE_STATUS } from '../utils/constants';
import { formatDate, formatDateISO } from '../utils/helpers';
import { toast } from 'react-toastify';

const Attendance = () => {
  const { userData, role } = useAuth();
  const [groups, setGroups] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedGroup, setSelectedGroup] = useState('');
  const [attendance, setAttendance] = useState({});
  const [saving, setSaving] = useState(false);
  const [studentData, setStudentData] = useState(null);
  const [isLocked, setIsLocked] = useState(false);

  // Davomat tarixi
  const [activeTab, setActiveTab] = useState('daily'); // 'daily' | 'history'
  const [allStudents, setAllStudents] = useState([]);
  const [selectedHistoryStudent, setSelectedHistoryStudent] = useState('');
  const [historyMonth, setHistoryMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [studentHistory, setStudentHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const isTeacher = role === ROLES.TEACHER;
  const isStudentOrParent = role === ROLES.STUDENT || role === ROLES.PARENT;
  const isAdmin = role === ROLES.ADMIN || role === ROLES.DIRECTOR;
  const canEdit = (isTeacher || isAdmin) && !isLocked;

  useEffect(() => { fetchGroups(); }, []);

  useEffect(() => {
    if (selectedGroup) fetchStudentsAndAttendance();
  }, [selectedGroup, selectedDate]);

  useEffect(() => {
    if (isAdmin && activeTab === 'history') {
      loadAllStudents();
    }
  }, [activeTab, isAdmin]);

  useEffect(() => {
    if (selectedHistoryStudent && historyMonth) {
      fetchStudentHistory(selectedHistoryStudent, historyMonth);
    }
  }, [selectedHistoryStudent, historyMonth]);

  const loadAllStudents = async () => {
    if (allStudents.length > 0) return;
    const data = await studentsAPI.getAll();
    setAllStudents(data.filter(s => s.status !== 'graduated'));
  };

  const fetchStudentHistory = async (studentId, month) => {
    setHistoryLoading(true);
    try {
      const records = await attendanceAPI.getByStudent(studentId);
      const filtered = records.filter(r => r.date && r.date.startsWith(month));
      filtered.sort((a, b) => a.date.localeCompare(b.date));
      setStudentHistory(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const fetchGroups = async () => {
    try {
      let groupsData = [];

      if (isTeacher) {
        const allTeachers = await teachersAPI.getAll();
        const normalizePhone = (phone) => phone?.replace(/\D/g, '') || '';

        const teacher = allTeachers.find(t =>
          t.id === userData?.id ||
          t.email === userData?.email ||
          t.phone === userData?.phone ||
          normalizePhone(t.phone) === normalizePhone(userData?.phone)
        );

        const allGroups = await groupsAPI.getAll();

        if (teacher) {
          groupsData = allGroups.filter(g => g.teacherId === teacher.id);
        }

        const groups2 = allGroups.filter(g => g.teacherId === userData?.id);

        groupsData = [...groupsData, ...groups2].filter((g, index, self) =>
          index === self.findIndex(t => t.id === g.id)
        );

      } else if (isStudentOrParent) {
        const allStudentsData = await studentsAPI.getAll();
        let student;

        if (role === ROLES.PARENT) {
          student = allStudentsData.find(s =>
            s.parentPhone === userData?.phone ||
            s.parentPhone?.replace(/\D/g, '') === userData?.phone?.replace(/\D/g, '')
          );
        } else {
          student = allStudentsData.find(s =>
            s.email === userData?.email ||
            s.phone === userData?.phone ||
            s.phone?.replace(/\D/g, '') === userData?.phone?.replace(/\D/g, '')
          );
        }

        if (student) {
          setStudentData(student);
          const allGroups = await groupsAPI.getAll();
          groupsData = allGroups.filter(g =>
            g.id === student.groupId ||
            g.studentIds?.includes(student.id)
          );
        }
      } else {
        groupsData = await groupsAPI.getAll();
      }

      setGroups(groupsData);

      if (groupsData.length === 1) {
        setSelectedGroup(groupsData[0].id);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchStudentsAndAttendance = async () => {
    try {
      const [studentsData, attendanceData] = await Promise.all([
        studentsAPI.getByGroup(selectedGroup),
        attendanceAPI.getByGroupAndDate(selectedGroup, formatDateISO(selectedDate))
      ]);

      const activeStudents = studentsData.filter(s => s.status !== 'graduated');

      if (isStudentOrParent && studentData) {
        setStudents(activeStudents.filter(s => s.id === studentData.id));
      } else {
        setStudents(activeStudents);
      }

      const attendanceMap = {};
      attendanceData.forEach(a => { attendanceMap[a.studentId] = a.status; });
      setAttendance(attendanceMap);

      const hasExistingAttendance = attendanceData.length > 0;
      setIsLocked(hasExistingAttendance && !isAdmin);
    } catch (err) { console.error(err); }
  };

  const handleDateChange = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const handleStatusChange = (studentId, status) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const records = students.map(s => ({
        studentId: s.id,
        studentName: s.fullName,
        status: attendance[s.id] || ATTENDANCE_STATUS.ABSENT
      }));
      await attendanceAPI.save(selectedGroup, formatDateISO(selectedDate), records);
      toast.success("Davomat saqlandi!");
    } catch (err) { toast.error("Xatolik yuz berdi"); }
    finally { setSaving(false); }
  };

  const markAllPresent = () => {
    const newAttendance = {};
    students.forEach(s => { newAttendance[s.id] = ATTENDANCE_STATUS.PRESENT; });
    setAttendance(newAttendance);
  };

  const stats = {
    total: students.length,
    present: Object.values(attendance).filter(s => s === ATTENDANCE_STATUS.PRESENT).length,
    absent: Object.values(attendance).filter(s => s === ATTENDANCE_STATUS.ABSENT).length,
    late: Object.values(attendance).filter(s => s === ATTENDANCE_STATUS.LATE).length,
  };

  const StatusButton = ({ studentId, status, icon: Icon, color, label }) => {
    const isActive = attendance[studentId] === status;
    return (
      <button
        onClick={() => handleStatusChange(studentId, status)}
        className={`p-2 rounded-lg transition ${isActive ? `${color} text-white` : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
        title={label}
      >
        <Icon className="w-5 h-5" />
      </button>
    );
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case ATTENDANCE_STATUS.PRESENT: return { label: 'Keldi', color: 'success', icon: Check };
      case ATTENDANCE_STATUS.ABSENT: return { label: 'Kelmadi', color: 'danger', icon: X };
      case ATTENDANCE_STATUS.LATE: return { label: 'Kechikdi', color: 'warning', icon: Clock };
      case ATTENDANCE_STATUS.EXCUSED: return { label: 'Sababli', color: 'info', icon: AlertCircle };
      default: return { label: 'Noma\'lum', color: 'default', icon: AlertCircle };
    }
  };

  // Oylik statistika
  const getHistoryStats = () => {
    return {
      total: studentHistory.length,
      present: studentHistory.filter(r => r.status === ATTENDANCE_STATUS.PRESENT).length,
      absent: studentHistory.filter(r => r.status === ATTENDANCE_STATUS.ABSENT).length,
      late: studentHistory.filter(r => r.status === ATTENDANCE_STATUS.LATE).length,
      excused: studentHistory.filter(r => r.status === ATTENDANCE_STATUS.EXCUSED).length,
    };
  };

  if (loading) return <Loading fullScreen text="Yuklanmoqda..." />;

  if (isTeacher && groups.length === 0) {
    return (
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold text-gray-900">Davomat</h1>
        <Card className="text-center py-12">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Sizga hali guruh biriktirilmagan</p>
        </Card>
      </div>
    );
  }

  const historyStats = getHistoryStats();
  const historyStudent = allStudents.find(s => s.id === selectedHistoryStudent);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Davomat</h1>
          <p className="text-gray-500">
            {activeTab === 'daily' ? 'Kunlik davomat qayd qilish' : "O'quvchi davomat tarixi"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isAdmin && (
            <div className="flex border rounded-lg overflow-hidden">
              <button
                onClick={() => setActiveTab('daily')}
                className={`px-4 py-2 text-sm font-medium flex items-center gap-2 transition ${
                  activeTab === 'daily' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Calendar className="w-4 h-4" />
                Kunlik
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-4 py-2 text-sm font-medium flex items-center gap-2 transition ${
                  activeTab === 'history' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <History className="w-4 h-4" />
                Tarixi
              </button>
            </div>
          )}
          {activeTab === 'daily' && selectedGroup && students.length > 0 && canEdit && (
            <div className="flex gap-2">
              <Button variant="outline" onClick={markAllPresent}>Barchasini belgilash</Button>
              <Button icon={Save} loading={saving} onClick={handleSave}>Saqlash</Button>
            </div>
          )}
        </div>
      </div>

      {/* ===== DAVOMAT TARIXI TAB ===== */}
      {activeTab === 'history' && isAdmin && (
        <div className="space-y-4">
          {/* Filtr */}
          <Card padding="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">O'quvchi</label>
                <select
                  value={selectedHistoryStudent}
                  onChange={(e) => setSelectedHistoryStudent(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="">O'quvchini tanlang</option>
                  {allStudents.map(s => (
                    <option key={s.id} value={s.id}>{s.fullName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Oy</label>
                <input
                  type="month"
                  value={historyMonth}
                  onChange={(e) => setHistoryMonth(e.target.value)}
                  className="px-3 py-2 border rounded-lg text-sm"
                />
              </div>
            </div>
          </Card>

          {selectedHistoryStudent && (
            <>
              {/* Oylik statistika */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card padding="p-3" className="text-center bg-green-50">
                  <p className="text-2xl font-bold text-green-600">{historyStats.present}</p>
                  <p className="text-xs text-green-600">Keldi</p>
                </Card>
                <Card padding="p-3" className="text-center bg-red-50">
                  <p className="text-2xl font-bold text-red-600">{historyStats.absent}</p>
                  <p className="text-xs text-red-600">Kelmadi</p>
                </Card>
                <Card padding="p-3" className="text-center bg-yellow-50">
                  <p className="text-2xl font-bold text-yellow-600">{historyStats.late}</p>
                  <p className="text-xs text-yellow-600">Kechikdi</p>
                </Card>
                <Card padding="p-3" className="text-center bg-blue-50">
                  <p className="text-2xl font-bold text-blue-600">{historyStats.excused}</p>
                  <p className="text-xs text-blue-600">Sababli</p>
                </Card>
              </div>

              {/* Davomat kunlar ro'yxati */}
              <Card>
                <div className="flex items-center gap-3 mb-4">
                  {historyStudent && <Avatar name={historyStudent.fullName} />}
                  <div>
                    <h3 className="font-semibold">{historyStudent?.fullName}</h3>
                    <p className="text-sm text-gray-500">
                      Jami {historyStats.total} ta dars qayd qilingan
                    </p>
                  </div>
                </div>

                {historyLoading ? (
                  <div className="text-center py-8 text-gray-400">Yuklanmoqda...</div>
                ) : studentHistory.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Calendar className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                    <p>Bu oy uchun davomat topilmadi</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {studentHistory.map((record) => {
                      const { label, color } = getStatusLabel(record.status);
                      return (
                        <div key={record.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
                          <div className="flex items-center gap-3">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">
                              {formatDate(new Date(record.date), 'dd MMMM yyyy, EEEE')}
                            </span>
                          </div>
                          <Badge variant={color}>{label}</Badge>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            </>
          )}

          {!selectedHistoryStudent && (
            <Card className="text-center py-12">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Davomat tarixini ko'rish uchun o'quvchi tanlang</p>
            </Card>
          )}
        </div>
      )}

      {/* ===== KUNLIK DAVOMAT TAB ===== */}
      {activeTab === 'daily' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card padding="p-4">
              <div className="flex items-center justify-between">
                <button onClick={() => handleDateChange(-1)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="text-center flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary-600" />
                  <span className="font-semibold">{formatDate(selectedDate, 'EEEE, d MMMM yyyy')}</span>
                </div>
                <button onClick={() => handleDateChange(1)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </Card>

            <Card padding="p-4">
              <Select
                label="Guruh"
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                options={groups.map(g => ({ value: g.id, label: g.name }))}
                placeholder="Guruhni tanlang"
              />
            </Card>
          </div>

          {selectedGroup && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card padding="p-3" className="text-center">
                  <Users className="w-5 h-5 mx-auto text-gray-500" />
                  <p className="text-xl font-bold">{stats.total}</p>
                  <p className="text-xs text-gray-500">Jami</p>
                </Card>
                <Card padding="p-3" className="text-center bg-green-50">
                  <Check className="w-5 h-5 mx-auto text-green-600" />
                  <p className="text-xl font-bold text-green-600">{stats.present}</p>
                  <p className="text-xs text-green-600">Keldi</p>
                </Card>
                <Card padding="p-3" className="text-center bg-red-50">
                  <X className="w-5 h-5 mx-auto text-red-600" />
                  <p className="text-xl font-bold text-red-600">{stats.absent}</p>
                  <p className="text-xs text-red-600">Kelmadi</p>
                </Card>
                <Card padding="p-3" className="text-center bg-yellow-50">
                  <Clock className="w-5 h-5 mx-auto text-yellow-600" />
                  <p className="text-xl font-bold text-yellow-600">{stats.late}</p>
                  <p className="text-xs text-yellow-600">Kechikdi</p>
                </Card>
              </div>

              <Card>
                <h3 className="text-lg font-semibold mb-4">O'quvchilar ro'yxati</h3>
                {students.length > 0 ? (
                  <div className="space-y-3">
                    {students.map((student, index) => (
                      <div key={student.id} className={`flex items-center gap-4 p-3 rounded-lg border-2 transition ${
                        attendance[student.id] === ATTENDANCE_STATUS.PRESENT ? 'border-green-200 bg-green-50/50' :
                        attendance[student.id] === ATTENDANCE_STATUS.ABSENT ? 'border-red-200 bg-red-50/50' :
                        attendance[student.id] === ATTENDANCE_STATUS.LATE ? 'border-yellow-200 bg-yellow-50/50' :
                        attendance[student.id] === ATTENDANCE_STATUS.EXCUSED ? 'border-blue-200 bg-blue-50/50' :
                        'border-gray-100'
                      }`}>
                        <span className="text-gray-400 w-6">{index + 1}</span>
                        <Avatar name={student.fullName} />
                        <div className="flex-1">
                          <p className="font-medium">{student.fullName}</p>
                          {attendance[student.id] && (
                            <Badge variant={
                              attendance[student.id] === ATTENDANCE_STATUS.PRESENT ? 'success' :
                              attendance[student.id] === ATTENDANCE_STATUS.ABSENT ? 'danger' :
                              attendance[student.id] === ATTENDANCE_STATUS.LATE ? 'warning' : 'info'
                            } className="mt-1">
                              {attendance[student.id] === ATTENDANCE_STATUS.PRESENT ? 'Keldi' :
                               attendance[student.id] === ATTENDANCE_STATUS.ABSENT ? 'Kelmadi' :
                               attendance[student.id] === ATTENDANCE_STATUS.LATE ? 'Kechikdi' : 'Sababli'}
                            </Badge>
                          )}
                        </div>
                        {canEdit && (
                          <div className="flex gap-2">
                            <StatusButton studentId={student.id} status={ATTENDANCE_STATUS.PRESENT} icon={Check} color="bg-green-500" label="Keldi" />
                            <StatusButton studentId={student.id} status={ATTENDANCE_STATUS.ABSENT} icon={X} color="bg-red-500" label="Kelmadi" />
                            <StatusButton studentId={student.id} status={ATTENDANCE_STATUS.LATE} icon={Clock} color="bg-yellow-500" label="Kechikdi" />
                            <StatusButton studentId={student.id} status={ATTENDANCE_STATUS.EXCUSED} icon={AlertCircle} color="bg-blue-500" label="Sababli" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">Bu guruhda o'quvchilar yo'q</p>
                )}
              </Card>
            </>
          )}

          {!selectedGroup && (
            <Card className="text-center py-12">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Davomat olish uchun guruhni tanlang</p>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default Attendance;
