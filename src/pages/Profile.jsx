import { useState } from 'react';
import { Save, User, Phone, Mail, Lock, AlertCircle, MessageCircle, Copy, Check } from 'lucide-react';
import { Card, Button, Input, Avatar, Badge } from '../components/common';
import { useAuth } from '../contexts/AuthContext';
import { usersAPI } from '../services/api';
import { ROLE_NAMES } from '../utils/constants';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { auth, db } from '../services/firebase';
import { doc, updateDoc } from 'firebase/firestore';

const Profile = () => {
  const { userData, user } = useAuth();
  const [formData, setFormData] = useState({
    fullName: userData?.fullName || '',
    phone: userData?.phone || '',
    email: userData?.email || '',
  });
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
  const [saving, setSaving] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const [telegramCode, setTelegramCode] = useState('');
  const [generatingCode, setGeneratingCode] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  const mustChangePassword = userData?.mustChangePassword;

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await usersAPI.update(userData?.id, formData);
      alert("Ma'lumotlar saqlandi!");
    } catch (err) { alert("Xatolik yuz berdi"); }
    finally { setSaving(false); }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (!passwordData.current) {
      setPasswordError("Joriy parolni kiriting");
      return;
    }
    if (passwordData.new !== passwordData.confirm) {
      setPasswordError("Yangi parollar mos kelmadi");
      return;
    }
    if (passwordData.new.length < 6) {
      setPasswordError("Yangi parol kamida 6 ta belgidan iborat bo'lishi kerak");
      return;
    }
    if (passwordData.current === passwordData.new) {
      setPasswordError("Yangi parol eskisidan farq qilishi kerak");
      return;
    }

    setSavingPassword(true);
    try {
      const credential = EmailAuthProvider.credential(user.email, passwordData.current);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, passwordData.new);
      if (mustChangePassword) {
        await usersAPI.update(userData?.id, { mustChangePassword: false });
      }
      setPasswordSuccess(true);
      setPasswordData({ current: '', new: '', confirm: '' });
    } catch (err) {
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setPasswordError("Joriy parol noto'g'ri");
      } else if (err.code === 'auth/too-many-requests') {
        setPasswordError("Juda ko'p urinish. Biroz kutib turing");
      } else if (err.code === 'auth/requires-recent-login') {
        setPasswordError("Xavfsizlik uchun qaytadan tizimga kiring");
      } else {
        setPasswordError("Xatolik yuz berdi: " + err.message);
      }
    }
    finally { setSavingPassword(false); }
  };

  const generateTelegramCode = async () => {
    setGeneratingCode(true);
    try {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiry = new Date(Date.now() + 15 * 60 * 1000);
      await updateDoc(doc(db, 'users', user.uid), {
        telegramLinkCode: code,
        telegramLinkCodeExpiry: expiry,
      });
      setTelegramCode(code);
    } catch (err) {
      alert("Kod yaratishda xatolik yuz berdi");
    }
    setGeneratingCode(false);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(`/connect ${telegramCode}`);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profil</h1>
        <p className="text-gray-500">Shaxsiy ma'lumotlaringiz</p>
      </div>

      {mustChangePassword && (
        <Card className="bg-yellow-50 border-yellow-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-800">Parolni o'zgartiring</h4>
              <p className="text-sm text-yellow-700 mt-1">
                Xavfsizlik uchun standart parolni o'zingizning shaxsiy parolingizga o'zgartiring.
              </p>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="text-center">
          <Avatar name={userData?.fullName} size="xl" className="mx-auto" />
          <h2 className="text-xl font-bold mt-4">{userData?.fullName}</h2>
          <Badge variant="primary" className="mt-2">{ROLE_NAMES[userData?.role]}</Badge>
          <p className="text-sm text-gray-500 mt-2">{userData?.email}</p>
          {userData?.phone && <p className="text-sm text-gray-500">{userData?.phone}</p>}
          {userData?.telegramId && (
            <p className="text-sm text-blue-500 mt-1 flex items-center justify-center gap-1">
              <MessageCircle className="w-3.5 h-3.5" /> Telegram ulangan
            </p>
          )}
        </Card>

        <Card className="lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-primary-600" /> Shaxsiy ma'lumotlar
          </h3>
          <form onSubmit={handleSave} className="space-y-4">
            <Input
              label="To'liq ismingiz"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              icon={User}
            />
            <Input
              label="Telefon"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              icon={Phone}
            />
            <Input
              label="Email"
              type="email"
              value={formData.email}
              icon={Mail}
              disabled
            />
            <div className="flex justify-end">
              <Button type="submit" icon={Save} loading={saving}>Saqlash</Button>
            </div>
          </form>
        </Card>
      </div>

      {/* Telegram ulash — A variant */}
      <Card>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-blue-500" /> Telegram ulash
        </h3>

        {userData?.telegramId ? (
          <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-green-800">Telegram ulangan</p>
              {userData?.telegramUsername && (
                <p className="text-sm text-green-600">@{userData.telegramUsername}</p>
              )}
              <p className="text-xs text-green-500 mt-0.5">
                Bildirishnomalar Telegramga yuboriladi
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Telegram botga ulanish uchun kod oling va botga yuboring.
              Shunda bildirishnomalar Telegramingizga keladi.
            </p>

            {telegramCode ? (
              <div className="space-y-3">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <p className="text-sm font-medium text-blue-800 mb-3">
                    Quyidagi buyruqni Telegram botga yuboring:
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-white border border-blue-200 rounded-lg px-4 py-3">
                      <code className="text-xl font-mono font-bold tracking-widest text-blue-900">
                        /connect {telegramCode}
                      </code>
                    </div>
                    <button
                      type="button"
                      onClick={copyCode}
                      className="p-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition"
                      title="Nusxalash"
                    >
                      {codeCopied
                        ? <Check className="w-5 h-5 text-green-600" />
                        : <Copy className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-blue-500 mt-2">⏱ Bu kod 15 daqiqa amal qiladi</p>
                </div>
                <Button variant="ghost" size="sm" onClick={generateTelegramCode} loading={generatingCode}>
                  Yangi kod olish
                </Button>
              </div>
            ) : (
              <Button onClick={generateTelegramCode} loading={generatingCode} icon={MessageCircle} variant="outline">
                Telegram ulash kodi olish
              </Button>
            )}
          </div>
        )}
      </Card>

      {/* Parolni o'zgartirish */}
      <Card className={mustChangePassword ? 'ring-2 ring-yellow-400' : ''}>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5 text-primary-600" /> Parolni o'zgartirish
          {mustChangePassword && <Badge variant="warning">Majburiy</Badge>}
        </h3>

        {passwordError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
            {passwordError}
          </div>
        )}

        {passwordSuccess && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-lg text-sm">
            Parol muvaffaqiyatli o'zgartirildi!
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
          <Input
            label="Joriy parol"
            type="password"
            value={passwordData.current}
            onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
            placeholder="Hozirgi parolingiz"
            required
          />
          <Input
            label="Yangi parol"
            type="password"
            value={passwordData.new}
            onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
            placeholder="Kamida 6 ta belgi"
            required
          />
          <Input
            label="Yangi parolni tasdiqlang"
            type="password"
            value={passwordData.confirm}
            onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
            placeholder="Yangi parolni qayta kiriting"
            required
          />
          <Button type="submit" icon={Lock} loading={savingPassword}>
            Parolni o'zgartirish
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Profile;
