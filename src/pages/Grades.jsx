import { useState, useEffect } from 'react';
import { Plus, FileText, Star, Trash2 } from 'lucide-react';
import { Card, Button, Input, Select, Avatar, Table, Modal, Loading, EmptyState } from '../components/common';
import { gradesAPI, groupsAPI, studentsAPI, teachersAPI, attendanceAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { ROLES } from '../utils/constants';
import { formatDate } from '../utils/helpers';
import { toast } from 'react-toastify';

const Grades = () => {
  const { userData, role } = useAuth();
  const [grades, setGrades] = useState([]);
  const [allGroupGrades, setAllGroupGrades] = useState([]); // Reyting uchun barcha baholar
  const [groups, setGroups] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ studentId: '', type: 'qa', topic: '', grade: '', maxGrade: '5', note: '', date: new Date().toISOString().split('T')[0] });
  const [formLoading, setFormLoading] = useState(false);
  const [studentData, setStudentData] = useState(null);
  const [filterDate, setFilterDate] = useState(''); // Sana bo'yicha filter
  const [fetchedAttendance, setFetchedAttendance] = useState(null); // null | 'present' | 'absent' | 'not_found'
  const [attendanceFetching, setAttendanceFetching] = useState(false);

  const isTeacher = role === ROLES.TEACHER;
  const isAdmin = role === ROLES.ADMIN || role === ROLES.DIRECTOR;
  const isStudentOrParent = role === ROLES.STUDENT || role === ROLES.PARENT;
  const canEdit = isTeacher || isAdmin;

  // Baho qo'yilgan kundan boshqa kunda o'chirib bo'lmaydi
  const canDeleteGrade = (grade) => {
    if (isAdmin) return true; // Admin har doim o'chira oladi
    const gradeDate = grade.date || formatDate(grade.createdAt);
    const today = new Date().toISOString().split('T')[0];
    return gradeDate === today; // Faqat bugun qo'yilgan bahoni o'chirish mumkin
  };

  useEffect(() => { fetchGroups(); }, []);
  useEffect(() => { if (selectedGroup) fetchGradesAndStudents(); }, [selectedGroup]);

  // Davomat turida o'quvchi + sana tanlanganda avtomatik davomat holati olinadi
  useEffect(() => {
    if (formData.type !== 'attendance' || !formData.studentId || !formData.date || !selectedGroup) {
      setFetchedAttendance(null);
      return;
    }
    let cancelled = false;
    const fetchAtt = async () => {
      setAttendanceFetching(true);
      setFetchedAttendance(null);
      try {
        const records = await attendanceAPI.getByGroupAndDate(selectedGroup, formData.date);
        if (cancelled) return;
        const rec = records.find(r => r.studentId === formData.studentId);
        const status = rec ? rec.status : 'not_found';
        setFetchedAttendance(status);
        setFormData(prev => ({
          ...prev,
          grade: status === 'present' ? '1' : status === 'absent' ? '0' : '',
        }));
      } catch {
        if (!cancelled) setFetchedAttendance('not_found');
      } finally {
        if (!cancelled) setAttendanceFetching(false);
      }
    };
    fetchAtt();
    return () => { cancelled = true; };
  }, [formData.type, formData.studentId, formData.date, selectedGroup]);

  const fetchGroups = async () => {
    try {
      let groupsData = [];
      
      if (isTeacher) {
        // O'qituvchini teachers kolleksiyasidan topish
        const allTeachers = await teachersAPI.getAll();
        const normalizePhone = (phone) => phone?.replace(/\D/g, '') || '';
        
        const teacher = allTeachers.find(t => 
          t.id === userData?.id || 
          t.email === userData?.email ||
          t.phone === userData?.phone ||
          normalizePhone(t.phone) === normalizePhone(userData?.phone)
        );
        
        
        // Guruhlarni topish - barcha guruhlardan filter
        const allGroups = await groupsAPI.getAll();
        
        if (teacher) {
          groupsData = allGroups.filter(g => g.teacherId === teacher.id);
        }
        
        // Users ID bilan ham
        const groups2 = allGroups.filter(g => g.teacherId === userData?.id);
        
        // Birlashtirish
        groupsData = [...groupsData, ...groups2].filter((g, index, self) => 
          index === self.findIndex(t => t.id === g.id)
        );
        
      } else if (isStudentOrParent) {
        // O'quvchi/Ota-ona faqat o'z guruhini ko'radi
        const allStudents = await studentsAPI.getAll();
        let student;
        
        if (role === ROLES.PARENT) {
          student = allStudents.find(s => 
            s.parentPhone === userData?.phone || 
            s.parentPhone?.replace(/\D/g, '') === userData?.phone?.replace(/\D/g, '')
          );
        } else {
          student = allStudents.find(s => 
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
      
      // Agar faqat bitta guruh bo'lsa, avtomatik tanlash
      if (groupsData.length === 1) {
        setSelectedGroup(groupsData[0].id);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchGradesAndStudents = async () => {
    try {
      const [gradesData, studentsData] = await Promise.all([
        gradesAPI.getByGroup(selectedGroup),
        studentsAPI.getByGroup(selectedGroup)
      ]);
      
      
      // Barcha guruh baholarini reyting uchun saqlash
      setAllGroupGrades(gradesData);
      
      // O'quvchi/Ota-ona faqat o'z baholarini ko'radi (jadvalda)
      if (isStudentOrParent && studentData) {
        setGrades(gradesData.filter(g => g.studentId === studentData.id));
      } else {
        setGrades(gradesData);
      }
      setStudents(studentsData);
    } catch (err) { console.error('fetchGradesAndStudents error:', err); }
  };

  const handleTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      type,
      grade: '',
      maxGrade: type === 'qa' ? '5' : type === 'attendance' ? '1' : '10',
    }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const student = students.find(s => s.id === formData.studentId);
      const newGrade = await gradesAPI.create({
        studentId: formData.studentId,
        studentName: student?.fullName || '',
        type: formData.type,
        topic: formData.topic,
        note: formData.note,
        groupId: selectedGroup,
        grade: Number(formData.grade),
        maxGrade: Number(formData.maxGrade),
        date: formData.date,
        teacherId: userData?.id,
        teacherName: userData?.fullName
      });
      setGrades([newGrade, ...grades]);
      setShowAddModal(false);
      setFormData({ studentId: '', type: 'qa', topic: '', grade: '', maxGrade: '5', note: '', date: new Date().toISOString().split('T')[0] });
      toast.success("Baho qo'shildi");
    } catch (err) { toast.error("Xatolik yuz berdi"); }
    finally { setFormLoading(false); }
  };

  const handleDelete = async (gradeId) => {
    if (!confirm("Bu bahoni o'chirishni xohlaysizmi?")) return;
    
    try {
      await gradesAPI.delete(gradeId);
      setGrades(grades.filter(g => g.id !== gradeId));
    } catch (err) { alert("O'chirishda xatolik"); }
  };

  const getGradeBadge = (grade) => {
    if (grade.type === 'attendance') {
      return grade.grade >= 1
        ? <span className="px-3 py-1 rounded-lg font-bold bg-green-100 text-green-700">📅 Keldi</span>
        : <span className="px-3 py-1 rounded-lg font-bold bg-red-100 text-red-700">📅 Kelmadi</span>;
    }
    if (grade.type === 'qa') {
      const g = grade.grade ?? 0;
      const max = grade.maxGrade || 1;
      const ratio = g / max;
      const color = ratio >= 0.8 ? 'bg-green-100 text-green-700'
        : ratio >= 0.4 ? 'bg-yellow-100 text-yellow-700'
        : 'bg-red-100 text-red-700';
      return <span className={`px-3 py-1 rounded-lg font-bold ${color}`}>❓ {g}/{max}</span>;
    }
    // Practical (0-10)
    const color = grade.grade >= 8 ? 'bg-green-100 text-green-700'
      : grade.grade >= 5 ? 'bg-yellow-100 text-yellow-700'
      : 'bg-red-100 text-red-700';
    return <span className={`px-3 py-1 rounded-lg font-bold ${color}`}>🔧 {grade.grade}/{grade.maxGrade}</span>;
  };

  // O'quvchi statistikasi — to'plangan ball (o'rtacha emas)
  const getStudentStats = () => {
    const stats = {};
    const gradesForStats = allGroupGrades.length > 0 ? allGroupGrades : grades;

    students.forEach(s => {
      const sg = gradesForStats.filter(g => g.studentId === s.id);
      if (sg.length === 0) return;
      const qaGrades        = sg.filter(g => g.type === 'qa');
      const qaSum           = qaGrades.reduce((sum, g) => sum + (g.grade || 0), 0);
      const qaMaxTotal      = qaGrades.reduce((sum, g) => sum + (g.maxGrade || 1), 0); // jami savol soni
      const practicalSum    = sg.filter(g => g.type === 'practical' || (!g.type && g.maxGrade > 1 && g.maxGrade <= 10))
                                .reduce((sum, g) => sum + (g.grade || 0), 0);
      const attendanceGrades = sg.filter(g => g.type === 'attendance');
      const attendanceCount  = attendanceGrades.filter(g => g.grade >= 1).length;
      const attendanceTotal  = attendanceGrades.length;
      // Eski 100-ballik baholar uchun backward compat
      const legacySum = sg.filter(g => !g.type && g.maxGrade > 10)
                          .reduce((sum, g) => sum + Math.round((g.grade / g.maxGrade) * 10), 0);
      const totalPoints = Math.round((qaSum + practicalSum + legacySum) * 10) / 10;
      stats[s.id] = { totalPoints, qaSum: Math.round(qaSum * 10) / 10, qaMaxTotal, practicalSum, attendanceCount, attendanceTotal, count: sg.length };
    });
    return stats;
  };

  if (loading) return <Loading fullScreen text="Yuklanmoqda..." />;

  // O'qituvchida guruh yo'q
  if (isTeacher && groups.length === 0) {
    return (
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold text-gray-900">Baholar</h1>
        <Card className="text-center py-12">
          <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Sizga hali guruh biriktirilmagan</p>
        </Card>
      </div>
    );
  }

  const studentStats = getStudentStats();
  
  // Sana bo'yicha filter
  const filteredGrades = filterDate 
    ? grades.filter(g => (g.date || formatDate(g.createdAt)) === filterDate)
    : grades;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Baholar</h1>
          <p className="text-gray-500">O'quvchilarga baho qo'yish</p>
        </div>
        {selectedGroup && canEdit && (
          <Button icon={Plus} onClick={() => setShowAddModal(true)}>Baho qo'yish</Button>
        )}
      </div>

      <Card padding="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select 
            label="Guruh" 
            value={selectedGroup} 
            onChange={(e) => setSelectedGroup(e.target.value)} 
            options={groups.map(g => ({ value: g.id, label: g.name }))} 
            placeholder="Guruhni tanlang" 
          />
          <Input 
            label="Sana bo'yicha filter" 
            type="date" 
            value={filterDate} 
            onChange={(e) => setFilterDate(e.target.value)} 
          />
        </div>
      </Card>

      {selectedGroup && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Baholar ro'yxati */}
          <div className="lg:col-span-2">
            <Card padding="p-0">
              <div className="p-4 border-b flex items-center justify-between">
                <h3 className="font-semibold">Baholar tarixi</h3>
                {filterDate && (
                  <button 
                    onClick={() => setFilterDate('')} 
                    className="text-sm text-primary-600 hover:underline"
                  >
                    Filterni tozalash
                  </button>
                )}
              </div>
              {filteredGrades.length > 0 ? (
                <Table>
                  <Table.Head>
                    <Table.Row>
                      <Table.Header>O'quvchi</Table.Header>
                      <Table.Header>Mavzu</Table.Header>
                      <Table.Header>Baho</Table.Header>
                      <Table.Header>Sana</Table.Header>
                      {canEdit && <Table.Header></Table.Header>}
                    </Table.Row>
                  </Table.Head>
                  <Table.Body>
                    {filteredGrades.map(grade => (
                      <Table.Row key={grade.id}>
                        <Table.Cell>
                          <div className="flex items-center gap-3">
                            <Avatar name={grade.studentName} size="sm" />
                            <span>{grade.studentName}</span>
                          </div>
                        </Table.Cell>
                        <Table.Cell>
                          <div>
                            <span className="text-xs text-gray-400 mr-1">
                              {grade.type === 'practical' ? '🔧' : '❓'}
                            </span>
                            {grade.topic}
                          </div>
                        </Table.Cell>
                        <Table.Cell>{getGradeBadge(grade)}</Table.Cell>
                        <Table.Cell>{grade.date || formatDate(grade.createdAt)}</Table.Cell>
                        {canEdit && (
                          <Table.Cell>
                            {canDeleteGrade(grade) ? (
                              <button 
                                onClick={() => handleDelete(grade.id)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                title="O'chirish"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            ) : (
                              <span className="text-xs text-gray-400" title="O'chirib bo'lmaydi">🔒</span>
                            )}
                          </Table.Cell>
                        )}
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              ) : (
                <div className="p-8">
                  <EmptyState icon={FileText} title="Baholar yo'q" description={filterDate ? "Bu sanada baholar yo'q" : "Bu guruhda hali baholar qo'yilmagan"} />
                </div>
              )}
            </Card>
          </div>

          {/* O'quvchilar statistikasi */}
          <Card>
            <h3 className="font-semibold mb-1">Reyting (ball)</h3>
            <p className="text-xs text-gray-400 mb-3">❓savol-javob: to'g'ri/jami &nbsp;|&nbsp; 🔧 amaliy 0–10 &nbsp;|&nbsp; 📅 davomat</p>
            {students.length > 0 ? (
              <div className="space-y-3">
                {students
                  .map(s => ({ ...s, stats: studentStats[s.id] }))
                  .sort((a, b) => (b.stats?.totalPoints || 0) - (a.stats?.totalPoints || 0))
                  .map((student, index) => (
                    <div key={student.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${
                        index === 0 ? 'bg-yellow-500' :
                        index === 1 ? 'bg-gray-400' :
                        index === 2 ? 'bg-orange-400' : 'bg-gray-300'
                      }`}>
                        {index + 1}
                      </span>
                      <Avatar name={student.fullName} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{student.fullName}</p>
                        <p className="text-xs text-gray-400">
                          ❓{student.stats?.qaSum ?? 0}/{student.stats?.qaMaxTotal || 0}
                          &nbsp;·&nbsp;
                          🔧{student.stats?.practicalSum || 0}
                          {(student.stats?.attendanceTotal || 0) > 0 && (
                            <>&nbsp;·&nbsp;📅{student.stats.attendanceCount}/{student.stats.attendanceTotal}</>
                          )}
                        </p>
                      </div>
                      <span className="text-sm font-bold text-primary-600">
                        {student.stats?.totalPoints ?? '—'} b
                      </span>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Bu guruhda o'quvchilar yo'q</p>
            )}
          </Card>
        </div>
      )}

      {!selectedGroup && (
        <Card className="text-center py-12">
          <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Baho qo'yish uchun guruhni tanlang</p>
        </Card>
      )}

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Baho qo'yish">
        <form onSubmit={handleAdd} className="space-y-4">
          <Select
            label="O'quvchi"
            value={formData.studentId}
            onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
            options={students.map(s => ({ value: s.id, label: s.fullName }))}
            required
          />

          {/* Baho turi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Baho turi</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleTypeChange('qa')}
                className={`flex-1 py-2 px-3 rounded-lg border-2 font-medium transition text-sm ${
                  formData.type === 'qa'
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                }`}
              >
                ❓ Savol-javob
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange('practical')}
                className={`flex-1 py-2 px-3 rounded-lg border-2 font-medium transition text-sm ${
                  formData.type === 'practical'
                    ? 'bg-purple-500 text-white border-purple-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-purple-300'
                }`}
              >
                🔧 Amaliy ish
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange('attendance')}
                className={`flex-1 py-2 px-3 rounded-lg border-2 font-medium transition text-sm ${
                  formData.type === 'attendance'
                    ? 'bg-green-500 text-white border-green-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-green-300'
                }`}
              >
                📅 Davomat
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Sana"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
            <Input
              label="Mavzu / Tavsif"
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              placeholder={formData.type === 'qa' ? '5-dars savollari' : formData.type === 'attendance' ? 'Dars nomi yoki sana' : 'Loyiha topshirig\'i'}
              required
            />
          </div>

          {/* Baho kiritish */}
          {formData.type === 'qa' ? (
            <div className="space-y-3">
              {/* Savollar soni */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nechta savol berildi?
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  step="1"
                  value={formData.maxGrade}
                  onChange={(e) => {
                    const max = Math.max(1, Math.min(50, parseInt(e.target.value) || 1));
                    const grade = Math.min(Number(formData.grade) || 0, max);
                    setFormData({ ...formData, maxGrade: String(max), grade: String(grade) });
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500"
                />
              </div>
              {/* To'g'ri javoblar */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nechta to'g'ri javob?&nbsp;
                  <span className={`font-bold ${
                    formData.grade !== '' && Number(formData.grade) / Number(formData.maxGrade) >= 0.8 ? 'text-green-600'
                    : formData.grade !== '' && Number(formData.grade) / Number(formData.maxGrade) >= 0.4 ? 'text-yellow-600'
                    : 'text-red-600'
                  }`}>
                    {formData.grade !== '' ? formData.grade : '—'}/{formData.maxGrade}
                  </span>
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {Array.from({ length: Number(formData.maxGrade) + 1 }, (_, i) => i).map(val => {
                    const ratio = val / Number(formData.maxGrade);
                    const isSelected = formData.grade === String(val);
                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setFormData({ ...formData, grade: String(val) })}
                        className={`w-10 h-10 rounded-lg border-2 text-sm font-bold transition ${
                          isSelected
                            ? ratio >= 0.8 ? 'bg-green-500 text-white border-green-500'
                              : ratio >= 0.4 ? 'bg-yellow-500 text-white border-yellow-500'
                              : 'bg-red-500 text-white border-red-500'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        {val}
                      </button>
                    );
                  })}
                </div>
                {formData.grade === '' && (
                  <p className="text-xs text-red-500">To'g'ri javoblar sonini tanlang</p>
                )}
              </div>
            </div>
          ) : formData.type === 'attendance' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Davomat holati</label>
              {!formData.studentId || !formData.date ? (
                <p className="text-sm text-gray-400 py-3 text-center border-2 border-dashed border-gray-200 rounded-xl">
                  O'quvchi va sanani tanlang
                </p>
              ) : attendanceFetching ? (
                <div className="py-4 text-center text-sm text-gray-500">Davomat tekshirilmoqda...</div>
              ) : fetchedAttendance === 'present' ? (
                <div className="py-4 rounded-xl bg-green-50 border-2 border-green-300 text-center text-green-700 font-bold text-lg">
                  ✅ Keldi
                </div>
              ) : fetchedAttendance === 'absent' ? (
                <div className="py-4 rounded-xl bg-red-50 border-2 border-red-300 text-center text-red-700 font-bold text-lg">
                  ❌ Kelmadi
                </div>
              ) : (
                <div className="py-4 rounded-xl bg-gray-50 border-2 border-dashed border-gray-300 text-center text-gray-500 text-sm">
                  Bu sana uchun davomat belgilanmagan
                </div>
              )}
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ball: <span className="text-purple-600 font-bold">{formData.grade || 0}/10</span>
              </label>
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                value={formData.grade || 0}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                className="w-full accent-purple-500"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                {[0,1,2,3,4,5,6,7,8,9,10].map(n => <span key={n}>{n}</span>)}
              </div>
            </div>
          )}

          <Input
            label="Izoh (ixtiyoriy)"
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            placeholder="Qo'shimcha izoh"
          />
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="ghost" onClick={() => setShowAddModal(false)}>Bekor qilish</Button>
            <Button
              type="submit"
              loading={formLoading}
              disabled={formData.grade === '' || (formData.type === 'attendance' && fetchedAttendance === 'not_found')}
            >
              Saqlash
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Grades;
