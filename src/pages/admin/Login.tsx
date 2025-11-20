import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiPost, setToken } from '@/lib/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e: any) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await apiPost('/auth/login', { email, password });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        setError(json.error || 'Login failed');
        setLoading(false);
        return;
      }
      const data = await res.json();
      setToken(data.token);
      navigate('/admin');
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/80 dark:bg-slate-900/80 backdrop-blur rounded-lg shadow-lg border border-slate-200 dark:border-slate-800 p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-xl mb-2">SD</div>
          <h1 className="text-2xl font-extrabold">Administration</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Connecte-toi pour accéder au tableau de bord</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="admin@example.com"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Mot de passe</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="••••••••"
            />
          </label>

          <div className="flex items-center justify-between">
            <button
              disabled={loading || !email || !password}
              className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-white ${loading || !email || !password ? 'bg-indigo-300' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
            <a className="text-sm text-slate-500 hover:underline" href="#">Mot de passe oublié ?</a>
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default Login;
