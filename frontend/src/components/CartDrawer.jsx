import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, Store, Truck, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cartItems, 
  onUpdateQty, 
  onRemoveItem, 
  onClearCart, 
  stores, 
  selectedStore, 
  onPlaceOrder 
}) {
  const [orderType, setOrderType] = useState('HOME_DELIVERY');
  const [storeId, setStoreId] = useState(selectedStore?.id || stores[0]?.id || 1);
  const [deliveryAddress, setDeliveryAddress] = useState('Flat 402, Sunshine Apartments, Bandra West, Mumbai');
  const [timeSlot, setTimeSlot] = useState('Today (Within 2 Hours)');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const tax = Math.round(subtotal * 0.05 * 100) / 100;
  const deliveryFee = orderType === 'HOME_DELIVERY' ? (subtotal >= 500 ? 0 : 49) : 0;
  const total = subtotal + tax + deliveryFee;

  const handleCheckout = async () => {
    try {
      setSubmitting(true);
      const payload = {
        orderType,
        storeLocationId: orderType === 'STORE_PICKUP' ? storeId : null,
        deliveryAddress: orderType === 'HOME_DELIVERY' ? deliveryAddress : null,
        deliveryTimeSlot: timeSlot,
        notes
      };
      const order = await onPlaceOrder(payload);
      setPlacedOrder(order);
    } catch (err) {
      alert(err.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ justifyContent: 'flex-end', padding: 0 }}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Your Express Cart ({cartItems.length})</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {placedOrder ? (
          <div style={{ padding: 32, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <CheckCircle2 size={64} style={{ color: 'var(--primary)', marginBottom: 16 }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 8 }}>Order Placed Successfully!</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 20 }}>
              Order No: <strong style={{ color: 'var(--primary)' }}>{placedOrder.orderNumber}</strong>
            </p>

            {placedOrder.orderType === 'STORE_PICKUP' && (
              <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid var(--primary)', padding: 16, borderRadius: 'var(--radius-md)', width: '100%', marginBottom: 24 }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase' }}>Store Pickup Verification Code</span>
                <h1 style={{ fontSize: '2rem', letterSpacing: 4, color: '#fff', margin: '4px 0' }}>{placedOrder.pickupCode}</h1>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Show this 6-digit code at store counter for instant collection.</p>
              </div>
            )}

            <button className="btn btn-primary" onClick={() => { setPlacedOrder(null); onClose(); }}>
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Items List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
              {cartItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                  <p>Your cart is empty.</p>
                  <span style={{ fontSize: '0.85rem' }}>Browse items from store and add to cart!</span>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} style={{ display: 'flex', gap: 12, marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid var(--border-glass)', alignItems: 'center' }}>
                    <img src={item.product.imageUrl} alt={item.product.name} style={{ width: 60, height: 60, borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>{item.product.name}</h4>
                      <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>₹{item.product.price} / {item.product.unit}</span>
                    </div>

                    {/* Qty Controls */}
                    <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.06)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
                      <button 
                        onClick={() => onUpdateQty(item.id, Math.max(1, item.quantity - 1))}
                        style={{ border: 'none', background: 'none', color: '#fff', padding: '4px 8px', cursor: 'pointer' }}
                      >
                        <Minus size={12} />
                      </button>
                      <span style={{ padding: '0 8px', fontSize: '0.85rem', fontWeight: 700 }}>{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQty(item.id, item.quantity + 1)}
                        style={{ border: 'none', background: 'none', color: '#fff', padding: '4px 8px', cursor: 'pointer' }}
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <button onClick={() => onRemoveItem(item.id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: 4 }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}

              {cartItems.length > 0 && (
                <div style={{ marginTop: 24 }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: 12 }}>Fulfillment Option</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                    <button 
                      className={`btn ${orderType === 'HOME_DELIVERY' ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setOrderType('HOME_DELIVERY')}
                      style={{ fontSize: '0.85rem' }}
                    >
                      <Truck size={16} /> Home Delivery
                    </button>
                    <button 
                      className={`btn ${orderType === 'STORE_PICKUP' ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setOrderType('STORE_PICKUP')}
                      style={{ fontSize: '0.85rem' }}
                    >
                      <Store size={16} /> Store Pickup
                    </button>
                  </div>

                  {orderType === 'STORE_PICKUP' ? (
                    <div className="form-group">
                      <label className="form-label">Select Pickup Store Branch</label>
                      <select 
                        className="form-control" 
                        value={storeId} 
                        onChange={(e) => setStoreId(Number(e.target.value))}
                      >
                        {stores.map(s => (
                          <option key={s.id} value={s.id}>{s.name} - {s.address}</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="form-group">
                      <label className="form-label">Delivery Address</label>
                      <textarea 
                        className="form-control" 
                        rows={2} 
                        value={deliveryAddress} 
                        onChange={(e) => setDeliveryAddress(e.target.value)} 
                      />
                    </div>
                  )}

                  <div className="form-group">
                    <label className="form-label">Preferred Time Slot</label>
                    <select className="form-control" value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)}>
                      <option value="Today (Within 2 Hours)">Today (Within 2 Hours Express)</option>
                      <option value="Today (4:00 PM - 7:00 PM)">Today (4:00 PM - 7:00 PM)</option>
                      <option value="Tomorrow (8:00 AM - 11:00 AM)">Tomorrow Morning (8:00 AM - 11:00 AM)</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Summary */}
            {cartItems.length > 0 && (
              <div style={{ padding: 24, borderTop: '1px solid var(--border-glass)', background: 'rgba(0,0,0,0.3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 6 }}>
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 6 }}>
                  <span>GST (5%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 12 }}>
                  <span>Delivery Fee</span>
                  <span>{deliveryFee === 0 ? <strong style={{ color: 'var(--primary)' }}>FREE</strong> : `₹${deliveryFee}`}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800, color: '#fff', marginBottom: 16 }}>
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>

                <button 
                  className="btn btn-primary" 
                  disabled={submitting} 
                  onClick={handleCheckout}
                  style={{ width: '100%', padding: '12px 20px', fontSize: '1rem' }}
                >
                  {submitting ? 'Processing Order...' : 'Confirm & Place Order'} <ArrowRight size={18} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
