import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  GraduationCap, Building2, User, Mail, Phone, Lock, MapPin, ArrowRight,
  CheckCircle, BookOpen,
} from 'lucide-react';
import { centersAPI } from '../services/api';
import { toast } from 'react-toastify';

const Register = () => {
  const navigate = useNavigate();
  // registrationType: null (hali tanlanmagan) | 'center' | 'solo'
  // step: 0 — turini tanlash, 1 — ma'lumotlar (markaz uchun: markaz info;
  // solo uchun: bitta birlashtirilgan forma), 2 — admin info (FAQAT markaz
  // yo'lida), 3 — muvaffaqiyat
  const [registrationType, setRegistrationType] = useState(null);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const [centerData, setCenterData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
  });

  const [adminData, setAdminData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  // Yakka o'qituvchi uchun — bitta birlashtirilgan forma (markaz nomi so'ralmaydi,
  // markaz nomi sifatida o'z ismi ishlatiladi)
  const [soloData, setSoloData] = useState({
    fullName: '',
    subject: '',
    phone: '',
    email: '',
    address: '',
    password: '',
    confirmPassword: '',
  });

  const handleTypeSelect = (type) => {
    setRegistrationType(type);
    setStep(1);
  };

  const handleCenterSubmit = (e) => {
    e.preventDefault();
    if (!centerData.name) {
      toast.error("O'quv markaz nomini kiriting");
      return;
    }
    setStep(2);
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();

    if (!adminData.fullName || !adminData.email || !adminData.password) {
      toast.error("Barcha maydonlarni to'ldiring");
      return;
    }

    if (adminData.password !== adminData.confirmPassword) {
      toast.error("Parollar mos kelmaydi");
      return;
    }

    if (adminData.password.length < 6) {
      toast.error("Parol kamida 6 ta belgidan iborat bo'lishi kerak");
      return;
    }

    setLoading(true);
    try {
      const res = await centersAPI.createWithAdmin(
        { ...centerData, type: 'center' },
        adminData,
        adminData.password
      );
      setResult(res);
      setStep(3);
      toast.success("O'quv markaz muvaffaqiyatli ro'yxatdan o'tdi!");
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        toast.error("Bu email allaqachon ro'yxatdan o'tgan");
      } else {
        toast.error("Xatolik yuz berdi: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSoloSubmit = async (e) => {
    e.preventDefault();

    if (!soloData.fullName || !soloData.subject || !soloData.email || !soloData.password) {
      toast.error("Barcha (*) bilan belgilangan maydonlarni to'ldiring");
      return;
    }

    if (soloData.password !== soloData.confirmPassword) {
      toast.error("Parollar mos kelmaydi");
      return;
    }

    if (soloData.password.length < 6) {
      toast.error("Parol kamida 6 ta belgidan iborat bo'lishi kerak");
      return;
    }

    setLoading(true);
    try {
      // Yakka o'qituvchi uchun "markaz nomi" — o'z to'liq ismi
      const res = await centersAPI.createWithAdmin(
        {
          name: soloData.fullName,
          phone: soloData.phone,
          email: soloData.email,
          address: soloData.address,
          type: 'solo',
        },
        {
          fullName: soloData.fullName,
          email: soloData.email,
          phone: soloData.phone,
          subject: soloData.subject, // auto-yaratiladigan O'qituvchi yozuviga tushadi
        },
        soloData.password
      );
      setResult(res);
      setStep(3);
      toast.success("Muvaffaqiyatli ro'yxatdan o'tdingiz!");
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        toast.error("Bu email allaqachon ro'yxatdan o'tgan");
      } else {
        toast.error("Xatolik yuz berdi: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Muvaffaqiyat ekranida ikkala yo'l uchun ham to'g'ri ma'lumot ko'rsatish uchun
  const displayName = registrationType === 'solo' ? soloData.fullName : centerData.name;
  const displayEmail = registrationType === 'solo' ? soloData.email : adminData.email;
  const totalSteps = registrationType === 'solo' ? 2 : 3; // progress ko'rsatkichi uchun (solo: info+muvaffaqiyat)
  const progressStep = registrationType === 'solo' && step === 3 ? 2 : step; // solo yo'lida 3-qadam 2-nuqta bo'lib ko'rinadi

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
            <GraduationCap className="w-10 h-10 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-white">EduCenter</h1>
          <p className="text-primary-200 mt-2">O'quv markaz boshqaruv tizimi</p>
        </div>

        {/* Progress */}
        {step > 0 && (
          <div className="flex items-center justify-center mb-8">
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  progressStep >= s ? 'bg-white text-primary-600' : 'bg-primary-500 text-primary-200'
                }`}>
                  {progressStep > s ? <CheckCircle className="w-6 h-6" /> : s}
                </div>
                {s < totalSteps && (
                  <div className={`w-16 h-1 ${progressStep > s ? 'bg-white' : 'bg-primary-500'}`} />
                )}
              </div>
            ))}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Step 0: Turini tanlash */}
          {step === 0 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <GraduationCap className="w-12 h-12 text-primary-600 mx-auto mb-2" />
                <h2 className="text-xl font-bold text-gray-900">Qanday ro'yxatdan o'tasiz?</h2>
                <p className="text-gray-500 text-sm">O'zingizga mos variantni tanlang</p>
              </div>

              <button
                type="button"
                onClick={() => handleTypeSelect('center')}
                className="w-full flex items-start gap-4 p-5 rounded-xl border-2 border-gray-200 hover:border-primary-500 hover:bg-primary-50 transition text-left"
              >
                <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                  <Building2 className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">O'quv markaz</h3>
                  <p className="text-sm text-gray-500">Bir nechta o'qituvchi va xodimlari bo'lgan markaz uchun</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleTypeSelect('solo')}
                className="w-full flex items-start gap-4 p-5 rounded-xl border-2 border-gray-200 hover:border-primary-500 hover:bg-primary-50 transition text-left"
              >
                <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                  <User className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Yakka o'qituvchi</h3>
                  <p className="text-sm text-gray-500">Repetitorlik qiladigan yagona o'qituvchi uchun</p>
                </div>
              </button>

              <p className="text-center text-sm text-gray-500 pt-2">
                Allaqachon ro'yxatdan o'tganmisiz?{' '}
                <Link to="/login" className="text-primary-600 hover:underline font-medium">
                  Kirish
                </Link>
              </p>
            </div>
          )}

          {/* Step 1 (markaz yo'li): Center Info */}
          {step === 1 && registrationType === 'center' && (
            <form onSubmit={handleCenterSubmit} className="space-y-6">
              <button
                type="button"
                onClick={() => { setStep(0); setRegistrationType(null); }}
                className="text-sm text-gray-400 hover:text-gray-600"
              >
                ← Orqaga
              </button>
              <div className="text-center mb-6">
                <Building2 className="w-12 h-12 text-primary-600 mx-auto mb-2" />
                <h2 className="text-xl font-bold text-gray-900">O'quv markaz ma'lumotlari</h2>
                <p className="text-gray-500 text-sm">Markazingiz haqida asosiy ma'lumotlar</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  O'quv markaz nomi *
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={centerData.name}
                    onChange={(e) => setCenterData({ ...centerData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Masalan: Silk Road Academy"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={centerData.phone}
                      onChange={(e) => setCenterData({ ...centerData, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500"
                      placeholder="+998901234567"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={centerData.email}
                      onChange={(e) => setCenterData({ ...centerData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500"
                      placeholder="info@example.uz"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Manzil</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={centerData.address}
                    onChange={(e) => setCenterData({ ...centerData, address: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500"
                    placeholder="Toshkent sh., Chilonzor t."
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition flex items-center justify-center gap-2"
              >
                Davom etish <ArrowRight className="w-5 h-5" />
              </button>

              <p className="text-center text-sm text-gray-500">
                Allaqachon ro'yxatdan o'tganmisiz?{' '}
                <Link to="/login" className="text-primary-600 hover:underline font-medium">
                  Kirish
                </Link>
              </p>
            </form>
          )}

          {/* Step 1 (yakka o'qituvchi yo'li): birlashtirilgan forma */}
          {step === 1 && registrationType === 'solo' && (
            <form onSubmit={handleSoloSubmit} className="space-y-6">
              <button
                type="button"
                onClick={() => { setStep(0); setRegistrationType(null); }}
                className="text-sm text-gray-400 hover:text-gray-600"
              >
                ← Orqaga
              </button>
              <div className="text-center mb-6">
                <User className="w-12 h-12 text-primary-600 mx-auto mb-2" />
                <h2 className="text-xl font-bold text-gray-900">Yakka o'qituvchi ma'lumotlari</h2>
                <p className="text-gray-500 text-sm">O'zingiz haqingizda ma'lumot kiriting</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To'liq ism *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={soloData.fullName}
                    onChange={(e) => setSoloData({ ...soloData, fullName: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500"
                    placeholder="Ism Familiya"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">O'qitadigan fani *</label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={soloData.subject}
                    onChange={(e) => setSoloData({ ...soloData, subject: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500"
                    placeholder="Masalan: Matematika"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={soloData.phone}
                      onChange={(e) => setSoloData({ ...soloData, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500"
                      placeholder="+998901234567"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={soloData.email}
                      onChange={(e) => setSoloData({ ...soloData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500"
                      placeholder="admin@example.uz"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Manzil</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={soloData.address}
                    onChange={(e) => setSoloData({ ...soloData, address: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500"
                    placeholder="Toshkent sh., Chilonzor t."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Parol *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      value={soloData.password}
                      onChange={(e) => setSoloData({ ...soloData, password: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Parolni tasdiqlash *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      value={soloData.confirmPassword}
                      onChange={(e) => setSoloData({ ...soloData, confirmPassword: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Yaratilmoqda...
                  </>
                ) : (
                  <>Ro'yxatdan o'tish</>
                )}
              </button>
            </form>
          )}

          {/* Step 2 (markaz yo'li): Admin Info */}
          {step === 2 && registrationType === 'center' && (
            <form onSubmit={handleAdminSubmit} className="space-y-6">
              <div className="text-center mb-6">
                <User className="w-12 h-12 text-primary-600 mx-auto mb-2" />
                <h2 className="text-xl font-bold text-gray-900">Administrator ma'lumotlari</h2>
                <p className="text-gray-500 text-sm">Tizimga kirish uchun login ma'lumotlari</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To'liq ism *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={adminData.fullName}
                    onChange={(e) => setAdminData({ ...adminData, fullName: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500"
                    placeholder="Ism Familiya"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={adminData.email}
                      onChange={(e) => setAdminData({ ...adminData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500"
                      placeholder="admin@example.uz"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={adminData.phone}
                      onChange={(e) => setAdminData({ ...adminData, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500"
                      placeholder="+998901234567"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Parol *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      value={adminData.password}
                      onChange={(e) => setAdminData({ ...adminData, password: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Parolni tasdiqlash *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      value={adminData.confirmPassword}
                      onChange={(e) => setAdminData({ ...adminData, confirmPassword: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition"
                >
                  Orqaga
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Yaratilmoqda...
                    </>
                  ) : (
                    <>Ro'yxatdan o'tish</>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Tabriklaymiz! 🎉</h2>
              <p className="text-gray-500 mb-6">
                <strong>{displayName}</strong> muvaffaqiyatli ro'yxatdan o'tdi.
              </p>

              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-semibold text-gray-900 mb-2">Kirish ma'lumotlari:</h3>
                <p className="text-sm text-gray-600">
                  <strong>Email:</strong> {displayEmail}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Parol:</strong> Siz kiritgan parol
                </p>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-semibold text-blue-900 mb-2">🎁 30 kunlik bepul sinov</h3>
                <p className="text-sm text-blue-700">
                  Sizga 30 kunlik bepul sinov muddati berildi. Bu davr ichida barcha funksiyalardan foydalanishingiz mumkin.
                </p>
              </div>

              <button
                onClick={() => navigate('/login')}
                className="w-full py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition"
              >
                Tizimga kirish
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-primary-200 text-sm mt-6">
          © 2024 EduCenter. Barcha huquqlar himoyalangan.
        </p>
      </div>
    </div>
  );
};

export default Register;
