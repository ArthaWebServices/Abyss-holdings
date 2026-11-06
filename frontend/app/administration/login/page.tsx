'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/api';
import Logo from '@/components/Logo';

export default function AdminLoginPage() {
  const router = useRouter();
  const [creds, setCreds] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setErr('');
    try {
      const data = await login(creds.username, creds.password);
      localStorage.setItem('admin_token', data.token);
      router.push('/administration');
    } catch (error: any) {
      const msg = error?.response?.data?.error || 
        (error?.message === 'Network Error' 
          ? 'Cannot connect to backend server. Make sure backend is running on port 5000.'
          : 'Invalid username or password.');
      setErr(msg);
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-4" style={{ marginRight: 0 }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Logo size={56} />
          <p className="mt-3 font-black text-white text-xl">ABYSS HOLDINGS</p>
          <p className="text-gray-400 text-xs tracking-widest uppercase mt-1">Admin Panel</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-2xl">
          <h2 className="font-bold text-dark text-lg mb-6 text-center">Sign In</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block uppercase tracking-wider">Username</label>
              <input type="text" required autoFocus
                value={creds.username}
                onChange={e => setCreds(c => ({ ...c, username: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                placeholder="admin" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block uppercase tracking-wider">Password</label>
              <input type="password" required
                value={creds.password}
                onChange={e => setCreds(c => ({ ...c, password: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                placeholder="••••••••" />
            </div>
          </div>
          {err && <p className="text-red-500 text-xs mt-3 text-center">{err}</p>}
          <button type="submit" disabled={loading}
            className="w-full mt-6 py-3.5 bg-primary text-white rounded-xl font-semibold text-sm hover:opacity-90 disabled:opacity-60 transition-all">
            {loading ? 'Signing in…' : 'Sign In →'}
          </button>
          <p className="text-center text-xs text-gray-400 mt-4">
            Authorized Personnel Only
          </p>
        </form>
      </div>
    </div>
  );
}


