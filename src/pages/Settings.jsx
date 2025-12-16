import { useState, useEffect } from 'react';
import { Save, Building, Phone, Mail, Globe, Clock, Percent, Users, Wallet } from 'lucide-react';
import { Card, Button, Input, Loading, Select } from '../components/common';
import { settingsAPI } from '../services/api';
import { toast } from 'react-toastify';

const Settings = () => {
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
    // SMS va bildirishnomalar
    smsEnabled: false,
    smsProvider: '',
    smsApiKey: '',
    telegramBotToken: '',
    telegramEnabled: false,
    // To'lov eslatmasi
    paymentReminderDays: '3',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchSettings(); }, []);

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
            <div className="p-4 border rounded-lg">
              <label className="flex items-center gap-3 mb-4">
                <input
                  type="checkbox"
                  checked={settings.telegramEnabled}
                  onChange={(e) => setSettings({ ...settings, telegramEnabled: e.target.checked })}
                  className="w-5 h-5 rounded"
                />
                <span className="font-medium">Telegram botni yoqish</span>
              </label>
              {settings.telegramEnabled && (
                <Input
                  label="Bot Token"
                  type="password"
                  value={settings.telegramBotToken}
                  onChange={(e) => setSettings({ ...settings, telegramBotToken: e.target.value })}
                  placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
                />
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
