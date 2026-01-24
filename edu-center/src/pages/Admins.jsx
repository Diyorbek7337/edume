import { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Shield, Mail, Phone } from 'lucide-react';
import { Card, Button, Input, Badge, Avatar, Table, Modal, Loading, EmptyState } from '../components/common';
import { usersAPI } from '../services/api';
import { formatPhone, formatDate } from '../utils/helpers';
import { ROLES } from '../utils/constants';
import { toast } from 'react-toastify';

const Admins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '', password: '' });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => { fetchAdmins(); }, []);

  const fetchAdmins = async () => {
    try {
      const data = await usersAPI.getByRole(ROLES.ADMIN);
      setAdmins(data);
    } catch (err) { 
      console.error(err); 
    }
    finally { setLoading(false); }
  };

  const filteredAdmins = admins.filter(a =>
    a.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resetForm = () => { 
    setFormData({ fullName: '', email: '', phone: '', password: '' }); 
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
      const newAdmin = await usersAPI.create({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        role: ROLES.ADMIN
      }, formData.password);
      
      setAdmins([{ ...newAdmin, id: newAdmin.id }, ...admins]);
      setShowAddModal(false);
      resetForm();
      toast.success("Admin qo'shildi");
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setFormError("Bu email allaqachon ro'yxatdan o'tgan");
      } else if (err.code === 'auth/invalid-email') {
        setFormError("Email formati noto'g'ri");
      } else if (err.code === 'auth/weak-password') {
        setFormError("Parol juda oddiy");
      } else {
        setFormError("Xatolik yuz berdi: " + (err.message || err.code));
      }
    } finally { 
      setFormLoading(false); 
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await usersAPI.update(selectedAdmin.id, {
        fullName: formData.fullName,
        phone: formData.phone
      });
      setAdmins(admins.map(a => a.id === selectedAdmin.id ? { ...a, fullName: formData.fullName, phone: formData.phone } : a));
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
      await usersAPI.delete(selectedAdmin.id);
      setAdmins(admins.filter(a => a.id !== selectedAdmin.id));
      setShowDeleteModal(false);
      toast.success("Admin o'chirildi");
    } catch (err) { 
      toast.error("O'chirishda xatolik"); 
    }
    finally { setFormLoading(false); }
  };

  const openEditModal = (admin) => {
    setSelectedAdmin(admin);
    setFormData({ fullName: admin.fullName || '', email: admin.email || '', phone: admin.phone || '', password: '' });
    setShowEditModal(true);
  };

  if (loading) return <Loading fullScreen text="Yuklanmoqda..." />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Administratorlar</h1>
          <p className="text-gray-500">Jami {admins.length} ta administrator</p>
        </div>
        <Button icon={Plus} onClick={() => { resetForm(); setShowAddModal(true); }}>
          Yangi admin qo'shish
        </Button>
      </div>

      <Card padding="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Ism yoki email bo'yicha qidirish..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500" 
          />
        </div>
      </Card>

      {filteredAdmins.length > 0 ? (
        <Card padding="p-0">
          <Table>
            <Table.Head>
              <Table.Row>
                <Table.Header>Administrator</Table.Header>
                <Table.Header>Email</Table.Header>
                <Table.Header>Telefon</Table.Header>
                <Table.Header>Qo'shilgan</Table.Header>
                <Table.Header className="text-right">Amallar</Table.Header>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {filteredAdmins.map(admin => (
                <Table.Row key={admin.id}>
                  <Table.Cell>
                    <div className="flex items-center gap-3">
                      <Avatar name={admin.fullName} />
                      <div>
                        <p className="font-medium">{admin.fullName}</p>
                        <Badge variant="info">Admin</Badge>
                      </div>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <a href={`mailto:${admin.email}`} className="text-primary-600 hover:underline flex items-center gap-1">
                      <Mail className="w-4 h-4" /> {admin.email}
                    </a>
                  </Table.Cell>
                  <Table.Cell>
                    {admin.phone ? (
                      <a href={`tel:${admin.phone}`} className="text-primary-600 hover:underline flex items-center gap-1">
                        <Phone className="w-4 h-4" /> {formatPhone(admin.phone)}
                      </a>
                    ) : '-'}
                  </Table.Cell>
                  <Table.Cell>{formatDate(admin.createdAt)}</Table.Cell>
                  <Table.Cell className="text-right">
                    <div className="flex justify-end gap-1">
                      <button 
                        onClick={() => openEditModal(admin)} 
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => { setSelectedAdmin(admin); setShowDeleteModal(true); }} 
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Card>
      ) : (
        <Card>
          <EmptyState 
            icon={Shield} 
            title="Administratorlar topilmadi" 
            description="Hozircha hech qanday administrator qo'shilmagan"
            action={
              <Button icon={Plus} onClick={() => { resetForm(); setShowAddModal(true); }}>
                Birinchi adminni qo'shish
              </Button>
            }
          />
        </Card>
      )}

      {/* Add Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Yangi administrator qo'shish" size="md">
        <form onSubmit={handleAdd} className="space-y-4">
          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {formError}
            </div>
          )}
          <Input 
            label="To'liq ismi" 
            value={formData.fullName} 
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} 
            placeholder="Ism Familiya"
            required 
          />
          <Input 
            label="Email" 
            type="email" 
            value={formData.email} 
            onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
            placeholder="admin@example.com"
            required 
          />
          <Input 
            label="Telefon" 
            value={formData.phone} 
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
            placeholder="+998901234567"
          />
          <Input 
            label="Parol" 
            type="password" 
            value={formData.password} 
            onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
            placeholder="Kamida 6 ta belgi"
            required 
          />
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="ghost" onClick={() => setShowAddModal(false)}>Bekor qilish</Button>
            <Button type="submit" loading={formLoading}>Qo'shish</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Administrator tahrirlash">
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
            label="Email" 
            type="email" 
            value={formData.email} 
            disabled 
          />
          <Input 
            label="Telefon" 
            value={formData.phone} 
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
          />
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="ghost" onClick={() => setShowEditModal(false)}>Bekor qilish</Button>
            <Button type="submit" loading={formLoading}>Saqlash</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Administratorni o'chirish">
        <p className="text-gray-600 mb-4">
          <strong>{selectedAdmin?.fullName}</strong> ni o'chirishni xohlaysizmi? Bu amalni ortga qaytarib bo'lmaydi.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>Bekor qilish</Button>
          <Button variant="danger" loading={formLoading} onClick={handleDelete}>O'chirish</Button>
        </div>
      </Modal>
    </div>
  );
};

export default Admins;
