'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';

export default function LoginPage() {
    const router = useRouter();
    const [isRegister, setIsRegister] = useState(false);
    const [form, setForm] = useState({ email: '', password: '', full_name: '', role: 'rescue_team' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isRegister) {
                await api.register(form.email, form.password, form.full_name, form.role);
            } else {
                await api.login(form.email, form.password);
            }

            const user = api.getUser();
            if (user?.role === 'command_center' || user?.role === 'admin') {
                router.push('/dashboard');
            } else {
                router.push('/rescue');
            }
        } catch (err) {
            setError(err.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    // Demo login for testing without backend
    const handleDemoLogin = (role) => {
        const demoUser = {
            id: 'demo-' + role,
            email: `demo@resqtrack.io`,
            full_name: role === 'command_center' ? 'Command Admin' : 'Alpha Team Lead',
            role,
        };
        api.setToken('demo-token-' + Date.now());
        api.setUser(demoUser);
        router.push(role === 'command_center' ? '/dashboard' : '/rescue');
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-red-600/8 rounded-full blur-[150px]" />
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-600/8 rounded-full blur-[150px]" />
            </div>

            <div className="relative w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-lg shadow-red-500/20">
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                            </svg>
                        </div>
                        <span className="text-2xl font-bold text-white">Res<span className="text-red-500">Q</span>Track</span>
                    </Link>
                    <p className="text-sm text-slate-400 mt-2">
                        {isRegister ? 'Create your account' : 'Sign in to your account'}
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8 shadow-2xl">
                    {error && (
                        <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {isRegister && (
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
                                <input
                                    type="text"
                                    value={form.full_name}
                                    onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-slate-800/80 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-colors"
                                    placeholder="Commander Smith"
                                    required={isRegister}
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                className="w-full px-4 py-2.5 bg-slate-800/80 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-colors"
                                placeholder="you@resqtrack.io"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
                            <input
                                type="password"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                className="w-full px-4 py-2.5 bg-slate-800/80 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-colors"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {isRegister && (
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">Role</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { value: 'rescue_team', label: '🚑 Rescue Team', desc: 'Field operations' },
                                        { value: 'command_center', label: '🏢 Command Center', desc: 'Coordination' },
                                    ].map(r => (
                                        <button
                                            key={r.value}
                                            type="button"
                                            onClick={() => setForm({ ...form, role: r.value })}
                                            className={`p-3 rounded-xl border text-left transition-all ${form.role === r.value
                                                    ? 'bg-red-600/10 border-red-500/40 text-white'
                                                    : 'bg-slate-800/50 border-slate-600/30 text-slate-400 hover:border-slate-500'
                                                }`}
                                        >
                                            <p className="text-sm font-medium">{r.label}</p>
                                            <p className="text-[10px] text-slate-500 mt-0.5">{r.desc}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-wait text-white font-semibold rounded-xl shadow-lg shadow-red-600/20 hover:shadow-red-600/30 transition-all"
                        >
                            {loading ? 'Authenticating...' : isRegister ? 'Create Account' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-4 text-center">
                        <button
                            onClick={() => { setIsRegister(!isRegister); setError(''); }}
                            className="text-sm text-slate-400 hover:text-red-400 transition-colors"
                        >
                            {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Register"}
                        </button>
                    </div>

                    {/* Demo Access */}
                    <div className="mt-6 pt-6 border-t border-slate-700/50">
                        <p className="text-xs text-slate-500 text-center mb-3">Quick Demo Access</p>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => handleDemoLogin('command_center')}
                                className="px-3 py-2 text-xs font-medium bg-blue-600/10 text-blue-400 border border-blue-500/20 rounded-lg hover:bg-blue-600/20 transition-colors"
                            >
                                🏢 Command Center
                            </button>
                            <button
                                onClick={() => handleDemoLogin('rescue_team')}
                                className="px-3 py-2 text-xs font-medium bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 rounded-lg hover:bg-emerald-600/20 transition-colors"
                            >
                                🚑 Rescue Team
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
