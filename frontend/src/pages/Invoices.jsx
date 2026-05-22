import React, { useState } from 'react';

export default function Invoices() {
  const [showForm, setShowForm] = useState(false);

  const invoices = [
    ['INV-001', 'John Kamau', 'KES 5,000', '2026-05-18', 'Paid'],
    ['INV-002', 'Mary Njeri', 'KES 1,750', '2026-05-18', 'Pending'],
    ['INV-003', 'Agrovet Kiambu', 'KES 32,000', '2026-05-17', 'Overdue']
  ];

  return React.createElement(
    'section',
    null,

    React.createElement(
      'div',
      { className: 'page-header premium-header customer-header' },
      React.createElement(
        'div',
        null,
        React.createElement('h2', null, 'Invoices'),
        React.createElement('p', null, 'Create, track, print and manage customer invoices professionally.')
      ),
      React.createElement(
        'button',
        { className: 'top-add-btn', onClick: () => setShowForm(true) },
        '+ Create Invoice'
      )
    ),

    showForm && React.createElement(
      'div',
      { className: 'modal-overlay' },
      React.createElement(
        'div',
        { className: 'customer-popup' },
        React.createElement(
          'div',
          { className: 'popup-header' },
          React.createElement('h3', null, 'Create Invoice'),
          React.createElement('button', { className: 'close-btn', onClick: () => setShowForm(false) }, '×')
        ),

        React.createElement(
          'form',
          { className: 'popup-form' },
          React.createElement('input', { placeholder: 'Customer Name' }),
          React.createElement('input', { placeholder: 'Customer Phone / Email' }),
          React.createElement('input', { placeholder: 'Invoice Number e.g INV-004' }),
          React.createElement('input', { type: 'date' }),
          React.createElement('input', { placeholder: 'Product / Service' }),
          React.createElement('input', { placeholder: 'Quantity' }),
          React.createElement('input', { placeholder: 'Unit Price' }),
          React.createElement('select', null,
            React.createElement('option', null, 'Pending'),
            React.createElement('option', null, 'Paid'),
            React.createElement('option', null, 'Overdue'),
            React.createElement('option', null, 'Cancelled')
          ),
          React.createElement('textarea', { placeholder: 'Invoice Notes / Payment Terms' }),

          React.createElement(
            'div',
            { className: 'popup-actions' },
            React.createElement('button', { type: 'button', className: 'secondary-btn', onClick: () => setShowForm(false) }, 'Cancel'),
            React.createElement('button', { type: 'button', className: 'primary-btn', onClick: () => setShowForm(false) }, 'Save Invoice')
          )
        )
      )
    ),

    React.createElement(
      'div',
      { className: 'cards' },
      React.createElement('div', { className: 'card premium-card' }, React.createElement('p', null, 'Total Invoices'), React.createElement('h3', null, '12')),
      React.createElement('div', { className: 'card premium-card' }, React.createElement('p', null, 'Paid'), React.createElement('h3', null, 'KES 45K')),
      React.createElement('div', { className: 'card premium-card' }, React.createElement('p', null, 'Pending'), React.createElement('h3', null, 'KES 32K')),
      React.createElement('div', { className: 'card premium-card' }, React.createElement('p', null, 'Overdue'), React.createElement('h3', null, 'KES 8K'))
    ),

    React.createElement(
      'div',
      { className: 'invoice-tools' },
      React.createElement('input', { placeholder: 'Search invoice, customer, status...' }),
      React.createElement('button', { className: 'secondary-btn' }, 'Export PDF'),
      React.createElement('button', { className: 'secondary-btn' }, 'Print')
    ),

    React.createElement(
      'div',
      { className: 'panel' },
      React.createElement('h3', null, 'Recent Invoices'),

      React.createElement(
        'table',
        { className: 'data-table' },
        React.createElement(
          'thead',
          null,
          React.createElement(
            'tr',
            null,
            React.createElement('th', null, 'Invoice No.'),
            React.createElement('th', null, 'Customer'),
            React.createElement('th', null, 'Amount'),
            React.createElement('th', null, 'Date'),
            React.createElement('th', null, 'Status'),
            React.createElement('th', null, 'Actions')
          )
        ),
        React.createElement(
          'tbody',
          null,
          invoices.map((invoice, i) =>
            React.createElement(
              'tr',
              { key: i },
              React.createElement('td', null, invoice[0]),
              React.createElement('td', null, invoice[1]),
              React.createElement('td', null, invoice[2]),
              React.createElement('td', null, invoice[3]),
              React.createElement(
                'td',
                null,
                React.createElement(
                  'span',
                  {
                    className:
                      invoice[4] === 'Paid'
                        ? 'status success'
                        : invoice[4] === 'Overdue'
                        ? 'status danger'
                        : 'status warning'
                  },
                  invoice[4]
                )
              ),
              React.createElement(
                'td',
                null,
                React.createElement('button', { className: 'small-btn' }, 'View'),
                React.createElement('button', { className: 'secondary-btn' }, 'Print')
              )
            )
          )
        )
      )
    )
  );
}
