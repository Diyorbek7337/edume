import { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, GraduationCap } from 'lucide-react';
import { Card, Button, Input, Badge, Avatar, Modal, Loading, EmptyState } from '../components/common';
import { teachersAPI, groupsAPI, usersAPI } from '../services/api';
import { formatPhone } from '../utils/helpers';
import { ROLES } from '../utils/constants';
import { toast } from 'react-toastify';

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [formData, setFormData] = useState({ fullName: '', phone: '', email: '', subject: '', password: '' });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [teachersData, groupsData] = await Promise.all([teachersAPI.getAll(), groupsAPI.getAll()]);
      setTeachers(teachersData);
      setGroups(groupsData);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const filteredTeachers = teachers.filter(t =>
    t.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.phone?.includes(searchQuery) ||
    t.subject?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resetForm = () => { 
    setFormData({ fullName: '', phone: '', email: '', subject: '', password: '' }); 
    setFormError(''); 
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    
    if (!formData.password || formData.password.length < 6) {
      setFormError("Parol kamida 6 ta belgidan iborat bo'lishi kerak");
      return;
    }
    
    setFormLoading(true);
    setFormError('');
    
    try {
      // 1. Firebase Auth'da foydalanuvchi yaratish
      await usersAPI.create({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        role: ROLES.TEACHER
      }, formData.password);
      
      // 2. Teachers kolleksiyasiga qo'shish
      const newTeacher = await teachersAPI.create({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        status: 'active'
      });
      
      setTeachers([newTeacher, ...teachers]);
      setShowAddModal(false);
      resetForm();
    } catch (err) {
      console.error('Teacher add error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setFormError("Bu email allaqachon ro'yxatdan o'tgan");
      } else if (err.code === 'auth/invalid-email') {
        setFormError("Email formati noto'g'ri");
      } else if (err.code === 'auth/weak-password') {
        setFormError("Parol juda oddiy");
      } else {
        setFormError("Xatolik yuz berdi: " + (err.message || err.code || 'Noma\'lum xato'));
      }
    } finally { 
      setFormLoading(false); 
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');
    
    try {
      await teachersAPI.update(selectedTeacher.id, {
        fullName: formData.fullName,
        phone: formData.phone,
        subject: formData.subject
      });
      setTeachers(teachers.map(t => t.id === selectedTeacher.id ? { 
        ...t, 
        fullName: formData.fullName,
        phone: formData.phone,
        subject: formData.subject 
      } : t));
      setShowEditModal(false);
      resetForm();
    } catch (err) { 
      setFormError("Xatolik yuz berdi"); 
    }
    finally { setFormLoading(false); }
  };

  const handleDelete = async () => {
    setFormLoading(true);
    try {
      // Teachers kolleksiyasidan o'chirish
      await teachersAPI.delete(selectedTeacher.id);
      
      // Users kolleksiyasidan ham o'chirish
      try {
        const allUsers = await usersAPI.getByRole(ROLES.TEACHER);
        const teacherUser = allUsers.find(u => u.email === selectedTeacher.email);
        if (teacherUser) {
          await usersAPI.delete(teacherUser.id);
        }
      } catch (err) { console.log('User delete warning:', err); }
      
      setTeachers(teachers.filter(t => t.id !== selectedTeacher.id));
      setShowDeleteModal(false);
      toast.success("O'qituvchi o'chirildi");
    } catch (err) { 
      console.error(err);
      toast.error("O'chirishda xatolik"); 
    }
    finally { setFormLoading(false); }
  };

  const openEditModal = (teacher) => {
    setSelectedTeacher(teacher);
    setFormData({ 
      fullName: teacher.fullName || '', 
      phone: teacher.phone || '', 
      email: teacher.email || '', 
      subject: teacher.subject || '', 
      password: '' 
    });
    setFormError('');
    setShowEditModal(true);
  };

  const getTeacherGroups = (teacherId) => groups.filter(g => g.teacherId === teacherId);

  if (loading) return <Loading fullScreen text="Yuklanmoqda..." />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">O'qituvchilar</h1>
          <p className="text-gray-500">Jami {teachers.length} ta o'qituvchi</p>
        </div>
        <Button icon={Plus} onClick={() => { resetForm(); setShowAddModal(true); }}>
          Yangi o'qituvchi
        </Button>
      </div>

      <Card padding="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Ism, telefon yoki fan bo'yicha qidirish..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500" 
          />
        </div>
      </Card>

      {filteredTeachers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTeachers.map(teacher => {
            const teacherGroups = getTeacherGroups(teacher.id);
            return (
              <Card key={teacher.id} className="hover:shadow-md transition">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar name={teacher.fullName} size="lg" />
                    <div>
                      <h3 className="font-semibold text-gray-900">{teacher.fullName}</h3>
                      <p className="text-sm text-primary-600">{teacher.subject}</p>
                    </div>
                  </div>
                  <Badge variant={teacher.status === 'active' ? 'success' : 'default'}>
                    {teacher.status === 'active' ? 'Faol' : 'Nofaol'}
                  </Badge>
                </div>
                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  <p>📱 <a href={`tel:${teacher.phone}`} className="text-primary-600">{formatPhone(teacher.phone)}</a></p>
                  <p>📧 {teacher.email}</p>
                  <p>📚 {teacherGroups.length} ta guruh</p>
                </div>
                {teacherGroups.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {teacherGroups.slice(0, 3).map(g => (
                      <Badge key={g.id} variant="primary">{g.name}</Badge>
                    ))}
                    {teacherGroups.length > 3 && <Badge>+{teacherGroups.length - 3}</Badge>}
                  </div>
                )}
                <div className="mt-4 pt-4 border-t flex justify-end gap-1">
                  <button 
                    onClick={() => openEditModal(teacher)} 
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => { setSelectedTeacher(teacher); setShowDeleteModal(true); }} 
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <EmptyState 
            icon={GraduationCap} 
            title="O'qituvchilar topilmadi" 
            action={<Button onClick={() => setSearchQuery('')}>Tozalash</Button>} 
          />
        </Card>
      )}

      {/* Add Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Yangi o'qituvchi qo'shish" size="lg">
        <form onSubmit={handleAdd} className="space-y-4">
          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {formError}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="To'liq ismi" 
              value={formData.fullName} 
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} 
              placeholder="Ism Familiya"
              required 
            />
            <Input 
              label="Telefon" 
              value={formData.phone} 
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
              placeholder="+998901234567"
              required 
            />
            <Input 
              label="Email" 
              type="email" 
              value={formData.email} 
              onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
              placeholder="teacher@example.com"
              required 
            />
            <Input 
              label="Fan" 
              value={formData.subject} 
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })} 
              placeholder="Ingliz tili" 
              required 
            />
            <Input 
              label="Parol" 
              type="password" 
              value={formData.password} 
              onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
              placeholder="Kamida 6 ta belgi" 
              required 
            />
          </div>
          <p className="text-sm text-gray-500">
            * O'qituvchi ushbu email va parol bilan tizimga kirishi mumkin bo'ladi
          </p>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="ghost" onClick={() => setShowAddModal(false)}>Bekor qilish</Button>
            <Button type="submit" loading={formLoading}>Qo'shish</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="O'qituvchini tahrirlash">
        <form onSubmit={handleEdit} className="space-y-4">
          {formError && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{formError}</div>
          )}
          <Input 
            label="To'liq ismi" 
            value={formData.fullName} 
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} 
            required 
          />
          <Input 
            label="Telefon" 
            value={formData.phone} 
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
            required 
          />
          <Input 
            label="Email" 
            type="email" 
            value={formData.email}
            disabled 
          />
          <Input 
            label="Fan" 
            value={formData.subject} 
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })} 
            required 
          />
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="ghost" onClick={() => setShowEditModal(false)}>Bekor qilish</Button>
            <Button type="submit" loading={formLoading}>Saqlash</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="O'qituvchini o'chirish">
        <p className="text-gray-600 mb-4">
          <strong>{selectedTeacher?.fullName}</strong> ni o'chirishni xohlaysizmi?
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>Bekor qilish</Button>
          <Button variant="danger" loading={formLoading} onClick={handleDelete}>O'chirish</Button>
        </div>
      </Modal>
    </div>
  );
};

export default Teachers;
