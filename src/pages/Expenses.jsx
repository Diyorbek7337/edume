import { useState, useEffect, useRef } from 'react';
import { Plus, Edit, Trash2, TrendingDown, DollarSign, Calendar, Tag } from 'lucide-react';
import { Card, Button, Input, Select, Badge, Table, Modal, Loading, EmptyState } from '../components/common';
import { expensesAPI } from '../services/api';
import { activityLogAPI, LOG_ACTIONS } from '../services/activityLog';
import { useAuth } from '../contexts/AuthContext';
import { ROLES } from '../utils/constants';
import { formatMoney } from '../utils/helpers';
import { toast } from 'react-toastify';
import { captureError } from '../services/sentry';

const CATEGORIES = [
  { value: 'ijara', label: '🏢 Ijara' },
  { value: 'maosh', label: '👨‍💼 Maosh' },
  { value: 'kommunal', label: '💡 Kommunal xizmatlar' },
  { value: 'tamirlash', label: '🔧 Ta\'mirlash' },
  { value: 'mebel', label: '🪑 Mebel / Jihozlar' },
  { value: 'reklama', label: '📢 Reklama' },
  { value: 'boshqa', label: '📦 Boshqa' },
];

const PAYMENT_METHODS = [
  { value: 'naqd', label: 'Naqd' },
  { value: 'karta', label: 'Karta' },
  { value: 'bank', label: 'Bank o\'tkazma' },
];

const EMPTY_FORM = {
  title: '',
  category: 'boshqa',
  amount: '',
  date: new Date().toISOString().split('T')[0],
  paymentMethod: 'naqd',
  note: '',
};

