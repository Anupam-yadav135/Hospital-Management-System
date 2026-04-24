import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Activity, UserRound, Stethoscope, LayoutDashboard } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('patient');
  
  // Secondary profile states
  const [phone, setPhone] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const roles = [
    { id: 'patient', name: 'Patient', icon: UserRound },
    { id: 'doctor', name: 'Doctor', icon: Stethoscope },
    { id: 'admin', name: 'Admin', icon: LayoutDashboard }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/signup';
      const payload = isLogin 
        ? { email, password, role } 
        : { 
            name, email, password, role,
            phone, specialization, age, gender 
          };
      
      const response = await api.post(endpoint, payload);
      
      if (isLogin) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('role', response.data.user?.role || 'patient');
        navigate('/dashboard');
      } else {
        setIsLogin(true);
        setError('Signup successful! Please log in.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center p-4">
      <div className="layered-card flex flex-col gap-6" style={{ width: '100%', maxWidth: '420px', zIndex: 10 }}>
        
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center justify-center p-4 bg-primary text-white rounded-xl shadow-lg">
            <Activity size={32} />
          </div>
          <h1 className="h1 text-center" style={{ fontSize: '1.75rem' }}>MediFlow Portal</h1>
        </div>

        {error && (
          <div className="p-3 badge-glow badge-glow-warning flex justify-center text-center w-full" style={{ whiteSpace: 'normal', borderRadius: '10px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-3 mb-2">
            <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-sub)' }}>SELECT YOUR ROLE</label>
            <div className="grid grid-cols-1 gap-3">
              {roles.map((r) => (
                <div 
                  key={r.id}
                  onClick={() => setRole(r.id)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-4 ${role === r.id ? 'border-primary bg-primary/5 shadow-sm' : 'border-transparent bg-white/50 hover:border-slate-200'}`}
                  style={{ border: role === r.id ? '2px solid var(--primary)' : '2px solid transparent' }}
                >
                  <div className={`p-3 rounded-lg ${role === r.id ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}>
                    <r.icon size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className={`font-bold ${role === r.id ? 'text-primary' : 'text-slate-600'}`}>{r.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {!isLogin && (
            <div className="flex flex-col gap-5">
              <div className="input-wrapper" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ display: 'block', marginBottom: '0.4rem' }}>Full Name</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Enter full name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                />
              </div>

              {role === 'doctor' && (
                <>
                  <div className="input-wrapper" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ display: 'block', marginBottom: '0.4rem' }}>Medical Specialization</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      placeholder="e.g. Cardiology" 
                      value={specialization}
                      onChange={(e) => setSpecialization(e.target.value)}
                    />
                  </div>
                  <div className="input-wrapper" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ display: 'block', marginBottom: '0.4rem' }}>Phone Number</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      placeholder="+1 (555) 000-0000" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </>
              )}

              {role === 'patient' && (
                <>
                  <div className="flex gap-4">
                    <div className="input-wrapper" style={{ flex: 1, marginBottom: 0 }}>
                      <label className="form-label" style={{ display: 'block', marginBottom: '0.4rem' }}>Age</label>
                      <input 
                        type="number" 
                        className="input-field" 
                        placeholder="0" 
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                      />
                    </div>
                    <div className="input-wrapper" style={{ flex: 1, marginBottom: 0 }}>
                      <label className="form-label" style={{ display: 'block', marginBottom: '0.4rem' }}>Gender</label>
                      <select 
                        className="input-field" 
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="input-wrapper" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ display: 'block', marginBottom: '0.4rem' }}>Contact Phone</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      placeholder="+1 (555) 000-0000" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </>
              )}
            </div>
          )}

          <div className="input-wrapper" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ display: 'block', marginBottom: '0.4rem' }}>Email Address</label>
            <input 
              type="email" 
              className="input-field" 
              placeholder="user@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className="input-wrapper" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ display: 'block', marginBottom: '0.4rem' }}>Password</label>
            <input 
              type="password" 
              className="input-field" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-full mt-2" 
            disabled={loading}
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        <div className="flex justify-center mt-2 border-t pt-4" style={{ borderColor: 'var(--glass-border)' }}>
          <button 
            type="button" 
            className="btn btn-glass w-full"
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
