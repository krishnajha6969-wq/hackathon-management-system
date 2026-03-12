'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { IncidentCard, StatusBadge } from '@/components/Cards';

const INITIAL_INCIDENTS = [
    { id: '1', title: 'Building Collapse - Sector 5', latitude: 28.6150, longitude: 77.2100, severity: 'critical', description: 'Multi-story building collapsed after earthquake. Multiple casualties reported. First responders on scene. Need additional rescue teams with heavy equipment.', incident_type: 'structural', status: 'in_progress', assigned_team_name: 'Bravo Medical', reporter_name: 'Field Unit 7', created_at: new Date(Date.now() - 3600000).toISOString(), updated_at: new Date(Date.now() - 1800000).toISOString() },
    { id: '2', title: 'Flood Water Rising - River Bank', latitude: 28.6250, longitude: 77.2200, severity: 'high', description: 'Water level rising rapidly in residential area. Over 200 residents need immediate evacuation. Boats requested.', incident_type: 'flood', status: 'reported', assigned_team_name: null, reporter_name: 'Local Authority', created_at: new Date(Date.now() - 1800000).toISOString(), updated_at: new Date(Date.now() - 1800000).toISOString() },
    { id: '3', title: 'Road Blocked - Highway 44', latitude: 28.6080, longitude: 77.2250, severity: 'medium', description: 'Large debris from collapsed overpass blocking both lanes. Alternate routes available but congested.', incident_type: 'blockage', status: 'reported', assigned_team_name: null, reporter_name: 'Traffic Patrol', created_at: new Date(Date.now() - 900000).toISOString(), updated_at: new Date(Date.now() - 900000).toISOString() },
    { id: '4', title: 'Medical Emergency - Relief Camp', latitude: 28.6320, longitude: 77.2050, severity: 'high', description: 'Acute water shortage. 15 people with dehydration symptoms. Medical supplies running low.', incident_type: 'medical', status: 'in_progress', assigned_team_name: 'Charlie Ambulance', reporter_name: 'Camp Manager', created_at: new Date(Date.now() - 600000).toISOString(), updated_at: new Date(Date.now() - 300000).toISOString() },
    { id: '5', title: 'Gas Leak - Industrial Zone', latitude: 28.6220, longitude: 77.1980, severity: 'critical', description: 'Chemical plant reporting hazardous gas leak. 500m evacuation zone established. HAZMAT team requested.', incident_type: 'hazmat', status: 'reported', assigned_team_name: null, reporter_name: 'Plant Security', created_at: new Date(Date.now() - 300000).toISOString(), updated_at: new Date(Date.now() - 300000).toISOString() },
    { id: '6', title: 'Trapped Survivors - Metro Station', latitude: 28.6170, longitude: 77.2180, severity: 'critical', description: 'Underground metro station partially collapsed. Signals from survivors detected. Need specialized rescue equipment.', incident_type: 'structural', status: 'reported', assigned_team_name: null, reporter_name: 'Metro Authority', created_at: new Date(Date.now() - 120000).toISOString(), updated_at: new Date(Date.now() - 120000).toISOString() },
];

