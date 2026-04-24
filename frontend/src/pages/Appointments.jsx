import React, { useEffect, useState } from 'react';
import api from '../api';
import Modal from '../components/Modal';
import { Calendar, Plus, Edit, Trash2, CheckCircle, XCircle, Search } from 'lucide-react';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [doctors, setDoctors] = useState([]); // For patient booking

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({ doctor_id: '', appointment_date: '', appointment_time: '', status: 'Scheduled' });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) setUser(JSON.parse(userString));
    fetchAppointments();
    fetchDoctors();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await api.get('/appointments/getAll');
      setAppointments(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    const res = await api.get('/doctors/getAllDoctors');
    setDoctors(res.data.data || []);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddAppointment = async (e) => {
    e.preventDefault();
    if (!window.confirm('Do you want to confirm this appointment booking?')) return;
    try {
      await api.post('/appointments/createAppointment', formData);
      setIsAddModalOpen(false);
      fetchAppointments();
      alert('Appointment booked successfully!');
    } catch (err) {
      alert('Error booking appointment: ' + err.message);
    }
  };

  const updateStatus = async (id, newStatus) => {
    if (!window.confirm(`Are you sure you want to mark this appointment as ${newStatus}?`)) return;
    try {
      await api.put(`/appointments/updateAppointment/${id}`, { status: newStatus });
      fetchAppointments();
      alert(`Appointment marked as ${newStatus}`);
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Cancel and remove this appointment record?')) {
      try {
        await api.delete(`/appointments/deleteAppointment/${id}`);
        fetchAppointments();
      } catch (err) {
        alert('Error deleting appointment');
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full min-h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="h1">Appointments</h1>
          <p className="p">Manage consultations and schedule timings.</p>
        </div>
        {user?.role === 'patient' && (
          <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
             <Plus size={18} className="mr-2" /> Book Appointment
          </button>
        )}
      </div>

      <div className="layered-card flex-grow" style={{ padding: 0, overflowY: 'visible', overflowX: 'auto' }}>
        <div className="p-4 border-b rounded-t-3xl" style={{ background: 'var(--glass-border)' }}>
           <div className="relative max-w-sm">
              <input 
                type="text" 
                placeholder="Search patient, doctor or status..." 
                className="input-field w-full transition-all duration-300" 
                style={{ background: 'white', border: '1px solid var(--glass-border)', cursor: 'text' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
           </div>
        </div>
        {loading ? (
          <div className="p-6 text-center">Fetching Schedule...</div>
        ) : (
          <table className="table-premium">
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                {user?.role !== 'patient' && <th>Patient</th>}
                {user?.role !== 'doctor' && <th>Doctor</th>}
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.filter(a => 
                a.patient_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                a.doctor_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                a.status?.toLowerCase().includes(searchQuery.toLowerCase())
              ).map(a => (
                <tr key={a.appointment_id}>
                  <td className="font-bold">{new Date(a.appointment_date).toLocaleDateString()}</td>
                  <td>{a.appointment_time}</td>
                  {user?.role !== 'patient' && <td>{a.patient_name}</td>}
                  {user?.role !== 'doctor' && <td className="font-bold text-primary">{a.doctor_name}</td>}
                  <td>
                    <span className={`badge ${a.status === 'Completed' ? 'badge-success' : a.status === 'Cancelled' ? 'badge-danger' : 'badge-warning'}`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="flex justify-end gap-2">
                       {(user?.role === 'doctor' || user?.role === 'admin') && a.status === 'Scheduled' && (
                         <>
                           <button className="btn btn-outline p-1" style={{ color: 'var(--success-color)' }} onClick={() => updateStatus(a.appointment_id, 'Completed')}><CheckCircle size={16} /></button>
                           <button className="btn btn-outline p-1" style={{ color: 'var(--danger-color)' }} onClick={() => updateStatus(a.appointment_id, 'Cancelled')}><XCircle size={16} /></button>
                         </>
                       )}
                       {user?.role === 'admin' && (
                         <button className="p-2 hover:bg-red-50 rounded text-danger" onClick={() => handleDelete(a.appointment_id)}><Trash2 size={16} /></button>
                       )}
                    </div>
                  </td>
                </tr>
              ))}
              {appointments.filter(a => 
                a.patient_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                a.doctor_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                a.status?.toLowerCase().includes(searchQuery.toLowerCase())
              ).length === 0 && (
                <tr><td colSpan="6" className="p-6 text-center text-muted">{searchQuery ? 'No matching appointments found.' : 'No appointments found.'}</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Book Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Schedule New Appointment">
        <form onSubmit={handleAddAppointment} className="flex flex-col gap-4">
           <div className="input-wrapper">
              <label className="form-label">Select Doctor</label>
              <select name="doctor_id" className="input-field" required onChange={handleInputChange}>
                 <option value="">Choose a specialist...</option>
               {doctors.map(d => (
                 <option key={d.doctor_id} value={d.doctor_id}>{d.name} ({d.specialization})</option>
               ))}
              </select>
           </div>
           <div className="input-wrapper">
              <label className="form-label">Date</label>
              <input name="appointment_date" type="date" className="input-field" required onChange={handleInputChange} />
           </div>
           <div className="input-wrapper">
              <label className="form-label">Preferred Time</label>
              <input name="appointment_time" type="time" className="input-field" required onChange={handleInputChange} />
           </div>
           <button type="submit" className="btn btn-primary w-full mt-4">Confirm Appointment</button>
        </form>
      </Modal>
    </div>
  );
};

export default Appointments;
