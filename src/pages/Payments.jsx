import { useState, useEffect } from 'react';
import { Search, Plus, CreditCard, CheckCircle, Clock, AlertTriangle, Eye } from 'lucide-react';
import { Card, Button, Input, Select, Badge, Avatar, Table, Modal, Loading, EmptyState } from '../components/common';
import { paymentsAPI, studentsAPI, groupsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { ROLES } from '../utils/constants';
import { formatMoney, formatDate } from '../utils/helpers';
import { toast } from 'react-toastify';

const Payments = () => {
  const { userData, role } = useAuth();
  const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [formData, setFormData] = useState({ studentId: '', amount: '', type: 'monthly', description: '' });
  const [formLoading, setFormLoading] = useState(false);

  const isAdmin = role === ROLES.ADMIN || role === ROLES.DIRECTOR;
  const isTeacher = role === ROLES.TEACHER;
  const isStudentOrParent = role === ROLES.STUDENT || role === ROLES.PARENT;

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      let paymentsData = [];
      let studentsData = [];
      let groupsData = [];

      if (isAdmin) {
        // Admin barcha to'lovlarni ko'radi
        [paymentsData, studentsData, groupsData] = await Promise.all([
          paymentsAPI.getAll(),
          studentsAPI.getAll(),
          groupsAPI.getAll()
        ]);
      } else if (isTeacher) {
        // O'qituvchi faqat o'z guruhlaridagi o'quvchilar to'lovlarini ko'radi
        groupsData = await groupsAPI.getByTeacher(userData?.id);
        const studentPromises = groupsData.map(g => studentsAPI.getByGroup(g.id));
        const studentsArrays = await Promise.all(studentPromises);
        studentsData = studentsArrays.flat();
        
        const allPayments = await paymentsAPI.getAll();
        const studentIds = studentsData.map(s => s.id);
        paymentsData = allPayments.filter(p => studentIds.includes(p.studentId));
      } else if (isStudentOrParent) {
        // O'quvchi/Ota-ona faqat o'z to'lovlarini ko'radi
        const allStudents = await studentsAPI.getAll();
        const myStudent = allStudents.find(s => 
          s.email === userData?.email || 
          s.phone === userData?.phone ||
          s.parentPhone === userData?.phone
        );
        
        if (myStudent) {
          studentsData = [myStudent];
          const allPayments = await paymentsAPI.getAll();
          paymentsData = allPayments.filter(p => p.studentId === myStudent.id);
        }
      }

      setPayments(paymentsData);
      setStudents(studentsData);
      setGroups(groupsData);
    } catch (err) { 
      console.error(err); 
      toast.error("Ma'lumotlarni yuklashda xatolik");
    }
    finally { setLoading(false); }
  };

  const filteredPayments = payments.filter(p => {
    const matchesSearch = p.studentName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !filterStatus || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: filteredPayments.reduce((sum, p) => sum + (p.amount || 0), 0),
    paid: filteredPayments.filter(p => p.status === 'paid').reduce((sum, p) => sum + (p.amount || 0), 0),
    pending: filteredPayments.filter(p => p.status === 'pending').reduce((sum, p) => sum + (p.amount || 0), 0),
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const student = students.find(s => s.id === formData.studentId);
      const newPayment = await paymentsAPI.create({
        studentId: formData.studentId,
        studentName: student?.fullName || '',
        amount: Number(formData.amount),
        type: formData.type,
        description: formData.description,
        status: 'pending'
      });
      setPayments([newPayment, ...payments]);
      setShowAddModal(false);
      setFormData({ studentId: '', amount: '', type: 'monthly', description: '' });
      toast.success("To'lov qo'shildi");
    } catch (err) { 
      toast.error("Xatolik yuz berdi"); 
    }
    finally { setFormLoading(false); }
  };

  const handleMarkPaid = async (payment) => {
    try {
      await paymentsAPI.update(payment.id, { status: 'paid', paidAt: new Date().toISOString() });
      setPayments(payments.map(p => p.id === payment.id ? { ...p, status: 'paid' } : p));
      toast.success("To'lov qabul qilindi");
    } catch (err) { 
      toast.error("Xatolik yuz berdi"); 
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid': return <Badge variant="success"><CheckCircle className="w-3 h-3 mr-1" /> To'langan</Badge>;
      case 'pending': return <Badge variant="warning"><Clock className="w-3 h-3 mr-1" /> Kutilmoqda</Badge>;
      case 'overdue': return <Badge variant="danger"><AlertTriangle className="w-3 h-3 mr-1" /> Muddati o'tgan</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  if (loading) return <Loading fullScreen text="Yuklanmoqda..." />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isStudentOrParent ? "Mening to'lovlarim" : "To'lovlar"}
          </h1>
          <p className="text-gray-500">
            {isStudentOrParent ? "Shaxsiy to'lov tarixingiz" : `Jami ${payments.length} ta to'lov`}
          </p>
        </div>
        {isAdmin && (
          <Button icon={Plus} onClick={() => setShowAddModal(true)}>To'lov qo'shish</Button>
        )}
      </div>

      {/* Stats - faqat Admin/Direktor uchun */}
      {isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card padding="p-4" className="bg-blue-50">
            <p className="text-sm text-blue-600">Jami</p>
            <p className="text-2xl font-bold text-blue-700">{formatMoney(stats.total)}</p>
          </Card>
          <Card padding="p-4" className="bg-green-50">
            <p className="text-sm text-green-600">To'langan</p>
            <p className="text-2xl font-bold text-green-700">{formatMoney(stats.paid)}</p>
          </Card>
          <Card padding="p-4" className="bg-yellow-50">
            <p className="text-sm text-yellow-600">Kutilmoqda</p>
            <p className="text-2xl font-bold text-yellow-700">{formatMoney(stats.pending)}</p>
          </Card>
        </div>
      )}

      {/* Student/Parent uchun oddiy statistika */}
      {isStudentOrParent && (
        <div className="grid grid-cols-2 gap-4">
          <Card padding="p-4" className="bg-green-50">
            <p className="text-sm text-green-600">To'langan</p>
            <p className="text-2xl font-bold text-green-700">{formatMoney(stats.paid)}</p>
          </Card>
          <Card padding="p-4" className="bg-yellow-50">
            <p className="text-sm text-yellow-600">Qarzdorlik</p>
            <p className="text-2xl font-bold text-yellow-700">{formatMoney(stats.pending)}</p>
          </Card>
        </div>
      )}

      {/* Filters - Admin/Teacher uchun */}
      {!isStudentOrParent && (
        <Card padding="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" placeholder="O'quvchi ismi..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300" />
            </div>
            <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} options={[
              { value: 'paid', label: "To'langan" },
              { value: 'pending', label: 'Kutilmoqda' },
              { value: 'overdue', label: "Muddati o'tgan" },
            ]} placeholder="Barcha holatlar" className="w-full md:w-48" />
          </div>
        </Card>
      )}

      {/* Payments Table */}
      {filteredPayments.length > 0 ? (
        <Card padding="p-0">
          <Table>
            <Table.Head>
              <Table.Row>
                {!isStudentOrParent && <Table.Header>O'quvchi</Table.Header>}
                <Table.Header>Summa</Table.Header>
                <Table.Header>Tur</Table.Header>
                <Table.Header>Holat</Table.Header>
                <Table.Header>Sana</Table.Header>
                <Table.Header className="text-right">Amallar</Table.Header>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {filteredPayments.map(payment => (
                <Table.Row key={payment.id}>
                  {!isStudentOrParent && (
                    <Table.Cell>
                      <div className="flex items-center gap-3">
                        <Avatar name={payment.studentName} />
                        <span className="font-medium">{payment.studentName}</span>
                      </div>
                    </Table.Cell>
                  )}
                  <Table.Cell>
                    <span className="font-bold text-lg">{formatMoney(payment.amount)}</span>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge variant="default">
                      {payment.type === 'monthly' ? 'Oylik' : payment.type === 'registration' ? "Ro'yxat" : payment.type}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>{getStatusBadge(payment.status)}</Table.Cell>
                  <Table.Cell>{formatDate(payment.createdAt)}</Table.Cell>
                  <Table.Cell className="text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => { setSelectedPayment(payment); setShowViewModal(true); }} className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg">
                        <Eye className="w-4 h-4" />
                      </button>
                      {isAdmin && payment.status === 'pending' && (
                        <Button size="sm" variant="success" onClick={() => handleMarkPaid(payment)}>
                          <CheckCircle className="w-4 h-4 mr-1" /> Qabul qilish
                        </Button>
                      )}
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Card>
      ) : (
        <Card>
          <EmptyState icon={CreditCard} title="To'lovlar topilmadi" />
        </Card>
      )}

      {/* Add Modal - faqat Admin */}
      {isAdmin && (
        <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="To'lov qo'shish">
          <form onSubmit={handleAdd} className="space-y-4">
            <Select label="O'quvchi" value={formData.studentId} onChange={(e) => setFormData({ ...formData, studentId: e.target.value })} options={students.map(s => ({ value: s.id, label: `${s.fullName} (${s.groupName || 'Guruh yo\'q'})` }))} required />
            <Input label="Summa" type="number" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} placeholder="500000" required />
            <Select label="To'lov turi" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} options={[
              { value: 'monthly', label: 'Oylik to\'lov' },
              { value: 'registration', label: 'Ro\'yxatdan o\'tish' },
              { value: 'material', label: 'O\'quv materiallari' },
              { value: 'other', label: 'Boshqa' },
            ]} />
            <Input label="Izoh" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Qo'shimcha ma'lumot" />
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button type="button" variant="ghost" onClick={() => setShowAddModal(false)}>Bekor qilish</Button>
              <Button type="submit" loading={formLoading}>Qo'shish</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* View Modal */}
      <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)} title="To'lov tafsilotlari">
        {selectedPayment && (
          <div className="space-y-4">
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <p className="text-3xl font-bold text-primary-600">{formatMoney(selectedPayment.amount)}</p>
              <div className="mt-2">{getStatusBadge(selectedPayment.status)}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">O'quvchi</p>
                <p className="font-medium">{selectedPayment.studentName}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">To'lov turi</p>
                <p className="font-medium">{selectedPayment.type === 'monthly' ? 'Oylik' : selectedPayment.type}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Yaratilgan</p>
                <p className="font-medium">{formatDate(selectedPayment.createdAt)}</p>
              </div>
              {selectedPayment.paidAt && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">To'langan</p>
                  <p className="font-medium">{formatDate(selectedPayment.paidAt)}</p>
                </div>
              )}
            </div>
            {selectedPayment.description && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Izoh</p>
                <p className="font-medium">{selectedPayment.description}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Payments;