export default function IncidentsPage() {
    const [incidents, setIncidents] = useState(INITIAL_INCIDENTS);
    const [filter, setFilter] = useState({ status: '', severity: '' });
    const [showCreate, setShowCreate] = useState(false);
    const [selectedIncident, setSelectedIncident] = useState(null);
    const [newIncident, setNewIncident] = useState({
        title: '', description: '', severity: 'medium', incident_type: 'general',
        latitude: '', longitude: '',
    });

    const filteredIncidents = incidents.filter(i => {
        if (filter.status && i.status !== filter.status) return false;
        if (filter.severity && i.severity !== filter.severity) return false;
        return true;
    });

    const handleCreate = (e) => {
        e.preventDefault();
        const incident = {
            ...newIncident,
            id: Date.now().toString(),
            status: 'reported',
            assigned_team_name: null,
            reporter_name: 'You',
            latitude: parseFloat(newIncident.latitude) || 28.615 + Math.random() * 0.02,
            longitude: parseFloat(newIncident.longitude) || 77.210 + Math.random() * 0.02,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };
        setIncidents([incident, ...incidents]);
        setShowCreate(false);
        setNewIncident({ title: '', description: '', severity: 'medium', incident_type: 'general', latitude: '', longitude: '' });
    };

    const handleStatusChange = (id, newStatus) => {
        setIncidents(prev => prev.map(i =>
            i.id === id ? { ...i, status: newStatus, updated_at: new Date().toISOString() } : i
        ));
        if (selectedIncident?.id === id) {
            setSelectedIncident(prev => ({ ...prev, status: newStatus }));
        }
    };

    const severityCounts = {
        critical: incidents.filter(i => i.severity === 'critical').length,
        high: incidents.filter(i => i.severity === 'high').length,
        medium: incidents.filter(i => i.severity === 'medium').length,
        low: incidents.filter(i => i.severity === 'low').length,
    };

    return (
        <div className="min-h-screen bg-slate-950">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Incident Management</h1>
                        <p className="text-sm text-slate-400 mt-1">{incidents.length} total incidents • {incidents.filter(i => i.status === 'reported').length} awaiting response</p>
                    </div>
                    <button
                        onClick={() => setShowCreate(true)}
                        className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-red-600/15 transition-all flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Report Incident
                    </button>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                    {Object.entries(severityCounts).map(([sev, count]) => {
                        const colors = {
                            critical: 'from-red-600/20 to-red-900/10 border-red-500/20',
                            high: 'from-orange-600/20 to-orange-900/10 border-orange-500/20',
                            medium: 'from-yellow-600/20 to-yellow-900/10 border-yellow-500/20',
                            low: 'from-green-600/20 to-green-900/10 border-green-500/20',
                        };
                        return (
                            <div key={sev} className={`bg-gradient-to-br ${colors[sev]} p-4 rounded-xl border`}>
                                <p className="text-2xl font-bold text-white">{count}</p>
                                <p className="text-xs text-slate-400 capitalize">{sev} Severity</p>
                            </div>
                        );
                    })}
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-2 mb-6">
                    <select
                        value={filter.status}
                        onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                        className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white"
                    >
                        <option value="">All Statuses</option>
                        <option value="reported">Reported</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                    </select>
                    <select
                        value={filter.severity}
                        onChange={(e) => setFilter({ ...filter, severity: e.target.value })}
                        className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white"
                    >
                        <option value="">All Severities</option>
                        <option value="critical">Critical</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>
                </div>

                {/* Incident Table / List */}
                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-3">
                        {filteredIncidents.map(incident => (
                            <div
                                key={incident.id}
                                onClick={() => setSelectedIncident(incident)}
                                className={`cursor-pointer transition-all ${selectedIncident?.id === incident.id ? 'ring-2 ring-red-500/50 rounded-xl' : ''}`}
                            >
                                <IncidentCard incident={incident} />
                            </div>
                        ))}
                        {filteredIncidents.length === 0 && (
                            <div className="text-center py-12 text-slate-500">No incidents match the selected filters.</div>
                        )}
                    </div>

                    {/* Detail Panel */}
                    <div className="bg-slate-900/80 rounded-2xl border border-slate-700/50 p-5 h-fit sticky top-20">
                        {selectedIncident ? (
                            <>
                                <div className="flex items-start justify-between gap-2 mb-4">
                                    <h2 className="text-lg font-bold text-white">{selectedIncident.title}</h2>
                                    <StatusBadge status={selectedIncident.severity} />
                                </div>
                                <p className="text-sm text-slate-400 mb-4">{selectedIncident.description}</p>

                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Status</span>
                                        <StatusBadge status={selectedIncident.status} size="xs" />
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Type</span>
                                        <span className="text-slate-300 capitalize">{selectedIncident.incident_type}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Assigned</span>
                                        <span className="text-slate-300">{selectedIncident.assigned_team_name || 'Unassigned'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Reported by</span>
                                        <span className="text-slate-300">{selectedIncident.reporter_name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Location</span>
                                        <span className="text-slate-300 font-mono text-xs">{selectedIncident.latitude?.toFixed(4)}, {selectedIncident.longitude?.toFixed(4)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Reported</span>
                                        <span className="text-slate-300">{new Date(selectedIncident.created_at).toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="mt-5 pt-4 border-t border-slate-700/50 space-y-2">
                                    <p className="text-xs text-slate-500 mb-2">Update Status</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {['reported', 'in_progress', 'resolved', 'closed'].map(st => (
                                            <button
                                                key={st}
                                                onClick={() => handleStatusChange(selectedIncident.id, st)}
                                                disabled={selectedIncident.status === st}
                                                className={`px-3 py-2 text-xs font-medium rounded-lg capitalize transition-colors ${selectedIncident.status === st
                                                        ? 'bg-red-600/20 text-red-400 border border-red-500/30'
                                                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700'
                                                    }`}
                                            >
                                                {st.replace('_', ' ')}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-slate-500 text-sm">Select an incident to view details</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Create Incident Modal */}
            {showCreate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-lg shadow-2xl">
                        <h3 className="text-lg font-bold text-white mb-4">Report New Incident</h3>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm text-slate-300 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={newIncident.title}
                                    onChange={(e) => setNewIncident({ ...newIncident, title: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:border-red-500/50"
                                    placeholder="Brief incident title"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-300 mb-1">Description</label>
                                <textarea
                                    value={newIncident.description}
                                    onChange={(e) => setNewIncident({ ...newIncident, description: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:border-red-500/50 h-24 resize-none"
                                    placeholder="Detailed description of the incident..."
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-slate-300 mb-1">Severity</label>
                                    <select
                                        value={newIncident.severity}
                                        onChange={(e) => setNewIncident({ ...newIncident, severity: e.target.value })}
                                        className="w-full px-3 py-2.5 bg-slate-800 border border-slate-600 rounded-xl text-white text-sm"
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                        <option value="critical">Critical</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-300 mb-1">Type</label>
                                    <select
                                        value={newIncident.incident_type}
                                        onChange={(e) => setNewIncident({ ...newIncident, incident_type: e.target.value })}
                                        className="w-full px-3 py-2.5 bg-slate-800 border border-slate-600 rounded-xl text-white text-sm"
                                    >
                                        <option value="general">General</option>
                                        <option value="structural">Structural</option>
                                        <option value="flood">Flood</option>
                                        <option value="medical">Medical</option>
                                        <option value="blockage">Road Blockage</option>
                                        <option value="hazmat">Hazmat</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-slate-300 mb-1">Latitude</label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={newIncident.latitude}
                                        onChange={(e) => setNewIncident({ ...newIncident, latitude: e.target.value })}
                                        className="w-full px-3 py-2.5 bg-slate-800 border border-slate-600 rounded-xl text-white text-sm"
                                        placeholder="28.6150"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-300 mb-1">Longitude</label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={newIncident.longitude}
                                        onChange={(e) => setNewIncident({ ...newIncident, longitude: e.target.value })}
                                        className="w-full px-3 py-2.5 bg-slate-800 border border-slate-600 rounded-xl text-white text-sm"
                                        placeholder="77.2100"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowCreate(false)}
                                    className="flex-1 py-2.5 text-sm text-slate-400 bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors"
                                >
                                    Report Incident
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
