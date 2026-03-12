'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Navbar() {
    const pathname = usePathname();
    const [user, setUser] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('resqtrack_user');
        if (stored) setUser(JSON.parse(stored));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('resqtrack_token');
        localStorage.removeItem('resqtrack_user');
        window.location.href = '/login';
    };

    const navLinks = user ? [
        { href: '/dashboard', label: 'Command Center', roles: ['command_center', 'admin'] },
        { href: '/incidents', label: 'Incidents', roles: ['command_center', 'admin', 'rescue_team'] },
        { href: '/rescue', label: 'Field Ops', roles: ['rescue_team'] },
        { href: '/analytics', label: 'Analytics', roles: ['command_center', 'admin'] },
    ].filter(link => link.roles.includes(user.role)) : [];

    const isActive = (href) => pathname === href;

    return (
        <nav className="bg-slate-900/95 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href={user ? '/dashboard' : '/'} className="flex items-center gap-2 group">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-lg shadow-red-500/20 group-hover:shadow-red-500/40 transition-shadow">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold text-white tracking-tight">
                            Res<span className="text-red-500">Q</span>Track
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive(link.href)
                                        ? 'bg-red-600/20 text-red-400 border border-red-500/30'
                                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center gap-3">
                        {/* Status Indicator */}
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-xs text-slate-400">Online</span>
                        </div>

                        {user ? (
                            <div className="flex items-center gap-3">
                                <div className="hidden sm:block text-right">
                                    <p className="text-sm font-medium text-white">{user.full_name}</p>
                                    <p className="text-xs text-slate-400 capitalize">{user.role?.replace('_', ' ')}</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-red-600 hover:text-white rounded-lg border border-slate-700 hover:border-red-500 transition-all"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-lg shadow-red-600/20 hover:shadow-red-600/40 transition-all"
                            >
                                Sign In
                            </Link>
                        )}

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                {mobileOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Nav */}
                {mobileOpen && (
                    <div className="md:hidden py-3 border-t border-slate-700/50">
                        {navLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive(link.href)
                                        ? 'bg-red-600/20 text-red-400'
                                        : 'text-slate-300 hover:bg-slate-800'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </nav>
    );
}
