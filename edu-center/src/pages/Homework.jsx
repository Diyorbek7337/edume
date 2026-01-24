import { useState, useEffect } from 'react';
import { 
  BookOpen, Plus, Calendar, Clock, CheckCircle, XCircle, 
  FileText, Upload, Download, Eye, Trash2, Edit, Filter,
  Users, AlertTriangle, Star, MessageSquare
} from 'lucide-react';
import { Card, Button, Input, Select, Badge, Avatar, Table, Modal, Loading, EmptyState } from '../components/common';
import { Textarea } from '../components/common/Textarea';
import { homeworkAPI, groupsAPI, studentsAPI, teachersAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { ROLES } from '../utils/constants';
import { formatDate, formatDateISO } from '../utils/helpers';
import { toast } from 'react-toastify';

const Homework = () => {
  const { userData, role } = useAuth();
  const [homework, setHomework] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [groups, setGroups] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [selectedHomework, setSelectedHomework] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [filter, setFilter] = useState('all'); // all, pending, completed, overdue
  const [studentData, setStudentData] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    groupId: '',
    dueDate: '',
    maxScore: '100',
    attachments: []
  });
  const [formLoading, setFormLoading] = useState(false);

  const isTeacher = role === ROLES.TEACHER;
  const isAdmin = role === ROLES.ADMIN || role === ROLES.DIRECTOR;
  const isStudentOrParent = role === ROLES.STUDENT || role === ROLES.PARENT;
  const canCreate = isTeacher || isAdmin;

  useEffect(() => { fetchData(); }, []);
  useEffect(() => { if (selectedGroup) fetchHomeworkAndSubmissions(); }, [selectedGroup]);

  const fetchData = async () => {
    try {
      let groupsData = [];
      
      if (isTeacher) {
        const allTeachers = await teachersAPI.getAll();
        const normalizePhone = (phone) => phone?.replace(/\D/g, '') || '';
        const teacher = allTeachers.find(t => 
          t.id === userData?.id || 
          t.email === userData?.email ||
          normalizePhone(t.phone) === normalizePhone(userData?.phone)
        );
        
        const allGroups = await groupsAPI.getAll();
        if (teacher) {
          groupsData = allGroups.filter(g => g.teacherId === teacher.id);
        }
        const groups2 = allGroups.filter(g => g.teacherId === userData?.id);
        groupsData = [...groupsData, ...groups2].filter((g, i, self) => 
          i === self.findIndex(t => t.id === g.id)
        );
      } else if (isStudentOrParent) {
        const allStudents = await studentsAPI.getAll();
        const normalizePhone = (phone) => phone?.replace(/\D/g, '') || '';
        
        let student;
        if (role === ROLES.PARENT) {
          student = allStudents.find(s => 
            s.parentPhone === userData?.phone || 
            normalizePhone(s.parentPhone) === normalizePhone(userData?.phone)
          );
        } else {
          student = allStudents.find(s => 
            s.email === userData?.email || 
            normalizePhone(s.phone) === normalizePhone(userData?.phone)
          );
        }
        
        if (student) {
          setStudentData(student);
          const allGroups = await groupsAPI.getAll();
          groupsData = allGroups.filter(g => 
            g.id === student.groupId || g.studentIds?.includes(student.id)
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

  const fetchHomeworkAndSubmissions = async () => {
    try {
      const [homeworkData, studentsData] = await Promise.all([
        homeworkAPI.getByGroup(selectedGroup),
        studentsAPI.getByGroup(selectedGroup)
      ]);
      
      // Har bir uy vazifasi uchun topshiriqlarni olish
      const homeworkWithSubmissions = await Promise.all(
        homeworkData.map(async (hw) => {
          const subs = await homeworkAPI.getSubmissions(hw.id);
          return { ...hw, submissions: subs };
        })
      );
      
      setHomework(homeworkWithSubmissions.sort((a, b) => 
        new Date(b.createdAt?.seconds * 1000 || b.createdAt) - 
        new Date(a.createdAt?.seconds * 1000 || a.createdAt)
      ));
      setStudents(studentsData);
    } catch (err) { console.error(err); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const group = groups.find(g => g.id === formData.groupId);
      const newHomework = await homeworkAPI.create({
        ...formData,
        groupName: group?.name || '',
        teacherId: userData?.id,
        teacherName: userData?.fullName,
        maxScore: parseInt(formData.maxScore),
        status: 'active'
      });
      
      setHomework([{ ...newHomework, submissions: [] }, ...homework]);
      setShowAddModal(false);
      setFormData({ title: '', description: '', groupId: '', dueDate: '', maxScore: '100', attachments: [] });
      toast.success("Uy vazifasi qo'shildi");
    } catch (err) { 
      console.error(err);
      toast.error("Xatolik yuz berdi"); 
    }
    finally { setFormLoading(false); }
  };

  const handleSubmit = async (homeworkId, answer) => {
    try {
      await homeworkAPI.submitHomework(homeworkId, {
        studentId: studentData.id,
        studentName: studentData.fullName,
        answer,
        submittedAt: new Date().toISOString()
      });
      
      toast.success("Vazifa topshirildi!");
      fetchHomeworkAndSubmissions();
    } catch (err) {
      toast.error("Xatolik yuz berdi");
    }
  };

  const handleGrade = async (e) => {
    e.preventDefault();
    try {
      await homeworkAPI.gradeSubmission(selectedHomework.id, selectedSubmission.id, {
        score: parseInt(selectedSubmission.score),
        feedback: selectedSubmission.feedback,
        gradedAt: new Date().toISOString(),
        gradedBy: userData?.fullName
      });
      
      toast.success("Baho qo'yildi!");
      setShowGradeModal(false);
      fetchHomeworkAndSubmissions();
    } catch (err) {
      toast.error("Xatolik yuz berdi");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Bu uy vazifasini o'chirishni xohlaysizmi?")) return;
    
    try {
      await homeworkAPI.delete(id);
      setHomework(homework.filter(h => h.id !== id));
      toast.success("O'chirildi");
    } catch (err) { toast.error("Xatolik"); }
  };

  const getStatusBadge = (hw) => {
    const now = new Date();
    const dueDate = new Date(hw.dueDate);
    
    if (isStudentOrParent) {
      const mySubmission = hw.submissions?.find(s => s.studentId === studentData?.id);
      if (mySubmission?.score !== undefined) {
        return <Badge variant="success">Baholangan: {mySubmission.score}/{hw.maxScore}</Badge>;
      }
      if (mySubmission) {
        return <Badge variant="info">Topshirilgan</Badge>;
      }
      if (dueDate < now) {
        return <Badge variant="danger">Muddati o'tgan</Badge>;
      }
      return <Badge variant="warning">Kutilmoqda</Badge>;
    }
    
    const submittedCount = hw.submissions?.length || 0;
    const totalStudents = students.length;
    
    if (dueDate < now) {
      return <Badge variant="danger">{submittedCount}/{totalStudents} topshirdi</Badge>;
    }
    return <Badge variant="primary">{submittedCount}/{totalStudents} topshirdi</Badge>;
  };

  const filteredHomework = homework.filter(hw => {
    if (filter === 'all') return true;
    
    const now = new Date();
    const dueDate = new Date(hw.dueDate);
    
    if (isStudentOrParent) {
      const mySubmission = hw.submissions?.find(s => s.studentId === studentData?.id);
      
      switch (filter) {
        case 'pending':
          return !mySubmission && dueDate >= now;
        case 'completed':
          return !!mySubmission;
        case 'overdue':
          return !mySubmission && dueDate < now;
        default:
          return true;
      }
    }
    
    return true;
  });

  if (loading) return <Loading fullScreen text="Yuklanmoqda..." />;

  // O'quvchi/Ota-ona ko'rinishi
  if (isStudentOrParent) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Uy vazifalari</h1>
            <p className="text-gray-500">Berilgan vazifalar va topshiriqlar</p>
          </div>
          
          <div className="flex items-center gap-2">
            {groups.length > 1 && (
              <Select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                options={groups.map(g => ({ value: g.id, label: g.name }))}
                className="w-48"
              />
            )}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm"
            >
              <option value="all">Barchasi</option>
              <option value="pending">Kutilmoqda</option>
              <option value="completed">Topshirilgan</option>
              <option value="overdue">Muddati o'tgan</option>
            </select>
          </div>
        </div>

        {/* Statistika */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card padding="p-4" className="bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="text-center">
              <BookOpen className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-700">{homework.length}</p>
              <p className="text-sm text-blue-600">Jami vazifalar</p>
            </div>
          </Card>
          
          <Card padding="p-4" className="bg-gradient-to-br from-yellow-50 to-yellow-100">
            <div className="text-center">
              <Clock className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-yellow-700">
                {homework.filter(h => !h.submissions?.find(s => s.studentId === studentData?.id) && new Date(h.dueDate) >= new Date()).length}
              </p>
              <p className="text-sm text-yellow-600">Kutilmoqda</p>
            </div>
          </Card>
          
          <Card padding="p-4" className="bg-gradient-to-br from-green-50 to-green-100">
            <div className="text-center">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-700">
                {homework.filter(h => h.submissions?.find(s => s.studentId === studentData?.id)).length}
              </p>
              <p className="text-sm text-green-600">Topshirilgan</p>
            </div>
          </Card>
          
          <Card padding="p-4" className="bg-gradient-to-br from-red-50 to-red-100">
            <div className="text-center">
              <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-red-700">
                {homework.filter(h => !h.submissions?.find(s => s.studentId === studentData?.id) && new Date(h.dueDate) < new Date()).length}
              </p>
              <p className="text-sm text-red-600">Muddati o'tgan</p>
            </div>
          </Card>
        </div>

        {/* Vazifalar ro'yxati */}
        <div className="space-y-4">
          {filteredHomework.length > 0 ? filteredHomework.map(hw => {
            const mySubmission = hw.submissions?.find(s => s.studentId === studentData?.id);
            const isOverdue = new Date(hw.dueDate) < new Date();
            
            return (
              <Card key={hw.id} className={`${isOverdue && !mySubmission ? 'border-red-200 bg-red-50/50' : ''}`}>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        mySubmission?.score !== undefined ? 'bg-green-100' :
                        mySubmission ? 'bg-blue-100' :
                        isOverdue ? 'bg-red-100' : 'bg-yellow-100'
                      }`}>
                        <BookOpen className={`w-6 h-6 ${
                          mySubmission?.score !== undefined ? 'text-green-600' :
                          mySubmission ? 'text-blue-600' :
                          isOverdue ? 'text-red-600' : 'text-yellow-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{hw.title}</h3>
                        <p className="text-gray-600 mt-1">{hw.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Muddat: {formatDate(hw.dueDate)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4" />
                            Max: {hw.maxScore} ball
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Mening natijam */}
                    {mySubmission?.score !== undefined && (
                      <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-green-700">Mening bahom:</span>
                          <span className="text-2xl font-bold text-green-600">{mySubmission.score}/{hw.maxScore}</span>
                        </div>
                        {mySubmission.feedback && (
                          <p className="mt-2 text-sm text-green-600">
                            <MessageSquare className="w-4 h-4 inline mr-1" />
                            {mySubmission.feedback}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    {getStatusBadge(hw)}
                    
                    {!mySubmission && !isOverdue && (
                      <Button 
                        size="sm" 
                        onClick={() => {
                          setSelectedHomework(hw);
                          setShowViewModal(true);
                        }}
                      >
                        Topshirish
                      </Button>
                    )}
                    
                    {mySubmission && !mySubmission.score && (
                      <span className="text-sm text-gray-500">Tekshirilmoqda...</span>
                    )}
                  </div>
                </div>
              </Card>
            );
          }) : (
            <Card className="text-center py-12">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {filter === 'all' ? "Uy vazifalari yo'q" : "Bu filterdagi vazifalar yo'q"}
              </p>
            </Card>
          )}
        </div>

        {/* Topshirish Modal */}
        <Modal 
          isOpen={showViewModal} 
          onClose={() => setShowViewModal(false)} 
          title={selectedHomework?.title}
          size="lg"
        >
          {selectedHomework && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700">{selectedHomework.description}</p>
                <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                  <span>Muddat: {formatDate(selectedHomework.dueDate)}</span>
                  <span>Max ball: {selectedHomework.maxScore}</span>
                </div>
              </div>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                const answer = e.target.answer.value;
                handleSubmit(selectedHomework.id, answer);
                setShowViewModal(false);
              }}>
                <Textarea
                  name="answer"
                  label="Javobingiz"
                  placeholder="Vazifa javobini yozing..."
                  rows={6}
                  required
                />
                <div className="flex gap-2 mt-4">
                  <Button type="submit" className="flex-1">
                    <Upload className="w-4 h-4 mr-2" />
                    Topshirish
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowViewModal(false)}>
                    Bekor qilish
                  </Button>
                </div>
              </form>
            </div>
          )}
        </Modal>
      </div>
    );
  }

  // O'qituvchi/Admin ko'rinishi
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Uy vazifalari</h1>
          <p className="text-gray-500">Vazifa berish va tekshirish</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            options={groups.map(g => ({ value: g.id, label: g.name }))}
            placeholder="Guruhni tanlang"
            className="w-48"
          />
          {canCreate && selectedGroup && (
            <Button icon={Plus} onClick={() => {
              setFormData({ ...formData, groupId: selectedGroup });
              setShowAddModal(true);
            }}>
              Vazifa berish
            </Button>
          )}
        </div>
      </div>

      {selectedGroup ? (
        <>
          {/* Statistika */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card padding="p-4" className="text-center">
              <BookOpen className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{homework.length}</p>
              <p className="text-sm text-gray-500">Jami vazifalar</p>
            </Card>
            <Card padding="p-4" className="text-center">
              <Users className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{students.length}</p>
              <p className="text-sm text-gray-500">O'quvchilar</p>
            </Card>
            <Card padding="p-4" className="text-center">
              <CheckCircle className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">
                {homework.reduce((sum, h) => sum + (h.submissions?.filter(s => s.score !== undefined).length || 0), 0)}
              </p>
              <p className="text-sm text-gray-500">Baholangan</p>
            </Card>
            <Card padding="p-4" className="text-center">
              <Clock className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">
                {homework.reduce((sum, h) => sum + (h.submissions?.filter(s => s.score === undefined).length || 0), 0)}
              </p>
              <p className="text-sm text-gray-500">Tekshirilmagan</p>
            </Card>
          </div>

          {/* Vazifalar ro'yxati */}
          <div className="space-y-4">
            {homework.length > 0 ? homework.map(hw => (
              <Card key={hw.id}>
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{hw.title}</h3>
                        <p className="text-gray-600 mt-1 line-clamp-2">{hw.description}</p>
                      </div>
                      {getStatusBadge(hw)}
                    </div>
                    
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(hw.dueDate)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        {hw.maxScore} ball
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        setSelectedHomework(hw);
                        setShowViewModal(true);
                      }}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Topshiriqlar ({hw.submissions?.length || 0})
                    </Button>
                    {canCreate && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(hw.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            )) : (
              <Card className="text-center py-12">
                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Bu guruhda uy vazifalari yo'q</p>
                {canCreate && (
                  <Button className="mt-4" onClick={() => {
                    setFormData({ ...formData, groupId: selectedGroup });
                    setShowAddModal(true);
                  }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Birinchi vazifa berish
                  </Button>
                )}
              </Card>
            )}
          </div>
        </>
      ) : (
        <Card className="text-center py-12">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Guruhni tanlang</p>
        </Card>
      )}

      {/* Vazifa qo'shish Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Yangi uy vazifasi" size="lg">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Vazifa nomi"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Masalan: 5-mavzu bo'yicha mashqlar"
            required
          />
          
          <Textarea
            label="Tavsif"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Vazifa haqida batafsil ma'lumot..."
            rows={4}
            required
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="date"
              label="Topshirish muddati"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              required
            />
            <Input
              type="number"
              label="Maksimal ball"
              value={formData.maxScore}
              onChange={(e) => setFormData({ ...formData, maxScore: e.target.value })}
              min="1"
              max="100"
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button type="submit" loading={formLoading} className="flex-1">
              Vazifa berish
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
              Bekor qilish
            </Button>
          </div>
        </form>
      </Modal>

      {/* Topshiriqlarni ko'rish Modal */}
      <Modal 
        isOpen={showViewModal} 
        onClose={() => setShowViewModal(false)} 
        title={`${selectedHomework?.title} - Topshiriqlar`}
        size="xl"
      >
        {selectedHomework && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">{selectedHomework.description}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span>Muddat: {formatDate(selectedHomework.dueDate)}</span>
                <span>Max ball: {selectedHomework.maxScore}</span>
              </div>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {students.map(student => {
                const submission = selectedHomework.submissions?.find(s => s.studentId === student.id);
                
                return (
                  <div 
                    key={student.id} 
                    className={`p-4 rounded-lg border-2 ${
                      submission?.score !== undefined ? 'border-green-200 bg-green-50' :
                      submission ? 'border-blue-200 bg-blue-50' :
                      'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar name={student.fullName} size="sm" />
                        <div>
                          <p className="font-medium">{student.fullName}</p>
                          {submission ? (
                            <p className="text-sm text-gray-500">
                              Topshirilgan: {formatDate(submission.submittedAt)}
                            </p>
                          ) : (
                            <p className="text-sm text-red-500">Topshirilmagan</p>
                          )}
                        </div>
                      </div>
                      
                      {submission?.score !== undefined ? (
                        <Badge variant="success">{submission.score}/{selectedHomework.maxScore}</Badge>
                      ) : submission ? (
                        <Button 
                          size="sm"
                          onClick={() => {
                            setSelectedSubmission({ ...submission, score: '', feedback: '' });
                            setShowGradeModal(true);
                          }}
                        >
                          Baholash
                        </Button>
                      ) : (
                        <Badge variant="warning">Kutilmoqda</Badge>
                      )}
                    </div>
                    
                    {submission && (
                      <div className="mt-3 p-3 bg-white rounded border">
                        <p className="text-sm font-medium text-gray-600">Javob:</p>
                        <p className="text-gray-800 mt-1">{submission.answer}</p>
                        {submission.feedback && (
                          <p className="mt-2 text-sm text-green-600">
                            <MessageSquare className="w-4 h-4 inline mr-1" />
                            {submission.feedback}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Modal>

      {/* Baholash Modal */}
      <Modal 
        isOpen={showGradeModal} 
        onClose={() => setShowGradeModal(false)} 
        title="Baholash"
      >
        {selectedSubmission && (
          <form onSubmit={handleGrade} className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium">{selectedSubmission.studentName}</p>
              <p className="text-gray-600 mt-2">{selectedSubmission.answer}</p>
            </div>
            
            <Input
              type="number"
              label={`Ball (max: ${selectedHomework?.maxScore})`}
              value={selectedSubmission.score}
              onChange={(e) => setSelectedSubmission({ ...selectedSubmission, score: e.target.value })}
              min="0"
              max={selectedHomework?.maxScore}
              required
            />
            
            <Textarea
              label="Izoh (ixtiyoriy)"
              value={selectedSubmission.feedback}
              onChange={(e) => setSelectedSubmission({ ...selectedSubmission, feedback: e.target.value })}
              placeholder="O'quvchiga izoh..."
              rows={3}
            />
            
            <div className="flex gap-2">
              <Button type="submit" className="flex-1">Baholash</Button>
              <Button type="button" variant="outline" onClick={() => setShowGradeModal(false)}>
                Bekor qilish
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default Homework;
