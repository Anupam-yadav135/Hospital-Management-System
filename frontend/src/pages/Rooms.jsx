import React, { useEffect, useState } from 'react';
import api from '../api';
import Modal from '../components/Modal';
import { Bed, Plus, Edit2, Trash2, Home, Search } from 'lucide-react';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [formData, setFormData] = useState({ room_number: '', room_type: 'General', status: 'Available' });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) setUser(JSON.parse(userString));
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await api.get('/rooms');
      setRooms(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    if (!window.confirm('Are you sure you want to add this room to the system?')) return;
    try {
      await api.post('/rooms', formData);
      setIsAddModalOpen(false);
      setFormData({ room_number: '', room_type: 'General', status: 'Available' });
      fetchRooms();
      alert('Room created successfully!');
    } catch (err) {
      alert('Error creating room');
    }
  };

  const handleEditRoom = async (e) => {
    e.preventDefault();
    if (!window.confirm('Are you sure you want to save these room changes?')) return;
    try {
      await api.put(`/rooms/updateRoom/${currentRoom.room_id}`, formData);
      setIsEditModalOpen(false);
      fetchRooms();
      alert('Room updated successfully!');
    } catch (err) {
      alert('Error updating room');
    }
  };

  const handleDeleteRoom = async (id) => {
    if (window.confirm('Remove this room from the system?')) {
      try {
        await api.delete(`/rooms/${id}`);
        fetchRooms();
      } catch (err) {
        alert('Error deleting room');
      }
    }
  };

  const openEditModal = (r) => {
    setCurrentRoom(r);
    setFormData({ room_number: r.room_number, room_type: r.room_type, status: r.status });
    setIsEditModalOpen(true);
  };

  const filteredRooms = rooms.filter(r => 
    r.room_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.room_type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.status?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 w-full min-h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="h1">Ward Management</h1>
          <p className="p mt-2">Oversee hospital rooms, occupancy, and bed types.</p>
        </div>
        {user?.role === 'admin' && (
          <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
             <Plus size={18} className="mr-2" /> Add New Room
          </button>
        )}
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200" style={{ backdropFilter: 'blur(10px)', background: 'rgba(255, 255, 255, 0.8)' }}>
         <div className="relative flex-grow max-w-lg">
            <div className="absolute left-4 top-0 bottom-0 flex items-center pointer-events-none">
               <Search className="text-secondary" size={20} />
            </div>
            <input 
              type="text" 
              placeholder="Search by Room ID (e.g. G-101), Ward Type, or Status..." 
              className="w-full pl-12 pr-4 outline-none transition-all" 
              style={{ 
                height: '52px', 
                fontSize: '1.05rem', 
                background: 'transparent',
                border: 'none',
                color: 'var(--text-main)',
                fontWeight: '500'
              }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
         </div>
         <div className="h-8 w-px bg-slate-200 hidden md:block"></div>
         <div className="hidden md:flex items-center gap-2 text-muted">
            <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">{filteredRooms.length}</span>
            <span className="text-xs uppercase tracking-wider font-bold">Total Wards</span>
         </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {loading ? (
          <div className="p-6 text-center text-muted" style={{ gridColumn: '1 / -1' }}>Synchronizing Facility Data...</div>
        ) : filteredRooms.length > 0 ? (
          filteredRooms.map(r => (
            <div key={r.room_id} className="layered-card flex flex-col justify-between group transition-all duration-300 hover:shadow-xl">
               <div>
                  <div className="flex items-start justify-between mb-4">
                     <div style={{ background: r.status === 'Available' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: r.status === 'Available' ? 'var(--success-color)' : 'var(--danger-color)', padding: '0.8rem', borderRadius: '12px' }}>
                        <Home size={24} />
                     </div>
                     <span className={`badge ${r.status === 'Available' ? 'badge-success' : 'badge-danger'}`}>{r.status}</span>
                  </div>
                  <h3 className="h2" style={{ fontSize: '1.6rem' }}>{r.room_number}</h3>
                  <p className="small mt-2 text-muted uppercase font-bold letter-spacing-1">Type: <span className="text-primary">{r.room_type}</span></p>
               </div>
               
               {user?.role === 'admin' && (
                 <div className="mt-6 pt-4 border-t flex items-center justify-end gap-3" style={{ borderColor: 'var(--glass-border)' }}>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg text-primary text-xs font-bold hover:bg-primary hover:text-white transition-all shadow-sm" onClick={() => openEditModal(r)}>
                      <Edit2 size={12} /> Edit
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-red-50 rounded-lg text-danger text-xs font-bold hover:bg-danger hover:text-white transition-all shadow-sm" onClick={() => handleDeleteRoom(r.room_id)}>
                      <Trash2 size={12} /> Delete
                    </button>
                 </div>
               )}
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-muted layered-card" style={{ gridColumn: '1 / -1' }}>{searchQuery ? 'No matching rooms found.' : 'No rooms discovered in current sector.'}</div>
        )}
      </div>

      {/* Add Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Register Hospital Room">
        <form onSubmit={handleAddRoom} className="flex flex-col gap-4">
          <div className="input-wrapper">
            <label className="form-label">Room Number / ID</label>
            <input name="room_number" type="text" className="input-field" placeholder="e.g. WARD-101" required onChange={handleInputChange} />
          </div>
          <div className="input-wrapper">
             <label className="form-label">Room Category</label>
             <select name="room_type" className="input-field" onChange={handleInputChange}>
                <option value="General">General Ward</option>
                <option value="Private">Private Suite</option>
                <option value="ICU">Intensive Care Unit (ICU)</option>
                <option value="Operation">Operating Theater</option>
             </select>
          </div>
          <div className="input-wrapper">
             <label className="form-label">Initial Status</label>
             <select name="status" className="input-field" onChange={handleInputChange}>
                <option value="Available">Available</option>
                <option value="Occupied">Occupied</option>
                <option value="Maintenance">Maintenance</option>
             </select>
          </div>
          <button type="submit" className="btn btn-primary w-full mt-4">Create Facility Record</button>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Modify Room Configuration">
        <form onSubmit={handleEditRoom} className="flex flex-col gap-4">
          <div className="input-wrapper">
            <label className="form-label">Room Number</label>
            <input name="room_number" type="text" value={formData.room_number} className="input-field" required onChange={handleInputChange} />
          </div>
          <div className="input-wrapper">
             <label className="form-label">Room Category</label>
             <select name="room_type" value={formData.room_type} className="input-field" onChange={handleInputChange}>
                <option value="General">General Ward</option>
                <option value="Private">Private Suite</option>
                <option value="ICU">Intensive Care Unit (ICU)</option>
                <option value="Operation">Operating Theater</option>
             </select>
          </div>
          <div className="input-wrapper">
             <label className="form-label">Update Status</label>
             <select name="status" value={formData.status} className="input-field" onChange={handleInputChange}>
                <option value="Available">Available</option>
                <option value="Occupied">Occupied</option>
                <option value="Maintenance">Maintenance</option>
             </select>
          </div>
          <button type="submit" className="btn btn-primary w-full mt-4">Save Changes</button>
        </form>
      </Modal>
    </div>
  );
};

export default Rooms;
