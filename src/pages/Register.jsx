import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, Building2, User, Mail, Phone, Lock, MapPin, ArrowRight, CheckCircle } from 'lucide-react';
import { centersAPI } from '../services/api';
import { toast } from 'react-toastify';

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Center info, 2: Admin info, 3: Success
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
      const res = await centersAPI.createWithAdmin(centerData, adminData, adminData.password);
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
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step >= s ? 'bg-white text-primary-600' : 'bg-primary-500 text-primary-200'
              }`}>
                {step > s ? <CheckCircle className="w-6 h-6" /> : s}
              </div>
              {s < 3 && (
                <div className={`w-16 h-1 ${step > s ? 'bg-white' : 'bg-primary-500'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Step 1: Center Info */}
          {step === 1 && (
            <form onSubmit={handleCenterSubmit} className="space-y-6">
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

          {/* Step 2: Admin Info */}
          {step === 2 && (
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
                <strong>{centerData.name}</strong> muvaffaqiyatli ro'yxatdan o'tdi.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-semibold text-gray-900 mb-2">Kirish ma'lumotlari:</h3>
                <p className="text-sm text-gray-600">
                  <strong>Email:</strong> {adminData.email}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Parol:</strong> Siz kiritgan parol
                </p>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-semibold text-blue-900 mb-2">🎁 7 kunlik bepul sinov</h3>
                <p className="text-sm text-blue-700">
                  Sizga 14 kunlik bepul sinov muddati berildi. Bu davr ichida barcha funksiyalardan foydalanishingiz mumkin.
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
