import React, { useEffect, useState } from 'react';
import api from '../api';
import Modal from '../components/Modal';
import { Edit2, Trash2, UserPlus, Search, Activity } from 'lucide-react';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentPatient, setCurrentPatient] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', age: '', gender: 'Male', phone: '', address: '', password: 'password123' });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) setUser(JSON.parse(userString));
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await api.get('/patients');
      // Handle the data wrapper correctly
      setPatients(response.data.data || response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch patients. Ensure you have proper role authorization.');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddPatient = async (e) => {
    e.preventDefault();
    try {
      // First create User + Patient linked (using our updated signup logic)
      await api.post('/auth/signup', { 
        name: formData.name, 
        email: formData.email, 
        password: formData.password, 
        role: 'patient',
        age: formData.age,
        gender: formData.gender,
        phone: formData.phone,
        address: formData.address
      });
      // Optionally update the patient specific fields later, but our signup now handles basic creation
      setIsAddModalOpen(false);
      setFormData({ name: '', email: '', age: '', gender: 'Male', phone: '', address: '', password: 'password123' });
      fetchPatients();
    } catch (err) {
      const errorMsg = err.response && err.response.data && err.response.data.message 
        ? err.response.data.message 
        : err.message;
      alert('Error adding patient: ' + errorMsg);
    }
  };

  const handleEditPatient = async (e) => {
    e.preventDefault();
    if (!window.confirm('Are you sure you want to save these changes?')) return;
    try {
      await api.put(`/patients/updatePatient/${currentPatient.patient_id}`, formData);
      setIsEditModalOpen(false);
      fetchPatients();
      alert('Patient updated successfully!');
    } catch (err) {
      alert('Error updating patient: ' + err.message);
    }
  };

  const handleDeletePatient = async (id) => {
    if (window.confirm('Are you sure you want to remove this patient from the system?')) {
      try {
        await api.delete(`/patients/deletePatient/${id}`);
        fetchPatients();
      } catch (err) {
        alert('Error deleting patient');
      }
    }
  };

  const openEditModal = (p) => {
    setCurrentPatient(p);
    setFormData({ age: p.age, gender: p.gender, phone: p.phone, address: p.address });
    setIsEditModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="h1">Patients Directory</h1>
          <p className="p">Manage hospital patient records and health history.</p>
        </div>
        {user?.role === 'admin' && (
          <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
            <UserPlus size={18} className="mr-2" /> Add Patient
          </button>
        )}
      </div>

      <div className="card-premium min-h-full" style={{ padding: '0', background: 'transparent', border: 'none', overflow: 'visible' }}>
        <div className="border-beam"></div>
        <div className="p-8 glass-panel flex items-center justify-between rounded-t-3xl border-b border-white/20" style={{ background: 'rgba(255, 255, 255, 0.4)' }}>
            <div className="relative flex-1 max-w-md">
              <input 
                type="text" 
                placeholder="Search patient name, email or records..." 
                className="input-field w-full transition-all duration-300" 
                style={{ background: 'white', border: '1px solid var(--glass-border)', cursor: 'text' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
           </div>
           <div className="flex gap-4">
              <span className="badge-glow badge-glow-success">Live Stream</span>
           </div>
        </div>
        
        <div className="p-4 rounded-b-3xl" style={{ overflowY: 'visible' }}>
          {loading ? (
            <div className="p-24 text-center">
               <Activity className="mx-auto mb-6 text-primary animate-pulse" size={48} />
               <p className="h3" style={{ opacity: 0.5 }}>Synchronizing Medical Ecosystem...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center text-danger">{error}</div>
          ) : (
            <div style={{ overflowX: 'auto', overflowY: 'visible' }}>
              <table className="table-premium">
                <thead>
                  <tr>
                    <th>Patient Protocol</th>
                    <th>Identity Name</th>
                    <th>Neural Email</th>
                    <th>Biological Sex</th>
                    <th>Contact Link</th>
                    <th className="text-right">Administration</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.filter(p => 
                    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                    p.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.phone?.includes(searchQuery)
                  ).length > 0 ? patients.filter(p => 
                    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                    p.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.phone?.includes(searchQuery)
                  ).map((p, i) => (
                    <tr key={p.patient_id || i}>
                      <td className="small font-bold text-primary" style={{ letterSpacing: '0.1em' }}>PT-X{p.patient_id}</td>
                      <td className="font-extrabold text-slate-800">{p.name}</td>
                      <td className="text-muted font-medium">{p.email}</td>
                      <td><span className={`badge-glow ${p.gender === 'Male' ? 'badge-glow-success' : 'badge-glow-primary'}`} style={{ color: p.gender === 'Male' ? '#059669' : '#2563eb' }}>{p.gender}</span></td>
                      <td className="font-mono">{p.phone}</td>
                      <td className="text-right">
                        <div className="flex justify-end gap-4">
                           {user?.role !== 'patient' && (
                             <button className="btn-glass p-3 hover:scale-110" onClick={() => openEditModal(p)}><Edit2 size={18} /></button>
                           )}
                           {user?.role === 'admin' && (
                             <button className="btn-glass p-3 hover:bg-red-500 hover:text-white border-red-200" onClick={() => handleDeletePatient(p.patient_id)}><Trash2 size={18} /></button>
                           )}
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="6" className="p-12 text-center text-muted italic">No anomalies discovered in current sector.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Register New Patient">
        <form onSubmit={handleAddPatient} className="flex flex-col gap-4">
          <div className="input-wrapper">
            <label className="form-label">Full Name</label>
            <input name="name" type="text" className="input-field" required onChange={handleInputChange} />
          </div>
          <div className="input-wrapper">
            <label className="form-label">Email Address</label>
            <input name="email" type="email" className="input-field" required onChange={handleInputChange} />
          </div>
          <div className="flex gap-4">
            <div className="input-wrapper flex-1">
              <label className="form-label">Age</label>
              <input name="age" type="number" className="input-field" onChange={handleInputChange} />
            </div>
            <div className="input-wrapper flex-1">
              <label className="form-label">Gender</label>
              <select name="gender" className="input-field" onChange={handleInputChange}>
                 <option value="Male">Male</option>
                 <option value="Female">Female</option>
                 <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div className="input-wrapper">
            <label className="form-label">Phone Number</label>
            <input name="phone" type="text" className="input-field" onChange={handleInputChange} />
          </div>
          <button type="submit" className="btn btn-primary w-full mt-4">Save Patient Profile</button>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Update Patient Profile">
        <form onSubmit={handleEditPatient} className="flex flex-col gap-4">
          <p className="p mb-2">Editing health profile for <strong>{currentPatient?.name}</strong></p>
          <div className="flex gap-4">
            <div className="input-wrapper flex-1">
              <label className="form-label">Age</label>
              <input name="age" type="number" value={formData.age} className="input-field" onChange={handleInputChange} />
            </div>
            <div className="input-wrapper flex-1">
              <label className="form-label">Gender</label>
              <select name="gender" value={formData.gender} className="input-field" onChange={handleInputChange}>
                 <option value="Male">Male</option>
                 <option value="Female">Female</option>
                 <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div className="input-wrapper">
            <label className="form-label">Phone Number</label>
            <input name="phone" type="text" value={formData.phone} className="input-field" onChange={handleInputChange} />
          </div>
          <div className="input-wrapper">
            <label className="form-label">Home Address</label>
            <textarea name="address" value={formData.address} className="input-field" rows="3" onChange={handleInputChange}></textarea>
          </div>
          <button type="submit" className="btn btn-primary w-full mt-4">Update Records</button>
        </form>
      </Modal>
    </div>
  );
};

export default Patients;
