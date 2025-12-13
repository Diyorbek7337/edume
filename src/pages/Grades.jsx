import { useState, useEffect } from 'react';
import { Plus, FileText, Star, Trash2 } from 'lucide-react';
import { Card, Button, Input, Select, Badge, Avatar, Table, Modal, Loading, EmptyState } from '../components/common';
import { gradesAPI, groupsAPI, studentsAPI, teachersAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { ROLES } from '../utils/constants';
import { formatDate } from '../utils/helpers';
import { toast } from 'react-toastify';

const Grades = () => {
  const { userData, role } = useAuth();
  const [grades, setGrades] = useState([]);
  const [groups, setGroups] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ studentId: '', topic: '', grade: '', maxGrade: '100', note: '', date: new Date().toISOString().split('T')[0] });
  const [formLoading, setFormLoading] = useState(false);
  const [studentData, setStudentData] = useState(null);

  const isTeacher = role === ROLES.TEACHER;
  const isStudentOrParent = role === ROLES.STUDENT || role === ROLES.PARENT;
  const canEdit = isTeacher; // Faqat o'qituvchi baho qo'yadi

  useEffect(() => { fetchGroups(); }, []);
  useEffect(() => { if (selectedGroup) fetchGradesAndStudents(); }, [selectedGroup]);

  const fetchGroups = async () => {
    try {
      let groupsData = [];
      
      if (isTeacher) {
        // O'qituvchini teachers kolleksiyasidan topish
        const allTeachers = await teachersAPI.getAll();
        const teacher = allTeachers.find(t => 
          t.id === userData?.id || 
          t.email === userData?.email
        );
        
        // Guruhlarni topish (ham teachers ID, ham users ID bilan)
        if (teacher) {
          const groups1 = await groupsAPI.getByTeacher(teacher.id);
          groupsData = [...groups1];
        }
        const groups2 = await groupsAPI.getByTeacher(userData?.id);
        
        // Birlashtirish (dublikatlarni olib tashlash)
        const allGroups = [...groupsData, ...groups2];
        groupsData = allGroups.filter((g, index, self) => 
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
      
      // O'quvchi/Ota-ona faqat o'z baholarini ko'radi
      if (isStudentOrParent && studentData) {
        setGrades(gradesData.filter(g => g.studentId === studentData.id));
      } else {
        setGrades(gradesData);
      }
      setStudents(studentsData);
    } catch (err) { console.error(err); }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const student = students.find(s => s.id === formData.studentId);
      const newGrade = await gradesAPI.create({
        studentId: formData.studentId,
        studentName: student?.fullName || '',
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
      setFormData({ studentId: '', topic: '', grade: '', maxGrade: '100', note: '', date: new Date().toISOString().split('T')[0] });
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

  const getGradeColor = (grade, maxGrade) => {
    const percent = (grade / maxGrade) * 100;
    if (percent >= 80) return 'bg-green-100 text-green-700';
    if (percent >= 60) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  // O'quvchi statistikasi
  const getStudentStats = () => {
    const stats = {};
    students.forEach(s => {
      const studentGrades = grades.filter(g => g.studentId === s.id);
      if (studentGrades.length > 0) {
        const avg = studentGrades.reduce((sum, g) => sum + ((g.grade / g.maxGrade) * 100), 0) / studentGrades.length;
        stats[s.id] = { avg: Math.round(avg), count: studentGrades.length };
      }
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
        <Select 
          label="Guruh" 
          value={selectedGroup} 
          onChange={(e) => setSelectedGroup(e.target.value)} 
          options={groups.map(g => ({ value: g.id, label: g.name }))} 
          placeholder="Guruhni tanlang" 
        />
      </Card>

      {selectedGroup && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Baholar ro'yxati */}
          <div className="lg:col-span-2">
            <Card padding="p-0">
              <div className="p-4 border-b">
                <h3 className="font-semibold">Baholar tarixi</h3>
              </div>
              {grades.length > 0 ? (
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
                    {grades.map(grade => (
                      <Table.Row key={grade.id}>
                        <Table.Cell>
                          <div className="flex items-center gap-3">
                            <Avatar name={grade.studentName} size="sm" />
                            <span>{grade.studentName}</span>
                          </div>
                        </Table.Cell>
                        <Table.Cell>{grade.topic}</Table.Cell>
                        <Table.Cell>
                          <span className={`px-3 py-1 rounded-lg font-bold ${getGradeColor(grade.grade, grade.maxGrade)}`}>
                            {grade.grade}/{grade.maxGrade}
                          </span>
                        </Table.Cell>
                        <Table.Cell>{formatDate(grade.createdAt)}</Table.Cell>
                        {canEdit && (
                          <Table.Cell>
                            <button 
                              onClick={() => handleDelete(grade.id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </Table.Cell>
                        )}
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              ) : (
                <div className="p-8">
                  <EmptyState icon={FileText} title="Baholar yo'q" description="Bu guruhda hali baholar qo'yilmagan" />
                </div>
              )}
            </Card>
          </div>

          {/* O'quvchilar statistikasi */}
          <Card>
            <h3 className="font-semibold mb-4">O'quvchilar reytingi</h3>
            {students.length > 0 ? (
              <div className="space-y-3">
                {students
                  .map(s => ({ ...s, stats: studentStats[s.id] }))
                  .sort((a, b) => (b.stats?.avg || 0) - (a.stats?.avg || 0))
                  .map((student, index) => (
                    <div key={student.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                        index === 0 ? 'bg-yellow-500' : 
                        index === 1 ? 'bg-gray-400' : 
                        index === 2 ? 'bg-orange-400' : 'bg-gray-300'
                      }`}>
                        {index + 1}
                      </span>
                      <Avatar name={student.fullName} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{student.fullName}</p>
                        <p className="text-xs text-gray-500">
                          {student.stats ? `${student.stats.count} ta baho` : 'Baho yo\'q'}
                        </p>
                      </div>
                      <span className={`text-sm font-bold ${
                        student.stats?.avg >= 80 ? 'text-green-600' :
                        student.stats?.avg >= 60 ? 'text-yellow-600' :
                        student.stats?.avg > 0 ? 'text-red-600' : 'text-gray-400'
                      }`}>
                        {student.stats ? `${student.stats.avg}%` : '-'}
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
          <Input 
            label="Sana" 
            type="date"
            value={formData.date} 
            onChange={(e) => setFormData({ ...formData, date: e.target.value })} 
            required 
          />
          <Input 
            label="Mavzu" 
            value={formData.topic} 
            onChange={(e) => setFormData({ ...formData, topic: e.target.value })} 
            placeholder="Grammar Test, Speaking Practice..." 
            required 
          />
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Baho" 
              type="number" 
              value={formData.grade} 
              onChange={(e) => setFormData({ ...formData, grade: e.target.value })} 
              placeholder="85" 
              min="0"
              required 
            />
            <Input 
              label="Maksimum" 
              type="number" 
              value={formData.maxGrade} 
              onChange={(e) => setFormData({ ...formData, maxGrade: e.target.value })} 
              placeholder="100" 
              min="1"
              required 
            />
          </div>
          <Input 
            label="Izoh (ixtiyoriy)" 
            value={formData.note} 
            onChange={(e) => setFormData({ ...formData, note: e.target.value })} 
            placeholder="Qo'shimcha izoh" 
          />
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="ghost" onClick={() => setShowAddModal(false)}>Bekor qilish</Button>
            <Button type="submit" loading={formLoading}>Saqlash</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Grades;
