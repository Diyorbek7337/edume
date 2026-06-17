import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Phone, Lock, GraduationCap, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button, Card } from '../common';

// Phone input → possible email candidates (student first, then parent, then direct email)
const resolveEmailCandidates = (input) => {
  const trimmed = input.trim();
  if (trimmed.includes('@')) return [trimmed];

  const digits = trimmed.replace(/\D/g, '');
  let phone = digits;
  if (digits.length === 9) phone = '998' + digits;
  else if (digits.length === 10 && digits.startsWith('0')) phone = '998' + digits.slice(1);

  // Try new format first, then old format for backward compat
  return [`${phone}@student.edu`, `${phone}@parent.edu`, `parent${phone}@edu.local`];
};

const CREDENTIAL_ERRORS = new Set([
  'auth/invalid-credential',
  'auth/user-not-found',
  'auth/wrong-password',
]);

const Login = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const isPhoneInput = !login.includes('@');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const trimmed = login.trim();
    if (trimmed.includes('@') && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed)) {
      setError("Email format noto'g'ri. Masalan: admin@email.com");
      setLoading(false);
      return;
    }

    const candidates = resolveEmailCandidates(login);
    let lastErr = null;

    for (const candidate of candidates) {
      try {
        const result = await signIn(candidate, password);
        if (result.role === 'super_admin') {
          navigate('/super-admin');
        } else {
          navigate('/dashboard');
        }
        return;
      } catch (err) {
        lastErr = err;
        if (!CREDENTIAL_ERRORS.has(err.code)) break;
      }
    }

    if (CREDENTIAL_ERRORS.has(lastErr?.code)) {
      setError(isPhoneInput ? "Telefon raqam yoki parol noto'g'ri" : "Email yoki parol noto'g'ri");
    } else {
      setError("Kirishda xatolik yuz berdi");
    }
    setLoading(false);
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
          <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">Tizimga kirish</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* Login field — phone or email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefon yoki Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  inputMode="text"
                  placeholder="901234567"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  required
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Masalan: 901234567 yoki admin@email.com
              </p>
            </div>

            {/* Password field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Parol
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-9 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Forgot password hint */}
            <p className="text-xs text-gray-400 text-right">
              Parolni unutdingizmi? Administrator bilan bog'laning.
            </p>

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
        </Card>

        <p className="text-center text-primary-200 text-sm mt-6">
          © 2024 EduCenter. Barcha huquqlar himoyalangan.
        </p>
      </div>
    </div>
  );
};

export default Login;
