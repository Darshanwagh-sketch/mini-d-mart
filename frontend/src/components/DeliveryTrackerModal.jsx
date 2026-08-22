import React, { useState, useEffect } from 'react';
import { X, Navigation, Phone, MessageSquare, ShieldCheck, MapPin, Truck, CheckCircle2, Clock, Sparkles } from 'lucide-react';

export default function DeliveryTrackerModal({ order, onClose }) {
  const [progress, setProgress] = useState(65); // Percentage position along route line (0 to 100)

  // Simulate smooth rider movement on the live map
  useEffect(() => {
    if (!order) return;
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 95 ? 65 : prev + 1.5));
    }, 1500);
    return () => clearInterval(interval);
  }, [order]);

  if (!order) return null;

  const isDelivered = order.status === 'DELIVERED';
  const isOutForDelivery = order.status === 'OUT_FOR_DELIVERY';
  const isPreparing = order.status === 'PREPARING';
  const isPlaced = order.status === 'PLACED';

  const trackingId = order.trackingNumber || `TRK-DMART-${order.id * 8371 || '593021'}`;
  const riderName = order.deliveryRiderName || 'Ramesh Kumar (Express Rider)';
  const riderPhone = order.deliveryRiderPhone || '+91 98201 55443';
  const deliveryPartner = order.deliveryPartner || 'D-Mart Express FastRider';
  const eta = isDelivered ? 'Delivered' : isOutForDelivery ? '12-18 Mins' : isPreparing ? '25-35 Mins' : '30-45 Mins';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-card" 
        onClick={(e) => e.stopPropagation()} 
        style={{ 
          maxWidth: 620, 
          width: '95%', 
          position: 'relative', 
          padding: 0, 
          overflow: 'hidden',
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)'
        }}
      >
        {/* Header */}
        <div style={{ padding: '20px 24px 16px', background: 'rgba(15, 23, 42, 0.95)', borderBottom: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="brand-badge" style={{ background: 'var(--primary)', color: '#fff', fontSize: '0.72rem' }}>
                ⚡ LIVE GPS TRACKER
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Tracking #{trackingId}</span>
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', marginTop: 4 }}>
              Order #{order.orderNumber}
            </h3>
          </div>

          <button 
            onClick={onClose} 
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid var(--border-glass)', color: '#fff', cursor: 'pointer', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: 24, maxHeight: '80vh', overflowY: 'auto' }}>
          {/* Animated Visual Route Map Container */}
          <div style={{ 
            position: 'relative', 
            height: 220, 
            background: 'radial-gradient(circle at 50% 50%, #1e293b 0%, #0f172a 100%)', 
            borderRadius: 'var(--radius-md)', 
            border: '1px solid rgba(59, 130, 246, 0.3)', 
            overflow: 'hidden',
            marginBottom: 20,
            boxShadow: 'inset 0 0 30px rgba(0,0,0,0.5)'
          }}>
            {/* Map Grid Pattern background */}
            <div style={{ 
              position: 'absolute', 
              inset: 0, 
              opacity: 0.15, 
              backgroundImage: 'linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)', 
              backgroundSize: '24px 24px' 
            }} />

            {/* Top Live GPS Badge */}
            <div style={{ position: 'absolute', top: 12, left: 14, display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(15, 23, 42, 0.85)', padding: '4px 10px', borderRadius: 'var(--radius-full)', border: '1px solid rgba(16,185,129,0.3)', fontSize: '0.72rem', color: '#10b981', fontWeight: 700 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
              Live Rider GPS Connected
            </div>

            {/* Route Curve SVG */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
              <path 
                d="M 60 110 Q 280 40 520 110" 
                fill="none" 
                stroke="rgba(59, 130, 246, 0.25)" 
                strokeWidth="6" 
                strokeDasharray="6 6" 
              />
              <path 
                d="M 60 110 Q 280 40 520 110" 
                fill="none" 
                stroke="var(--primary)" 
                strokeWidth="4" 
                strokeDasharray="100%" 
                strokeDashoffset={`${100 - (isDelivered ? 100 : progress)}%`}
                style={{ transition: 'stroke-dashoffset 0.8s ease' }}
              />
            </svg>

            {/* Node 1: Store Location */}
            <div style={{ position: 'absolute', left: 45, top: 90, textAlign: 'center' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 0 15px rgba(16,185,129,0.5)', margin: '0 auto' }}>
                <Truck size={18} />
              </div>
              <span style={{ fontSize: '0.7rem', color: '#fff', fontWeight: 700, display: 'block', marginTop: 4, background: 'rgba(0,0,0,0.6)', padding: '2px 6px', borderRadius: 4 }}>
                D-Mart Store
              </span>
            </div>

            {/* Animated Delivery Rider Pin on Route */}
            {!isDelivered && (
              <div style={{ 
                position: 'absolute', 
                left: `${progress}%`, 
                top: `${75 - Math.sin((progress / 100) * Math.PI) * 55}px`, 
                transform: 'translate(-50%, -50%)', 
                transition: 'all 1.2s ease',
                zIndex: 10
              }}>
                <div style={{ 
                  background: 'linear-gradient(135deg, var(--accent-purple), #8b5cf6)', 
                  color: '#fff', 
                  padding: '6px 12px', 
                  borderRadius: 'var(--radius-full)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 6, 
                  boxShadow: '0 0 20px rgba(139, 92, 246, 0.7)',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  whiteSpace: 'nowrap'
                }}>
                  <Navigation size={14} style={{ transform: 'rotate(45deg)' }} />
                  <span>Rider En Route</span>
                </div>
              </div>
            )}

            {/* Node 2: Customer Address */}
            <div style={{ position: 'absolute', right: 45, top: 90, textAlign: 'center' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: isDelivered ? '#10b981' : '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 0 15px rgba(99,102,241,0.5)', margin: '0 auto' }}>
                <MapPin size={18} />
              </div>
              <span style={{ fontSize: '0.7rem', color: '#fff', fontWeight: 700, display: 'block', marginTop: 4, background: 'rgba(0,0,0,0.6)', padding: '2px 6px', borderRadius: 4 }}>
                Your Home
              </span>
            </div>
          </div>

          {/* Live Arrival ETA Card */}
          <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.3)', padding: 16, borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase' }}>
                {isDelivered ? 'Delivery Status' : 'Estimated Delivery Time'}
              </span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginTop: 2, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Clock size={22} style={{ color: 'var(--primary)' }} />
                <span>{eta}</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Delivery Address</span>
              <strong style={{ fontSize: '0.85rem', color: '#fff' }}>{order.deliveryAddress || 'Your Registered Home Address'}</strong>
            </div>
          </div>

          {/* Assigned Rider Contact Card */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', padding: 18, borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '1.1rem' }}>
                👤
              </div>
              <div>
                <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#fff' }}>{riderName}</h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '2px 0' }}>
                  Partner: <strong>{deliveryPartner}</strong> | Vehicle: MH-03-EX-9921 (⭐ 4.9)
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <a 
                href={`tel:${riderPhone}`} 
                className="btn btn-primary btn-sm" 
                style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}
              >
                <Phone size={14} /> Call Rider
              </a>
            </div>
          </div>

          {/* Milestone Status Timeline */}
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: 16, borderRadius: 'var(--radius-md)' }}>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#fff', marginBottom: 14 }}>Delivery Milestones</h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <CheckCircle2 size={18} style={{ color: 'var(--primary)' }} />
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>Order Placed & Payment Confirmed</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <CheckCircle2 size={18} style={{ color: isPreparing || isOutForDelivery || isDelivered ? 'var(--primary)' : 'var(--text-dim)' }} />
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: isPreparing || isOutForDelivery || isDelivered ? '#fff' : 'var(--text-muted)' }}>Store Packing & Quality Check</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Verified at Powai Central Store</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Truck size={18} style={{ color: isOutForDelivery || isDelivered ? 'var(--accent-purple)' : 'var(--text-dim)' }} />
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: isOutForDelivery || isDelivered ? '#fff' : 'var(--text-muted)' }}>Dispatched with Rider</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Rider picked up package</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <MapPin size={18} style={{ color: isDelivered ? 'var(--primary)' : 'var(--text-dim)' }} />
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: isDelivered ? 'var(--primary)' : 'var(--text-muted)' }}>
                    {isDelivered ? 'Delivered to Doorstep' : 'Arriving at Destination'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
