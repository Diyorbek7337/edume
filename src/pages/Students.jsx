import { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Eye, Download, Copy, Check, Gift } from 'lucide-react';
import { Card, Button, Input, Select, Badge, Avatar, Table, Modal, Loading, EmptyState } from '../components/common';
import { studentsAPI, groupsAPI, usersAPI, settingsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { ROLES } from '../utils/constants';
import { formatPhone, formatMoney } from '../utils/helpers';
import { toast } from 'react-toastify';

const Students = () => {
  const { userData, role } = useAuth();
  const [students, setStudents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGroup, setFilterGroup] = useState('');
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formData, setFormData] = useState({ 
    fullName: '', phone: '', email: '', groupId: '', 
    parentName: '', parentPhone: '', parentTelegram: '', address: '' 
  });
  const [credentials, setCredentials] = useState({ studentEmail: '', studentPassword: '', parentEmail: '', parentPassword: '' });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [copied, setCopied] = useState('');

  const isTeacher = role === ROLES.TEACHER;
  const isAdmin = role === ROLES.ADMIN || role === ROLES.DIRECTOR;

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      let groupsData;
      let studentsData;

      if (isTeacher) {
        groupsData = await groupsAPI.getByTeacher(userData?.id);
        const studentPromises = groupsData.map(g => studentsAPI.getByGroup(g.id));
        const studentsArrays = await Promise.all(studentPromises);
        studentsData = studentsArrays.flat();
      } else {
        [studentsData, groupsData] = await Promise.all([studentsAPI.getAll(), groupsAPI.getAll()]);
      }

      setStudents(studentsData);
      setGroups(groupsData);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) || s.phone?.includes(searchQuery);
    const matchesGroup = !filterGroup || s.groupId === filterGroup;
    return matchesSearch && matchesGroup;
  });

  const resetForm = () => { 
    setFormData({ 
      fullName: '', 
      phone: '', 
      email: '', 
      groupId: '', 
      parentName: '', 
      parentPhone: '', 
      parentTelegram: '', 
      address: '',
      startDate: new Date().toISOString().split('T')[0],
      paymentDay: '1',
      paymentType: 'full_month',
      referredBy: '', // Tavsiya qilgan o'quvchi ID
      discount: '0' // Chegirma foizi
    }); 
    setFormError(''); 
  };

  const updateGroupStudentsCount = async (groupId, increment = true) => {
    if (!groupId) return;
    try {
      const group = groups.find(g => g.id === groupId);
      if (group) {
        const newCount = Math.max(0, (group.studentsCount || 0) + (increment ? 1 : -1));
        await groupsAPI.update(groupId, { studentsCount: newCount });
        setGroups(groups.map(g => g.id === groupId ? { ...g, studentsCount: newCount } : g));
      }
    } catch (err) { console.error(err); }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');
    
    try {
      const group = groups.find(g => g.id === formData.groupId);
      
      // O'quvchi uchun login/parol
      const studentEmail = `${formData.phone.replace(/\D/g, '')}@student.edu`;
      const studentPassword = 'student123';
      
      // 1. O'quvchi Firebase Auth yaratish
      await usersAPI.create({
        fullName: formData.fullName,
        email: studentEmail,
        phone: formData.phone,
        role: ROLES.STUDENT
      }, studentPassword);
      
      // 2. Students kolleksiyasiga qo'shish
      const newStudent = await studentsAPI.create({ 
        ...formData, 
        email: studentEmail,
        groupName: group?.name || '', 
        status: 'active',
        mustChangePassword: true,
        startDate: formData.startDate,
        paymentDay: parseInt(formData.paymentDay) || 1,
        paymentType: formData.paymentType || 'full_month',
        referredBy: formData.referredBy || null,
        discount: parseInt(formData.discount) || 0
      });
      
      // 2.5 Tavsiya mukofoti - agar tavsiya qilgan o'quvchi bo'lsa
      if (formData.referredBy) {
        try {
          const settingsData = await settingsAPI.get();
          const referralBonus = parseInt(settingsData?.referralBonus) || 10; // Default 10%
          const monthlyFee = parseInt(settingsData?.monthlyFee) || 500000;
          const bonusAmount = Math.round(monthlyFee * referralBonus / 100);
          
          // Tavsiya qilgan o'quvchiga mukofot yozish
          const referrer = students.find(s => s.id === formData.referredBy);
          if (referrer) {
            const currentBonus = parseInt(referrer.referralBonus) || 0;
            await studentsAPI.update(formData.referredBy, { 
              referralBonus: currentBonus + bonusAmount,
              referralCount: (referrer.referralCount || 0) + 1
            });
          }
        } catch (err) {
          console.error('Referral bonus error:', err);
        }
      }
      
      // 3. Ota-ona akkaunti yaratish yoki yangilash
      let parentEmail = '';
      let parentPassword = 'parent123';
      
      if (formData.parentPhone) {
        parentEmail = `${formData.parentPhone.replace(/\D/g, '')}@parent.edu`;
        try {
          // Avval mavjud ota-onani tekshirish
          const existingUsers = await usersAPI.getAll();
          const existingParent = existingUsers.find(u => 
            u.email === parentEmail || 
            u.phone === formData.parentPhone ||
            u.phone?.replace(/\D/g, '') === formData.parentPhone.replace(/\D/g, '')
          );
          
          if (existingParent) {
            // Mavjud ota-onaga yangi farzand qo'shish
            const childIds = existingParent.childIds || [];
            if (existingParent.childId && !childIds.includes(existingParent.childId)) {
              childIds.push(existingParent.childId);
            }
            if (!childIds.includes(newStudent.id)) {
              childIds.push(newStudent.id);
            }
            
            const childNames = existingParent.childNames || [];
            if (existingParent.childName && !childNames.includes(existingParent.childName)) {
              childNames.push(existingParent.childName);
            }
            if (!childNames.includes(formData.fullName)) {
              childNames.push(formData.fullName);
            }
            
            await usersAPI.update(existingParent.id, { 
              childIds, 
              childNames,
              childId: childIds[0], // Eski format uchun
              childName: childNames[0]
            });
            parentEmail = existingParent.email;
          } else {
            // Yangi ota-ona yaratish
            await usersAPI.create({
              fullName: formData.parentName || `${formData.fullName} (ota-ona)`,
              email: parentEmail,
              phone: formData.parentPhone,
              telegram: formData.parentTelegram,
              role: ROLES.PARENT,
              childName: formData.fullName,
              childId: newStudent.id,
              childIds: [newStudent.id],
              childNames: [formData.fullName]
            }, parentPassword);
          }
        } catch (err) {
          if (err.code !== 'auth/email-already-in-use') {
            console.error('Parent creation error:', err);
          }
        }
      }
      
      // 4. Guruh studentsCount yangilash
      if (formData.groupId) {
        await updateGroupStudentsCount(formData.groupId, true);
      }
      
      setStudents([{ ...newStudent, email: studentEmail }, ...students]);
      setShowAddModal(false);
      resetForm();
      
      // Credentials ko'rsatish
      setCredentials({
        studentEmail,
        studentPassword,
        parentEmail,
        parentPassword
      });
      setShowCredentialsModal(true);
      
    } catch (err) { 
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setFormError("Bu telefon raqami allaqachon ro'yxatdan o'tgan");
      } else {
        setFormError("Xatolik yuz berdi: " + err.message); 
      }
    }
    finally { setFormLoading(false); }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');
    
    try {
      const group = groups.find(g => g.id === formData.groupId);
      const oldGroupId = selectedStudent.groupId;
      const newGroupId = formData.groupId;
      
      await studentsAPI.update(selectedStudent.id, { 
        ...formData, 
        groupName: group?.name || '' 
      });
      
      if (oldGroupId !== newGroupId) {
        if (oldGroupId) await updateGroupStudentsCount(oldGroupId, false);
        if (newGroupId) await updateGroupStudentsCount(newGroupId, true);
      }
      
      setStudents(students.map(s => s.id === selectedStudent.id ? { ...s, ...formData, groupName: group?.name || '' } : s));
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
      // Students kolleksiyasidan o'chirish
      await studentsAPI.delete(selectedStudent.id);
      
      // Users kolleksiyasidan ham o'chirish (o'quvchi)
      try {
        const allUsers = await usersAPI.getByRole(ROLES.STUDENT);
        const studentUser = allUsers.find(u => u.email === selectedStudent.email);
        if (studentUser) {
          await usersAPI.delete(studentUser.id);
        }
      } catch (err) { console.log('User delete warning:', err); }
      
      // Ota-ona profilini o'chirish
      if (selectedStudent.parentPhone) {
        try {
          const parentEmail = `${selectedStudent.parentPhone.replace(/\D/g, '')}@parent.edu`;
          const allParents = await usersAPI.getByRole(ROLES.PARENT);
          const parentUser = allParents.find(u => u.email === parentEmail);
          if (parentUser) {
            await usersAPI.delete(parentUser.id);
          }
        } catch (err) { console.log('Parent delete warning:', err); }
      }
      
      // Guruh studentsCount yangilash
      if (selectedStudent.groupId) {
        await updateGroupStudentsCount(selectedStudent.groupId, false);
      }
      
      setStudents(students.filter(s => s.id !== selectedStudent.id));
      setShowDeleteModal(false);
      toast.success("O'quvchi o'chirildi");
    } catch (err) { 
      console.error(err);
      toast.error("O'chirishda xatolik"); 
    }
    finally { setFormLoading(false); }
  };

  const openEditModal = (student) => {
    setSelectedStudent(student);
    setFormData({ 
      fullName: student.fullName || '', 
      phone: student.phone || '', 
      email: student.email || '', 
      groupId: student.groupId || '', 
      parentName: student.parentName || '', 
      parentPhone: student.parentPhone || '',
      parentTelegram: student.parentTelegram || '',
      address: student.address || '' 
    });
    setFormError('');
    setShowEditModal(true);
  };

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(''), 2000);
  };

  const exportToCSV = () => {
    const headers = ["Ism", "Telefon", "Email", "Guruh", "Ota-ona", "Ota-ona tel", "Telegram"];
    const rows = filteredStudents.map(s => [s.fullName, s.phone, s.email, s.groupName, s.parentName, s.parentPhone, s.parentTelegram]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a'); 
    link.href = URL.createObjectURL(blob); 
    link.download = 'students.csv'; 
    link.click();
  };

  if (loading) return <Loading fullScreen text="Yuklanmoqda..." />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isTeacher ? "O'quvchilarim" : "O'quvchilar"}</h1>
          <p className="text-gray-500">Jami {students.length} ta o'quvchi</p>
        </div>
        <div className="flex gap-2">
          {isAdmin && (
            <>
              <Button variant="outline" icon={Download} onClick={exportToCSV}>Export</Button>
              <Button icon={Plus} onClick={() => { resetForm(); setShowAddModal(true); }}>Yangi o'quvchi</Button>
            </>
          )}
        </div>
      </div>

      <Card padding="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Qidirish..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500" />
          </div>
          <Select value={filterGroup} onChange={(e) => setFilterGroup(e.target.value)} options={groups.map(g => ({ value: g.id, label: g.name }))} placeholder="Barcha guruhlar" className="w-full md:w-64" />
        </div>
      </Card>

      {filteredStudents.length > 0 ? (
        <Card padding="p-0">
          <Table>
            <Table.Head>
              <Table.Row>
                <Table.Header>O'quvchi</Table.Header>
                <Table.Header>Telefon</Table.Header>
                <Table.Header>Guruh</Table.Header>
                <Table.Header>Ota-ona</Table.Header>
                <Table.Header className="text-right">Amallar</Table.Header>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {filteredStudents.map(student => (
                <Table.Row key={student.id}>
                  <Table.Cell>
                    <div className="flex items-center gap-3">
                      <Avatar name={student.fullName} />
                      <div>
                        <p className="font-medium">{student.fullName}</p>
                        <p className="text-sm text-gray-500">{student.email}</p>
                      </div>
                    </div>
                  </Table.Cell>
                  <Table.Cell><a href={`tel:${student.phone}`} className="text-primary-600">{formatPhone(student.phone)}</a></Table.Cell>
                  <Table.Cell><Badge variant="primary">{student.groupName || '-'}</Badge></Table.Cell>
                  <Table.Cell>
                    <p className="text-sm">{student.parentName}</p>
                    <a href={`tel:${student.parentPhone}`} className="text-sm text-primary-600">{formatPhone(student.parentPhone)}</a>
                    {student.parentTelegram && <p className="text-xs text-blue-500">@{student.parentTelegram}</p>}
                  </Table.Cell>
                  <Table.Cell className="text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => { setSelectedStudent(student); setShowViewModal(true); }} className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg"><Eye className="w-4 h-4" /></button>
                      {isAdmin && (
                        <>
                          <button onClick={() => openEditModal(student)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => { setSelectedStudent(student); setShowDeleteModal(true); }} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                        </>
                      )}
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Card>
      ) : (
        <Card><EmptyState icon={Search} title="O'quvchilar topilmadi" action={<Button onClick={() => { setSearchQuery(''); setFilterGroup(''); }}>Tozalash</Button>} /></Card>
      )}

      {/* Add Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Yangi o'quvchi" size="lg">
        <form onSubmit={handleAdd} className="space-y-4">
          {formError && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{formError}</div>}
          
          <div className="p-3 bg-blue-50 rounded-lg text-sm">
            <p className="font-medium text-blue-800">Avtomatik login ma'lumotlari</p>
            <p className="text-blue-600">O'quvchi va ota-ona uchun login/parol avtomatik yaratiladi</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="To'liq ismi *" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} required />
            <Input label="Telefon *" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+998901234567" required />
            <Select label="Guruh" value={formData.groupId} onChange={(e) => setFormData({ ...formData, groupId: e.target.value })} options={groups.map(g => ({ value: g.id, label: g.name }))} />
            <Input label="Manzil" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
          </div>
          
          <h4 className="font-medium pt-2 border-t">O'qish va to'lov sozlamalari</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input 
              label="O'qishni boshlash sanasi *" 
              type="date" 
              value={formData.startDate} 
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} 
              required 
            />
            <Select 
              label="To'lov turi" 
              value={formData.paymentType} 
              onChange={(e) => setFormData({ ...formData, paymentType: e.target.value })} 
              options={[
                { value: 'full_month', label: 'To\'liq oylik (1-sanadan)' },
                { value: 'prorated', label: 'Proporsional (boshlash sanasidan)' }
              ]} 
            />
            <Input 
              label="To'lov kuni (oyning)" 
              type="number" 
              min="1" 
              max="28" 
              value={formData.paymentDay} 
              onChange={(e) => setFormData({ ...formData, paymentDay: e.target.value })} 
              placeholder="1"
            />
          </div>
          <p className="text-xs text-gray-500">
            * Proporsional: Agar o'quvchi oyning o'rtasida boshlasa, birinchi oylik proporsional hisoblanadi
          </p>
          
          <h4 className="font-medium pt-2 border-t flex items-center gap-2">
            <Gift className="w-4 h-4 text-purple-600" />
            Tavsiya va chegirma
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select 
              label="Tavsiya qilgan o'quvchi" 
              value={formData.referredBy} 
              onChange={(e) => setFormData({ ...formData, referredBy: e.target.value })}
              options={[
                { value: '', label: 'Tanlanmagan' },
                ...students.filter(s => s.status === 'active').map(s => ({ 
                  value: s.id, 
                  label: `${s.fullName} (${s.groupName || 'Guruhsiz'})` 
                }))
              ]}
            />
            <Input 
              label="Chegirma (%)" 
              type="number" 
              min="0" 
              max="100" 
              value={formData.discount} 
              onChange={(e) => setFormData({ ...formData, discount: e.target.value })} 
              placeholder="0"
            />
          </div>
          {formData.referredBy && (
            <div className="p-3 bg-purple-50 rounded-lg text-sm text-purple-700">
              <p>✨ Tavsiya qilgan o'quvchi mukofot oladi (sozlamalarda belgilangan foiz miqdorida)</p>
            </div>
          )}
          
          <h4 className="font-medium pt-2 border-t">Ota-ona ma'lumotlari</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Ota-ona ismi" value={formData.parentName} onChange={(e) => setFormData({ ...formData, parentName: e.target.value })} />
            <Input label="Ota-ona telefoni" value={formData.parentPhone} onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })} placeholder="+998901234567" />
            <Input label="Telegram username" value={formData.parentTelegram} onChange={(e) => setFormData({ ...formData, parentTelegram: e.target.value })} placeholder="username (@ siz)" />
          </div>
          
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="ghost" onClick={() => setShowAddModal(false)}>Bekor qilish</Button>
            <Button type="submit" loading={formLoading}>Qo'shish</Button>
          </div>
        </form>
      </Modal>

      {/* Credentials Modal */}
      <Modal isOpen={showCredentialsModal} onClose={() => setShowCredentialsModal(false)} title="Login ma'lumotlari" size="md">
        <div className="space-y-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-800 mb-3">O'quvchi uchun:</h4>
            <div className="flex items-center justify-between bg-white p-2 rounded mb-2">
              <span className="text-sm">Login: <strong>{credentials.studentEmail}</strong></span>
              <button onClick={() => copyToClipboard(credentials.studentEmail, 'se')} className="p-1 hover:bg-gray-100 rounded">
                {copied === 'se' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex items-center justify-between bg-white p-2 rounded">
              <span className="text-sm">Parol: <strong>{credentials.studentPassword}</strong></span>
              <button onClick={() => copyToClipboard(credentials.studentPassword, 'sp')} className="p-1 hover:bg-gray-100 rounded">
                {copied === 'sp' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
          
          {credentials.parentEmail && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-3">Ota-ona uchun:</h4>
              <div className="flex items-center justify-between bg-white p-2 rounded mb-2">
                <span className="text-sm">Login: <strong>{credentials.parentEmail}</strong></span>
                <button onClick={() => copyToClipboard(credentials.parentEmail, 'pe')} className="p-1 hover:bg-gray-100 rounded">
                  {copied === 'pe' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex items-center justify-between bg-white p-2 rounded">
                <span className="text-sm">Parol: <strong>{credentials.parentPassword}</strong></span>
                <button onClick={() => copyToClipboard(credentials.parentPassword, 'pp')} className="p-1 hover:bg-gray-100 rounded">
                  {copied === 'pp' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}
          
          <div className="p-3 bg-yellow-50 rounded-lg text-sm text-yellow-800">
            ⚠️ Bu ma'lumotlarni o'quvchi va ota-onaga yuboring. Birinchi kirishda parolni o'zgartirish talab qilinadi.
          </div>
          
          <Button className="w-full" onClick={() => setShowCredentialsModal(false)}>Tushunarli</Button>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Tahrirlash" size="lg">
        <form onSubmit={handleEdit} className="space-y-4">
          {formError && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{formError}</div>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="To'liq ismi" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} required />
            <Input label="Telefon" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
            <Select label="Guruh" value={formData.groupId} onChange={(e) => setFormData({ ...formData, groupId: e.target.value })} options={groups.map(g => ({ value: g.id, label: g.name }))} />
            <Input label="Manzil" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
            <Input label="Ota-ona ismi" value={formData.parentName} onChange={(e) => setFormData({ ...formData, parentName: e.target.value })} />
            <Input label="Ota-ona telefoni" value={formData.parentPhone} onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })} />
            <Input label="Telegram" value={formData.parentTelegram} onChange={(e) => setFormData({ ...formData, parentTelegram: e.target.value })} />
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="ghost" onClick={() => setShowEditModal(false)}>Bekor qilish</Button>
            <Button type="submit" loading={formLoading}>Saqlash</Button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)} title="O'quvchi ma'lumotlari">
        {selectedStudent && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar name={selectedStudent.fullName} size="xl" />
              <div>
                <h3 className="text-xl font-bold">{selectedStudent.fullName}</h3>
                <Badge variant="primary">{selectedStudent.groupName || 'Guruh yo\'q'}</Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg"><p className="text-sm text-gray-500">Telefon</p><p className="font-medium">{formatPhone(selectedStudent.phone)}</p></div>
              <div className="p-3 bg-gray-50 rounded-lg"><p className="text-sm text-gray-500">Email</p><p className="font-medium text-sm">{selectedStudent.email || '-'}</p></div>
              <div className="p-3 bg-gray-50 rounded-lg"><p className="text-sm text-gray-500">Ota-ona</p><p className="font-medium">{selectedStudent.parentName || '-'}</p></div>
              <div className="p-3 bg-gray-50 rounded-lg"><p className="text-sm text-gray-500">Ota-ona tel</p><p className="font-medium">{formatPhone(selectedStudent.parentPhone)}</p></div>
              {selectedStudent.parentTelegram && (
                <div className="p-3 bg-gray-50 rounded-lg"><p className="text-sm text-gray-500">Telegram</p><p className="font-medium text-blue-600">@{selectedStudent.parentTelegram}</p></div>
              )}
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="ghost" onClick={() => setShowViewModal(false)}>Yopish</Button>
              {isAdmin && <Button icon={Edit} onClick={() => { setShowViewModal(false); openEditModal(selectedStudent); }}>Tahrirlash</Button>}
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="O'chirish">
        <p className="text-gray-600 mb-4"><strong>{selectedStudent?.fullName}</strong> ni o'chirishni xohlaysizmi?</p>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>Bekor qilish</Button>
          <Button variant="danger" loading={formLoading} onClick={handleDelete}>O'chirish</Button>
        </div>
      </Modal>
    </div>
  );
};

export default Students;
