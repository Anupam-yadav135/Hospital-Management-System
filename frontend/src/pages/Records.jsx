import React, { useEffect, useState } from 'react';
import api from '../api';
import Modal from '../components/Modal';
import { FileText, Plus, Trash2, Search, Clipboard } from 'lucide-react';

const Records = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({ appointment_id: '', diagnosis: '', prescription: '', notes: '' });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) setUser(JSON.parse(userString));
    fetchRecords();
    if (userString && JSON.parse(userString).role === 'doctor') {
      fetchAppointments();
    }
  }, []);

  const fetchRecords = async () => {
    try {
      const res = await api.get('/medical-records');
      setRecords(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    const res = await api.get('/appointments/getAll');
    setAppointments(res.data.data || []);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddRecord = async (e) => {
    e.preventDefault();
    if (!window.confirm('Save this medical record to the database?')) return;
    try {
      const selectedApt = appointments.find(a => a.appointment_id == formData.appointment_id);
      if (!selectedApt) return alert('Please select a valid appointment');

      await api.post('/medical-records/createMedicalRecord', {
        ...formData,
        patient_id: selectedApt.patient_id,
        doctor_id: selectedApt.doctor_id
      });
      setIsAddModalOpen(false);
      setFormData({ appointment_id: '', diagnosis: '', prescription: '', notes: '' });
      fetchRecords();
      alert('Diagnostic record saved successfully!');
    } catch (err) {
      alert('Error saving record: ' + err.message);
    }
  };

  const handleDeleteRecord = async (id) => {
    if (window.confirm('Permanently delete this medical record?')) {
      try {
        await api.delete(`/medical-records/deleteMedicalRecord/${id}`);
        fetchRecords();
      } catch (err) {
        alert('Error deleting record');
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full min-h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="h1">Medical Records</h1>
          <p className="p mt-2">Comprehensive health history repository and diagnostic logs.</p>
        </div>
        {user?.role === 'doctor' && (
          <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
             <Plus size={18} className="mr-2" /> New Diagnostic Record
          </button>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <div className="layered-card" style={{ padding: '1rem' }}>
           <div className="relative max-w-sm">
              <input 
                type="text" 
                placeholder="Search diagnosis or patients..." 
                className="input-field w-full transition-all duration-300" 
                style={{ background: 'white', border: '1px solid var(--glass-border)', cursor: 'text' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
           </div>
        </div>

        {loading ? (
          <div className="p-6 text-center text-muted layered-card">Retrieving Health Data...</div>
        ) : (() => {
          const filtered = records.filter(r => 
            r.diagnosis?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.patient_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.doctor_name?.toLowerCase().includes(searchQuery.toLowerCase())
          );
          return filtered.length > 0 ? (
          filtered.map(r => (
            <div key={r.record_id} className="layered-card flex items-center justify-between group">
               <div className="flex items-center gap-6">
                 <div style={{ background: 'var(--bg-tertiary)', color: 'var(--primary-color)', padding: '1rem', borderRadius: '12px' }}>
                    <Clipboard size={24} />
                 </div>
                 <div>
                    <h3 className="h3 font-bold" style={{ marginBottom: '0.25rem' }}>{r.diagnosis}</h3>
                    <p className="small text-muted">
                      Patient: <strong>{r.patient_name}</strong> | 
                      Physician: <strong>{r.doctor_name}</strong> | 
                      Date: {new Date(r.created_at).toLocaleDateString()}
                    </p>
                 </div>
               </div>
               
               <div className="flex items-center gap-8">
                 <div style={{ textAlign: 'right' }}>
                    <p className="small uppercase font-bold text-muted mb-1">Prescription</p>
                    <span className="badge badge-primary">{r.prescription || 'Observation Only'}</span>
                 </div>
                 {user?.role === 'admin' && (
                   <button className="p-2 hover:bg-red-50 rounded text-danger opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleDeleteRecord(r.record_id)}>
                      <Trash2 size={18} />
                   </button>
                 )}
               </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center text-muted layered-card">{searchQuery ? 'No matching records found.' : 'No medical history found in the database.'}</div>
        );
        })()}
      </div>

      {/* Add Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Create Diagnostic Record">
        <form onSubmit={handleAddRecord} className="flex flex-col gap-4">
          <div className="input-wrapper">
            <label className="form-label">Related Appointment</label>
            <select name="appointment_id" className="input-field" required onChange={handleInputChange}>
               <option value="">Select a recent session...</option>
               {appointments.map(a => (
                 <option key={a.appointment_id} value={a.appointment_id}>
                   {new Date(a.appointment_date).toLocaleDateString()} - {a.patient_name}
                 </option>
               ))}
            </select>
          </div>
          <div className="input-wrapper">
            <label className="form-label">Diagnosis</label>
            <input name="diagnosis" type="text" className="input-field" placeholder="Primary condition found" required onChange={handleInputChange} />
          </div>
          <div className="input-wrapper">
             <label className="form-label">Prescription / Medication</label>
             <textarea name="prescription" className="input-field" rows="2" placeholder="Drugs and dosage" required onChange={handleInputChange}></textarea>
          </div>
          <div className="input-wrapper">
             <label className="form-label">Clinical Notes</label>
             <textarea name="notes" className="input-field" rows="3" placeholder="Additional observations..." onChange={handleInputChange}></textarea>
          </div>
          <button type="submit" className="btn btn-primary w-full mt-4">Save to Health History</button>
        </form>
      </Modal>
    </div>
  );
};

export default Records;
