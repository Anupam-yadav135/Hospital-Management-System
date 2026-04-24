import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Calendar, Banknote, FileText, Activity, Clock } from 'lucide-react';

const DashboardPatient = ({ stats }) => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatientData();
  }, []);

  const fetchPatientData = async () => {
    try {
      const [aptRes, docRes] = await Promise.all([
        api.get('/appointments/getAll'),
        api.get('/doctors/getAllDoctors')
      ]);
      setAppointments(aptRes.data.data || []);
      setDoctors(docRes.data.data || []);
    } catch (err) {
      console.error("Failed to fetch patient dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  const nextApt = appointments
    .filter(a => a.status === 'Scheduled')
    .sort((a, b) => new Date(a.appointment_date) - new Date(b.appointment_date))[0];

  const patientStatCards = [
    { title: 'My Appointments', value: stats.appointments ?? 0, icon: Calendar, color: 'var(--primary-color)', bg: 'rgba(14, 165, 233, 0.1)' },
    { title: 'Pending Bills', value: stats.bills ?? 0, icon: Banknote, color: 'var(--danger-color)', bg: 'rgba(239, 68, 68, 0.1)' },
    { title: 'Medical Reports', value: stats.records ?? 0, icon: FileText, color: 'var(--success-color)', bg: 'rgba(16, 185, 129, 0.1)' }
  ];

  return (
    <div className="flex flex-col gap-6 w-full">
        <div>
          <h1 className="h1">Patient Dashboard</h1>
        </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {patientStatCards.map((stat, i) => (
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
           <h3 className="h3 mb-6">Upcoming Appointment</h3>
            <div className={`p-6 rounded-xl text-white flex flex-col md:flex-row gap-4 items-start md:items-center justify-between ${nextApt ? 'bg-primary' : 'bg-slate-400'}`}>
              <div className="flex flex-wrap items-center gap-6">
                 <div className="p-4 bg-white/20 rounded-lg">
                    <Calendar size={32} />
                 </div>
                 {nextApt ? (
                   <div>
                      <h4 className="text-xl font-bold">{new Date(nextApt.appointment_date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</h4>
                      <p className="opacity-80">{nextApt.appointment_time} - {nextApt.doctor_name || 'Clinical Staff'}</p>
                   </div>
                 ) : (
                   <div className="flex flex-col gap-1 py-1">
                      <h4 className="text-xl font-bold text-white">No Sessions Scheduled</h4>
                      <p className="text-sm opacity-90 text-white/90">Your medical journey is up to date. Feel free to book a consultation anytime.</p>
                   </div>
                 )}
              </div>
              {nextApt && (
                <div className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full font-bold whitespace-nowrap">
                   <Clock size={18} /> {nextApt.appointment_time}
                </div>
              )}
            </div>
            
            <div className="mt-8">
               <h4 className="font-bold mb-4">Available Care Team</h4>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {loading ? (
                    <div className="col-span-full py-4 text-center text-muted">Scanning medical staff...</div>
                  ) : doctors.length > 0 ? (
                    doctors.slice(0, 3).map((doc, i) => (
                      <div key={doc.doctor_id || i} className="p-4 border rounded-lg flex items-center gap-3 hover:border-primary transition-colors cursor-pointer bg-white/50">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-primary font-bold">DR</div>
                        <div>
                           <p className="font-bold small">{doc.name}</p>
                           <p className="small text-muted">{doc.specialization || 'Clinical Staff'}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-4 text-center text-muted">No specialized staff found in your sector.</div>
                  )}
               </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPatient;
