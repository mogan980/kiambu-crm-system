import React, { useEffect, useMemo, useState } from 'react';

export default function Orders() {
  const defaultOrders = [
    ['#ORD-001', 'John Kamau', 'NPK Fertilizer x2', 'KES 5,000', 'Pending', '0700000001', 'john@email.com'],
    ['#ORD-002', 'Agrovet Kiambu', 'DAP Fertilizer x10', 'KES 32,000', 'Processing', '0700000003', 'sales@agrovet.co.ke'],
    ['#ORD-003', 'Mary Njeri', 'Spinach Seeds x5', 'KES 1,750', 'Completed', '0700000002', 'mary@email.com']
  ];

  const defaultCustomers = [
    ['CUST-001', 'John Kamau', '0700000001', 'john@email.com', 'Kiambu', 'Farmer', 'KES 5,000', 'Paid'],
    ['CUST-002', 'Mary Njeri', '0700000002', 'mary@email.com', 'Nairobi', 'Retailer', 'KES 12,500', 'Pending'],
    ['CUST-003', 'Agrovet Kiambu', '0700000003', 'sales@agrovet.co.ke', 'Kiambu', 'Agrovet', 'KES 32,000', 'Paid']
  ];

  const [orders, setOrders] = useState(() => {
    return JSON.parse(localStorage.getItem('crm_orders') || 'null') || defaultOrders;
  });

  const [customers, setCustomers] = useState(() => {
    return JSON.parse(localStorage.getItem('crm_customers') || 'null') || defaultCustomers;
  });

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [page, setPage] = useState(1);
  const [showOrderForm, setShowOrderForm] = useState(false);

  const [newOrder, setNewOrder] = useState({
    customer: '',
    phone: '',
    email: '',
    product: '',
    amount: '',
    status: 'Pending',
    notes: ''
  });

  const perPage = 10;

  useEffect(() => {
    localStorage.setItem('crm_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    const refreshCustomers = () => {
      setCustomers(JSON.parse(localStorage.getItem('crm_customers') || 'null') || defaultCustomers);
    };

    window.addEventListener('storage', refreshCustomers);
    window.addEventListener('focus', refreshCustomers);

    return () => {
      window.removeEventListener('storage', refreshCustomers);
      window.removeEventListener('focus', refreshCustomers);
    };
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const text = order.join(' ').toLowerCase();
      return text.includes(search.toLowerCase()) && (status === 'All' || order[4] === status);
    });
  }, [orders, search, status]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / perPage));
  const paginatedOrders = filteredOrders.slice((page - 1) * perPage, page * perPage);

  const badgeClass = s =>
    s === 'Completed' ? 'status success' :
    s === 'Processing' ? 'status warning' :
    'status pending';

  const handleCustomerSelect = (customerId) => {
    const selected = customers.find(c => c[0] === customerId);

    if (!selected) {
      setNewOrder({
        ...newOrder,
        customer: '',
        phone: '',
        email: ''
      });
      return;
    }

    setNewOrder({
      ...newOrder,
      customer: selected[1],
      phone: selected[2],
      email: selected[3]
    });
  };

  const saveOrder = () => {
    if (!newOrder.customer || !newOrder.product || !newOrder.amount) {
      alert('Select customer, enter product and amount');
      return;
    }

    const order = [
      `#ORD-${String(orders.length + 1).padStart(3, '0')}`,
      newOrder.customer,
      newOrder.product,
      newOrder.amount.startsWith('KES') ? newOrder.amount : `KES ${newOrder.amount}`,
      newOrder.status,
      newOrder.phone,
      newOrder.email,
      newOrder.notes
    ];

    const updatedOrders = [order, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem('crm_orders', JSON.stringify(updatedOrders));

    setNewOrder({
      customer: '',
      phone: '',
      email: '',
      product: '',
      amount: '',
      status: 'Pending',
      notes: ''
    });

    setSearch('');
    setStatus('All');
    setPage(1);
    setShowOrderForm(false);

    alert('Order created successfully');
  };

  return (
    <section>
      <div className="page-header premium-header">
        <div>
          <h2>Sales Orders</h2>
          <p>Manage customer orders, delivery status, invoices and sales records.</p>
        </div>

        <button className="green-btn" onClick={() => setShowOrderForm(true)}>
          + Create Order
        </button>
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
              <th>Phone</th>
              <th>Email</th>
              <th>Product</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {paginatedOrders.length === 0 ? (
              <tr><td colSpan="7">No orders found.</td></tr>
            ) : paginatedOrders.map(order => (
              <tr key={order[0]}>
                <td><strong>{order[0]}</strong></td>
                <td>{order[1]}</td>
                <td>{order[5] || '-'}</td>
                <td>{order[6] || '-'}</td>
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
              <select onChange={e => handleCustomerSelect(e.target.value)}>
                <option value="">Select Customer</option>
                {customers.map(c => (
                  <option key={c[0]} value={c[0]}>
                    {c[1]} • {c[2]}
                  </option>
                ))}
              </select>

              <input placeholder="Customer Name" value={newOrder.customer} readOnly />
              <input placeholder="Phone" value={newOrder.phone} readOnly />
              <input placeholder="Email" value={newOrder.email} readOnly />

              <input
                placeholder="Product / Item"
                value={newOrder.product}
                onChange={e => setNewOrder({ ...newOrder, product: e.target.value })}
              />

              <input
                placeholder="Amount e.g 5000 or KES 5,000"
                value={newOrder.amount}
                onChange={e => setNewOrder({ ...newOrder, amount: e.target.value })}
              />

              <select
                value={newOrder.status}
                onChange={e => setNewOrder({ ...newOrder, status: e.target.value })}
              >
                <option>Pending</option>
                <option>Processing</option>
                <option>Completed</option>
              </select>

              <textarea
                placeholder="Order notes"
                value={newOrder.notes}
                onChange={e => setNewOrder({ ...newOrder, notes: e.target.value })}
              />

              <div className="popup-actions">
                <button type="button" className="secondary-btn" onClick={() => setShowOrderForm(false)}>
                  Cancel
                </button>

                <button type="button" className="primary-btn" onClick={saveOrder}>
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
