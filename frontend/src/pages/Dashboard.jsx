import React, { useEffect, useState } from 'react';
import api from '../api';
import DashboardAdmin from '../components/dashboards/DashboardAdmin';
import DashboardDoctor from '../components/dashboards/DashboardDoctor';
import DashboardPatient from '../components/dashboards/DashboardPatient';

const Dashboard = () => {
  const [stats, setStats] = useState({
    patients: 0,
    doctors: 0,
    appointments: 0,
    rooms: 0,
    bills: 0,
    records: 0,
    doctorsList: []
  });
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState({ role: 'patient' });

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        setUser(JSON.parse(userString));
      } catch (e) {
        console.error("Failed to parse user");
      }
    }

    const fetchStats = async () => {
      try {
        // Stats call logic
        const pReq = api.get('/patients').catch(() => ({ data: { data: [] } }));
        const dReq = api.get('/doctors/getAllDoctors').catch(() => ({ data: { data: [] } }));
        const rReq = api.get('/rooms').catch(() => ({ data: { data: [] } }));
        const aReq = api.get('/appointments/getAll').catch(() => ({ data: { data: [] } }));
        const bReq = api.get('/bills').catch(() => ({ data: { data: [] } }));
        const recReq = api.get('/medical-records/getAll').catch(() => ({ data: { data: [] } }));
        
        const [pRes, dRes, rRes, aRes, bRes, recRes] = await Promise.all([pReq, dReq, rReq, aReq, bReq, recReq]);
        
        setStats({
          patients: Array.isArray(pRes.data) ? pRes.data.length : (pRes.data.data?.length || 0),
          doctors: (dRes.data.data && Array.isArray(dRes.data.data)) ? dRes.data.data.length : 0,
          appointments: (aRes.data.data && Array.isArray(aRes.data.data)) ? aRes.data.data.length : 0,
          rooms: (rRes.data.data && Array.isArray(rRes.data.data)) ? rRes.data.data.length : 0,
          bills: (bRes.data.data && Array.isArray(bRes.data.data)) ? bRes.data.data.length : 0,
          records: (recRes.data.data && Array.isArray(recRes.data.data)) ? recRes.data.data.length : 0,
          doctorsList: dRes.data.data || []
        });
      } catch (err) {
        console.error("Failed to fetch stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-6 text-center text-muted">Synchronizing Hospital Ecosystem...</div>;

  if (user.role === 'admin') return <DashboardAdmin stats={stats} />;
  if (user.role === 'doctor') return <DashboardDoctor stats={stats} />;
  
  return <DashboardPatient stats={stats} />;
};

export default Dashboard;
