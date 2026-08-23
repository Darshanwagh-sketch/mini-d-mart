import React, { useState, useEffect } from 'react';
import { X, Lock, Mail, User as UserIcon } from 'lucide-react';
import { api, setToken } from '../api';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
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
        res = await api.register({ fullName, email, password });
      } else {
        res = await api.login({ email, password });
      }

      setToken(res.token);
      onLoginSuccess(res);
      onClose();
    } catch (err) {
      let msg = err.message;
      if (!msg || msg === 'Internal Server Error' || msg === 'An error occurred' || msg.includes('500')) {
        msg = isRegister 
          ? 'This email address is already registered. Please try signing in instead.' 
          : 'Invalid email or password. Please check your login details and try again.';
      }
      setError(msg);
    } finally {

      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 420, position: 'relative' }}>
        <button 
          onClick={onClose} 
          style={{ position: 'absolute', top: 18, right: 18, background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-glass)', color: 'var(--text-muted)', cursor: 'pointer', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' }}
          className="btn-icon-hover"
        >
          <X size={18} />
        </button>

        <h3 style={{ fontSize: '1.45rem', fontWeight: 800, marginBottom: 4, color: 'var(--text-main)' }}>
          {isRegister ? 'Create an Account' : 'Welcome Back'}
        </h3>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: 20 }}>
          {isRegister 
            ? 'Register to place orders, track delivery & manage your profile.' 
            : 'Sign in to access your account, orders, or management portal.'}
        </p>

        {error && (
          <div style={{ background: 'var(--danger-light)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--danger)', padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  className="form-control" 
                  required 
                  placeholder="Enter your full name" 
                  value={fullName} 
                  onChange={(e) => setFullName(e.target.value)} 
                />
              </div>
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
              marginTop: 12, 
              padding: '12px', 
              fontSize: '0.95rem', 
              fontWeight: 700 
            }}
          >
            {submitting ? 'Authenticating...' : isRegister ? 'Register Account' : 'Sign In'}
          </button>
        </form>

        {/* Footer Toggle */}
        <div style={{ textAlign: 'center', marginTop: 18, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          {isRegister ? 'Already have an account?' : "Don't have an account yet?"}{' '}
          <span 
            onClick={() => { setIsRegister(!isRegister); setError(''); }} 
            style={{ color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
          >
            {isRegister ? 'Sign In Here' : 'Register New Account'}
          </span>
        </div>
      </div>
    </div>
  );
}
