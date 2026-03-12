'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import { IncidentCard, TeamCard, StatusBadge } from '@/components/Cards';

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false });

// Demo data for standalone operation
const DEMO_TEAMS = [
    { id: '1', vehicle_id: 'RV-001', team_name: 'Alpha Rescue', latitude: 28.6139, longitude: 77.2090, status: 'available', incident_title: null },
    { id: '2', vehicle_id: 'RV-002', team_name: 'Bravo Medical', latitude: 28.6200, longitude: 77.2150, status: 'responding', incident_title: 'Building Collapse - Sector 5' },
    { id: '3', vehicle_id: 'AMB-001', team_name: 'Charlie Ambulance', latitude: 28.6100, longitude: 77.2300, status: 'busy', incident_title: 'Medical Emergency' },
    { id: '4', vehicle_id: 'RV-003', team_name: 'Delta Relief', latitude: 28.6300, longitude: 77.2000, status: 'available', incident_title: null },
    { id: '5', vehicle_id: 'AMB-002', team_name: 'Echo Ambulance', latitude: 28.6050, longitude: 77.1950, status: 'available', incident_title: null },
    { id: '6', vehicle_id: 'RV-004', team_name: 'Foxtrot SAR', latitude: 28.6180, longitude: 77.2220, status: 'responding', incident_title: 'Flood Water Rising' },
];

const DEMO_INCIDENTS = [
    { id: '1', title: 'Building Collapse - Sector 5', latitude: 28.6150, longitude: 77.2100, severity: 'critical', description: 'Multi-story building collapsed. Multiple casualties reported. Urgent rescue needed.', status: 'in_progress', assigned_team_name: 'Bravo Medical', created_at: new Date(Date.now() - 3600000).toISOString() },
    { id: '2', title: 'Flood Water Rising - River Bank', latitude: 28.6250, longitude: 77.2200, severity: 'high', description: 'Water level rising rapidly near residential area. 200+ residents need evacuation.', status: 'reported', assigned_team_name: null, created_at: new Date(Date.now() - 1800000).toISOString() },
    { id: '3', title: 'Road Blocked - Highway 44', latitude: 28.6080, longitude: 77.2250, severity: 'medium', description: 'Debris blocking main highway. Rescue vehicles cannot pass through.', status: 'reported', assigned_team_name: null, created_at: new Date(Date.now() - 900000).toISOString() },
    { id: '4', title: 'Medical Emergency - Relief Camp', latitude: 28.6320, longitude: 77.2050, severity: 'high', description: 'Multiple injuries at camp. Need medical teams urgently.', status: 'in_progress', assigned_team_name: 'Charlie Ambulance', created_at: new Date(Date.now() - 600000).toISOString() },
    { id: '5', title: 'Gas Leak - Industrial Zone', latitude: 28.6220, longitude: 77.1980, severity: 'critical', description: 'Chemical plant reporting gas leak. Evacuation zone expanding.', status: 'reported', assigned_team_name: null, created_at: new Date(Date.now() - 300000).toISOString() },
];

const DEMO_CONGESTION = [
    { id: '1', road_segment: 'Highway 44 - Section A', latitude: 28.6100, longitude: 77.2150, vehicle_density: 8, average_speed: 5.2, status: 'congested' },
    { id: '2', road_segment: 'Ring Road - Junction B', latitude: 28.6200, longitude: 77.2100, vehicle_density: 4, average_speed: 18.5, status: 'moderate' },
    { id: '3', road_segment: 'Relief Route - Sector 12', latitude: 28.6280, longitude: 77.2300, vehicle_density: 6, average_speed: 8.1, status: 'congested' },
];

