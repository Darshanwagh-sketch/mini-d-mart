import React, { useState, useEffect } from 'react';
import { X, User, Package, Crown } from 'lucide-react';
import { api, setToken } from '../api';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [selectedRole, setSelectedRole] = useState('ROLE_CUSTOMER'); // ROLE_CUSTOMER | ROLE_STAFF | ROLE_ADMIN
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Clean form inputs whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setPassword('');
      setFullName('');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      let res;
      if (isRegister) {
        res = await api.register({ fullName, email, password, role: selectedRole });
      } else {
        res = await api.login({ email, password });
      }

      setToken(res.token);
      onLoginSuccess(res);
      onClose();
    } catch (err) {
      setError(err.message || 'Invalid credentials or registration details. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const roleInfo = {
    ROLE_CUSTOMER: {
      label: 'Customer Account',
      badge: '🛒 Customer',
      color: 'var(--primary)',
      desc: 'Browse fresh groceries, express checkout, track order progression.'
    },
    ROLE_STAFF: {
      label: 'Store Staff Account',
      badge: '📦 Store Staff',
      color: 'var(--secondary)',
      desc: 'Confirm incoming orders, update prep, dispatch & delivery status.'
    },
    ROLE_ADMIN: {
      label: 'System Admin Account',
      badge: '👑 Executive Admin',
      color: 'var(--accent-purple)',
      desc: 'Add/edit products, stock control, user role management & audit trail.'
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 440, position: 'relative' }}>
        <button 
          onClick={onClose} 
          style={{ position: 'absolute', top: 18, right: 18, background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-glass)', color: 'var(--text-muted)', cursor: 'pointer', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' }}
          className="btn-icon-hover"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span className="brand-badge" style={{ background: roleInfo[selectedRole].color, padding: '2px 10px', fontSize: '0.72rem' }}>
            {roleInfo[selectedRole].badge}
          </span>
        </div>

        <h3 style={{ fontSize: '1.45rem', fontWeight: 800, marginBottom: 4, color: 'var(--text-main)' }}>
          {isRegister ? `Register as ${roleInfo[selectedRole].label}` : `Sign In as ${roleInfo[selectedRole].label}`}
        </h3>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 18 }}>
          {roleInfo[selectedRole].desc}
        </p>

        {/* STEP 1: Interactive Role Selection Tabs */}
        <div style={{ marginBottom: 20 }}>
          <label className="form-label" style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Select Account Role
          </label>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr 1fr', 
            gap: 6, 
            background: 'rgba(255,255,255,0.04)', 
            padding: 4, 
            borderRadius: 'var(--radius-md)', 
            border: '1px solid var(--border-glass)' 
          }}>
            <button 
              type="button"
              className={`btn btn-sm ${selectedRole === 'ROLE_CUSTOMER' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSelectedRole('ROLE_CUSTOMER')}
              style={{ fontSize: '0.78rem', padding: '8px 4px', borderRadius: 'var(--radius-sm)' }}
            >
              <User size={14} /> Customer
            </button>
            <button 
              type="button"
              className={`btn btn-sm ${selectedRole === 'ROLE_STAFF' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSelectedRole('ROLE_STAFF')}
              style={{ 
                fontSize: '0.78rem', 
                padding: '8px 4px', 
                borderRadius: 'var(--radius-sm)',
                background: selectedRole === 'ROLE_STAFF' ? 'var(--secondary)' : ''
              }}
            >
              <Package size={14} /> Staff
            </button>
            <button 
              type="button"
              className={`btn btn-sm ${selectedRole === 'ROLE_ADMIN' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSelectedRole('ROLE_ADMIN')}
              style={{ 
                fontSize: '0.78rem', 
                padding: '8px 4px', 
                borderRadius: 'var(--radius-sm)',
                background: selectedRole === 'ROLE_ADMIN' ? 'var(--accent-purple)' : ''
              }}
            >
              <Crown size={14} /> Admin
            </button>
          </div>
        </div>

        {error && (
          <div style={{ background: 'var(--danger-light)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--danger)', padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>⚠️</span> {error}
          </div>
        )}

        {/* STEP 2: Auth Form */}
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input 
                type="text" 
                className="form-control" 
                required 
                placeholder="Enter your full name" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)} 
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-control" 
              required 
              placeholder="Enter your email address" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              autoComplete="off"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-control" 
              required 
              placeholder="Enter your password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              autoComplete="new-password"
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={submitting} 
            style={{ 
              width: '100%', 
              marginTop: 10, 
              padding: '12px', 
              fontSize: '0.95rem', 
              fontWeight: 700,
              background: roleInfo[selectedRole].color
            }}
          >
            {submitting ? 'Authenticating...' : isRegister ? `Register as ${selectedRole.replace('ROLE_', '')}` : `Sign In as ${selectedRole.replace('ROLE_', '')}`}
          </button>
        </form>

        {/* Footer Toggle */}
        <div style={{ textAlign: 'center', marginTop: 18, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          {isRegister ? 'Already registered?' : "Need a new account?"}{' '}
          <span 
            onClick={() => { setIsRegister(!isRegister); setError(''); }} 
            style={{ color: roleInfo[selectedRole].color, fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
          >
            {isRegister ? 'Sign In Here' : 'Register New Account'}
          </span>
        </div>
      </div>
    </div>
  );
}
