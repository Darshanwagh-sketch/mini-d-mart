import React, { useState, useEffect } from 'react';
import { Search, Shield, PackageCheck, Truck, Store, CheckCircle, XCircle, Clock, ArrowRight } from 'lucide-react';
import { api } from '../api';

export default function StaffDashboard() {
  const [orders, setOrders] = useState([]);
  const [returns, setReturns] = useState([]);
  const [activeTab, setActiveTab] = useState('orders'); // orders | returns
  const [statusFilter, setStatusFilter] = useState('');
  const [pickupSearch, setPickupSearch] = useState('');
  const [searchedOrder, setSearchedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStaffData();
  }, [statusFilter]);

  const fetchStaffData = async () => {
    try {
      setLoading(true);
      const [orderList, returnList] = await Promise.all([
        api.getStaffOrders(statusFilter),
        api.getStaffReturns()
      ]);
      setOrders(orderList);
      setReturns(returnList);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus, 'Status updated by store staff');
      fetchStaffData();
    } catch (err) {
      alert(err.message || 'Failed to update order status');
    }
  };

  const handlePickupLookup = async (e) => {
    e.preventDefault();
    if (!pickupSearch.trim()) return;
    try {
      const res = await api.getOrderByPickupCode(pickupSearch);
      setSearchedOrder(res);
    } catch (err) {
      alert(err.message || 'Invalid pickup code');
    }
  };

  const handleProcessReturn = async (returnId, status) => {
    try {
      await api.processReturnRequest(returnId, status, 'Reviewed and processed by Store Staff');
      alert(`Return request marked as ${status}. Inventory updated.`);
      fetchStaffData();
    } catch (err) {
      alert(err.message || 'Failed to process return');
    }
  };

  return (
    <div>
      {/* Header Banner */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glass)', padding: 20, borderRadius: 'var(--radius-lg)', marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <span style={{ fontSize: '0.78rem', color: 'var(--secondary)', fontWeight: 700, textTransform: 'uppercase' }}>Store Operations & Fulfillment</span>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '4px 0' }}>Staff Operations Portal</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Confirm customer orders, dispatch items, verify store pickup codes, and process returns.</p>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className={`btn btn-sm ${activeTab === 'orders' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('orders')}>
            Active Orders Queue ({orders.length})
          </button>
          <button className={`btn btn-sm ${activeTab === 'returns' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('returns')}>
            Return Requests ({returns.length})
          </button>
        </div>
      </div>

      {/* Pickup Verification Tool */}
      <div style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid var(--secondary)', padding: 18, borderRadius: 'var(--radius-lg)', marginBottom: 24 }}>
        <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--secondary)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Store size={18} /> Quick Store Pickup Code Lookup
        </h4>
        <form onSubmit={handlePickupLookup} style={{ display: 'flex', gap: 10, maxWidth: 520, flexWrap: 'wrap' }}>
          <input 
            type="text" 
            className="form-control" 
            placeholder="Enter 6-digit pickup code (e.g. PK-123456)"
            value={pickupSearch}
            onChange={(e) => setPickupSearch(e.target.value)}
            style={{ flex: 1, minWidth: 200 }}
          />
          <button type="submit" className="btn btn-primary btn-sm" style={{ background: 'var(--secondary)' }}>Verify Code</button>
        </form>

        {searchedOrder && (
          <div style={{ marginTop: 14, background: 'rgba(0,0,0,0.3)', padding: 14, borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h5 style={{ fontWeight: 800 }}>Order #{searchedOrder.orderNumber} — Customer: {searchedOrder.user?.fullName}</h5>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Status: <strong>{searchedOrder.status}</strong> | Total Amount: ₹{searchedOrder.totalAmount}</span>
            </div>
            {searchedOrder.status !== 'DELIVERED' && (
              <button className="btn btn-primary btn-sm" onClick={() => { handleUpdateStatus(searchedOrder.id, 'DELIVERED'); setSearchedOrder(null); }}>
                <CheckCircle size={15} /> Mark Delivered / Handed Over
              </button>
            )}
          </div>
        )}
      </div>

      {activeTab === 'orders' ? (
        <>
          {/* Status Filters */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
            {['', 'PLACED', 'PREPARING', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY', 'DELIVERED'].map((st) => (
              <button 
                key={st}
                className={`btn btn-sm ${statusFilter === st ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setStatusFilter(st)}
              >
                {st === '' ? 'All Orders' : st}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: 40 }}>Loading queue...</div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Order No</th>
                    <th>Customer</th>
                    <th>Fulfillment</th>
                    <th>Slot / Pickup Code</th>
                    <th>Current Status</th>
                    <th>Total</th>
                    <th>Staff Action Workflow</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id}>
                      <td style={{ fontWeight: 700 }}>#{o.orderNumber}</td>
                      <td>{o.user?.fullName}<br/><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{o.user?.phone}</span></td>
                      <td>
                        <span className="brand-badge" style={{ background: o.orderType === 'STORE_PICKUP' ? 'rgba(59,130,246,0.2)' : 'rgba(16,185,129,0.2)', color: '#fff' }}>
                          {o.orderType === 'STORE_PICKUP' ? 'Pickup' : 'Delivery'}
                        </span>
                      </td>
                      <td>
                        {o.orderType === 'STORE_PICKUP' ? (
                          <strong style={{ color: 'var(--primary)' }}>{o.pickupCode}</strong>
                        ) : (
                          <span style={{ fontSize: '0.8rem' }}>{o.deliveryTimeSlot}</span>
                        )}
                      </td>
                      <td>
                        <span className={`brand-badge ${o.status === 'DELIVERED' ? 'badge-in-stock' : o.status === 'CANCELLED' ? 'badge-out-of-stock' : 'badge-low-stock'}`}>
                          {o.status}
                        </span>
                      </td>
                      <td style={{ fontWeight: 700 }}>₹{o.totalAmount}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {o.status === 'PLACED' && (
                            <button className="btn btn-secondary btn-sm" onClick={() => handleUpdateStatus(o.id, 'PREPARING')}>
                              1. Confirm & Start Prep <ArrowRight size={14} />
                            </button>
                          )}
                          {o.status === 'PREPARING' && (
                            <button className="btn btn-primary btn-sm" onClick={() => handleUpdateStatus(o.id, o.orderType === 'STORE_PICKUP' ? 'READY_FOR_PICKUP' : 'OUT_FOR_DELIVERY')}>
                              2. {o.orderType === 'STORE_PICKUP' ? 'Ready at Store' : 'Dispatch for Delivery'} <ArrowRight size={14} />
                            </button>
                          )}
                          {(o.status === 'READY_FOR_PICKUP' || o.status === 'OUT_FOR_DELIVERY') && (
                            <button className="btn btn-primary btn-sm" style={{ background: 'var(--success)' }} onClick={() => handleUpdateStatus(o.id, 'DELIVERED')}>
                              3. Mark Delivered <CheckCircle size={14} />
                            </button>
                          )}
                          {o.status === 'DELIVERED' && (
                            <span style={{ fontSize: '0.78rem', color: 'var(--success)', fontWeight: 700 }}>✓ Completed</span>
                          )}
                          {o.status === 'CANCELLED' && (
                            <span style={{ fontSize: '0.78rem', color: 'var(--danger)', fontWeight: 700 }}>Cancelled</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : (
        /* Return Requests Queue */
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Req No</th>
                <th>Order No</th>
                <th>Item</th>
                <th>Type</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {returns.map((r) => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 700 }}>{r.requestNumber}</td>
                  <td>#{r.order?.orderNumber}</td>
                  <td>{r.item?.product?.name} (Qty: {r.quantity})</td>
                  <td><strong>{r.requestType}</strong></td>
                  <td style={{ fontSize: '0.85rem' }}>{r.reason}</td>
                  <td>
                    <span className={`brand-badge ${r.status === 'APPROVED' || r.status === 'PROCESSED' ? 'badge-in-stock' : r.status === 'REJECTED' ? 'badge-out-of-stock' : 'badge-low-stock'}`}>
                      {r.status}
                    </span>
                  </td>
                  <td>
                    {r.status === 'PENDING' && (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-primary btn-sm" onClick={() => handleProcessReturn(r.id, 'APPROVED')}>
                          Approve & Restock
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleProcessReturn(r.id, 'REJECTED')}>
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
