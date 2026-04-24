import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="flex items-center justify-center p-4" 
      style={{ 
        position: 'fixed', 
        top: 0, left: 0, right: 0, bottom: 0, 
        zIndex: 9999, 
        backgroundColor: 'rgba(15, 76, 92, 0.4)', 
        backdropFilter: 'blur(8px)' 
      }}
    >
      <div className="layered-card w-full shadow-2xl animate-in" style={{ maxWidth: '500px', padding: 0, overflow: 'hidden', zIndex: 10000 }}>
        <div className="flex items-center justify-between p-6 border-b" style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', borderColor: 'var(--glass-border)' }}>
          <h3 className="h2" style={{ fontSize: '1.25rem', margin: 0 }}>{title}</h3>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-slate-200 rounded-full transition-colors"
            style={{ color: 'var(--text-sub)' }}
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6 bg-white">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