export default function DashboardPage() {
    const [teams, setTeams] = useState(DEMO_TEAMS);
    const [incidents, setIncidents] = useState(DEMO_INCIDENTS);
    const [congestion, setCongestion] = useState(DEMO_CONGESTION);
    const [activePanel, setActivePanel] = useState('incidents');
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [showAssignModal, setShowAssignModal] = useState(null);

    // Simulate real-time movement
    useEffect(() => {
        const interval = setInterval(() => {
            setTeams(prev => prev.map(t => ({
                ...t,
                latitude: t.latitude + (Math.random() - 0.5) * 0.001,
                longitude: t.longitude + (Math.random() - 0.5) * 0.001,
            })));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const handleAssign = (incident) => {
        setShowAssignModal(incident);
    };

    const confirmAssign = (incidentId, teamId) => {
        setIncidents(prev => prev.map(i =>
            i.id === incidentId ? { ...i, status: 'in_progress', assigned_team_name: teams.find(t => t.id === teamId)?.team_name } : i
        ));
        setTeams(prev => prev.map(t =>
            t.id === teamId ? { ...t, status: 'responding' } : t
        ));
        setShowAssignModal(null);
    };

    const statusCounts = {
        available: teams.filter(t => t.status === 'available').length,
        responding: teams.filter(t => t.status === 'responding').length,
        busy: teams.filter(t => t.status === 'busy').length,
    };

    const incidentCounts = {
        critical: incidents.filter(i => i.severity === 'critical').length,
        active: incidents.filter(i => i.status !== 'resolved' && i.status !== 'closed').length,
        unassigned: incidents.filter(i => !i.assigned_team_name).length,
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col">
            <Navbar />

            <div className="flex-1 flex flex-col lg:flex-row">
                {/* Main Map Area */}
                <div className="flex-1 relative">
                    {/* Status Bar */}
                    <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap gap-2">
                        <div className="glass px-4 py-2 rounded-xl flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                                <span className="text-xs text-slate-300">{statusCounts.available} Available</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                                <span className="text-xs text-slate-300">{statusCounts.responding} Responding</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                                <span className="text-xs text-slate-300">{statusCounts.busy} Busy</span>
                            </div>
                        </div>
                        <div className="glass px-4 py-2 rounded-xl flex items-center gap-3">
                            <span className="text-xs text-red-400 font-semibold">{incidentCounts.critical} Critical</span>
                            <span className="text-xs text-slate-500">|</span>
                            <span className="text-xs text-amber-400">{incidentCounts.unassigned} Unassigned</span>
                        </div>
                    </div>

                    <MapView
                        teams={teams}
                        incidents={incidents}
                        congestion={congestion}
                        center={[28.615, 77.210]}
                        zoom={14}
                        height="100%"
                        className="min-h-[400px] lg:min-h-0"
                    />
                </div>

                {/* Side Panel */}
                <div className="w-full lg:w-96 bg-slate-900/95 border-l border-slate-700/50 flex flex-col max-h-[50vh] lg:max-h-none overflow-hidden">
                    {/* Panel Tabs */}
                    <div className="flex border-b border-slate-700/50 px-2 pt-2">
                        {[
                            { key: 'incidents', label: 'Incidents', count: incidentCounts.active },
                            { key: 'teams', label: 'Teams', count: teams.length },
                            { key: 'congestion', label: 'Traffic', count: congestion.length },
                        ].map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setActivePanel(tab.key)}
                                className={`flex-1 px-3 py-2.5 text-xs font-medium rounded-t-lg transition-colors ${activePanel === tab.key
                                        ? 'bg-slate-800 text-white border-t-2 border-red-500'
                                        : 'text-slate-400 hover:text-slate-300'
                                    }`}
                            >
                                {tab.label}
                                <span className={`ml-1.5 px-1.5 py-0.5 text-[10px] rounded-full ${activePanel === tab.key ? 'bg-red-600/20 text-red-400' : 'bg-slate-700 text-slate-500'
                                    }`}>
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Panel Content */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-2">
                        {activePanel === 'incidents' && incidents.map(incident => (
                            <IncidentCard key={incident.id} incident={incident} onAssign={handleAssign} />
                        ))}
                        {activePanel === 'teams' && teams.map(team => (
                            <TeamCard key={team.id} team={team} />
                        ))}
                        {activePanel === 'congestion' && congestion.map(zone => (
                            <div key={zone.id} className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/50">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-sm font-semibold text-white">{zone.road_segment}</h3>
                                    <StatusBadge status={zone.status} size="xs" />
                                </div>
                                <div className="flex items-center gap-4 text-xs text-slate-400">
                                    <span>🚗 {zone.vehicle_density} vehicles</span>
                                    <span>⚡ {zone.average_speed} km/h</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Assign Modal */}
            {showAssignModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <h3 className="text-lg font-bold text-white mb-1">Assign Team</h3>
                        <p className="text-sm text-slate-400 mb-4">Select a team for: {showAssignModal.title}</p>

                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            {teams.filter(t => t.status === 'available').map(team => (
                                <button
                                    key={team.id}
                                    onClick={() => confirmAssign(showAssignModal.id, team.id)}
                                    className="w-full flex items-center justify-between p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors text-left"
                                >
                                    <div>
                                        <p className="text-sm font-medium text-white">{team.team_name}</p>
                                        <p className="text-xs text-slate-400">{team.vehicle_id}</p>
                                    </div>
                                    <StatusBadge status={team.status} size="xs" />
                                </button>
                            ))}
                            {teams.filter(t => t.status === 'available').length === 0 && (
                                <p className="text-sm text-slate-500 text-center py-4">No available teams</p>
                            )}
                        </div>

                        <button
                            onClick={() => setShowAssignModal(null)}
                            className="mt-4 w-full py-2 text-sm text-slate-400 hover:text-white bg-slate-800 rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
