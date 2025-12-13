import { useState, useEffect } from 'react';
import { Search, Plus, Phone, Edit, Trash2, UserPlus, Calendar, XCircle, CheckCircle, MessageSquare, Users } from 'lucide-react';
import { Card, Button, Input, Select, Badge, Avatar, Modal, Loading, EmptyState, Textarea } from '../components/common';
import { leadsAPI, groupsAPI, studentsAPI, usersAPI } from '../services/api';
import { formatPhone, formatDate } from '../utils/helpers';
import { ROLES } from '../utils/constants';

const LEAD_STATUS = {
  NEW: 'new',
  CONTACTED: 'contacted',
  INTERESTED: 'interested',
  TRIAL: 'trial',
  CONVERTED: 'converted',
  LOST: 'lost'
};

const STATUS_CONFIG = {
  [LEAD_STATUS.NEW]: { label: 'Yangi', variant: 'info', icon: UserPlus },
  [LEAD_STATUS.CONTACTED]: { label: "Bog'lanildi", variant: 'warning', icon: Phone },
  [LEAD_STATUS.INTERESTED]: { label: 'Qiziqmoqda', variant: 'primary', icon: MessageSquare },
  [LEAD_STATUS.TRIAL]: { label: 'Sinov darsida', variant: 'warning', icon: Calendar },
  [LEAD_STATUS.CONVERTED]: { label: "O'quvchi bo'ldi", variant: 'success', icon: CheckCircle },
  [LEAD_STATUS.LOST]: { label: "Yo'qotildi", variant: 'danger', icon: XCircle },
};

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  
  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [showTrialModal, setShowTrialModal] = useState(false);
  const [showLostModal, setShowLostModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const [selectedLead, setSelectedLead] = useState(null);
  const [formData, setFormData] = useState({ fullName: '', phone: '', source: '', note: '' });
  const [convertData, setConvertData] = useState({ groupId: '', parentName: '', parentPhone: '' });
  const [trialData, setTrialData] = useState({ groupId: '', trialDate: '', trialTime: '' });
  const [lostReason, setLostReason] = useState('');
  const [contactNote, setContactNote] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [leadsData, groupsData] = await Promise.all([leadsAPI.getAll(), groupsAPI.getAll()]);
      setLeads(leadsData);
      setGroups(groupsData);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const filteredLeads = leads.filter(l => {
    const matchesSearch = l.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) || l.phone?.includes(searchQuery);
    const matchesStatus = !filterStatus || l.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === LEAD_STATUS.NEW).length,
    converted: leads.filter(l => l.status === LEAD_STATUS.CONVERTED).length,
    trial: leads.filter(l => l.status === LEAD_STATUS.TRIAL).length,
    lost: leads.filter(l => l.status === LEAD_STATUS.LOST).length,
  };

  const resetForm = () => { 
    setFormData({ fullName: '', phone: '', source: '', note: '' }); 
    setConvertData({ groupId: '', parentName: '', parentPhone: '' });
    setTrialData({ groupId: '', trialDate: '', trialTime: '' });
    setLostReason('');
    setContactNote('');
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const newLead = await leadsAPI.create({ ...formData, status: LEAD_STATUS.NEW });
      setLeads([newLead, ...leads]);
      setShowAddModal(false);
      resetForm();
    } catch (err) { alert("Xatolik yuz berdi"); }
    finally { setFormLoading(false); }
  };

  const handleStatusChange = async (lead, newStatus) => {
    // Maxsus holatlar uchun modal ochish
    if (newStatus === LEAD_STATUS.CONVERTED) {
      setSelectedLead(lead);
      setShowConvertModal(true);
      return;
    }
    if (newStatus === LEAD_STATUS.TRIAL) {
      setSelectedLead(lead);
      setShowTrialModal(true);
      return;
    }
    if (newStatus === LEAD_STATUS.LOST) {
      setSelectedLead(lead);
      setShowLostModal(true);
      return;
    }

    // Oddiy status o'zgartirish
    try {
      await leadsAPI.update(lead.id, { status: newStatus });
      setLeads(leads.map(l => l.id === lead.id ? { ...l, status: newStatus } : l));
    } catch (err) { alert("Xatolik yuz berdi"); }
  };

  // Lidni o'quvchiga aylantirish
  const handleConvert = async (e) => {
    e.preventDefault();
    if (!convertData.groupId) {
      alert("Guruhni tanlang");
      return;
    }
    setFormLoading(true);
    try {
      const group = groups.find(g => g.id === convertData.groupId);
      
      // 1. O'quvchi yaratish
      const studentEmail = `${selectedLead.phone.replace(/\D/g, '')}@student.edu`;
      const defaultPassword = 'student123';
      
      // Firebase Auth yaratish
      await usersAPI.create({
        fullName: selectedLead.fullName,
        email: studentEmail,
        phone: selectedLead.phone,
        role: ROLES.STUDENT
      }, defaultPassword);
      
      // Students kolleksiyasiga qo'shish
      await studentsAPI.create({
        fullName: selectedLead.fullName,
        phone: selectedLead.phone,
        email: studentEmail,
        groupId: convertData.groupId,
        groupName: group?.name || '',
        parentName: convertData.parentName,
        parentPhone: convertData.parentPhone,
        status: 'active',
        mustChangePassword: true
      });
      
      // Agar ota-ona telefoni bo'lsa, ota-ona akkaunti yaratish
      if (convertData.parentPhone) {
        const parentEmail = `${convertData.parentPhone.replace(/\D/g, '')}@parent.edu`;
        try {
          await usersAPI.create({
            fullName: convertData.parentName || `${selectedLead.fullName} (ota-ona)`,
            email: parentEmail,
            phone: convertData.parentPhone,
            role: ROLES.PARENT,
            childName: selectedLead.fullName
          }, 'parent123');
        } catch (err) {
          console.log('Parent already exists or error:', err);
        }
      }
      
      // Guruh studentsCount yangilash
      await groupsAPI.update(convertData.groupId, { 
        studentsCount: (group?.studentsCount || 0) + 1 
      });
      
      // 2. Lid statusini yangilash
      await leadsAPI.update(selectedLead.id, { 
        status: LEAD_STATUS.CONVERTED,
        convertedGroupId: convertData.groupId,
        convertedGroupName: group?.name,
        convertedAt: new Date().toISOString()
      });
      
      setLeads(leads.map(l => l.id === selectedLead.id ? { 
        ...l, 
        status: LEAD_STATUS.CONVERTED,
        convertedGroupName: group?.name
      } : l));
      
      setShowConvertModal(false);
      resetForm();
      alert(`O'quvchi yaratildi!\n\nLogin: ${studentEmail}\nParol: student123\n\nOta-ona:\nLogin: ${convertData.parentPhone.replace(/\D/g, '')}@parent.edu\nParol: parent123`);
    } catch (err) { 
      console.error(err);
      alert("Xatolik yuz berdi: " + err.message); 
    }
    finally { setFormLoading(false); }
  };

  // Sinov darsiga yozish
  const handleTrialLesson = async (e) => {
    e.preventDefault();
    if (!trialData.groupId || !trialData.trialDate) {
      alert("Guruh va sanani tanlang");
      return;
    }
    setFormLoading(true);
    try {
      const group = groups.find(g => g.id === trialData.groupId);
      await leadsAPI.update(selectedLead.id, { 
        status: LEAD_STATUS.TRIAL,
        trialGroupId: trialData.groupId,
        trialGroupName: group?.name,
        trialDate: trialData.trialDate,
        trialTime: trialData.trialTime || group?.schedule?.time
      });
      
      setLeads(leads.map(l => l.id === selectedLead.id ? { 
        ...l, 
        status: LEAD_STATUS.TRIAL,
        trialGroupName: group?.name,
        trialDate: trialData.trialDate,
        trialTime: trialData.trialTime
      } : l));
      
      setShowTrialModal(false);
      resetForm();
    } catch (err) { alert("Xatolik yuz berdi"); }
    finally { setFormLoading(false); }
  };

  // Yo'qotildi
  const handleLost = async (e) => {
    e.preventDefault();
    if (!lostReason.trim()) {
      alert("Sababni kiriting");
      return;
    }
    setFormLoading(true);
    try {
      await leadsAPI.update(selectedLead.id, { 
        status: LEAD_STATUS.LOST,
        lostReason: lostReason,
        lostAt: new Date().toISOString()
      });
      
      setLeads(leads.map(l => l.id === selectedLead.id ? { 
        ...l, 
        status: LEAD_STATUS.LOST,
        lostReason 
      } : l));
      
      setShowLostModal(false);
      resetForm();
    } catch (err) { alert("Xatolik yuz berdi"); }
    finally { setFormLoading(false); }
  };

  const handleDelete = async () => {
    setFormLoading(true);
    try {
      await leadsAPI.delete(selectedLead.id);
      setLeads(leads.filter(l => l.id !== selectedLead.id));
      setShowDeleteModal(false);
    } catch (err) { alert("O'chirishda xatolik"); }
    finally { setFormLoading(false); }
  };

  if (loading) return <Loading fullScreen text="Yuklanmoqda..." />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lidlar</h1>
          <p className="text-gray-500">Potensial o'quvchilar</p>
        </div>
        <Button icon={Plus} onClick={() => { resetForm(); setShowAddModal(true); }}>Yangi lid</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card padding="p-4" className="text-center">
          <p className="text-2xl font-bold">{stats.total}</p>
          <p className="text-sm text-gray-500">Jami</p>
        </Card>
        <Card padding="p-4" className="text-center bg-blue-50">
          <p className="text-2xl font-bold text-blue-600">{stats.new}</p>
          <p className="text-sm text-blue-600">Yangi</p>
        </Card>
        <Card padding="p-4" className="text-center bg-yellow-50">
          <p className="text-2xl font-bold text-yellow-600">{stats.trial}</p>
          <p className="text-sm text-yellow-600">Sinov</p>
        </Card>
        <Card padding="p-4" className="text-center bg-green-50">
          <p className="text-2xl font-bold text-green-600">{stats.converted}</p>
          <p className="text-sm text-green-600">O'quvchi</p>
        </Card>
        <Card padding="p-4" className="text-center bg-red-50">
          <p className="text-2xl font-bold text-red-600">{stats.lost}</p>
          <p className="text-sm text-red-600">Yo'qotildi</p>
        </Card>
      </div>

      {/* Filters */}
      <Card padding="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Qidirish..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300" />
          </div>
          <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} options={Object.entries(STATUS_CONFIG).map(([k, v]) => ({ value: k, label: v.label }))} placeholder="Barcha holatlar" className="w-full md:w-48" />
        </div>
      </Card>

      {/* Leads Grid */}
      {filteredLeads.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLeads.map(lead => {
            const statusConfig = STATUS_CONFIG[lead.status] || STATUS_CONFIG[LEAD_STATUS.NEW];
            const StatusIcon = statusConfig.icon;
            
            return (
              <Card key={lead.id} className="hover:shadow-md transition">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={lead.fullName} />
                    <div>
                      <h3 className="font-semibold">{lead.fullName}</h3>
                      <a href={`tel:${lead.phone}`} className="text-sm text-primary-600">{formatPhone(lead.phone)}</a>
                    </div>
                  </div>
                  <Badge variant={statusConfig.variant}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {statusConfig.label}
                  </Badge>
                </div>

                {/* Qo'shimcha ma'lumot */}
                {lead.trialGroupName && lead.status === LEAD_STATUS.TRIAL && (
                  <div className="mb-3 p-2 bg-yellow-50 rounded-lg text-sm">
                    <p className="font-medium text-yellow-800">Sinov darsi: {lead.trialGroupName}</p>
                    <p className="text-yellow-600">{lead.trialDate} {lead.trialTime}</p>
                  </div>
                )}
                {lead.convertedGroupName && lead.status === LEAD_STATUS.CONVERTED && (
                  <div className="mb-3 p-2 bg-green-50 rounded-lg text-sm">
                    <p className="font-medium text-green-800">Guruh: {lead.convertedGroupName}</p>
                  </div>
                )}
                {lead.lostReason && lead.status === LEAD_STATUS.LOST && (
                  <div className="mb-3 p-2 bg-red-50 rounded-lg text-sm">
                    <p className="font-medium text-red-800">Sabab: {lead.lostReason}</p>
                  </div>
                )}

                <div className="text-sm text-gray-500 mb-3">
                  <p>📍 {lead.source || 'Noma\'lum'}</p>
                  {lead.note && <p className="mt-1">💬 {lead.note}</p>}
                </div>

                {/* Actions */}
                {lead.status !== LEAD_STATUS.CONVERTED && lead.status !== LEAD_STATUS.LOST && (
                  <div className="pt-3 border-t flex flex-wrap gap-2">
                    {lead.status === LEAD_STATUS.NEW && (
                      <Button size="sm" variant="outline" onClick={() => handleStatusChange(lead, LEAD_STATUS.CONTACTED)}>
                        <Phone className="w-3 h-3 mr-1" /> Bog'landim
                      </Button>
                    )}
                    {(lead.status === LEAD_STATUS.CONTACTED || lead.status === LEAD_STATUS.INTERESTED) && (
                      <Button size="sm" variant="outline" onClick={() => handleStatusChange(lead, LEAD_STATUS.TRIAL)}>
                        <Calendar className="w-3 h-3 mr-1" /> Sinov
                      </Button>
                    )}
                    {lead.status === LEAD_STATUS.TRIAL && (
                      <Button size="sm" variant="success" onClick={() => handleStatusChange(lead, LEAD_STATUS.CONVERTED)}>
                        <CheckCircle className="w-3 h-3 mr-1" /> O'quvchi
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" className="text-red-600" onClick={() => handleStatusChange(lead, LEAD_STATUS.LOST)}>
                      <XCircle className="w-3 h-3 mr-1" /> Yo'qotildi
                    </Button>
                  </div>
                )}

                <div className="flex justify-end gap-1 mt-2">
                  <button onClick={() => { setSelectedLead(lead); setShowDeleteModal(true); }} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card><EmptyState icon={Users} title="Lidlar topilmadi" /></Card>
      )}

      {/* Add Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Yangi lid">
        <form onSubmit={handleAdd} className="space-y-4">
          <Input label="To'liq ismi" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} required />
          <Input label="Telefon" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+998901234567" required />
          <Select label="Manba" value={formData.source} onChange={(e) => setFormData({ ...formData, source: e.target.value })} options={[
            { value: 'instagram', label: 'Instagram' },
            { value: 'telegram', label: 'Telegram' },
            { value: 'referral', label: 'Tavsiya' },
            { value: 'google', label: 'Google' },
            { value: 'other', label: 'Boshqa' },
          ]} />
          <Textarea label="Izoh" value={formData.note} onChange={(e) => setFormData({ ...formData, note: e.target.value })} rows={3} />
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="ghost" onClick={() => setShowAddModal(false)}>Bekor qilish</Button>
            <Button type="submit" loading={formLoading}>Qo'shish</Button>
          </div>
        </form>
      </Modal>

      {/* Convert to Student Modal */}
      <Modal isOpen={showConvertModal} onClose={() => setShowConvertModal(false)} title="O'quvchiga aylantirish" size="lg">
        <form onSubmit={handleConvert} className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg mb-4">
            <p className="font-medium">{selectedLead?.fullName}</p>
            <p className="text-sm text-gray-600">{selectedLead?.phone}</p>
          </div>
          
          <Select 
            label="Guruhni tanlang *" 
            value={convertData.groupId} 
            onChange={(e) => setConvertData({ ...convertData, groupId: e.target.value })} 
            options={groups.map(g => ({ value: g.id, label: `${g.name} (${g.teacherName})` }))} 
            required 
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Ota-ona ismi" 
              value={convertData.parentName} 
              onChange={(e) => setConvertData({ ...convertData, parentName: e.target.value })} 
            />
            <Input 
              label="Ota-ona telefoni" 
              value={convertData.parentPhone} 
              onChange={(e) => setConvertData({ ...convertData, parentPhone: e.target.value })} 
              placeholder="+998901234567"
            />
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg text-sm">
            <p className="font-medium mb-2">Avtomatik yaratiladi:</p>
            <p>O'quvchi login: {selectedLead?.phone?.replace(/\D/g, '')}@student.edu</p>
            <p>O'quvchi parol: <strong>student123</strong></p>
            {convertData.parentPhone && (
              <>
                <p className="mt-2">Ota-ona login: {convertData.parentPhone.replace(/\D/g, '')}@parent.edu</p>
                <p>Ota-ona parol: <strong>parent123</strong></p>
              </>
            )}
          </div>
          
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="ghost" onClick={() => setShowConvertModal(false)}>Bekor qilish</Button>
            <Button type="submit" loading={formLoading} icon={CheckCircle}>O'quvchiga aylantirish</Button>
          </div>
        </form>
      </Modal>

      {/* Trial Lesson Modal */}
      <Modal isOpen={showTrialModal} onClose={() => setShowTrialModal(false)} title="Sinov darsiga yozish">
        <form onSubmit={handleTrialLesson} className="space-y-4">
          <Select 
            label="Guruhni tanlang *" 
            value={trialData.groupId} 
            onChange={(e) => setTrialData({ ...trialData, groupId: e.target.value })} 
            options={groups.map(g => ({ value: g.id, label: `${g.name} - ${g.schedule?.days} ${g.schedule?.time}` }))} 
            required 
          />
          <Input 
            label="Sinov sanasi *" 
            type="date" 
            value={trialData.trialDate} 
            onChange={(e) => setTrialData({ ...trialData, trialDate: e.target.value })} 
            required 
          />
          <Input 
            label="Vaqti" 
            value={trialData.trialTime} 
            onChange={(e) => setTrialData({ ...trialData, trialTime: e.target.value })} 
            placeholder="09:00"
          />
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="ghost" onClick={() => setShowTrialModal(false)}>Bekor qilish</Button>
            <Button type="submit" loading={formLoading} icon={Calendar}>Yozish</Button>
          </div>
        </form>
      </Modal>

      {/* Lost Reason Modal */}
      <Modal isOpen={showLostModal} onClose={() => setShowLostModal(false)} title="Yo'qotildi">
        <form onSubmit={handleLost} className="space-y-4">
          <p className="text-gray-600">Nima uchun bu lid yo'qotildi?</p>
          <Textarea 
            label="Sabab *" 
            value={lostReason} 
            onChange={(e) => setLostReason(e.target.value)} 
            placeholder="Boshqa joyga ketdi, narx qimmat, vaqt mos kelmadi..."
            rows={3}
            required
          />
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="ghost" onClick={() => setShowLostModal(false)}>Bekor qilish</Button>
            <Button type="submit" variant="danger" loading={formLoading}>Tasdiqlash</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="O'chirish">
        <p className="text-gray-600 mb-4"><strong>{selectedLead?.fullName}</strong> ni o'chirishni xohlaysizmi?</p>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>Bekor qilish</Button>
          <Button variant="danger" loading={formLoading} onClick={handleDelete}>O'chirish</Button>
        </div>
      </Modal>
    </div>
  );
};

export default Leads;
