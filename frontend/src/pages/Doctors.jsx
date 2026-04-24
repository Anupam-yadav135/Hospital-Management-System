import React, { useEffect, useState } from 'react';
import api from '../api';
import Modal from '../components/Modal';
import { Stethoscope, UserPlus, Edit2, Trash2, Activity, Search } from 'lucide-react';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentDoctor, setCurrentDoctor] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', specialization: '', phone: '', password: 'password123' });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) setUser(JSON.parse(userString));
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await api.get('/doctors/getAllDoctors');
      setDoctors(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/signup', { 
        name: formData.name, 
        email: formData.email, 
        password: formData.password, 
        role: 'doctor',
        specialization: formData.specialization,
        phone: formData.phone
      });
      // Further doctor details can be updated via PUT /doctors/:id if needed
      setIsAddModalOpen(false);
      setFormData({ name: '', email: '', specialization: '', phone: '', password: 'password123' });
      fetchDoctors();
    } catch (err) {
      const errorMsg = err.response && err.response.data && err.response.data.message 
        ? err.response.data.message 
        : err.message;
      alert('Error adding doctor: ' + errorMsg);
    }
  };

  const handleEditDoctor = async (e) => {
    e.preventDefault();
    if (!window.confirm('Save changes to the doctor profile?')) return;
    try {
      await api.put(`/doctors/updateDoctor/${currentDoctor.doctor_id}`, formData);
      setIsEditModalOpen(false);
      fetchDoctors();
      alert('Doctor profile updated successfully!');
    } catch (err) {
      alert('Error updating doctor');
    }
  };

  const handleDeleteDoctor = async (id) => {
    if (window.confirm('Delete doctor profile and active records?')) {
      try {
        await api.delete(`/doctors/deleteDoctor/${id}`);
        fetchDoctors();
      } catch (err) {
        alert('Error deleting doctor');
      }
    }
  };

  const openEditModal = (d) => {
    setCurrentDoctor(d);
    setFormData({ name: d.name, specialization: d.specialization, phone: d.phone });
    setIsEditModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-6 w-full min-h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="h1">Medical Staff</h1>
          <p className="p mt-2">Manage the doctors directory and specializations.</p>
        </div>
        {user?.role === 'admin' && (
          <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
             <UserPlus size={18} className="mr-2" /> Add Doctor
          </button>
        )}
      </div>

      <div className="card-premium flex-grow" style={{ padding: 0, border: 'none', background: 'transparent', overflow: 'visible' }}>
        <div className="border-beam"></div>
        <div className="p-8 glass-panel flex items-center justify-between rounded-t-3xl border-b border-white/20" style={{ background: 'rgba(255, 255, 255, 0.4)' }}>
           <div className="relative flex-1 max-w-md">
              <input 
                type="text" 
                placeholder="Search physicians or specialties..." 
                className="input-field w-full transition-all duration-300" 
                style={{ background: 'white', border: '1px solid var(--glass-border)', cursor: 'text' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
           </div>
        </div>

        <div className="p-4 rounded-b-3xl" style={{ overflowY: 'visible' }}>
          {loading ? (
            <div className="p-24 text-center">
               <Activity className="mx-auto mb-6 text-primary animate-pulse" size={48} />
               <p className="h3" style={{ opacity: 0.5 }}>Retrieving Specialist Profiles...</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto', overflowY: 'visible' }}>
              <table className="table-premium">
                <thead>
                  <tr>
                    <th>Medical Profile</th>
                    <th>Clinical Professional</th>
                    <th>Neural Email</th>
                    <th>Specialization Core</th>
                    <th>Contact Link</th>
                    {user?.role !== 'patient' && <th className="text-right">Operations</th>}
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const filtered = doctors.filter(d => 
                      (d.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                      (d.specialization || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                      (d.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                      (d.phone || '').toLowerCase().includes(searchQuery.toLowerCase())
                    );
                    return filtered.length > 0 ? filtered.map(d => (
                      <tr key={d.doctor_id}>
                        <td>
                          <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
                             <Stethoscope size={24} />
                          </div>
                        </td>
                        <td className="font-extrabold text-slate-800">{d.name}</td>
                        <td className="text-muted font-medium">{d.email || d.phone || 'N/A'}</td>
                        <td><span className="badge-glow badge-glow-primary" style={{ color: '#2563eb' }}>{d.specialization}</span></td>
                        <td className="font-mono">{d.phone || 'N/A'}</td>
                        {user?.role !== 'patient' && (
                          <td className="text-right">
                            <div className="flex justify-end gap-3">
                               <button className="btn-glass p-3 hover:scale-110" onClick={() => openEditModal(d)}><Edit2 size={18} /></button>
                               {user?.role === 'admin' && (
                                 <button className="btn-glass p-3 hover:bg-red-500 hover:text-white border-red-200" onClick={() => handleDeleteDoctor(d.doctor_id)}><Trash2 size={18} /></button>
                               )}
                            </div>
                          </td>
                        )}
                      </tr>
                    )) : (
                      <tr><td colSpan="5" className="p-12 text-center text-muted italic">{searchQuery ? 'No matching specialists found.' : 'No registered experts found.'}</td></tr>
                    );
                  })()}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Doctor">
        <form onSubmit={handleAddDoctor} className="flex flex-col gap-4">
          <div className="input-wrapper">
            <label className="form-label">Doctor Name</label>
            <input name="name" type="text" className="input-field" required onChange={handleInputChange} />
          </div>
          <div className="input-wrapper">
            <label className="form-label">Email Address</label>
            <input name="email" type="email" className="input-field" required onChange={handleInputChange} />
          </div>
          <div className="input-wrapper">
             <label className="form-label">Specialization</label>
             <input name="specialization" type="text" className="input-field" placeholder="e.g. Cardiology" onChange={handleInputChange} />
          </div>
          <div className="input-wrapper">
             <label className="form-label">Phone Number</label>
             <input name="phone" type="text" className="input-field" onChange={handleInputChange} />
          </div>
          <button type="submit" className="btn btn-primary w-full mt-4">Create Doctor Account</button>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Update Doctor Details">
        <form onSubmit={handleEditDoctor} className="flex flex-col gap-4">
          <div className="input-wrapper">
            <label className="form-label">Doctor Name</label>
            <input name="name" type="text" value={formData.name} className="input-field" onChange={handleInputChange} />
          </div>
          <div className="input-wrapper">
             <label className="form-label">Specialization</label>
             <input name="specialization" type="text" value={formData.specialization} className="input-field" onChange={handleInputChange} />
          </div>
          <div className="input-wrapper">
             <label className="form-label">Phone Number</label>
             <input name="phone" type="text" value={formData.phone} className="input-field" onChange={handleInputChange} />
          </div>
          <button type="submit" className="btn btn-primary w-full mt-4">Save Changes</button>
        </form>
      </Modal>
    </div>
  );
};

export default Doctors;
