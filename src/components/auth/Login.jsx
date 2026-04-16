import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, GraduationCap, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button, Input, Card } from '../common';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../services/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotError('');
    setForgotLoading(true);
    try {
      await sendPasswordResetEmail(auth, forgotEmail);
      setForgotSuccess(true);
    } catch (err) {
      if (err.code === 'auth/user-not-found') setForgotError('Bu email bilan foydalanuvchi topilmadi');
      else if (err.code === 'auth/invalid-email') setForgotError("Email formati noto'g'ri");
      else setForgotError("Xatolik yuz berdi, qayta urinib ko'ring");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn(email, password);
      
      // Role ni tekshirish va to'g'ri joyga yo'naltirish
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.role === 'super_admin') {
          navigate('/super-admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      if (err.code === 'auth/user-not-found') setError('Bunday foydalanuvchi topilmadi');
      else if (err.code === 'auth/wrong-password') setError("Parol noto'g'ri");
      else if (err.code === 'auth/invalid-email') setError("Email formati noto'g'ri");
      else if (err.code === 'auth/invalid-credential') setError("Email yoki parol noto'g'ri");
      else setError('Kirishda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-lg mb-4">
            <GraduationCap className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-white">EduCenter</h1>
          <p className="text-primary-200 mt-1">O'quv markaz boshqaruv tizimi</p>
        </div>

        <Card>
          {!showForgot ? (
            <>
              <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">Tizimga kirish</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                    {error}
                  </div>
                )}
                <Input
                  label="Email"
                  type="email"
                  placeholder="email@example.com"
                  icon={Mail}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Input
                  label="Parol"
                  type="password"
                  placeholder="••••••••"
                  icon={Lock}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => { setShowForgot(true); setForgotEmail(email); setForgotSuccess(false); setForgotError(''); }}
                    className="text-sm text-primary-600 hover:underline"
                  >
                    Parolni unutdingizmi?
                  </button>
                </div>
                <Button type="submit" loading={loading} className="w-full">
                  Kirish
                </Button>
              </form>
              <div className="mt-6 pt-6 border-t text-center">
                <p className="text-gray-600 text-sm">
                  O'quv markazingiz yo'qmi?{' '}
                  <Link to="/register" className="text-primary-600 hover:underline font-semibold">
                    Ro'yxatdan o'ting
                  </Link>
                </p>
              </div>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => { setShowForgot(false); setForgotSuccess(false); setForgotError(''); }}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
              >
                <ArrowLeft className="w-4 h-4" /> Orqaga
              </button>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Parolni tiklash</h2>
              <p className="text-sm text-gray-500 mb-6">
                Emailingizni kiriting, tiklash havolasini yuboramiz.
              </p>
              {forgotSuccess ? (
                <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm text-center">
                  <p className="font-semibold mb-1">Havola yuborildi!</p>
                  <p>{forgotEmail} manziliga parol tiklash havolasi yuborildi. Inbox yoki spam papkasini tekshiring.</p>
                  <button
                    onClick={() => { setShowForgot(false); setForgotSuccess(false); }}
                    className="mt-3 text-primary-600 hover:underline font-medium"
                  >
                    Kirish sahifasiga qaytish
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  {forgotError && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                      {forgotError}
                    </div>
                  )}
                  <Input
                    label="Email"
                    type="email"
                    placeholder="email@example.com"
                    icon={Mail}
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                  />
                  <Button type="submit" loading={forgotLoading} className="w-full">
                    Tiklash havolasini yuborish
                  </Button>
                </form>
              )}
            </>
          )}
        </Card>

        <p className="text-center text-primary-200 text-sm mt-6">
          © 2024 EduCenter. Barcha huquqlar himoyalangan.
        </p>
      </div>
    </div>
  );
};

export default Login;
