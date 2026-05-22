import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({});
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const loadProducts = () => {
    api.get('/products', { params: { search, category } })
      .then(res => setProducts(res.data.data || []))
      .catch(err => console.log(err));

    api.get('/products/stats')
      .then(res => setStats(res.data || {}))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    loadProducts();
  }, [search, category]);

  const categories = ['All'].concat(stats.categories || []);

  return React.createElement(
    'section',
    null,

    React.createElement(
      'div',
      { className: 'page-header premium-header customer-header' },
      React.createElement(
        'div',
        null,
        React.createElement('h2', null, 'Products Inventory'),
        React.createElement('p', null, 'Real stock, prices and categories from KFCL inventory.')
      )
    ),

    React.createElement(
      'div',
      { className: 'cards' },
      React.createElement('div', { className: 'card premium-card' }, React.createElement('p', null, 'Total Products'), React.createElement('h3', null, stats.total_products || 0)),
      React.createElement('div', { className: 'card premium-card' }, React.createElement('p', null, 'Total Stock'), React.createElement('h3', null, Number(stats.total_stock || 0).toLocaleString())),
      React.createElement('div', { className: 'card premium-card' }, React.createElement('p', null, 'Stock Value'), React.createElement('h3', null, 'KES ' + Number(stats.stock_value || 0).toLocaleString())),
      React.createElement('div', { className: 'card premium-card' }, React.createElement('p', null, 'Low Stock'), React.createElement('h3', null, stats.low_stock || 0))
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
          React.createElement('h3', null, 'Product List'),
          React.createElement('p', null, 'Search by product name, SKU, category or status.')
        ),
        React.createElement(
          'div',
          { className: 'toolbar-actions' },
          React.createElement('input', {
            className: 'search-input',
            placeholder: 'Search products...',
            value: search,
            onChange: e => setSearch(e.target.value)
          }),
          React.createElement(
            'select',
            {
              className: 'filter-select',
              value: category,
              onChange: e => setCategory(e.target.value)
            },
            categories.map(c => React.createElement('option', { key: c }, c))
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
            React.createElement('th', null, 'Product'),
            React.createElement('th', null, 'SKU'),
            React.createElement('th', null, 'Category'),
            React.createElement('th', null, 'Price'),
            React.createElement('th', null, 'Stock'),
            React.createElement('th', null, 'Status')
          )
        ),
        React.createElement(
          'tbody',
          null,
          products.length === 0
            ? React.createElement('tr', null, React.createElement('td', { colSpan: 6 }, 'No products found.'))
            : products.map(product =>
                React.createElement(
                  'tr',
                  { key: product.id },
                  React.createElement('td', null, product.name),
                  React.createElement('td', null, product.sku || '-'),
                  React.createElement('td', null, product.category || '-'),
                  React.createElement('td', null, 'KES ' + Number(product.price || 0).toLocaleString()),
                  React.createElement('td', null, Number(product.stock || 0).toLocaleString()),
                  React.createElement(
                    'td',
                    null,
                    React.createElement(
                      'span',
                      { className: Number(product.stock || 0) <= 10 ? 'status danger' : 'status success' },
                      product.status || 'In Stock'
                    )
                  )
                )
              )
        )
      )
    )
  );
}
