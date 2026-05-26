import React, { useMemo, useState } from 'react';

export default function Receipts() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [showAdd, setShowAdd] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const perPage = 10;

  const [receipts, setReceipts] = useState([
    ['RCT-001', 'INV-001', 'John Kamau', 'john@email.com', 'KES 5,000', 'Paid', '2026-05-18'],
    ['RCT-002', 'INV-008', 'Peter Otieno', 'peter@email.com', 'KES 15,000', 'Paid', '2026-05-12'],
    ['RCT-003', 'INV-010', 'David Mutua', 'david@email.com', 'KES 3,900', 'Paid', '2026-05-10']
  ]);

  const [form, setForm] = useState({
    receipt: '',
    invoice: '',
    customer: '',
    email: '',
    amount: '',
    status: 'Paid',
    date: new Date().toISOString().slice(0, 10)
  });

  const filtered = useMemo(() => {
    return receipts.filter(r => {
      const text = r.join(' ').toLowerCase();
      return text.includes(search.toLowerCase()) && (statusFilter === 'All' || r[5] === statusFilter);
    });
  }, [receipts, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const addReceipt = () => {
    if (!form.customer || !form.email || !form.amount) {
      alert('Fill customer, email and amount');
      return;
    }

    const newReceipt = [
      form.receipt || `RCT-${String(receipts.length + 1).padStart(3, '0')}`,
      form.invoice || `INV-${String(receipts.length + 1).padStart(3, '0')}`,
      form.customer,
      form.email,
      form.amount.startsWith('KES') ? form.amount : `KES ${form.amount}`,
      form.status,
      form.date
    ];

    setReceipts([newReceipt, ...receipts]);
    setShowAdd(false);
    setForm({
      receipt: '',
      invoice: '',
      customer: '',
      email: '',
      amount: '',
      status: 'Paid',
      date: new Date().toISOString().slice(0, 10)
    });
  };

  const printReceipt = (r) => {
    const html = `
      <html>
        <head>
          <title>${r[0]}</title>
          <style>
            body { font-family: Arial; padding: 30px; background:#f7fbf6; }
            .receipt { max-width: 560px; margin:auto; background:white; padding:32px; border-radius:18px; border:1px solid #dce8d7; }
            h1 { color:#064e2b; margin:0; }
            .row { display:flex; justify-content:space-between; border-bottom:1px solid #eee; padding:12px 0; }
            .amount { font-size:24px; color:#078144; font-weight:bold; }
            .paid { background:#dcfce7; color:#166534; padding:8px 14px; border-radius:999px; display:inline-block; font-weight:bold; }
          </style>
        </head>
        <body>
          <div class="receipt">
            <h1>Kiambu CRM</h1>
            <p>Official Payment Receipt</p>
            <p class="paid">${r[5]}</p>
            <div class="row"><b>Receipt No.</b><span>${r[0]}</span></div>
            <div class="row"><b>Invoice No.</b><span>${r[1]}</span></div>
            <div class="row"><b>Customer</b><span>${r[2]}</span></div>
            <div class="row"><b>Email</b><span>${r[3]}</span></div>
            <div class="row"><b>Date</b><span>${r[6]}</span></div>
            <div class="row"><b>Amount</b><span class="amount">${r[4]}</span></div>
            <p>Generated on ${new Date().toLocaleString()}</p>
          </div>
        </body>
      </html>
    `;

    const win = window.open('', '_blank');
    win.document.write(html);
    win.document.close();
    win.print();
  };

  const sendReceipt = (r) => {
    const subject = `Payment Receipt ${r[0]}`;
    const body = `Hello ${r[2]},

Thank you for your payment.

Receipt Details:
Receipt No: ${r[0]}
Invoice No: ${r[1]}
Amount Paid: ${r[4]}
Status: ${r[5]}
Date: ${r[6]}

You can print this email as your official receipt.

Regards,
Kiambu CRM`;

    window.location.href = `mailto:${r[3]}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <section>
      <div className="page-header premium-header">
        <div>
          <h2>Receipts</h2>
          <p>Ready-to-print receipts and email sending for paid invoices.</p>
        </div>

        <button className="green-btn" onClick={() => setShowAdd(true)}>+ Add Receipt</button>
      </div>

      <div className="panel">
        <div className="table-toolbar">
          <div>
            <h3>Receipt Center</h3>
            <p>Search, filter, view, print and send customer receipts.</p>
          </div>

          <div className="toolbar-actions">
            <input
              className="search-input"
              placeholder="Search receipt, invoice, customer..."
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />

            <select
              className="filter-select"
              value={statusFilter}
              onChange={e => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
            >
              <option>All</option>
              <option>Paid</option>
              <option>Pending</option>
              <option>Cancelled</option>
            </select>
          </div>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Receipt No.</th>
              <th>Invoice</th>
              <th>Customer</th>
              <th>Email</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginated.length === 0 ? (
              <tr><td colSpan="8">No receipts found.</td></tr>
            ) : paginated.map(r => (
              <tr key={r[0]}>
                <td><strong>{r[0]}</strong></td>
                <td>{r[1]}</td>
                <td>{r[2]}</td>
                <td>{r[3]}</td>
                <td>{r[4]}</td>
                <td><span className="status success">{r[5]}</span></td>
                <td>{r[6]}</td>
                <td>
                  <div className="customer-action-buttons">
                    <button onClick={() => setSelectedReceipt(r)}>View</button>
                    <button onClick={() => printReceipt(r)}>Print</button>
                    <button className="receipt-btn" onClick={() => sendReceipt(r)}>Send Receipt</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="clean-pagination">
          <span>
            Showing {paginated.length ? ((page - 1) * perPage) + 1 : 0}–
            {Math.min(page * perPage, filtered.length)} of {filtered.length} receipts
          </span>

          <div className="pagination-controls">
            <button className="page-btn" disabled={page <= 1} onClick={() => setPage(page - 1)}>←</button>
            <button className="page-number active">{page}</button>
            <button className="page-btn" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>→</button>
          </div>
        </div>
      </div>

      {showAdd && (
        <div className="modal-overlay">
          <div className="customer-popup">
            <div className="popup-header">
              <h3>Add Receipt Manually</h3>
              <button className="close-btn" onClick={() => setShowAdd(false)}>×</button>
            </div>

            <form className="popup-form">
              <input placeholder="Receipt No. optional" value={form.receipt} onChange={e => setForm({...form, receipt:e.target.value})} />
              <input placeholder="Invoice No. optional" value={form.invoice} onChange={e => setForm({...form, invoice:e.target.value})} />
              <input placeholder="Customer Name" value={form.customer} onChange={e => setForm({...form, customer:e.target.value})} />
              <input placeholder="Customer Email" value={form.email} onChange={e => setForm({...form, email:e.target.value})} />
              <input placeholder="Amount e.g 5000 or KES 5,000" value={form.amount} onChange={e => setForm({...form, amount:e.target.value})} />

              <select value={form.status} onChange={e => setForm({...form, status:e.target.value})}>
                <option>Paid</option>
                <option>Pending</option>
                <option>Cancelled</option>
              </select>

              <input type="date" value={form.date} onChange={e => setForm({...form, date:e.target.value})} />

              <div className="popup-actions">
                <button type="button" className="secondary-btn" onClick={() => setShowAdd(false)}>Cancel</button>
                <button type="button" className="primary-btn" onClick={addReceipt}>Save Receipt</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedReceipt && (
        <div className="modal-overlay">
          <div className="customer-popup receipt-popup">
            <div className="popup-header">
              <h3>Receipt Preview</h3>
              <button className="close-btn" onClick={() => setSelectedReceipt(null)}>×</button>
            </div>

            <div className="receipt-preview">
              <h2>Kiambu CRM</h2>
              <p><b>Receipt No:</b> {selectedReceipt[0]}</p>
              <p><b>Invoice:</b> {selectedReceipt[1]}</p>
              <p><b>Customer:</b> {selectedReceipt[2]}</p>
              <p><b>Email:</b> {selectedReceipt[3]}</p>
              <p><b>Amount:</b> {selectedReceipt[4]}</p>
              <p><b>Status:</b> {selectedReceipt[5]}</p>
              <p><b>Date:</b> {selectedReceipt[6]}</p>
            </div>

            <div className="popup-actions">
              <button className="secondary-btn" onClick={() => sendReceipt(selectedReceipt)}>Send Receipt</button>
              <button className="primary-btn" onClick={() => printReceipt(selectedReceipt)}>Print Receipt</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
