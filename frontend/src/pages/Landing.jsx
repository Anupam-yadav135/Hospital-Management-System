import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, ShieldCheck, HeartPulse, Stethoscope, ArrowRight } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      {/* Animated Background Elements */}
      <div className="landing-orb orb-teal"></div>
      <div className="landing-orb orb-indigo"></div>
      <div className="landing-orb orb-coral"></div>

      {/* Navigation Bar */}
      <nav className="landing-nav">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary rounded-lg text-white shadow-lg">
            <Activity size={24} />
          </div>
          <span className="h2" style={{ color: 'var(--primary)', letterSpacing: '-0.03em' }}>MediFlow</span>
        </div>
        <div className="flex gap-4">
          <button className="btn btn-primary" onClick={() => navigate('/login')}>Login</button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="landing-content">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 className="h1" style={{ fontSize: '4rem', lineHeight: '1.2', marginBottom: '1.5rem' }}>
            Precision Medicine meets <br />
            <span className="hero-gradient-text">Intelligent Technology</span>
          </h1>
          <p className="p" style={{ fontSize: '1.15rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
            Seamlessly connecting patients with world-class medical professionals through real-time tracking and premium care management.
          </p>
          <div className="flex justify-center gap-4">
            <button className="btn btn-primary" style={{ padding: '0.8rem 2rem', fontSize: '1.1rem' }} onClick={() => navigate('/login')}>
              Get Started <ArrowRight size={20} className="ml-2" />
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="landing-features">
          <div className="layered-card flex flex-col items-center text-center">
            <div className="p-4 bg-primary text-white rounded-2xl mb-4 shadow-lg shadow-primary">
              <Stethoscope size={32} />
            </div>
            <h3 className="h3 mb-2">Expert Professionals</h3>
            <p className="p">Connect with board-certified doctors across over 40 specialized medical fields.</p>
          </div>

          <div className="layered-card flex flex-col items-center text-center">
            <div className="p-4 text-white rounded-2xl mb-4 shadow-lg" style={{ background: 'var(--secondary)' }}>
              <HeartPulse size={32} />
            </div>
            <h3 className="h3 mb-2">Real-time Vitals</h3>
            <p className="p">Advanced synchronization with wearable technology for continuous health monitoring.</p>
          </div>

          <div className="layered-card flex flex-col items-center text-center">
            <div className="p-4 text-white rounded-2xl mb-4 shadow-lg" style={{ background: 'var(--accent)' }}>
              <ShieldCheck size={32} />
            </div>
            <h3 className="h3 mb-2">Secure Records</h3>
            <p className="p">Bank-grade encryption protecting your most sensitive medical histories and data.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Landing;
