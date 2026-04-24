import React, { useEffect, useState } from 'react';
import api from '../api';
import Modal from '../components/Modal';
import { Banknote, Plus, Trash2, Printer, Search } from 'lucide-react';

const Billing = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [patients, setPatients] = useState([]);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({ patient_id: '', total_amount: '', payment_status: 'Pending', appointment_id: '' });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) setUser(JSON.parse(userString));
    fetchBills();
    fetchPatients();
  }, []);

  const fetchBills = async () => {
    try {
      const res = await api.get('/bills');
      setBills(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    const res = await api.get('/patients');
    setPatients(res.data.data || res.data);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateBill = async (e) => {
    e.preventDefault();
    if (!window.confirm('Do you want to issue this invoice to the patient?')) return;
    try {
      // Basic bill creation
      await api.post('/bills', formData);
      setIsAddModalOpen(false);
      setFormData({ patient_id: '', total_amount: '', payment_status: 'Pending', appointment_id: '' });
      fetchBills();
      alert('Invoice issued successfully!');
    } catch (err) {
      alert('Error generating invoice: ' + err.message);
    }
  };

  const handleDeleteBill = async (id) => {
    if (window.confirm('Void this financial record?')) {
      try {
        await api.delete(`/bills/${id}`);
        fetchBills();
      } catch (err) {
        alert('Error deleting bill');
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full min-h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="h1">Financial Center</h1>
          <p className="p mt-2">Manage patient billing, invoices, and payment tracking.</p>
        </div>
        {user?.role === 'admin' && (
          <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
             <Plus size={18} className="mr-2" /> Generate Invoice
          </button>
        )}
      </div>

      <div className="layered-card flex-grow overflow-x-auto" style={{ padding: 0, overflowY: 'visible' }}>
        <div className="p-4 border-b rounded-t-3xl" style={{ background: 'var(--glass-border)' }}>
           <div className="relative max-w-sm">
              <input 
                type="text" 
                placeholder="Search invoice # or patient..." 
                className="input-field w-full transition-all duration-300" 
                style={{ background: 'white', border: '1px solid var(--glass-border)', cursor: 'text' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
           </div>
        </div>
        {loading ? (
          <div className="p-6 text-center text-muted">Synchronizing Ledger...</div>
        ) : (
          <table className="table-premium">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Patient</th>
                <th>Amount</th>
                <th>Created At</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bills.filter(b => 
                `INV-${b.bill_id}`.toLowerCase().includes(searchQuery.toLowerCase()) || 
                b.patient_name?.toLowerCase().includes(searchQuery.toLowerCase())
              ).map(b => (
                <tr key={b.bill_id}>
                  <td className="small font-bold">INV-{b.bill_id}</td>
                  <td className="font-bold">{b.patient_name}</td>
                  <td className="font-bold text-primary">₹{b.total_amount}</td>
                  <td>{new Date(b.created_at || b.date).toLocaleDateString()}</td>
                  <td>
                    <span className={`badge ${b.payment_status === 'Paid' || b.status === 'Paid' ? 'badge-success' : 'badge-danger'}`}>
                      {b.payment_status || b.status}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="flex justify-end gap-2">
                       {user?.role === 'admin' && (
                         <button className="p-2 hover:bg-red-50 rounded text-danger" onClick={() => handleDeleteBill(b.bill_id)}><Trash2 size={16} /></button>
                       )}
                    </div>
                  </td>
                </tr>
              ))}
              {bills.filter(b => 
                `INV-${b.bill_id}`.toLowerCase().includes(searchQuery.toLowerCase()) || 
                b.patient_name?.toLowerCase().includes(searchQuery.toLowerCase())
              ).length === 0 && (
                <tr><td colSpan="6" className="p-6 text-center text-muted">{searchQuery ? 'No matching invoices found.' : 'No financial records found.'}</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Generate New Invoice">
        <form onSubmit={handleCreateBill} className="flex flex-col gap-4">
          <div className="input-wrapper">
            <label className="form-label">Select Patient</label>
            <select name="patient_id" className="input-field" required onChange={handleInputChange}>
               <option value="">Search for patient...</option>
               {patients.map(p => (
                 <option key={p.patient_id} value={p.patient_id}>{p.name} (PT-{p.patient_id})</option>
               ))}
            </select>
          </div>
          <div className="input-wrapper">
            <label className="form-label">Total Amount (₹)</label>
            <input name="total_amount" type="number" step="0.01" className="input-field" placeholder="0.00" required onChange={handleInputChange} />
          </div>
          <div className="input-wrapper">
             <label className="form-label">Initial Status</label>
             <select name="payment_status" className="input-field" onChange={handleInputChange}>
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Overdue">Overdue</option>
             </select>
          </div>
          <button type="submit" className="btn btn-primary w-full mt-4">Issue Invoice</button>
        </form>
      </Modal>
    </div>
  );
};

export default Billing;
