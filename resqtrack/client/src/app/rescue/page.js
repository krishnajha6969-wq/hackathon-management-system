'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import { StatusBadge } from '@/components/Cards';

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false });

const DEMO_MISSION = {
    id: 'm1',
    incident: {
        id: 'i1',
        title: 'Building Collapse - Sector 5',
        latitude: 28.6150,
        longitude: 77.2100,
        severity: 'critical',
        description: 'Multi-story building collapsed. Multiple casualties. Need rescue with heavy equipment.',
    },
    status: 'en_route',
    started_at: new Date(Date.now() - 1200000).toISOString(),
};

export default function RescuePage() {
    const [teamStatus, setTeamStatus] = useState('responding');
    const [mission, setMission] = useState(DEMO_MISSION);
    const [position, setPosition] = useState({ lat: 28.6139, lng: 77.2090 });
    const [showReportModal, setShowReportModal] = useState(false);
    const [isOnline, setIsOnline] = useState(true);
    const [reportForm, setReportForm] = useState({ title: '', description: '', severity: 'medium', type: 'general' });

    // Simulate GPS movement toward incident
    useEffect(() => {
        const interval = setInterval(() => {
            setPosition(prev => {
                const target = mission.incident;
                const dx = (target.latitude - prev.lat) * 0.02;
                const dy = (target.longitude - prev.lng) * 0.02;
                return { lat: prev.lat + dx + (Math.random() - 0.5) * 0.0003, lng: prev.lng + dy + (Math.random() - 0.5) * 0.0003 };
            });
        }, 2000);
        return () => clearInterval(interval);
    }, [mission]);

    // Simulate online/offline
    useEffect(() => {
        const handle = () => setIsOnline(navigator.onLine);
        window.addEventListener('online', handle);
        window.addEventListener('offline', handle);
        return () => { window.removeEventListener('online', handle); window.removeEventListener('offline', handle); };
    }, []);

    const handleStatusChange = (status) => {
        setTeamStatus(status);
    };

    const handleReport = (e) => {
        e.preventDefault();
        // In production, this would call the API or queue for offline sync
        setShowReportModal(false);
        setReportForm({ title: '', description: '', severity: 'medium', type: 'general' });
    };

    const distanceToTarget = () => {
        const R = 6371;
        const dLat = (mission.incident.latitude - position.lat) * Math.PI / 180;
        const dLng = (mission.incident.longitude - position.lng) * Math.PI / 180;
        const a = Math.sin(dLat / 2) ** 2 + Math.cos(position.lat * Math.PI / 180) * Math.cos(mission.incident.latitude * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
        return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 1000).toFixed(0);
    };

    const teamMarker = [{ id: 'self', vehicle_id: 'RV-001', team_name: 'You', latitude: position.lat, longitude: position.lng, status: teamStatus }];
    const incidentMarker = [mission.incident];

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col">
            <Navbar />

            <div className="flex-1 flex flex-col">
                {/* Status Bar */}
                <div className="bg-slate-900 border-b border-slate-700/50 px-4 py-3">
                    <div className="max-w-lg mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-emerald-400' : 'bg-red-400 animate-pulse'}`} />
                            <span className="text-sm text-slate-300">{isOnline ? 'Connected' : 'Offline Mode'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500">Status:</span>
                            <StatusBadge status={teamStatus} size="sm" />
                        </div>
                    </div>
                </div>

                {/* Map */}
                <div className="relative flex-1 min-h-[300px]">
                    <MapView
                        teams={teamMarker}
                        incidents={incidentMarker}
                        center={[position.lat, position.lng]}
                        zoom={15}
                        height="100%"
                    />

                    {/* ETA Overlay */}
                    <div className="absolute bottom-4 left-4 right-4 z-20">
                        <div className="glass rounded-2xl p-4 max-w-lg mx-auto">
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <p className="text-xs text-slate-400">Navigating to</p>
                                    <p className="text-sm font-semibold text-white">{mission.incident.title}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-bold text-red-400">{distanceToTarget()}m</p>
                                    <p className="text-[10px] text-slate-500">remaining</p>
                                </div>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-1.5">
                                <div className="bg-gradient-to-r from-red-500 to-amber-500 h-1.5 rounded-full transition-all" style={{ width: `${Math.max(10, 100 - parseInt(distanceToTarget()) / 20)}%` }} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mission Details & Actions */}
                <div className="bg-slate-900 border-t border-slate-700/50">
                    <div className="max-w-lg mx-auto p-4 space-y-4">
                        {/* Mission Info */}
                        <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/50">
                            <div className="flex items-start justify-between gap-2 mb-2">
                                <h3 className="text-sm font-bold text-white">{mission.incident.title}</h3>
                                <StatusBadge status={mission.incident.severity} size="xs" />
                            </div>
                            <p className="text-xs text-slate-400 mb-3">{mission.incident.description}</p>
                            <div className="flex items-center gap-4 text-xs text-slate-500">
                                <span>Started {new Date(mission.started_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                <span className="font-mono">{mission.incident.latitude.toFixed(4)}, {mission.incident.longitude.toFixed(4)}</span>
                            </div>
                        </div>

                        {/* Status Toggle */}
                        <div>
                            <p className="text-xs text-slate-500 mb-2">Update Your Status</p>
                            <div className="grid grid-cols-3 gap-2">
                                {['available', 'responding', 'busy'].map(s => (
                                    <button
                                        key={s}
                                        onClick={() => handleStatusChange(s)}
                                        className={`py-3 text-sm font-semibold rounded-xl capitalize transition-all ${teamStatus === s
                                                ? s === 'available' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' :
                                                    s === 'responding' ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20' :
                                                        'bg-red-600 text-white shadow-lg shadow-red-600/20'
                                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                            }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setShowReportModal(true)}
                                className="py-3.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                </svg>
                                Report Incident
                            </button>
                            <button
                                className="py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                </svg>
                                Road Blockage
                            </button>
                        </div>

                        {/* Offline Indicator */}
                        {!isOnline && (
                            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-amber-400">Offline Mode Active</p>
                                    <p className="text-xs text-slate-500">Data will sync when connection is restored</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Report Modal */}
            {showReportModal && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-slate-700 rounded-t-2xl sm:rounded-2xl p-6 w-full max-w-lg shadow-2xl">
                        <h3 className="text-lg font-bold text-white mb-4">Report Incident</h3>
                        <form onSubmit={handleReport} className="space-y-4">
                            <input
                                type="text"
                                value={reportForm.title}
                                onChange={(e) => setReportForm({ ...reportForm, title: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:border-red-500/50"
                                placeholder="Incident title"
                                required
                            />
                            <textarea
                                value={reportForm.description}
                                onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:border-red-500/50 h-20 resize-none"
                                placeholder="What happened?"
                                required
                            />
                            <div className="grid grid-cols-2 gap-3">
                                <select
                                    value={reportForm.severity}
                                    onChange={(e) => setReportForm({ ...reportForm, severity: e.target.value })}
                                    className="px-3 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white text-sm"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                    <option value="critical">Critical</option>
                                </select>
                                <select
                                    value={reportForm.type}
                                    onChange={(e) => setReportForm({ ...reportForm, type: e.target.value })}
                                    className="px-3 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white text-sm"
                                >
                                    <option value="general">General</option>
                                    <option value="structural">Structural</option>
                                    <option value="flood">Flood</option>
                                    <option value="medical">Medical</option>
                                    <option value="blockage">Blockage</option>
                                </select>
                            </div>
                            <div className="flex gap-3">
                                <button type="button" onClick={() => setShowReportModal(false)} className="flex-1 py-3 text-sm bg-slate-800 text-slate-400 rounded-xl hover:bg-slate-700">Cancel</button>
                                <button type="submit" className="flex-1 py-3 text-sm font-semibold bg-red-600 text-white rounded-xl hover:bg-red-700">Submit Report</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
