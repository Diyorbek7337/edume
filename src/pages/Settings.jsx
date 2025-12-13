import { useState, useEffect } from 'react';
import { Save, Building, Phone, Mail, Globe, Clock } from 'lucide-react';
import { Card, Button, Input, Loading } from '../components/common';
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
              icon={Phone}
            />
            <Input
              label="Email"
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              placeholder="info@educenter.uz"
              icon={Mail}
            />
            <Input
              label="Veb-sayt"
              value={settings.website}
              onChange={(e) => setSettings({ ...settings, website: e.target.value })}
              placeholder="www.educenter.uz"
              icon={Globe}
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

        <Card>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary-600" /> Ish tartibi
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
