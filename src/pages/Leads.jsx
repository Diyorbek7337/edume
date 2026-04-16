import { useState, useEffect } from 'react';
import { Search, Plus, Phone, Edit, Trash2, UserPlus, Calendar, XCircle, CheckCircle, MessageSquare, Users, Send, Square, CheckSquare, X, Copy, Check, ExternalLink } from 'lucide-react';
import { Card, Button, Input, Select, Badge, Avatar, Modal, Loading, EmptyState, Textarea } from '../components/common';
import { leadsAPI, groupsAPI, studentsAPI, usersAPI, settingsAPI } from '../services/api';
import { sendTelegramMessage } from '../services/telegram';
import { formatPhone, formatDate } from '../utils/helpers';
import { validateLeadForm, hasErrors } from '../utils/validation';
import FieldError from '../components/common/FieldError';
import { ROLES } from '../utils/constants';
import { toast } from 'react-toastify';
import { activityLogAPI, LOG_ACTIONS } from '../services/activityLog';
import { useAuth } from '../contexts/AuthContext';

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
  const { userData, role } = useAuth();
  const [leads, setLeads] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  
  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [showTrialModal, setShowTrialModal] = useState(false);
  const [showLostModal, setShowLostModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const [subjects, setSubjects] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [formData, setFormData] = useState({ fullName: '', phone: '', source: '', note: '', subject: '', address: '', parentTelegram: '' });
  const [convertData, setConvertData] = useState({ groupId: '', parentName: '', parentPhone: '', address: '', parentTelegram: '' });
  const [trialData, setTrialData] = useState({ groupId: '', trialDate: '', trialTime: '' });
  const [lostReason, setLostReason] = useState('');
  const [contactNote, setContactNote] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState(null);

  // Bulk SMS state
  const [selectedLeadIds, setSelectedLeadIds] = useState(new Set());
  const [showSmsModal, setShowSmsModal] = useState(false);
  const [smsMessage, setSmsMessage] = useState(
    "Salom {ism}! O'quv markazimiz sizni qiziqtirishi mumkin. Biz bilan bog'laning yoki bepul sinov darsiga yozing! 📚"
  );
  const [smsSending, setSmsSending] = useState(false);
  const [smsResults, setSmsResults] = useState(null); // { sent, failed, total }
  const [copiedPhone, setCopiedPhone] = useState('');
  const [settings, setSettings] = useState({});

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [leadsData, groupsData, settingsData] = await Promise.all([
        leadsAPI.getAll(),
        groupsAPI.getAll(),
        settingsAPI.get(),
      ]);
      setLeads(leadsData);
      setGroups(groupsData);
      setSubjects(settingsData?.subjects || []);
      setSettings(settingsData || {});
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
    setFormData({ fullName: '', phone: '', source: '', note: '', subject: '', address: '', parentTelegram: '' });
    setConvertData({ groupId: '', parentName: '', parentPhone: '', address: '', parentTelegram: '' });
    setTrialData({ groupId: '', trialDate: '', trialTime: '' });
    setLostReason('');
    setContactNote('');
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const errors = validateLeadForm(formData);
    if (hasErrors(errors)) { setFormErrors(errors); return; }
    setFormErrors({});
    setFormLoading(true);
    try {
      const newLead = await leadsAPI.create({ ...formData, status: LEAD_STATUS.NEW });
      setLeads([newLead, ...leads]);
      setShowAddModal(false);
      resetForm();

      activityLogAPI.log({
        action: LOG_ACTIONS.LEAD_ADDED.key,
        entityType: 'lead',
        entityName: formData.fullName,
        details: { subject: formData.subject, source: formData.source },
        performer: { id: userData?.id, fullName: userData?.fullName, role },
      });
    } catch (err) { toast.error("Xatolik yuz berdi"); }
    finally { setFormLoading(false); }
  };

  const handleStatusChange = async (lead, newStatus) => {
    if (newStatus === LEAD_STATUS.CONTACTED) {
      setSelectedLead(lead);
      setContactNote('');
      setShowContactModal(true);
      return;
    }
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
      activityLogAPI.log({
        action: LOG_ACTIONS.LEAD_STATUS_CHANGED.key,
        entityType: 'lead',
        entityName: lead.fullName,
        details: { fromStatus: lead.status, toStatus: newStatus },
        performer: { id: userData?.id, fullName: userData?.fullName, role },
      });
    } catch (err) { toast.error("Xatolik yuz berdi"); }
  };

  const handleContact = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const updateData = {
        status: LEAD_STATUS.CONTACTED,
        contactNote: contactNote.trim(),
        contactedAt: new Date().toISOString(),
      };
      await leadsAPI.update(selectedLead.id, updateData);
      setLeads(leads.map(l => l.id === selectedLead.id ? { ...l, ...updateData } : l));
      setShowContactModal(false);
      setContactNote('');
    } catch (err) { toast.error("Xatolik yuz berdi"); }
    finally { setFormLoading(false); }
  };

  // Lidni o'quvchiga aylantirish
  const handleConvert = async (e) => {
    e.preventDefault();
    if (!convertData.groupId) {
      toast.warning("Guruhni tanlang");
      return;
    }
    setFormLoading(true);
    try {
      const group = groups.find(g => g.id === convertData.groupId);
      const cleanPhone = selectedLead.phone.replace(/\D/g, '');
      const parentCleanPhone = convertData.parentPhone?.replace(/\D/g, '') || cleanPhone;
      
      // Telegram ni aniqlash (telefon yoki username)
      const studentTelegram = cleanPhone;
      const parentTelegram = convertData.parentTelegram || parentCleanPhone;
      
      // 1. O'quvchi yaratish
      const studentEmail = `student${cleanPhone}@edu.local`;
      const generatePassword = () => {
        const chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
      };
      const defaultPassword = generatePassword();
      const parentDefaultPassword = generatePassword();

      // Firebase Auth yaratish
      await usersAPI.create({
        fullName: selectedLead.fullName,
        email: studentEmail,
        phone: selectedLead.phone,
        telegram: studentTelegram,
        role: ROLES.STUDENT
      }, defaultPassword);
      
      // Students kolleksiyasiga qo'shish
      const newStudent = await studentsAPI.create({
        fullName: selectedLead.fullName,
        phone: selectedLead.phone,
        email: studentEmail,
        telegram: studentTelegram,
        groupId: convertData.groupId,
        groupName: group?.name || '',
        parentName: convertData.parentName,
        parentPhone: convertData.parentPhone || selectedLead.phone,
        parentTelegram: parentTelegram,
        address: convertData.address || '',
        subject: selectedLead.subject || '', // Liddan fan
        startDate: new Date().toISOString().split('T')[0],
        paymentType: 'prorated',
        status: 'active',
        mustChangePassword: true
      });
      
      // Agar ota-ona telefoni bo'lsa, ota-ona akkaunti yaratish
      const parentPhone = convertData.parentPhone || selectedLead.phone;
      const parentEmail = `parent${parentCleanPhone}@edu.local`;
      try {
        await usersAPI.create({
          fullName: convertData.parentName || `${selectedLead.fullName} (ota-ona)`,
          email: parentEmail,
          phone: parentPhone,
          telegram: parentTelegram,
          role: ROLES.PARENT,
          childName: selectedLead.fullName,
          childId: newStudent.id,
          childIds: [newStudent.id],
          childNames: [selectedLead.fullName]
        }, parentDefaultPassword);
      } catch (err) {
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
      setCreatedCredentials({ studentEmail, defaultPassword, parentEmail, parentDefaultPassword });
      setShowCredentialsModal(true);
    } catch (err) {
      console.error(err);
      toast.error("Xatolik yuz berdi: " + (err.message || 'Noma\'lum xato'));
    }
    finally { setFormLoading(false); }
  };

  // Sinov darsiga yozish
  const handleTrialLesson = async (e) => {
    e.preventDefault();
    if (!trialData.groupId || !trialData.trialDate) {
      toast.warning("Guruh va sanani tanlang");
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
    } catch (err) { toast.error("Xatolik yuz berdi"); }
    finally { setFormLoading(false); }
  };

  // Yo'qotildi
  const handleLost = async (e) => {
    e.preventDefault();
    if (!lostReason.trim()) {
      toast.warning("Sababni kiriting");
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
    } catch (err) { toast.error("Xatolik yuz berdi"); }
    finally { setFormLoading(false); }
  };

  const handleDelete = async () => {
    setFormLoading(true);
    try {
      await leadsAPI.delete(selectedLead.id);
      setLeads(leads.filter(l => l.id !== selectedLead.id));
      setShowDeleteModal(false);
      toast.success("Lid o'chirildi");
    } catch (err) { toast.error("O'chirishda xatolik"); }
    finally { setFormLoading(false); }
  };

  // ==================== BULK SMS ====================
  const allFilteredIds = filteredLeads.map(l => l.id);
  const allLeadsSelected = allFilteredIds.length > 0 && allFilteredIds.every(id => selectedLeadIds.has(id));
  const someLeadsSelected = selectedLeadIds.size > 0;

  const toggleSelectAllLeads = () => {
    if (allLeadsSelected) {
      setSelectedLeadIds(new Set());
    } else {
      setSelectedLeadIds(new Set(allFilteredIds));
    }
  };

  const toggleSelectLead = (id) => {
    setSelectedLeadIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const clearLeadSelection = () => setSelectedLeadIds(new Set());

  const getPersonalizedMessage = (lead) =>
    smsMessage.replace(/\{ism\}/g, lead.fullName?.split(' ')[0] || lead.fullName || '');

  const handleSendSms = async () => {
    const selected = leads.filter(l => selectedLeadIds.has(l.id));
    setSmsSending(true);
    setSmsResults(null);
    let sent = 0;
    let failed = 0;

    for (const lead of selected) {
      const text = getPersonalizedMessage(lead);
      // 1) Agar Telegram bot mavjud bo'lsa va lead chatId ga ega bo'lsa → bot orqali yuborish
      if (settings.telegramBotToken && lead.telegramChatId) {
        try {
          await sendTelegramMessage(settings.telegramBotToken, lead.telegramChatId, text);
          sent++;
        } catch {
          failed++;
        }
      } else {
        // 2) In-app xabar sifatida saqlash (agar lead user accounti bo'lsa)
        // Hozircha: bot orqali yuborish imkoni bo'lmasa - failed hisoblanmaydi,
        // foydalanuvchi manual link orqali yuboradi
        failed++;
      }
    }

    setSmsSending(false);
    setSmsResults({ sent, failed: failed - (selected.filter(l => !l.telegramChatId).length), total: selected.length, noChat: selected.filter(l => !l.telegramChatId).length });
  };

  const copyPhoneList = () => {
    const selected = leads.filter(l => selectedLeadIds.has(l.id));
    const text = selected.map(l => `${l.fullName}: ${l.phone}`).join('\n');
    navigator.clipboard.writeText(text);
    toast.success(`${selected.length} ta telefon raqam nusxalandi`);
  };

  const copyAllMessages = () => {
    const selected = leads.filter(l => selectedLeadIds.has(l.id));
    const text = selected.map(l => `${l.phone}: ${getPersonalizedMessage(l)}`).join('\n\n---\n\n');
    navigator.clipboard.writeText(text);
    toast.success("Barcha xabarlar nusxalandi");
  };

  const openTelegramLink = (phone) => {
    const digits = phone?.replace(/\D/g, '') || '';
    window.open(`https://t.me/+${digits}`, '_blank');
  };

  const openWhatsAppLink = (phone, message) => {
    const digits = phone?.replace(/\D/g, '') || '';
    window.open(`https://wa.me/${digits}?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (loading) return <Loading fullScreen text="Yuklanmoqda..." />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Lidlar</h1>
          <p className="text-gray-500 dark:text-gray-400">Potensial o'quvchilar</p>
        </div>
        <Button icon={Plus} onClick={() => { resetForm(); setShowAddModal(true); }}>Yangi lid</Button>
      </div>

      {/* Bulk selection toolbar */}
      {someLeadsSelected && (
        <div className="sticky top-0 z-20 bg-primary-600 text-white rounded-xl px-4 py-3 flex flex-wrap items-center gap-3 shadow-lg animate-fade-in">
          <span className="font-semibold text-sm">{selectedLeadIds.size} ta tanlandi</span>
          <div className="flex-1" />
          <button
            onClick={() => setShowSmsModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500 hover:bg-green-600 rounded-lg text-sm font-medium transition"
          >
            <Send className="w-4 h-4" /> SMS/Xabar yuborish
          </button>
          <button
            onClick={copyPhoneList}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition"
          >
            <Copy className="w-4 h-4" /> Raqamlarni nusxalash
          </button>
          <button onClick={clearLeadSelection} className="p-1.5 hover:bg-white/20 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

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
          <button
            onClick={toggleSelectAllLeads}
            className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-primary-600 transition flex-shrink-0 px-2"
            title={allLeadsSelected ? "Hammasini bekor qilish" : "Hammasini tanlash"}
          >
            {allLeadsSelected
              ? <CheckSquare className="w-5 h-5 text-primary-600" />
              : <Square className="w-5 h-5" />
            }
            <span className="hidden md:inline">
              {allLeadsSelected ? 'Bekor qilish' : `Hammasini tanlash (${filteredLeads.length})`}
            </span>
          </button>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
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
            const isChecked = selectedLeadIds.has(lead.id);

            return (
              <Card key={lead.id} className={`hover:shadow-md transition ${isChecked ? 'ring-2 ring-primary-400 dark:ring-primary-500' : ''}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleSelectLead(lead.id)}
                      className="flex-shrink-0 p-0.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                      {isChecked
                        ? <CheckSquare className="w-5 h-5 text-primary-600" />
                        : <Square className="w-5 h-5 text-gray-400" />
                      }
                    </button>
                    <Avatar name={lead.fullName} />
                    <div>
                      <h3 className="font-semibold dark:text-gray-100">{lead.fullName}</h3>
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
                  {lead.subject && <p>📚 {lead.subject}</p>}
                  <p>📍 {lead.source || 'Noma\'lum'}</p>
                  {lead.note && <p className="mt-1">💬 {lead.note}</p>}
                  {lead.contactNote && (
                    <p className="mt-1 text-blue-600">📝 {lead.contactNote}</p>
                  )}
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

      {/* Contact Note Modal */}
      <Modal isOpen={showContactModal} onClose={() => setShowContactModal(false)} title="Bog'lanish qayd">
        <form onSubmit={handleContact} className="space-y-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="font-medium text-blue-900">{selectedLead?.fullName}</p>
            <a href={`tel:${selectedLead?.phone}`} className="text-sm text-blue-600">{selectedLead?.phone}</a>
          </div>
          <Textarea
            label="Izoh (ixtiyoriy)"
            value={contactNote}
            onChange={(e) => setContactNote(e.target.value)}
            rows={3}
            placeholder="Mijoz bilan qanday muloqot bo'ldi? Keyingi qadam nima?"
          />
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="ghost" onClick={() => setShowContactModal(false)}>Bekor qilish</Button>
            <Button type="submit" loading={formLoading}>
              <Phone className="w-4 h-4 mr-1" /> Bog'landim deb belgilash
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Yangi lid">
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <Input label="To'liq ismi *" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
            <FieldError error={formErrors.fullName} />
          </div>
          <div>
            <Input label="Telefon *" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+998901234567" />
            <FieldError error={formErrors.phone} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Qiziqtirgan fan"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              options={[
                { value: '', label: 'Tanlang...' },
                ...subjects.map(s => ({ value: s, label: s })),
              ]}
            />
            <Select label="Manba" value={formData.source} onChange={(e) => setFormData({ ...formData, source: e.target.value })} options={[
              { value: '', label: 'Tanlang...' },
              { value: 'instagram', label: 'Instagram' },
              { value: 'telegram', label: 'Telegram' },
              { value: 'referral', label: 'Tavsiya' },
              { value: 'google', label: 'Google' },
              { value: 'banner', label: 'Banner/Reklama' },
              { value: 'other', label: 'Boshqa' },
            ]} />
          </div>
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
            <Input 
              label="Ota-ona Telegram" 
              value={convertData.parentTelegram} 
              onChange={(e) => setConvertData({ ...convertData, parentTelegram: e.target.value })} 
              placeholder="998901234567 yoki username"
            />
            <Input 
              label="Manzil" 
              value={convertData.address} 
              onChange={(e) => setConvertData({ ...convertData, address: e.target.value })} 
            />
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg text-sm">
            <p className="font-medium mb-2">Avtomatik yaratiladi:</p>
            <p>O'quvchi login: {selectedLead?.phone?.replace(/\D/g, '')}@student.edu</p>
            <p>O'quvchi parol: <strong className="text-green-700">Avtomatik (xavfsiz) parol beriladi</strong></p>
            {convertData.parentPhone && (
              <>
                <p className="mt-2">Ota-ona login: {convertData.parentPhone.replace(/\D/g, '')}@parent.edu</p>
                <p>Ota-ona parol: <strong className="text-green-700">Avtomatik (xavfsiz) parol beriladi</strong></p>
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

      {/* SMS / Bulk Message Modal */}
      <Modal
        isOpen={showSmsModal}
        onClose={() => { setShowSmsModal(false); setSmsResults(null); }}
        title={`Xabar yuborish — ${selectedLeadIds.size} ta lid`}
        size="lg"
      >
        <div className="space-y-4">
          {/* Message template */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Xabar matni
              <span className="ml-2 text-xs font-normal text-gray-500">{'{ism}'} — ism avtomatik qo'yiladi</span>
            </label>
            <textarea
              value={smsMessage}
              onChange={(e) => setSmsMessage(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 rounded-xl border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:border-primary-500 resize-none"
            />
          </div>

          {/* Preview */}
          {leads.filter(l => selectedLeadIds.has(l.id))[0] && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">Ko'rinish (birinchi lid):</p>
              <p className="text-sm text-blue-900 dark:text-blue-200 whitespace-pre-wrap">
                {getPersonalizedMessage(leads.filter(l => selectedLeadIds.has(l.id))[0])}
              </p>
            </div>
          )}

          {/* Send results */}
          {smsResults && (
            <div className={`p-3 rounded-xl border ${smsResults.sent > 0 ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700' : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700'}`}>
              {smsResults.sent > 0 && (
                <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                  ✅ {smsResults.sent} ta Telegram bot orqali yuborildi
                </p>
              )}
              {smsResults.noChat > 0 && (
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  ⚠️ {smsResults.noChat} ta lid Telegram botni ishga tushirmagan — quyidagi havolalardan foydalaning
                </p>
              )}
            </div>
          )}

          {/* Per-lead links table */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            <div className="bg-gray-50 dark:bg-gray-800 px-3 py-2 flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">Har bir lid uchun havolalar</span>
              <button
                onClick={copyAllMessages}
                className="text-xs text-primary-600 hover:underline flex items-center gap-1"
              >
                <Copy className="w-3 h-3" /> Hammasini nusxalash
              </button>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-60 overflow-y-auto">
              {leads.filter(l => selectedLeadIds.has(l.id)).map(lead => {
                const msg = getPersonalizedMessage(lead);
                const digits = lead.phone?.replace(/\D/g, '') || '';
                return (
                  <div key={lead.id} className="flex items-center gap-3 px-3 py-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate text-gray-900 dark:text-gray-100">{lead.fullName}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{lead.phone}</p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {/* Telegram personal link */}
                      <button
                        onClick={() => openTelegramLink(lead.phone)}
                        title="Telegram orqali yuborish"
                        className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-xs hover:bg-blue-200 transition"
                      >
                        <ExternalLink className="w-3 h-3" /> Telegram
                      </button>
                      {/* WhatsApp link */}
                      <button
                        onClick={() => openWhatsAppLink(lead.phone, msg)}
                        title="WhatsApp orqali yuborish"
                        className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-xs hover:bg-green-200 transition"
                      >
                        <ExternalLink className="w-3 h-3" /> WhatsApp
                      </button>
                      {/* Copy single */}
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(msg);
                          setCopiedPhone(lead.id);
                          setTimeout(() => setCopiedPhone(''), 1500);
                        }}
                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        title="Xabarni nusxalash"
                      >
                        {copiedPhone === lead.id ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
            {settings.telegramBotToken && (
              <Button
                onClick={handleSendSms}
                loading={smsSending}
                className="flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Bot orqali yuborish
              </Button>
            )}
            <Button variant="outline" onClick={copyPhoneList}>
              <Copy className="w-4 h-4 mr-1" /> Raqamlarni nusxalash
            </Button>
            <Button variant="ghost" onClick={() => { setShowSmsModal(false); setSmsResults(null); }}>
              Yopish
            </Button>
          </div>
        </div>
      </Modal>

      {/* Credentials Modal */}
      <Modal isOpen={showCredentialsModal} onClose={() => setShowCredentialsModal(false)} title="✅ O'quvchi yaratildi">
        <div className="space-y-4">
          <p className="text-sm text-gray-500">Login ma'lumotlarini nusxalab saqlang. Ular qayta ko'rsatilmaydi.</p>
          <div className="p-4 bg-blue-50 rounded-lg space-y-2">
            <p className="font-semibold text-blue-800 text-sm">📚 O'quvchi</p>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Login:</span>
              <span className="font-mono font-medium">{createdCredentials?.studentEmail}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Parol:</span>
              <span className="font-mono font-medium text-green-700">{createdCredentials?.defaultPassword}</span>
            </div>
          </div>
          {createdCredentials?.parentEmail && (
            <div className="p-4 bg-purple-50 rounded-lg space-y-2">
              <p className="font-semibold text-purple-800 text-sm">👨‍👩‍👧 Ota-ona</p>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Login:</span>
                <span className="font-mono font-medium">{createdCredentials?.parentEmail}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Parol:</span>
                <span className="font-mono font-medium text-green-700">{createdCredentials?.parentDefaultPassword}</span>
              </div>
            </div>
          )}
          <Button
            className="w-full"
            onClick={() => {
              const text = `O'quvchi:\nLogin: ${createdCredentials?.studentEmail}\nParol: ${createdCredentials?.defaultPassword}\n\nOta-ona:\nLogin: ${createdCredentials?.parentEmail}\nParol: ${createdCredentials?.parentDefaultPassword}`;
              navigator.clipboard.writeText(text);
              toast.success("Nusxalandi!");
            }}
          >
            Hammasini nusxalash
          </Button>
          <Button variant="ghost" className="w-full" onClick={() => setShowCredentialsModal(false)}>
            Yopish
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Leads;
