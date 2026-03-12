'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';

const features = [
  {
    icon: '📡',
    title: 'Real-Time GPS Tracking',
    desc: 'Track every rescue vehicle, ambulance, and relief team on a live map with sub-second updates.',
  },
  {
    icon: '🚧',
    title: 'Congestion Detection',
    desc: 'Automatically detect when routes are congested and suggest alternate paths for rescue vehicles.',
  },
  {
    icon: '📋',
    title: 'Incident Management',
    desc: 'Report, assign, and track incidents from the field with severity-based prioritization.',
  },
  {
    icon: '📡',
    title: 'Offline-First Operation',
    desc: 'Continue working without internet. Data syncs automatically when connectivity returns.',
  },
  {
    icon: '🗺️',
    title: 'Smart Route Navigation',
    desc: 'Get optimized routes that avoid blocked roads, flooded areas, and congestion zones.',
  },
  {
    icon: '🔗',
    title: 'Device-to-Device Sync',
    desc: 'Share critical updates between nearby devices using local wireless communication.',
  },
];

const workflowSteps = [
  { num: '01', title: 'Mission Assigned', desc: 'Command center assigns rescue team to an incident', color: 'from-blue-500 to-cyan-500' },
  { num: '02', title: 'GPS Tracking Begins', desc: 'Mobile app tracks vehicle location in real-time', color: 'from-cyan-500 to-emerald-500' },
  { num: '03', title: 'Route Analyzed', desc: 'System detects congestion and suggests optimal paths', color: 'from-emerald-500 to-yellow-500' },
  { num: '04', title: 'Incidents Reported', desc: 'Field teams report blockages and emergencies', color: 'from-yellow-500 to-orange-500' },
  { num: '05', title: 'Local Data Shared', desc: 'Nearby devices exchange updates without internet', color: 'from-orange-500 to-red-500' },
  { num: '06', title: 'Data Synchronized', desc: 'When online, all data syncs to command center', color: 'from-red-500 to-pink-500' },
];

const stats = [
  { value: '500+', label: 'Vehicles Tracked' },
  { value: '<2s', label: 'Dashboard Load' },
  { value: '99.9%', label: 'Uptime SLA' },
  { value: '50ms', label: 'Update Latency' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 mb-8">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-sm text-red-400 font-medium">Emergency Response Technology</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              <span className="text-white">Smart Disaster</span>
              <br />
              <span className="text-gradient">Response Coordination</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Real-time tracking, congestion-aware routing, and offline-first coordination
              for rescue teams operating in disaster zones.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/login"
                className="group px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-lg shadow-red-600/25 hover:shadow-red-600/40 transition-all flex items-center gap-2"
              >
                Launch Command Center
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link
                href="#features"
                className="px-8 py-3.5 bg-slate-800/80 hover:bg-slate-700/80 text-white font-semibold rounded-xl border border-slate-700 hover:border-slate-600 transition-all"
              >
                Explore Features
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16 max-w-2xl mx-auto">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              The Crisis of Uncoordinated Rescue
            </h2>
            <p className="text-slate-400 text-lg">
              During disasters, communication failures lead to duplicated efforts,
              missed victims, and delayed response — costing lives.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: '🔴', problem: 'Blind Teams', detail: 'Rescue teams cannot see live locations of other teams in the field' },
              { icon: '🚗', problem: 'Route Congestion', detail: 'Multiple vehicles enter same routes causing gridlock in disaster zones' },
              { icon: '⏰', problem: 'Delayed Response', detail: 'Some disaster zones receive critically delayed assistance' },
              { icon: '📵', problem: 'Network Failure', detail: 'Mobile networks become weak or unavailable when most needed' },
            ].map((item, i) => (
              <div key={i} className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/50 hover:border-red-500/30 transition-colors group">
                <span className="text-3xl">{item.icon}</span>
                <h3 className="text-white font-semibold mt-3 mb-2 group-hover:text-red-400 transition-colors">{item.problem}</h3>
                <p className="text-sm text-slate-400">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Platform Capabilities</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Every feature built for life-critical situations where seconds matter.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="group relative bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 hover:border-red-500/30 transition-all hover:-translate-y-1 duration-300"
              >
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-red-400 transition-colors">
                  {f.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">System Workflow</h2>
            <p className="text-slate-400 text-lg">From mission assignment to synchronized coordination</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workflowSteps.map((step, i) => (
              <div key={i} className="relative bg-slate-800/60 p-6 rounded-2xl border border-slate-700/50">
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${step.color} mb-4`}>
                  <span className="text-white text-sm font-bold">{step.num}</span>
                </div>
                <h3 className="text-white font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-slate-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-3xl border border-slate-700/50 p-8 sm:p-12">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">Built for Extreme Conditions</h2>
                <p className="text-slate-400 mb-6">
                  ResQTrack is engineered to operate in the harshest disaster scenarios with
                  offline-first architecture and future Starlink satellite integration readiness.
                </p>
                <div className="space-y-3">
                  {[
                    'Offline-first with IndexedDB & Service Workers',
                    'WebSocket real-time updates under 500ms',
                    'Supports 10,000+ simultaneous vehicles',
                    'Role-based access with JWT authentication',
                    'Future-ready for Starlink satellite connectivity',
                  ].map((t, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      </div>
                      <span className="text-sm text-slate-300">{t}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {['React & Next.js', 'Node.js & Express', 'PostgreSQL', 'Socket.io', 'Leaflet Maps', 'IndexedDB'].map((tech, i) => (
                  <div key={i} className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/50 text-center">
                    <p className="text-sm font-medium text-white">{tech}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Save Lives?
          </h2>
          <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
            Deploy ResQTrack for your emergency response organization and coordinate
            rescue operations with unprecedented efficiency.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-10 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold text-lg rounded-xl shadow-2xl shadow-red-600/20 hover:shadow-red-600/40 transition-all"
          >
            Get Started Now
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-slate-400">ResQTrack</span>
          </div>
          <p className="text-xs text-slate-600">© 2026 ResQTrack. Saving lives through technology.</p>
        </div>
      </footer>
    </div>
  );
}
