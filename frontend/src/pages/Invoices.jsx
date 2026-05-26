import React, { useMemo, useState } from 'react';

export default function Invoices() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const perPage = 10;

  const [invoices, setInvoices] = useState([
    ['INV-001', 'John Kamau', 'john@email.com', 'KES 5,000', '2026-05-18', 'Paid'],
    ['INV-002', 'Mary Njeri', 'mary@email.com', 'KES 1,750', '2026-05-18', 'Pending'],
    ['INV-003', 'Agrovet Kiambu', 'sales@agrovet.co.ke', 'KES 32,000', '2026-05-17', 'Overdue']
  ]);

  const [form, setForm] = useState({
    customer: '',
    email: '',
    amount: '',
    date: new Date().toISOString().slice(0, 10),
    status: 'Pending'
  });

  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv =>
      inv.join(' ').toLowerCase().includes(search.toLowerCase()) &&
      (statusFilter === 'All' || inv[5] === statusFilter)
    );
  }, [invoices, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredInvoices.length / perPage));
  const paginated = filteredInvoices.slice((page - 1) * perPage, page * perPage);

  const badgeClass = s =>
    s === 'Paid' ? 'status success' :
    s === 'Pending' ? 'status warning' :
    'status danger';

  const createInvoice = () => {
    if (!form.customer || !form.email || !form.amount) {
      alert('Fill customer, email and amount');
      return;
    }

    const invoice = [
      `INV-${String(invoices.length + 1).padStart(3, '0')}`,
      form.customer,
      form.email,
      form.amount.startsWith('KES') ? form.amount : `KES ${form.amount}`,
      form.date,
      form.status
    ];

    setInvoices([invoice, ...invoices]);
    setShowCreate(false);
    setForm({
      customer: '',
      email: '',
      amount: '',
      date: new Date().toISOString().slice(0, 10),
      status: 'Pending'
    });
  };

  const printInvoice = (inv) => {
    const html = `
      <html>
      <head>
        <title>${inv[0]}</title>
        <style>
          body { font-family: Arial; padding:30px; background:#f7fbf6; }
          .box { max-width:650px; margin:auto; background:white; padding:30px; border-radius:18px; border:1px solid #dce8d7; }
          h1 { color:#064e2b; margin:0; }
          .row { display:flex; justify-content:space-between; border-bottom:1px solid #eee; padding:12px 0; }
          .amount { color:#078144; font-size:24px; font-weight:bold; }
        </style>
      </head>
      <body>
        <div class="box">
          <h1>Kiambu CRM</h1>
          <p>Customer Invoice</p>
          <div class="row"><b>Invoice No.</b><span>${inv[0]}</span></div>
          <div class="row"><b>Customer</b><span>${inv[1]}</span></div>
          <div class="row"><b>Email</b><span>${inv[2]}</span></div>
          <div class="row"><b>Date</b><span>${inv[4]}</span></div>
          <div class="row"><b>Status</b><span>${inv[5]}</span></div>
          <div class="row"><b>Amount</b><span class="amount">${inv[3]}</span></div>
        </div>
      </body>
      </html>
    `;

    const win = window.open('', '_blank');
    win.document.write(html);
    win.document.close();
    win.print();
  };

  return (
    <section>
      <div className="page-header premium-header">
        <div>
          <h2>Invoices</h2>
          <p>Create, track, print and manage customer invoices professionally.</p>
        </div>
        <button className="green-btn" onClick={() => setShowCreate(true)}>+ Create Invoice</button>
      </div>

      <div className="cards">
        <div className="card premium-card"><p>Total Invoices</p><h3>{invoices.length}</h3></div>
        <div className="card premium-card"><p>Paid</p><h3>{invoices.filter(i => i[5] === 'Paid').length}</h3></div>
        <div className="card premium-card"><p>Pending</p><h3>{invoices.filter(i => i[5] === 'Pending').length}</h3></div>
        <div className="card premium-card"><p>Overdue</p><h3>{invoices.filter(i => i[5] === 'Overdue').length}</h3></div>
      </div>

      <div className="panel">
        <div className="table-toolbar">
          <div>
            <h3>Recent Invoices</h3>
            <p>Search, filter, view and print invoices.</p>
          </div>

          <div className="toolbar-actions">
            <input className="search-input" placeholder="Search invoice..." value={search} onChange={e => setSearch(e.target.value)} />
            <select className="filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option>All</option>
              <option>Paid</option>
              <option>Pending</option>
              <option>Overdue</option>
            </select>
            <button className="ghost-btn" onClick={() => window.print()}>Print</button>
          </div>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Invoice No.</th>
              <th>Customer</th>
              <th>Email</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginated.map(inv => (
              <tr key={inv[0]}>
                <td><strong>{inv[0]}</strong></td>
                <td>{inv[1]}</td>
                <td>{inv[2]}</td>
                <td>{inv[3]}</td>
                <td>{inv[4]}</td>
                <td><span className={badgeClass(inv[5])}>{inv[5]}</span></td>
                <td>
                  <div className="customer-action-buttons">
                    <button onClick={() => setSelectedInvoice(inv)}>View</button>
                    <button onClick={() => printInvoice(inv)}>Print</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="clean-pagination">
          <span>Showing {paginated.length ? ((page - 1) * perPage) + 1 : 0}–{Math.min(page * perPage, filteredInvoices.length)} of {filteredInvoices.length} invoices</span>
          <div className="pagination-controls">
            <button className="page-btn" disabled={page <= 1} onClick={() => setPage(page - 1)}>←</button>
            <button className="page-number active">{page}</button>
            <button className="page-btn" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>→</button>
          </div>
        </div>
      </div>

      {showCreate && (
        <div className="modal-overlay">
          <div className="customer-popup">
            <div className="popup-header">
              <h3>Create Invoice</h3>
              <button className="close-btn" onClick={() => setShowCreate(false)}>×</button>
            </div>

            <form className="popup-form">
              <input placeholder="Customer Name" value={form.customer} onChange={e => setForm({...form, customer:e.target.value})} />
              <input placeholder="Customer Email" value={form.email} onChange={e => setForm({...form, email:e.target.value})} />
              <input placeholder="Amount e.g 5000" value={form.amount} onChange={e => setForm({...form, amount:e.target.value})} />
              <input type="date" value={form.date} onChange={e => setForm({...form, date:e.target.value})} />
              <select value={form.status} onChange={e => setForm({...form, status:e.target.value})}>
                <option>Pending</option>
                <option>Paid</option>
                <option>Overdue</option>
              </select>

              <div className="popup-actions">
                <button type="button" className="secondary-btn" onClick={() => setShowCreate(false)}>Cancel</button>
                <button type="button" className="primary-btn" onClick={createInvoice}>Save Invoice</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedInvoice && (
        <div className="modal-overlay">
          <div className="customer-popup">
            <div className="popup-header">
              <h3>Invoice Details</h3>
              <button className="close-btn" onClick={() => setSelectedInvoice(null)}>×</button>
            </div>

            <div className="receipt-preview">
              <h2>{selectedInvoice[0]}</h2>
              <p><b>Customer:</b> {selectedInvoice[1]}</p>
              <p><b>Email:</b> {selectedInvoice[2]}</p>
              <p><b>Amount:</b> {selectedInvoice[3]}</p>
              <p><b>Date:</b> {selectedInvoice[4]}</p>
              <p><b>Status:</b> {selectedInvoice[5]}</p>
            </div>

            <div className="popup-actions">
              <button className="secondary-btn" onClick={() => setSelectedInvoice(null)}>Close</button>
              <button className="primary-btn" onClick={() => printInvoice(selectedInvoice)}>Print</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
