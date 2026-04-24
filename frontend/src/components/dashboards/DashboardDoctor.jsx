import React, { useState, useEffect } from 'react';
import { Calendar, UserRound, Clock, ClipboardList, CheckCircle2 } from 'lucide-react';
import api from '../../api';

const DashboardDoctor = ({ stats }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLiveSchedule();
  }, []);

  const fetchLiveSchedule = async () => {
    try {
      const res = await api.get('/appointments/getAll');
      setAppointments(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch doctor schedule", err);
    } finally {
      setLoading(false);
    }
  };

  const doctorStatCards = [
    { title: 'My Total Patients', value: stats.patients ?? 0, icon: UserRound, color: 'var(--primary-color)', bg: 'rgba(14, 165, 233, 0.1)' },
    { title: "Today's Appointments", value: stats.appointments ?? 0, icon: Calendar, color: 'var(--success-color)', bg: 'rgba(16, 185, 129, 0.1)' },
    { title: 'Pending Records', value: stats.records ?? 0, icon: ClipboardList, color: 'var(--warning-color)', bg: 'rgba(245, 158, 11, 0.1)' }
  ];

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="h1">Doctor's Workspace</h1>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {doctorStatCards.map((stat, i) => (
          <div key={i} className="layered-card flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div style={{ background: stat.bg, color: stat.color, padding: '0.8rem', borderRadius: '12px' }}>
                <stat.icon size={24} />
              </div>
            </div>
            <div>
              <h2 className="h1" style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>{stat.value}</h2>
              <p className="small uppercase font-bold text-muted">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="layered-card flex-1">
           <h3 className="h3 mb-6">Today's Schedule</h3>
           <div className="flex flex-col gap-4">
              {loading ? (
                <div className="p-12 text-center text-muted italic">Synchronizing schedule...</div>
              ) : appointments.length > 0 ? (
                appointments.map((apt, i) => (
                  <div key={apt.appointment_id || i} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-lg border border-slate-100/50 hover:bg-white hover:shadow-md transition-all">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-center justify-center p-2 bg-white rounded-xl border border-slate-200 min-w-[90px]">
                        <Clock size={14} className="text-primary mb-1" />
                        <span className="small font-bold">{apt.appointment_time || '00:00'}</span>
                        <span style={{ fontSize: '0.65rem', opacity: 0.6 }}>{new Date(apt.appointment_date).toLocaleDateString()}</span>
                      </div>
                      <div>
                        <p className="font-bold">{apt.patient_name || 'Anonymous Patient'}</p>
                        <p className="small text-muted">Clinical Consultation</p>
                      </div>
                    </div>
                    <span className={`badge ${apt.status === 'Completed' ? 'badge-success' : apt.status === 'Scheduled' ? 'badge-primary' : 'badge-warning'}`}>
                      {apt.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-muted italic">No appointments scheduled for today.</div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardDoctor;
