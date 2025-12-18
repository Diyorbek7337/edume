import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, GraduationCap } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button, Input, Card } from '../common';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      navigate('/dashboard');
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
