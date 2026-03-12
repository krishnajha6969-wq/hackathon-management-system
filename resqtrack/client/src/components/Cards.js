export function StatusBadge({ status, size = 'sm' }) {
    const colors = {
        // Team statuses
        available: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        responding: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        busy: 'bg-red-500/20 text-red-400 border-red-500/30',
        offline: 'bg-slate-500/20 text-slate-400 border-slate-500/30',

        // Incident statuses
        reported: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        in_progress: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        resolved: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        closed: 'bg-slate-500/20 text-slate-400 border-slate-500/30',

        // Severity
        critical: 'bg-red-500/20 text-red-400 border-red-500/30',
        high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
        medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        low: 'bg-green-500/20 text-green-400 border-green-500/30',

        // Congestion
        clear: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        moderate: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        congested: 'bg-red-500/20 text-red-400 border-red-500/30',
    };

    const sizes = {
        xs: 'px-1.5 py-0.5 text-[10px]',
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-3 py-1 text-sm',
    };

    return (
        <span className={`inline-flex items-center rounded-full font-semibold border capitalize ${colors[status] || colors.offline} ${sizes[size]}`}>
            {status?.replace('_', ' ')}
        </span>
    );
}

export function IncidentCard({ incident, onAssign, onStatusChange, compact = false }) {
    const severityIcon = {
        critical: '🔴',
        high: '🟠',
        medium: '🟡',
        low: '🟢',
    };

    return (
        <div className={`bg-slate-800/80 backdrop-blur rounded-xl border border-slate-700/50 hover:border-slate-600/50 transition-all ${compact ? 'p-3' : 'p-4'}`}>
            <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className={`font-semibold text-white ${compact ? 'text-sm' : 'text-base'}`}>
                    {severityIcon[incident.severity]} {incident.title}
                </h3>
                <StatusBadge status={incident.severity} size="xs" />
            </div>

            {!compact && incident.description && (
                <p className="text-sm text-slate-400 mb-3 line-clamp-2">{incident.description}</p>
            )}

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <StatusBadge status={incident.status} size="xs" />
                    {incident.assigned_team_name && (
                        <span className="text-xs text-slate-500">→ {incident.assigned_team_name}</span>
                    )}
                </div>
                <span className="text-[10px] text-slate-500">
                    {new Date(incident.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>

            {!compact && onAssign && incident.status === 'reported' && (
                <button
                    onClick={() => onAssign(incident)}
                    className="mt-3 w-full px-3 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                    Assign Team
                </button>
            )}
        </div>
    );
}

export function TeamCard({ team, onStatusChange, compact = false }) {
    return (
        <div className={`bg-slate-800/80 backdrop-blur rounded-xl border border-slate-700/50 hover:border-slate-600/50 transition-all ${compact ? 'p-3' : 'p-4'}`}>
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${team.status === 'available' ? 'bg-emerald-400' :
                            team.status === 'responding' ? 'bg-amber-400 animate-pulse' :
                                team.status === 'busy' ? 'bg-red-400' : 'bg-slate-500'
                        }`} />
                    <h3 className="font-semibold text-white text-sm">{team.team_name}</h3>
                </div>
                <StatusBadge status={team.status} size="xs" />
            </div>

            <div className="space-y-1">
                <p className="text-xs text-slate-400">
                    <span className="text-slate-500">Vehicle:</span> {team.vehicle_id}
                </p>
                {team.incident_title && (
                    <p className="text-xs text-amber-400">
                        <span className="text-slate-500">Mission:</span> {team.incident_title}
                    </p>
                )}
                {team.latitude && (
                    <p className="text-[10px] text-slate-500 font-mono">
                        {team.latitude?.toFixed(4)}, {team.longitude?.toFixed(4)}
                    </p>
                )}
            </div>

            {!compact && onStatusChange && (
                <div className="flex gap-1 mt-3">
                    {['available', 'busy', 'responding'].map(status => (
                        <button
                            key={status}
                            onClick={() => onStatusChange(team.id, status)}
                            disabled={team.status === status}
                            className={`flex-1 px-2 py-1 text-[10px] font-medium rounded capitalize transition-colors ${team.status === status
                                    ? 'bg-slate-700 text-slate-400 cursor-default'
                                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
