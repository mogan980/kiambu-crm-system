import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function Customers() {
  const emptyForm = {
    name: '',
    phone: '',
    email: '',
    county: '',
    location: '',
    customer_type: 'Farmer',
    notes: ''
  };

  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');

  const loadCustomers = () => {
    api.get('/customers')
      .then(res => setCustomers(res.data.data || []))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const updateField = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const saveCustomer = (e) => {
    e.preventDefault();

    const request = editingId
      ? api.put('/customers/' + editingId, form)
      : api.post('/customers', form);

    request.then(() => {
      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
      loadCustomers();
    });
  };

  const editCustomer = (customer) => {
    setEditingId(customer.id);
    setShowForm(true);
    setForm({
      name: customer.name || '',
      phone: customer.phone || '',
      email: customer.email || '',
      county: customer.county || '',
      location: customer.location || '',
      customer_type: customer.customer_type || 'Farmer',
      notes: customer.notes || ''
    });
  };

  const deleteCustomer = (id) => {
    if (!confirm('Delete this customer?')) return;
    api.delete('/customers/' + id).then(() => loadCustomers());
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const filteredCustomers = customers.filter(customer => {
    const text = [
      customer.name,
      customer.phone,
      customer.email,
      customer.county,
      customer.location,
      customer.customer_type,
      customer.notes
    ].join(' ').toLowerCase();

    const matchesSearch = text.includes(search.toLowerCase());
    const matchesFilter = filterType === 'All' || customer.customer_type === filterType;

    return matchesSearch && matchesFilter;
  });

  return React.createElement(
    'section',
    null,

    React.createElement(
      'div',
      { className: 'page-header customer-header' },
      React.createElement(
        'div',
        null,
        React.createElement('h2', null, 'Customers'),
        React.createElement('p', null, 'Add, edit, delete, search and filter customer records.')
      ),
      React.createElement(
        'button',
        {
          className: 'top-add-btn',
          onClick: () => {
            setEditingId(null);
            setForm(emptyForm);
            setShowForm(true);
          }
        },
        '+ Add Customer'
      )
    ),

    showForm &&
      React.createElement(
        'div',
        { className: 'modal-overlay' },
        React.createElement(
          'div',
          { className: 'customer-popup' },
          React.createElement(
            'div',
            { className: 'popup-header' },
            React.createElement('h3', null, editingId ? 'Edit Customer' : 'Add Customer'),
            React.createElement('button', { className: 'close-btn', onClick: closeForm }, '×')
          ),

          React.createElement(
            'form',
            { className: 'popup-form', onSubmit: saveCustomer },

            React.createElement('input', {
              placeholder: 'Customer Name',
              value: form.name,
              onChange: e => updateField('name', e.target.value),
              required: true
            }),

            React.createElement('input', {
              placeholder: 'Phone',
              value: form.phone,
              onChange: e => updateField('phone', e.target.value)
            }),

            React.createElement('input', {
              placeholder: 'Email',
              value: form.email,
              onChange: e => updateField('email', e.target.value)
            }),

            React.createElement('input', {
              placeholder: 'County',
              value: form.county,
              onChange: e => updateField('county', e.target.value)
            }),

            React.createElement('input', {
              placeholder: 'Location',
              value: form.location,
              onChange: e => updateField('location', e.target.value)
            }),

            React.createElement(
              'select',
              {
                value: form.customer_type,
                onChange: e => updateField('customer_type', e.target.value)
              },
              React.createElement('option', null, 'Farmer'),
              React.createElement('option', null, 'Retail Customer'),
              React.createElement('option', null, 'Wholesale Customer'),
              React.createElement('option', null, 'Supplier')
            ),

            React.createElement('textarea', {
              placeholder: 'Notes',
              value: form.notes,
              onChange: e => updateField('notes', e.target.value)
            }),

            React.createElement(
              'div',
              { className: 'popup-actions' },
              React.createElement(
                'button',
                { type: 'button', className: 'secondary-btn', onClick: closeForm },
                'Cancel'
              ),
              React.createElement(
                'button',
                { type: 'submit', className: 'primary-btn' },
                editingId ? 'Update Customer' : 'Save Customer'
              )
            )
          )
        )
      ),

    React.createElement(
      'div',
      { className: 'panel' },

      React.createElement(
        'div',
        { className: 'table-toolbar' },

        React.createElement(
          'div',
          null,
          React.createElement('h3', null, 'Customer List'),
          React.createElement(
            'p',
            null,
            'Search using name, phone, email, county, location, type or notes.'
          )
        ),

        React.createElement(
          'div',
          { className: 'toolbar-actions' },

          React.createElement('input', {
            className: 'search-input',
            placeholder: 'Search customer by any info...',
            value: search,
            onChange: e => setSearch(e.target.value)
          }),

          React.createElement(
            'select',
            {
              className: 'filter-select',
              value: filterType,
              onChange: e => setFilterType(e.target.value)
            },
            React.createElement('option', null, 'All'),
            React.createElement('option', null, 'Farmer'),
            React.createElement('option', null, 'Retail Customer'),
            React.createElement('option', null, 'Wholesale Customer'),
            React.createElement('option', null, 'Supplier')
          )
        )
      ),

      React.createElement(
        'table',
        { className: 'data-table' },
        React.createElement(
          'thead',
          null,
          React.createElement(
            'tr',
            null,
            React.createElement('th', null, 'Name'),
            React.createElement('th', null, 'Phone'),
            React.createElement('th', null, 'Email'),
            React.createElement('th', null, 'County'),
            React.createElement('th', null, 'Type'),
            React.createElement('th', null, 'Actions')
          )
        ),
        React.createElement(
          'tbody',
          null,
          filteredCustomers.length === 0
            ? React.createElement(
                'tr',
                null,
                React.createElement('td', { colSpan: 6 }, 'No customers found.')
              )
            : filteredCustomers.map(customer =>
                React.createElement(
                  'tr',
                  { key: customer.id },
                  React.createElement('td', null, customer.name),
                  React.createElement('td', null, customer.phone || '-'),
                  React.createElement('td', null, customer.email || '-'),
                  React.createElement('td', null, customer.county || '-'),
                  React.createElement('td', null, customer.customer_type || '-'),
                  React.createElement(
                    'td',
                    null,
                    React.createElement(
                      'button',
                      { className: 'small-btn', onClick: () => editCustomer(customer) },
                      'Edit'
                    ),
                    React.createElement(
                      'button',
                      { className: 'danger-btn', onClick: () => deleteCustomer(customer.id) },
                      'Delete'
                    )
                  )
                )
              )
        )
      )
    )
  );
}
