import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({});
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({});
  const [showImport, setShowImport] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [file, setFile] = useState(null);

  const [form, setForm] = useState({
    name: '',
    sku: '',
    category: 'Agro-inputs',
    stock_qty: '',
    selling_price: '',
    qty: '',
    unit_price: ''
  });

  const loadProducts = () => {
    api.get('/products', { params: { search, category, page } }).then(res => {
      setProducts(res.data.data || []);
      setMeta(res.data || {});
    });

    api.get('/products/stats').then(res => setStats(res.data || {}));
  };

  useEffect(() => {
    loadProducts();
  }, [search, category, page]);

  const categories = ['All'].concat(stats.categories || []);

  const importProducts = () => {
    if (!file) return alert('Choose Excel or CSV file');

    const fd = new FormData();
    fd.append('file', file);

    api.post('/products/import', fd, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => {
      alert(`Imported ${res.data.imported} products`);
      setShowImport(false);
      setFile(null);
      loadProducts();
    });
  };

  const addProduct = () => {
    api.post('/products', form).then(() => {
      setShowAdd(false);
      setForm({
        name: '',
        sku: '',
        category: 'Agro-inputs',
        stock_qty: '',
        selling_price: '',
        qty: '',
        unit_price: ''
      });
      loadProducts();
    });
  };

  return (
    <section className="products-clean-page">

      <div className="products-main-header">
        <div className="products-icon">▣</div>

        <div>
          <h1>Products</h1>
          <p>Manage your products, inventory, pricing and stock in one place.</p>
        </div>

        <div className="products-main-actions">
          <button onClick={() => setShowImport(true)}>☁ Import Excel</button>
          <button>⇩ Export</button>
          <button className="primary" onClick={() => setShowAdd(true)}>+ Add Product</button>
        </div>
      </div>

      <div className="products-table-card">

        <div className="products-toolbar">
          <input
            placeholder="Search products..."
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />

          <select
            value={category}
            onChange={e => {
              setCategory(e.target.value);
              setPage(1);
            }}
          >
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        <table className="products-clean-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>SKU</th>
              <th>Category</th>
              <th>Stock Qty</th>
              <th>Selling Price</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="9" className="empty-products">No products found.</td>
              </tr>
            ) : products.map(p => (
              <tr key={p.id}>
                <td><strong>{p.name}</strong></td>
                <td>{p.sku}</td>
                <td>{p.category}</td>
                <td className={Number(p.stock_qty || 0) <= 10 ? 'stock-low' : 'stock-ok'}>
                  {Number(p.stock_qty || 0).toLocaleString()}
                </td>
                <td>KES {Number(p.selling_price || 0).toLocaleString()}</td>
                <td>{Number(p.qty || 0).toLocaleString()}</td>
                <td>KES {Number(p.unit_price || 0).toLocaleString()}</td>
                <td>
                  <span className={Number(p.stock_qty || 0) <= 10 ? 'clean-status low' : 'clean-status ok'}>
                    {Number(p.stock_qty || 0) <= 10 ? 'Low Stock' : 'In Stock'}
                  </span>
                </td>
                <td>
                  <div className="table-actions">
                    <button>✎</button>
                    <button>🗑</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="clean-pagination">
          <span>Showing page {meta.current_page || page} of {meta.last_page || 1}</span>

          <div>
            <button disabled={page <= 1} onClick={() => setPage(page - 1)}>‹</button>
            <strong>{meta.current_page || page}</strong>
            <button disabled={page >= (meta.last_page || 1)} onClick={() => setPage(page + 1)}>›</button>
          </div>
        </div>
      </div>

      {showImport && (
        <div className="modal-overlay">
          <div className="customer-popup">
            <div className="popup-header">
              <h3>Import Products</h3>
              <button className="close-btn" onClick={() => setShowImport(false)}>×</button>
            </div>

            <div className="popup-form">
              <p>Upload CSV, XLS or XLSX with Product, SKU, Category, Stock Qty, Selling Price, Qty and Unit Price.</p>
              <input type="file" accept=".csv,.xlsx,.xls" onChange={e => setFile(e.target.files[0])} />

              <div className="popup-actions">
                <button className="secondary-btn" onClick={() => setShowImport(false)}>Cancel</button>
                <button className="primary-btn" onClick={importProducts}>Upload & Import</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAdd && (
        <div className="modal-overlay">
          <div className="customer-popup">
            <div className="popup-header">
              <h3>Add Product</h3>
              <button className="close-btn" onClick={() => setShowAdd(false)}>×</button>
            </div>

            <form className="popup-form">
              {['name','sku','category','stock_qty','selling_price','qty','unit_price'].map(field => (
                <input
                  key={field}
                  placeholder={field.replace('_',' ').toUpperCase()}
                  value={form[field]}
                  onChange={e => setForm({ ...form, [field]: e.target.value })}
                />
              ))}

              <div className="popup-actions">
                <button type="button" className="secondary-btn" onClick={() => setShowAdd(false)}>Cancel</button>
                <button type="button" className="primary-btn" onClick={addProduct}>Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </section>
  );
}
