import { useState, useEffect } from 'react';
import { Save, Building, Phone, Clock, Percent, Users, Wallet, BookOpen, Plus, X, CheckCircle, AlertCircle, RefreshCw, ExternalLink, Eye, EyeOff } from 'lucide-react';
import { Card, Button, Input, Loading, Select } from '../components/common';
import { settingsAPI, usersAPI } from '../services/api';
import { toast } from 'react-toastify';
import { getBotInfo } from '../services/telegram';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../services/firebase';

const Settings = () => {
  const { centerId } = useAuth();
  const [settings, setSettings] = useState({
    centerName: '',
    phone: '',
    email: '',
    address: '',
    website: '',
    workingHours: '',
    monthlyFee: '',
    trialDays: '',
    // Chegirma tizimi
    siblingDiscount: '10',
    siblingDiscountType: 'second_only',
    earlyPaymentDiscount: '5',
    referralBonus: '10', // Tavsiya mukofoti %
    // O'qituvchi maoshi
    teacherSalaryType: 'fixed',
    teacherFixedSalary: '3000000',
    teacherPerStudent: '50000',
    teacherPerHour: '100000',
    teacherPercentage: '30',
    // Fanlar
    subjects: [],
    // SMS va bildirishnomalar
    smsEnabled: false,
    smsProvider: '',
    smsApiKey: '',
    telegramBotToken: '',
    telegramBotUsername: '',
    telegramEnabled: false,
    // To'lov eslatmasi
    paymentReminderDays: '3',
    // Avtomatik bildirishnomalar
    weeklyReportEnabled: true,
    paymentReminderEnabled: true,
    debtReminderEnabled: true,
    homeworkNotifEnabled: true,
    classReminderEnabled: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newSubject, setNewSubject] = useState('');

  // Telegram
  const [botVerifying, setBotVerifying] = useState(false);
  const [botInfo, setBotInfo] = useState(null);
  const [copiedToken, setCopiedToken] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [webhookSetting, setWebhookSetting] = useState(false);
  const [webhookStatus, setWebhookStatus] = useState(null);
  const [linkedStats, setLinkedStats] = useState(null); // { linked, total }
  const [statsLoading, setStatsLoading] = useState(false);

  useEffect(() => { fetchSettings(); }, []);

  useEffect(() => {
    if (settings.telegramEnabled) fetchLinkedStats();
  }, [settings.telegramEnabled]);

  const fetchSettings = async () => {
    try {
      const data = await settingsAPI.get();
      if (data) setSettings(prev => ({ ...prev, ...data }));
    } catch (err) { 
      console.error('Settings fetch error:', err); 
    }
    finally { setLoading(false); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await settingsAPI.update(settings);
      toast.success("Sozlamalar saqlandi!");
    } catch (err) { 
      console.error('Settings save error:', err);
      toast.error("Xatolik yuz berdi: " + err.message); 
    }
    finally { setSaving(false); }
  };

  // ---- Telegram helpers ----

  const handleVerifyToken = async () => {
    if (!settings.telegramBotToken.trim()) {
      toast.error("Bot token kiriting");
      return;
    }
    setBotVerifying(true);
    setBotInfo(null);
    try {
      const info = await getBotInfo(settings.telegramBotToken.trim());
      setBotInfo(info);
      // Auto-fill username from bot info
      setSettings(s => ({ ...s, telegramBotUsername: info.username }));
      toast.success(`Bot topildi: @${info.username}`);
    } catch (err) {
      toast.error("Token noto'g'ri: " + err.message);
    } finally {
      setBotVerifying(false);
    }
  };

  const fetchLinkedStats = async () => {
    setStatsLoading(true);
    try {
      const users = await usersAPI.getAll();
      const parents = users.filter(u => u.role === 'parent');
      const linked = parents.filter(u => u.telegramId).length;
      setLinkedStats({ linked, total: parents.length });
    } catch {
      setLinkedStats(null);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleSetWebhook = async () => {
    if (!settings.telegramBotToken) {
      toast.error("Avval bot tokenini saqlang");
      return;
    }
    if (!centerId) {
      toast.error("Markaz ID topilmadi");
      return;
    }
    setWebhookSetting(true);
    setWebhookStatus(null);
    try {
      const project = import.meta.env.VITE_FIREBASE_PROJECT_ID;
      const idToken = await auth.currentUser?.getIdToken();
      const url = `https://us-central1-${project}.cloudfunctions.net/setupWebhook`;
      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${idToken}` },
      });
      const text = await res.text();
      if (res.ok) {
        setWebhookStatus('ok');
        toast.success("Webhook muvaffaqiyatli o'rnatildi!");
      } else {
        setWebhookStatus('error');
        toast.error("Webhook xatoligi: " + text);
      }
    } catch (err) {
      setWebhookStatus('error');
      toast.error("Xatolik: " + err.message);
    } finally {
      setWebhookSetting(false);
    }
  };

  if (loading) return <Loading fullScreen text="Yuklanmoqda..." />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sozlamalar</h1>
          <p className="text-gray-500">Tizim sozlamalari</p>
        </div>
        <Button icon={Save} loading={saving} onClick={handleSave}>Saqlash</Button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* O'quv markaz ma'lumotlari */}
        <Card>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Building className="w-5 h-5 text-primary-600" /> O'quv markaz ma'lumotlari
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="O'quv markaz nomi"
              value={settings.centerName}
              onChange={(e) => setSettings({ ...settings, centerName: e.target.value })}
              placeholder="EduCenter"
            />
            <Input
              label="Telefon"
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              placeholder="+998 90 123 45 67"
            />
            <Input
              label="Email"
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              placeholder="info@educenter.uz"
            />
            <Input
              label="Veb-sayt"
              value={settings.website}
              onChange={(e) => setSettings({ ...settings, website: e.target.value })}
              placeholder="www.educenter.uz"
            />
            <Input
              label="Manzil"
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              placeholder="Toshkent sh., Chilonzor t."
              className="md:col-span-2"
            />
          </div>
        </Card>

        {/* Fanlar */}
        <Card>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" /> O'tiladigan fanlar
          </h3>
          <p className="text-sm text-gray-500 mb-4">Lidlar bo'limida ko'rsatiladigan fanlar ro'yxati</p>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const trimmed = newSubject.trim();
                  if (trimmed && !(settings.subjects || []).includes(trimmed)) {
                    setSettings({ ...settings, subjects: [...(settings.subjects || []), trimmed] });
                    setNewSubject('');
                  }
                }
              }}
              placeholder="Fan nomini kiriting (Enter)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              type="button"
              onClick={() => {
                const trimmed = newSubject.trim();
                if (trimmed && !(settings.subjects || []).includes(trimmed)) {
                  setSettings({ ...settings, subjects: [...(settings.subjects || []), trimmed] });
                  setNewSubject('');
                }
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Qo'shish
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(settings.subjects || []).length === 0 && (
              <p className="text-sm text-gray-400">Hali fan qo'shilmagan</p>
            )}
            {(settings.subjects || []).map((subj, i) => (
              <span key={i} className="flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm">
                {subj}
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, subjects: settings.subjects.filter((_, idx) => idx !== i) })}
                  className="ml-1 hover:text-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </Card>

        {/* To'lov sozlamalari */}
        <Card>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary-600" /> To'lov sozlamalari
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Ish vaqti"
              value={settings.workingHours}
              onChange={(e) => setSettings({ ...settings, workingHours: e.target.value })}
              placeholder="09:00 - 21:00"
            />
            <Input
              label="Sinov muddati (kun)"
              type="number"
              value={settings.trialDays}
              onChange={(e) => setSettings({ ...settings, trialDays: e.target.value })}
              placeholder="3"
            />
            <Input
              label="Standart oylik to'lov (so'm)"
              type="number"
              value={settings.monthlyFee}
              onChange={(e) => setSettings({ ...settings, monthlyFee: e.target.value })}
              placeholder="850000"
            />
            <Input
              label="To'lov eslatmasi (kun oldin)"
              type="number"
              value={settings.paymentReminderDays}
              onChange={(e) => setSettings({ ...settings, paymentReminderDays: e.target.value })}
              placeholder="3"
            />
          </div>
        </Card>

        {/* Chegirma tizimi */}
        <Card>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Percent className="w-5 h-5 text-green-600" /> Chegirma tizimi
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Bir nechta farzand uchun chegirma (%)"
              type="number"
              value={settings.siblingDiscount}
              onChange={(e) => setSettings({ ...settings, siblingDiscount: e.target.value })}
              placeholder="10"
              min="0"
              max="100"
            />
            <Select
              label="Chegirma qo'llanishi"
              value={settings.siblingDiscountType}
              onChange={(e) => setSettings({ ...settings, siblingDiscountType: e.target.value })}
              options={[
                { value: 'second_only', label: 'Faqat 2-chi va keyingi farzandlarga' },
                { value: 'all_children', label: 'Barcha farzandlarga' },
              ]}
            />
            <Input
              label="Muddatidan oldin to'lov uchun chegirma (%)"
              type="number"
              value={settings.earlyPaymentDiscount}
              onChange={(e) => setSettings({ ...settings, earlyPaymentDiscount: e.target.value })}
              placeholder="5"
              min="0"
              max="100"
            />
            <Input
              label="Tavsiya mukofoti (%)"
              type="number"
              value={settings.referralBonus}
              onChange={(e) => setSettings({ ...settings, referralBonus: e.target.value })}
              placeholder="10"
              min="0"
              max="100"
            />
          </div>
          <div className="mt-4 p-3 bg-green-50 rounded-lg text-sm text-green-700">
            <p><strong>Chegirma qoidalari:</strong></p>
            <p>• Bir oiladan bir nechta farzand o'qisa, {settings.siblingDiscount}% chegirma beriladi</p>
            <p>• Oylik to'lovni muddatidan {settings.paymentReminderDays} kun oldin to'lasa, {settings.earlyPaymentDiscount}% chegirma</p>
            <p>• Yangi o'quvchi tavsiya qilganda, tavsiya qiluvchiga oylik to'lovning {settings.referralBonus}% i mukofot</p>
          </div>
        </Card>

        {/* O'qituvchi maoshi */}
        <Card>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Wallet className="w-5 h-5 text-purple-600" /> O'qituvchi maoshi
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Maosh hisoblash usuli"
              value={settings.teacherSalaryType}
              onChange={(e) => setSettings({ ...settings, teacherSalaryType: e.target.value })}
              options={[
                { value: 'fixed', label: 'Qat\'iy oylik maosh' },
                { value: 'per_student', label: 'Har bir o\'quvchi uchun' },
                { value: 'per_hour', label: 'Dars soatiga' },
                { value: 'percentage', label: 'To\'lovlardan foiz' },
              ]}
            />
            
            {settings.teacherSalaryType === 'fixed' && (
              <Input
                label="Qat'iy oylik (so'm)"
                type="number"
                value={settings.teacherFixedSalary}
                onChange={(e) => setSettings({ ...settings, teacherFixedSalary: e.target.value })}
                placeholder="3000000"
              />
            )}
            
            {settings.teacherSalaryType === 'per_student' && (
              <Input
                label="Har bir o'quvchi uchun (so'm)"
                type="number"
                value={settings.teacherPerStudent}
                onChange={(e) => setSettings({ ...settings, teacherPerStudent: e.target.value })}
                placeholder="50000"
              />
            )}
            
            {settings.teacherSalaryType === 'per_hour' && (
              <Input
                label="Har bir soat uchun (so'm)"
                type="number"
                value={settings.teacherPerHour}
                onChange={(e) => setSettings({ ...settings, teacherPerHour: e.target.value })}
                placeholder="100000"
              />
            )}
            
            {settings.teacherSalaryType === 'percentage' && (
              <Input
                label="To'lovlardan foiz (%)"
                type="number"
                value={settings.teacherPercentage}
                onChange={(e) => setSettings({ ...settings, teacherPercentage: e.target.value })}
                placeholder="30"
                min="0"
                max="100"
              />
            )}
          </div>
          <div className="mt-4 p-3 bg-purple-50 rounded-lg text-sm text-purple-700">
            <p><strong>Maosh hisoblash:</strong></p>
            {settings.teacherSalaryType === 'fixed' && (
              <p>• Har bir o'qituvchi oyiga {parseInt(settings.teacherFixedSalary || 0).toLocaleString()} so'm oladi</p>
            )}
            {settings.teacherSalaryType === 'per_student' && (
              <p>• Har bir o'quvchi uchun {parseInt(settings.teacherPerStudent || 0).toLocaleString()} so'm</p>
            )}
            {settings.teacherSalaryType === 'per_hour' && (
              <p>• Har bir dars soati uchun {parseInt(settings.teacherPerHour || 0).toLocaleString()} so'm</p>
            )}
            {settings.teacherSalaryType === 'percentage' && (
              <p>• Guruhdan tushadigan to'lovlarning {settings.teacherPercentage}% i o'qituvchiga</p>
            )}
          </div>
        </Card>

        {/* SMS va Telegram sozlamalari */}
        <Card>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Phone className="w-5 h-5 text-blue-600" /> Bildirishnomalar (SMS va Telegram)
          </h3>
          <div className="space-y-4">
            {/* SMS */}
            <div className="p-4 border rounded-lg">
              <label className="flex items-center gap-3 mb-4">
                <input
                  type="checkbox"
                  checked={settings.smsEnabled}
                  onChange={(e) => setSettings({ ...settings, smsEnabled: e.target.checked })}
                  className="w-5 h-5 rounded"
                />
                <span className="font-medium">SMS bildirishnomalarni yoqish</span>
              </label>
              {settings.smsEnabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="SMS provayder"
                    value={settings.smsProvider}
                    onChange={(e) => setSettings({ ...settings, smsProvider: e.target.value })}
                    options={[
                      { value: 'eskiz', label: 'Eskiz.uz' },
                      { value: 'playmobile', label: 'PlayMobile' },
                      { value: 'smsuz', label: 'SMS.uz' },
                    ]}
                  />
                  <Input
                    label="API kaliti"
                    type="password"
                    value={settings.smsApiKey}
                    onChange={(e) => setSettings({ ...settings, smsApiKey: e.target.value })}
                    placeholder="API key"
                  />
                </div>
              )}
            </div>

            {/* Telegram */}
            <div className="p-4 border rounded-lg space-y-4">
              {/* Toggle */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.telegramEnabled}
                  onChange={(e) => setSettings({ ...settings, telegramEnabled: e.target.checked })}
                  className="w-5 h-5 rounded"
                />
                <span className="font-medium">Telegram botni yoqish</span>
              </label>

              {settings.telegramEnabled && (
                <>
                  {/* Setup instruction */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800 space-y-1">
                    <p className="font-medium">Sozlash tartibi:</p>
                    <ol className="list-decimal ml-4 space-y-0.5 text-blue-700">
                      <li>Telegramda <a href="https://t.me/BotFather" target="_blank" rel="noopener noreferrer" className="underline font-medium">@BotFather</a> ga yozing → <code>/newbot</code> → token oling</li>
                      <li>Tokenni quyida kiriting va "Tekshirish" tugmasini bosing</li>
                      <li>Saqlang — endi O'quvchilar sahifasidan har bir ota-onaga havola yuboring</li>
                      <li>Ota-ona havolani bosib, botga xabar yuboradi</li>
                      <li>"Sinxronlash" tugmasini bosib, chat ID-larni yangilang</li>
                    </ol>
                  </div>

                  {/* Token input + verify */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Bot Token</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type={showToken ? 'text' : 'password'}
                          value={settings.telegramBotToken}
                          onChange={(e) => {
                            setSettings({ ...settings, telegramBotToken: e.target.value });
                            setBotInfo(null);
                          }}
                          placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
                          autoComplete="off"
                          className="w-full pr-9 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowToken(v => !v)}
                          className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-gray-400 hover:text-gray-600"
                          title={showToken ? "Yashirish" : "Ko'rsatish"}
                        >
                          {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        loading={botVerifying}
                        onClick={handleVerifyToken}
                      >
                        Tekshirish
                      </Button>
                    </div>

                    {/* Bot status badge */}
                    {botInfo && (
                      <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                        <CheckCircle className="w-4 h-4 flex-shrink-0" />
                        <span>Bot ulandi: <strong>@{botInfo.username}</strong> ({botInfo.first_name})</span>
                        <a
                          href={`https://t.me/${botInfo.username}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-auto text-green-600 hover:text-green-800"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Bot username (auto-filled after verify, editable) */}
                  <Input
                    label="Bot username (@siz)"
                    value={settings.telegramBotUsername}
                    onChange={(e) => setSettings({ ...settings, telegramBotUsername: e.target.value.replace('@', '') })}
                    placeholder="my_edu_bot"
                    helpText="Tekshirish tugmasidan so'ng avtomatik to'ldiriladi"
                  />

                  {/* Ota-onalar holati — avtomatik yuklanadi */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span>Telegram bilan ulangan ota-onalar:</span>
                      {statsLoading ? (
                        <span className="text-gray-400">yuklanmoqda...</span>
                      ) : linkedStats ? (
                        <span className={`font-semibold ${linkedStats.linked > 0 ? 'text-green-700' : 'text-gray-500'}`}>
                          {linkedStats.linked} / {linkedStats.total}
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={fetchLinkedStats}
                      className="text-gray-400 hover:text-gray-600"
                      title="Yangilash"
                    >
                      <RefreshCw className={`w-4 h-4 ${statsLoading ? 'animate-spin' : ''}`} />
                    </button>
                  </div>

                  {/* Webhook tugmasi */}
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <Button
                      type="button"
                      variant="primary"
                      loading={webhookSetting}
                      onClick={handleSetWebhook}
                      disabled={!settings.telegramBotToken}
                    >
                      🔗 Webhookni o'rnatish
                    </Button>

                    {webhookStatus === 'ok' && (
                      <span className="flex items-center gap-1 text-sm text-green-700 font-medium">
                        <CheckCircle className="w-4 h-4" /> Webhook ulandi
                      </span>
                    )}
                    {webhookStatus === 'error' && (
                      <span className="flex items-center gap-1 text-sm text-red-600 font-medium">
                        <AlertCircle className="w-4 h-4" /> Webhook xatoligi
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-gray-400">
                    Ota-onalar botga <code className="bg-gray-100 px-1 rounded">/start</code> yuborib, telefon raqamini yuborganda
                    — tizimga <strong>avtomatik</strong> ulanadi. Qo'lda sinxronlash kerak emas.
                  </p>

                  {/* Avtomatik bildirishnomalar */}
                  <div className="mt-4 border-t pt-4">
                    <p className="text-sm font-semibold text-gray-700 mb-3">Avtomatik bildirishnomalar</p>
                    <div className="space-y-3">

                      {/* Haftalik hisobot */}
                      <div className="flex items-start justify-between gap-4 p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-800">Haftalik hisobot</p>
                          <p className="text-xs text-gray-500">Har dushanba — o'tgan hafta baholari + davomat xulosasi</p>
                        </div>
                        <label className="flex items-center cursor-pointer shrink-0">
                          <div className="relative">
                            <input
                              type="checkbox"
                              className="sr-only"
                              checked={settings.weeklyReportEnabled}
                              onChange={(e) => setSettings({ ...settings, weeklyReportEnabled: e.target.checked })}
                            />
                            <div className={`w-10 h-5 rounded-full transition-colors ${settings.weeklyReportEnabled ? 'bg-primary-600' : 'bg-gray-300'}`} />
                            <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${settings.weeklyReportEnabled ? 'translate-x-5' : ''}`} />
                          </div>
                        </label>
                      </div>

                      {/* To'lov eslatmasi */}
                      <div className="flex items-start justify-between gap-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800">Balansdagi mablag'</p>
                          <p className="text-xs text-gray-500 mb-2">To'lov qilishga X kun qoldi eslatmasi</p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Eslatma</span>
                            <input
                              type="number"
                              min="1"
                              max="14"
                              value={settings.paymentReminderDays}
                              onChange={(e) => setSettings({ ...settings, paymentReminderDays: e.target.value })}
                              disabled={!settings.paymentReminderEnabled}
                              className="w-14 px-2 py-1 text-sm border border-gray-300 rounded text-center disabled:opacity-50"
                            />
                            <span className="text-xs text-gray-500">kun oldin yuboriladi</span>
                          </div>
                        </div>
                        <label className="flex items-center cursor-pointer shrink-0">
                          <div className="relative">
                            <input
                              type="checkbox"
                              className="sr-only"
                              checked={settings.paymentReminderEnabled}
                              onChange={(e) => setSettings({ ...settings, paymentReminderEnabled: e.target.checked })}
                            />
                            <div className={`w-10 h-5 rounded-full transition-colors ${settings.paymentReminderEnabled ? 'bg-primary-600' : 'bg-gray-300'}`} />
                            <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${settings.paymentReminderEnabled ? 'translate-x-5' : ''}`} />
                          </div>
                        </label>
                      </div>

                      {/* Dars tugaganda eslatma */}
                      <div className="flex items-start justify-between gap-4 p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-800">Dars tugagach eslatma</p>
                          <p className="text-xs text-gray-500">Dars tugagandan 15 daqiqa o'tgach o'qituvchiga davomat/baho belgilash eslatmasi</p>
                        </div>
                        <label className="flex items-center cursor-pointer shrink-0">
                          <div className="relative">
                            <input
                              type="checkbox"
                              className="sr-only"
                              checked={settings.classReminderEnabled}
                              onChange={(e) => setSettings({ ...settings, classReminderEnabled: e.target.checked })}
                            />
                            <div className={`w-10 h-5 rounded-full transition-colors ${settings.classReminderEnabled ? 'bg-primary-600' : 'bg-gray-300'}`} />
                            <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${settings.classReminderEnabled ? 'translate-x-5' : ''}`} />
                          </div>
                        </label>
                      </div>

                      {/* Qarzdorlik eslatmasi */}
                      <div className="flex items-start justify-between gap-4 p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-800">Qarzdorlik eslatmasi</p>
                          <p className="text-xs text-gray-500">Har juma — qarzi bor ota-onalarga eslatma</p>
                        </div>
                        <label className="flex items-center cursor-pointer shrink-0">
                          <div className="relative">
                            <input
                              type="checkbox"
                              className="sr-only"
                              checked={settings.debtReminderEnabled}
                              onChange={(e) => setSettings({ ...settings, debtReminderEnabled: e.target.checked })}
                            />
                            <div className={`w-10 h-5 rounded-full transition-colors ${settings.debtReminderEnabled ? 'bg-primary-600' : 'bg-gray-300'}`} />
                            <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${settings.debtReminderEnabled ? 'translate-x-5' : ''}`} />
                          </div>
                        </label>
                      </div>

                      {/* Uyga vazifa */}
                      <div className="flex items-start justify-between gap-4 p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-800">Yangi uyga vazifa</p>
                          <p className="text-xs text-gray-500">Vazifa qo'yilganda darhol ota-ona va o'quvchiga xabar</p>
                        </div>
                        <label className="flex items-center cursor-pointer shrink-0">
                          <div className="relative">
                            <input
                              type="checkbox"
                              className="sr-only"
                              checked={settings.homeworkNotifEnabled}
                              onChange={(e) => setSettings({ ...settings, homeworkNotifEnabled: e.target.checked })}
                            />
                            <div className={`w-10 h-5 rounded-full transition-colors ${settings.homeworkNotifEnabled ? 'bg-primary-600' : 'bg-gray-300'}`} />
                            <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${settings.homeworkNotifEnabled ? 'translate-x-5' : ''}`} />
                          </div>
                        </label>
                      </div>

                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" icon={Save} loading={saving}>Saqlash</Button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
