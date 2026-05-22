import React, { useState } from 'react';

export default function Payments() {
  const [showForm, setShowForm] = useState(false);

  const payments = [
    ['MPESA-001', 'John Kamau', 'KES 5,000', 'M-PESA', 'Paid'],
    ['MPESA-002', 'Mary Njeri', 'KES 1,750', 'M-PESA', 'Paid'],
    ['INV-003', 'Agrovet Kiambu', 'KES 32,000', 'Bank/Cash', 'Pending']
  ];

  return React.createElement('section', null,
    React.createElement('div', { className: 'page-header premium-header customer-header' },
      React.createElement('div', null,
        React.createElement('h2', null, 'Payments & Invoices'),
        React.createElement('p', null, 'Track M-PESA payments, invoices, balances and customer transactions.')
      ),
      React.createElement('button', { className: 'top-add-btn', onClick: () => setShowForm(true) }, '+ Record Payment')
    ),

    showForm && React.createElement('div', { className: 'modal-overlay' },
      React.createElement('div', { className: 'customer-popup' },
        React.createElement('div', { className: 'popup-header' },
          React.createElement('h3', null, 'Record Payment'),
          React.createElement('button', { className: 'close-btn', onClick: () => setShowForm(false) }, '×')
        ),
        React.createElement('form', { className: 'popup-form' },
          React.createElement('input', { placeholder: 'Customer Name' }),
          React.createElement('input', { placeholder: 'Amount Paid' }),
          React.createElement('input', { placeholder: 'M-PESA Code / Reference' }),
          React.createElement('select', null,
            React.createElement('option', null, 'M-PESA'),
            React.createElement('option', null, 'Cash'),
            React.createElement('option', null, 'Bank')
          ),
          React.createElement('textarea', { placeholder: 'Payment Notes' }),
          React.createElement('div', { className: 'popup-actions' },
            React.createElement('button', { type: 'button', className: 'secondary-btn', onClick: () => setShowForm(false) }, 'Cancel'),
            React.createElement('button', { type: 'button', className: 'primary-btn', onClick: () => setShowForm(false) }, 'Save Payment')
          )
        )
      )
    ),

    React.createElement('div', { className: 'panel' },
      React.createElement('h3', null, 'Recent Payments'),
      React.createElement('table', { className: 'data-table' },
        React.createElement('tbody', null,
          payments.map((p, i) =>
            React.createElement('tr', { key: i },
              React.createElement('td', null, p[0]),
              React.createElement('td', null, p[1]),
              React.createElement('td', null, p[2]),
              React.createElement('td', null, p[3]),
              React.createElement('td', null, React.createElement('span', { className: p[4] === 'Pending' ? 'status warning' : 'status success' }, p[4]))
            )
          )
        )
      )
    )
  );
}