const Expenses = () => {
  const { role, userData } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterMonth, setFilterMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [filterCategory, setFilterCategory] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formLoading, setFormLoading] = useState(false);
  const isMountedRef = useRef(true);

  const isAdmin = role === ROLES.ADMIN || role === ROLES.DIRECTOR;

  useEffect(() => {
    isMountedRef.current = true;
    fetchExpenses();
    return () => { isMountedRef.current = false; };
  }, []);

  const fetchExpenses = async () => {
    try {
      const data = await expensesAPI.getAll();
      if (!isMountedRef.current) return;
      setExpenses(data);
    } catch (err) {
      captureError(err, { context: 'fetchExpenses' });
      toast.error("Xarajatlar yuklanmadi. Sahifani yangilang.", { toastId: 'expenses-load-error' });
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  };

  const filteredExpenses = expenses.filter(e => {
    const matchesMonth = !filterMonth || (e.date || '').startsWith(filterMonth);
    const matchesCategory = !filterCategory || e.category === filterCategory;
    return matchesMonth && matchesCategory;
  }).sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  const totalThisFilter = filteredExpenses.reduce((s, e) => s + (parseInt(e.amount) || 0), 0);

  // Kategoriya bo'yicha guruhlanish
  const byCategory = CATEGORIES.map(cat => ({
    ...cat,
    total: filteredExpenses
      .filter(e => e.category === cat.value)
      .reduce((s, e) => s + (parseInt(e.amount) || 0), 0),
  })).filter(c => c.total > 0);

  const openAdd = () => {
    setFormData(EMPTY_FORM);
    setShowAddModal(true);
  };

  const openEdit = (expense) => {
    setSelectedExpense(expense);
    setFormData({
      title: expense.title || '',
      category: expense.category || 'boshqa',
      amount: expense.amount?.toString() || '',
      date: expense.date || new Date().toISOString().split('T')[0],
      paymentMethod: expense.paymentMethod || 'naqd',
      note: expense.note || '',
    });
    setShowEditModal(true);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount || !formData.date) {
      toast.error("Sarlavha, summa va sana majburiy");
      return;
    }
    setFormLoading(true);
    try {
      const created = await expensesAPI.create({
        ...formData,
        amount: parseInt(formData.amount) || 0,
      });
      setExpenses(prev => [created, ...prev]);
      setShowAddModal(false);
      toast.success("Harajat qo'shildi");
      activityLogAPI.log({
        action: LOG_ACTIONS.EXPENSE_ADDED.key,
        entityType: 'expense',
        entityName: formData.title,
        details: { amount: parseInt(formData.amount) || 0, category: formData.category },
        performer: { id: userData?.id, fullName: userData?.fullName, role },
      });
    } catch {
      toast.error("Xatolik yuz berdi");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount || !formData.date) {
      toast.error("Sarlavha, summa va sana majburiy");
      return;
    }
    setFormLoading(true);
    try {
      const updated = { ...formData, amount: parseInt(formData.amount) || 0 };
      await expensesAPI.update(selectedExpense.id, updated);
      setExpenses(prev => prev.map(ex => ex.id === selectedExpense.id ? { ...ex, ...updated } : ex));
      setShowEditModal(false);
      toast.success("Harajat yangilandi");
      activityLogAPI.log({
        action: LOG_ACTIONS.EXPENSE_UPDATED.key,
        entityType: 'expense',
        entityName: formData.title,
        details: { amount: parseInt(formData.amount) || 0, category: formData.category },
        performer: { id: userData?.id, fullName: userData?.fullName, role },
      });
    } catch {
      toast.error("Xatolik yuz berdi");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await expensesAPI.delete(selectedExpense.id);
      setExpenses(prev => prev.filter(ex => ex.id !== selectedExpense.id));
      setShowDeleteModal(false);
      toast.success("Harajat o'chirildi");
      activityLogAPI.log({
        action: LOG_ACTIONS.EXPENSE_DELETED.key,
        entityType: 'expense',
        entityName: selectedExpense.title,
        details: { amount: selectedExpense.amount, category: selectedExpense.category },
        performer: { id: userData?.id, fullName: userData?.fullName, role },
      });
    } catch {
      toast.error("Xatolik yuz berdi");
    }
  };

  const getCategoryLabel = (val) => CATEGORIES.find(c => c.value === val)?.label || val;
  const getMethodLabel = (val) => PAYMENT_METHODS.find(m => m.value === val)?.label || val;

  if (loading) return <Loading text="Yuklanmoqda..." />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Harajatlar</h1>
          <p className="text-gray-500 dark:text-gray-400">Markaz xarajatlarini hisob-kitob qilish</p>
        </div>
        {isAdmin && (
          <Button icon={Plus} onClick={openAdd}>Harajat qo'shish</Button>
        )}
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card padding="p-5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 rounded-xl">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Jami harajat</p>
              <p className="text-xl font-bold text-red-600">{formatMoney(totalThisFilter)}</p>
            </div>
          </div>
        </Card>
        <Card padding="p-5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-xl">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Yozuvlar soni</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{filteredExpenses.length} ta</p>
            </div>
          </div>
        </Card>
        <Card padding="p-5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Tag className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">O'rtacha harajat</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {filteredExpenses.length > 0 ? formatMoney(Math.round(totalThisFilter / filteredExpenses.length)) : '—'}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Category breakdown */}
      {byCategory.length > 0 && (
        <Card>
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Kategoriya bo'yicha</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {byCategory.map(cat => (
              <div key={cat.value} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">{cat.label}</p>
                <p className="font-bold text-gray-900 dark:text-white">{formatMoney(cat.total)}</p>
                <p className="text-xs text-gray-400">
                  {totalThisFilter > 0 ? Math.round(cat.total / totalThisFilter * 100) : 0}%
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Filters */}
      <Card padding="p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <Input
            type="month"
            value={filterMonth}
            onChange={e => setFilterMonth(e.target.value)}
            className="w-full md:w-48"
          />
          <Select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            options={CATEGORIES}
            placeholder="Barcha kategoriyalar"
            className="w-full md:w-56"
          />
          {(filterMonth || filterCategory) && (
            <Button variant="ghost" onClick={() => { setFilterMonth(''); setFilterCategory(''); }}>
              Tozalash
            </Button>
          )}
        </div>
      </Card>

      {/* Table */}
      {filteredExpenses.length === 0 ? (
        <EmptyState
          icon={TrendingDown}
          title="Harajatlar yo'q"
          description="Hozircha bu davr uchun hech qanday harajat qo'shilmagan"
          action={isAdmin ? <Button icon={Plus} onClick={openAdd}>Harajat qo'shish</Button> : undefined}
        />
      ) : (
        <Card>
          <Table>
            <Table.Head>
              <tr>
                <Table.Header>Sana</Table.Header>
                <Table.Header>Sarlavha</Table.Header>
                <Table.Header>Kategoriya</Table.Header>
                <Table.Header>To'lov usuli</Table.Header>
                <Table.Header>Summa</Table.Header>
                {isAdmin && <Table.Header>Amallar</Table.Header>}
              </tr>
            </Table.Head>
            <Table.Body>
              {filteredExpenses.map((expense) => (
                <Table.Row key={expense.id}>
                  <Table.Cell>
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {expense.date}
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <p className="font-medium text-gray-900 dark:text-white">{expense.title}</p>
                    {expense.note && <p className="text-xs text-gray-400">{expense.note}</p>}
                  </Table.Cell>
                  <Table.Cell>
                    <Badge variant="default">{getCategoryLabel(expense.category)}</Badge>
                  </Table.Cell>
                  <Table.Cell>{getMethodLabel(expense.paymentMethod)}</Table.Cell>
                  <Table.Cell>
                    <span className="font-semibold text-red-600">{formatMoney(expense.amount)}</span>
                  </Table.Cell>
                  {isAdmin && (
                    <Table.Cell>
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(expense)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => { setSelectedExpense(expense); setShowDeleteModal(true); }} className="p-1.5 text-red-600 hover:bg-red-50 rounded">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </Table.Cell>
                  )}
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Card>
      )}

      {/* Add Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Harajat qo'shish" size="md">
        <form onSubmit={handleAdd} className="space-y-4">
          <Input label="Sarlavha *" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="Ijara to'lovi..." required />
          <div className="grid grid-cols-2 gap-3">
            <Select label="Kategoriya" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} options={CATEGORIES} />
            <Select label="To'lov usuli" value={formData.paymentMethod} onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })} options={PAYMENT_METHODS} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Summa (so'm) *" type="number" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} placeholder="500000" required />
            <Input label="Sana *" type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} required />
          </div>
          <Input label="Izoh" value={formData.note} onChange={e => setFormData({ ...formData, note: e.target.value })} placeholder="Qo'shimcha ma'lumot..." />
          <div className="flex justify-end gap-2 pt-2 border-t">
            <Button variant="ghost" type="button" onClick={() => setShowAddModal(false)}>Bekor qilish</Button>
            <Button type="submit" loading={formLoading}>Saqlash</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Harajatni tahrirlash" size="md">
        <form onSubmit={handleEdit} className="space-y-4">
          <Input label="Sarlavha *" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
          <div className="grid grid-cols-2 gap-3">
            <Select label="Kategoriya" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} options={CATEGORIES} />
            <Select label="To'lov usuli" value={formData.paymentMethod} onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })} options={PAYMENT_METHODS} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Summa (so'm) *" type="number" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} required />
            <Input label="Sana *" type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} required />
          </div>
          <Input label="Izoh" value={formData.note} onChange={e => setFormData({ ...formData, note: e.target.value })} />
          <div className="flex justify-end gap-2 pt-2 border-t">
            <Button variant="ghost" type="button" onClick={() => setShowEditModal(false)}>Bekor qilish</Button>
            <Button type="submit" loading={formLoading}>Saqlash</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Harajatni o'chirish" size="sm">
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          <strong>{selectedExpense?.title}</strong> harajatini o'chirasizmi?
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>Bekor qilish</Button>
          <Button variant="danger" onClick={handleDelete}>O'chirish</Button>
        </div>
      </Modal>
    </div>
  );
};

export default Expenses;
