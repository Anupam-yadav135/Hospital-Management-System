import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, UserRound, Calendar, LogOut, Bed, Banknote, FileText } from 'lucide-react';

const DashboardLayout = () => {
  const navigate = useNavigate();
  
  const userString = localStorage.getItem('user');
  let user = { role: 'patient', email: 'user@example.com' };
  try {
    if (userString && userString !== 'undefined' && userString !== 'null') {
      const parsed = JSON.parse(userString);
      if (parsed) user = { ...user, ...parsed };
    }
  } catch (e) {
    console.error("Failed to parse user");
  }

  // Double check if token is manually holding role
  const roleOverride = localStorage.getItem('role');
  if(roleOverride && roleOverride !== 'undefined') {
    user.role = roleOverride; 
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'doctor', 'patient'], exact: true },
    { name: 'Patients', path: '/dashboard/patients', icon: UserRound, roles: ['admin', 'doctor'] },
    { name: 'Doctors', path: '/dashboard/doctors', icon: Users, roles: ['admin', 'patient'] },
    { name: 'Appointments', path: '/dashboard/appointments', icon: Calendar, roles: ['admin', 'doctor', 'patient'] },
    { name: 'Rooms', path: '/dashboard/rooms', icon: Bed, roles: ['admin'] },
    { name: 'Billing', path: '/dashboard/billing', icon: Banknote, roles: ['admin', 'patient'] },
    { name: 'Records', path: '/dashboard/records', icon: FileText, roles: ['admin', 'doctor', 'patient'] },
  ];

  const authorizedNav = navItems.filter(item => item.roles.includes(user.role));

  return (
    <div className="flex w-full h-screen overflow-hidden" style={{ background: 'transparent' }}>
      {/* Floating Glass Sidebar */}
      <aside className="sidebar-glass flex flex-col p-8 shrink-0">
        <div className="flex items-center gap-4 mb-12">
          <div className="p-3 bg-primary rounded-xl text-white shadow-lg shadow-primary/20" style={{ background: 'var(--primary)' }}>
            <Activity />
          </div>
          <span className="h1" style={{ fontSize: '1.5rem', margin: 0, color: 'var(--primary)' }}>MediFlow</span>
        </div>

        <nav className="flex flex-col gap-3 flex-grow">
          {authorizedNav.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.exact}
              className={({ isActive }) => 
                `flex items-center gap-4 ${isActive ? 'active-nav' : 'hover-nav'}`
              }
              style={({ isActive }) => ({
                padding: '1rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                color: isActive ? 'var(--primary)' : 'var(--text-sub)',
                background: isActive ? 'rgba(15, 76, 92, 0.08)' : 'transparent',
                fontWeight: isActive ? '800' : '600',
                transition: 'var(--transition-soft)',
                textDecoration: 'none',
                border: isActive ? '1px solid rgba(15, 76, 92, 0.1)' : '1px solid transparent'
              })}
            >
              {({ isActive }) => (
                <>
                  <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                  {item.name}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)' }}>
          <div className="flex items-center gap-4" style={{ marginBottom: '2rem' }}>
             <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'white', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <UserRound size={24} />
             </div>
             <div>
               <p style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)', textTransform: 'capitalize' }}>{user.role}</p>
               <p style={{ fontSize: '0.8rem', color: 'var(--text-mute)' }}>{user.email || 'Online'}</p>
             </div>
          </div>
          
          <button 
            className="btn-glass w-full"
            style={{ border: 'none', justifyContent: 'flex-start', color: '#ef4444' }}
            onClick={handleLogout}
          >
            <LogOut size={20} />
            Logout Account
          </button>
        </div>
      </aside>

      {/* Main Immersive Content View */}
      <main className="flex-grow flex flex-col m-6 ml-0 overflow-hidden">
        <div className="card-premium h-full flex flex-col" style={{ padding: 0, background: 'rgba(255, 255, 255, 0.4)' }}>
          <header className="p-8 border-b glass-panel flex items-center justify-between sticky top-0 z-10" style={{ background: 'rgba(255, 255, 255, 0.3)', borderBottom: '1px solid var(--glass-border)' }}>
               <h2 className="h2" style={{ margin: 0 }}>Overview</h2>
               <div className="flex items-center gap-4">
                 <span className="badge-glow badge-glow-success">System Synchronized</span>
               </div>
          </header>
          <div className="p-8 flex-grow overflow-y-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

const Activity = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
);

export default DashboardLayout;
