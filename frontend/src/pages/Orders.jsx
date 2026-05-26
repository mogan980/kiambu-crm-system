import React, { useEffect, useMemo, useState } from 'react';

export default function Orders() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [page, setPage] = useState(1);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const perPage = 10;

  useEffect(() => {
    const openQuickAdd = () => setShowOrderForm(true);
    window.addEventListener('crmQuickAdd', openQuickAdd);
    return () => window.removeEventListener('crmQuickAdd', openQuickAdd);
  }, []);

  const orders = [
    ['#ORD-001', 'John Kamau', 'NPK Fertilizer x2', 'KES 5,000', 'Pending'],
    ['#ORD-002', 'Agrovet Kiambu', 'DAP Fertilizer x10', 'KES 32,000', 'Processing'],
    ['#ORD-003', 'Mary Njeri', 'Spinach Seeds x5', 'KES 1,750', 'Completed'],
    ['#ORD-004', 'Brian Mwangi', 'Yara Mila Winner x4', 'KES 64,000', 'Pending'],
    ['#ORD-005', 'Alice Njoroge', 'Yellow Maize DK7500 x3', 'KES 9,600', 'Processing'],
    ['#ORD-006', 'James Kariuki', 'Pesticide Alpha x6', 'KES 12,400', 'Completed'],
    ['#ORD-007', 'Grace Wanjiku', 'CAN Fertilizer x5', 'KES 26,000', 'Pending'],
    ['#ORD-008', 'Peter Otieno', 'Urea Fertilizer x8', 'KES 38,400', 'Completed'],
    ['#ORD-009', 'Faith Achieng', 'Hybrid Seeds x2', 'KES 6,200', 'Processing'],
    ['#ORD-010', 'David Mutua', 'Farm Tools Set x1', 'KES 4,500', 'Completed'],
    ['#ORD-011', 'Mercy Wambui', 'Organic Manure x7', 'KES 8,400', 'Pending'],
    ['#ORD-012', 'Simon Maina', 'Glyphosate 1L x5', 'KES 8,000', 'Processing']
  ];

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const text = order.join(' ').toLowerCase();
      return text.includes(search.toLowerCase()) && (status === 'All' || order[4] === status);
    });
  }, [search, status]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / perPage));
  const paginatedOrders = filteredOrders.slice((page - 1) * perPage, page * perPage);

  const badgeClass = s =>
    s === 'Completed' ? 'status success' :
    s === 'Processing' ? 'status warning' :
    'status pending';

  return (
    <section>
      <div className="page-header premium-header">
        <div>
          <h2>Sales Orders</h2>
          <p>Manage customer orders, delivery status, invoices and sales records.</p>
        </div>
        <button className="green-btn" onClick={() => setShowOrderForm(true)}>+ Create Order</button>
      </div>

      <div className="panel">
        <div className="table-toolbar">
          <div>
            <h3>Recent Orders</h3>
            <p>Search and filter customer orders by order number, customer, product, amount or status.</p>
          </div>

          <div className="toolbar-actions">
            <input
              className="search-input"
              placeholder="Search orders..."
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />

            <select
              className="filter-select"
              value={status}
              onChange={e => {
                setStatus(e.target.value);
                setPage(1);
              }}
            >
              <option>All</option>
              <option>Pending</option>
              <option>Processing</option>
              <option>Completed</option>
            </select>
          </div>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Order No.</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {paginatedOrders.length === 0 ? (
              <tr><td colSpan="5">No orders found.</td></tr>
            ) : paginatedOrders.map(order => (
              <tr key={order[0]}>
                <td><strong>{order[0]}</strong></td>
                <td>{order[1]}</td>
                <td>{order[2]}</td>
                <td>{order[3]}</td>
                <td><span className={badgeClass(order[4])}>{order[4]}</span></td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="clean-pagination">
          <span>
            Showing {paginatedOrders.length ? ((page - 1) * perPage) + 1 : 0}–
            {Math.min(page * perPage, filteredOrders.length)} of {filteredOrders.length} orders
          </span>

          <div className="pagination-controls">
            <button className="page-btn" disabled={page <= 1} onClick={() => setPage(page - 1)}>←</button>
            <button className="page-number active">{page}</button>
            <button className="page-btn" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>→</button>
          </div>
        </div>
      </div>
    
      {showOrderForm && (
        <div className="modal-overlay">
          <div className="customer-popup">
            <div className="popup-header">
              <h3>Create Order</h3>
              <button className="close-btn" onClick={() => setShowOrderForm(false)}>×</button>
            </div>

            <form className="popup-form">
              <input placeholder="Customer Name" />
              <input placeholder="Product / Item" />
              <input placeholder="Quantity" />
              <input placeholder="Amount e.g KES 5,000" />

              <select>
                <option>Pending</option>
                <option>Processing</option>
                <option>Completed</option>
              </select>

              <textarea placeholder="Order notes" />

              <div className="popup-actions">
                <button type="button" className="secondary-btn" onClick={() => setShowOrderForm(false)}>
                  Cancel
                </button>

                <button type="button" className="primary-btn" onClick={() => setShowOrderForm(false)}>
                  Save Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </section>
  );
}
