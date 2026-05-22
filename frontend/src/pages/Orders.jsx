import React, { useState } from 'react';

export default function Orders() {
  const [showForm, setShowForm] = useState(false);

  const orders = [
    ['#ORD-001', 'John Kamau', 'NPK Fertilizer x2', 'KES 5,000', 'Pending'],
    ['#ORD-002', 'Agrovet Kiambu', 'DAP Fertilizer x10', 'KES 32,000', 'Processing'],
    ['#ORD-003', 'Mary Njeri', 'Spinach Seeds x5', 'KES 1,750', 'Completed']
  ];

  return React.createElement('section', null,
    React.createElement('div', { className: 'page-header premium-header customer-header' },
      React.createElement('div', null,
        React.createElement('h2', null, 'Sales Orders'),
        React.createElement('p', null, 'Manage customer orders, delivery status, invoices and sales records.')
      ),
      React.createElement('button', { className: 'top-add-btn', onClick: () => setShowForm(true) }, '+ Create Order')
    ),

    showForm && React.createElement('div', { className: 'modal-overlay' },
      React.createElement('div', { className: 'customer-popup' },
        React.createElement('div', { className: 'popup-header' },
          React.createElement('h3', null, 'Create Order'),
          React.createElement('button', { className: 'close-btn', onClick: () => setShowForm(false) }, '×')
        ),
        React.createElement('form', { className: 'popup-form' },
          React.createElement('input', { placeholder: 'Customer Name' }),
          React.createElement('input', { placeholder: 'Phone Number' }),
          React.createElement('input', { placeholder: 'Product / Item' }),
          React.createElement('input', { placeholder: 'Quantity' }),
          React.createElement('input', { placeholder: 'Total Amount' }),
          React.createElement('select', null,
            React.createElement('option', null, 'Pending'),
            React.createElement('option', null, 'Processing'),
            React.createElement('option', null, 'Completed')
          ),
          React.createElement('textarea', { placeholder: 'Order Notes / Delivery Details' }),
          React.createElement('div', { className: 'popup-actions' },
            React.createElement('button', { type: 'button', className: 'secondary-btn', onClick: () => setShowForm(false) }, 'Cancel'),
            React.createElement('button', { type: 'button', className: 'primary-btn', onClick: () => setShowForm(false) }, 'Save Order')
          )
        )
      )
    ),

    React.createElement('div', { className: 'panel' },
      React.createElement('h3', null, 'Recent Orders'),
      React.createElement('table', { className: 'data-table' },
        React.createElement('tbody', null,
          orders.map((o, i) =>
            React.createElement('tr', { key: i },
              React.createElement('td', null, o[0]),
              React.createElement('td', null, o[1]),
              React.createElement('td', null, o[2]),
              React.createElement('td', null, o[3]),
              React.createElement('td', null, React.createElement('span', { className: 'status success' }, o[4]))
            )
          )
        )
      )
    )
  );
}
