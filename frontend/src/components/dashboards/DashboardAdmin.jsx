import React from 'react';
import { Users, UserRound, Calendar, Bed, Activity, TrendingUp, Stethoscope, Banknote } from 'lucide-react';

const DashboardAdmin = ({ stats }) => {
  const adminStatCards = [
    { title: 'Total Patients', value: stats?.patients ?? 0, icon: UserRound, color: 'var(--primary)', bg: 'rgba(37, 99, 235, 0.1)' },
    { title: 'Active Doctors', value: stats?.doctors ?? 0, icon: Users, color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' },
    { title: 'Room Utilization', value: stats?.rooms ?? 0, icon: Bed, color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' }
  ];
  
  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="h1">Hospital Overview</h1>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
        {adminStatCards.map((stat, i) => (
          <div key={i} className="card-premium">
            <div className="border-beam"></div>
            <div className="flex items-center justify-between mb-6">
              <div style={{ background: stat.bg, color: stat.color, padding: '0.8rem', borderRadius: '16px', boxShadow: `0 4px 12px ${stat.bg}` }}>
                <stat.icon size={26} strokeWidth={2.5} />
              </div>
              <div className="badge-glow badge-glow-success" style={{ fontSize: '0.65rem' }}>
                 <TrendingUp size={12} className="mr-1" /> +4.2%
              </div>
            </div>
            <div>
               <h2 className="h1" style={{ fontSize: '2.5rem', marginBottom: '0.5rem', letterSpacing: '-0.05em' }}>{stat.value}</h2>
               <p className="p" style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.6 }}>{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="card-premium flex-1">
           <div className="border-beam"></div>
           <div className="flex items-center justify-between mb-8">
             <h3 className="h2" style={{ fontSize: '1.25rem' }}>Medical Personnel Pulse</h3>
             <button className="btn-glass" style={{ scale: '0.85' }}>Live History</button>
           </div>
           <div className="flex flex-col gap-6">
             {stats.doctorsList && stats.doctorsList.map((d, i) => (
               <div key={d.doctor_id || i} className="flex items-center justify-between group">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-primary font-extrabold shadow-sm transition-all group-hover:scale-110 group-hover:rotate-6">
                      D{i + 1}
                    </div>
                    <div>
                       <p className="h3" style={{ fontSize: '1rem', margin: 0 }}>{d.name}</p>
                       <p className="p" style={{ fontSize: '0.85rem' }}>{d.specialization} • Signed In</p>
                    </div>
                  </div>
                  <div className="badge-glow badge-glow-success" style={{ fontSize: '0.65rem' }}>Active Now</div>
               </div>
             ))}
             {stats.doctorsList?.length === 0 && (
                <div className="text-center text-muted italic text-sm py-4">No active personnel found.</div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
