import React, { useEffect, useState } from 'react';
import Dashboard from './pages/Dashboard.jsx';
import Customers from './pages/Customers.jsx';
import Products from './pages/Products.jsx';
import Leads from './pages/Leads.jsx';
import Orders from './pages/Orders.jsx';
import Payments from './pages/Payments.jsx';
import Invoices from './pages/Invoices.jsx';
import Receipts from './pages/Receipts.jsx';
import WhatsApp from './pages/WhatsApp.jsx';
import Notifications from './pages/Notifications.jsx';
import CompanySwitcher from './pages/CompanySwitcher.jsx';
import Subscription from './pages/Subscription.jsx';
import Settings from './pages/Settings.jsx';
import './styles/main.css';

export default function App() {
  const [page, setPageState] = useState(localStorage.getItem('crm_page') || 'Dashboard');
  const [crmSettings, setCrmSettings] = useState(JSON.parse(localStorage.getItem('crm_settings') || '{}'));

  useEffect(() => {
    const reloadSettings = () => setCrmSettings(JSON.parse(localStorage.getItem('crm_settings') || '{}'));
    window.addEventListener('crmSettingsUpdated', reloadSettings);
    return () => window.removeEventListener('crmSettingsUpdated', reloadSettings);
  }, []);

  const setPage = (name) => {
    localStorage.setItem('crm_page', name);
    setPageState(name);
  };

  const pages = {
    Dashboard: <Dashboard />,
    Customers: <Customers />,
    Products: <Products />,
    Leads: <Leads />,
    Orders: <Orders />,
    Payments: <Payments />,
    Invoices: <Invoices />,
    Receipts: <Receipts />,
    WhatsApp: <WhatsApp />,
    Notifications: <Notifications />,
    Companies: <CompanySwitcher />,
    Subscription: <Subscription />,
    Settings: <Settings />
  };

  const groups = [
    {
      title: 'Main',
      items: [
        ['Dashboard', '📊', ''],
        ['Customers', '👥', ''],
        ['Products', '🌱', '24']
      ]
    },
    {
      title: 'Sales',
      items: [
        ['Leads', '🎯', '18'],
        ['Orders', '🧾', ''],
        ['Payments', '💳', ''],
        ['Invoices', '📄', '12'],
        ['Receipts', '🧾', '']
      ]
    },
    {
      title: 'Communication',
      items: [
        ['WhatsApp', '💬', '5'],
        ['Notifications', '🔔', '5']
      ]
    },
    {
      title: 'Business',
      items: [
        ['Companies', '🏢', ''],
        ['Subscription', '💎', ''],
        ['Settings', '⚙️', '']
      ]
    }
  ];

  return (
    <div className="crm-shell">
      <aside className="pro-sidebar">
        <div className="brand-card">
          {crmSettings.logo ? (
            <img className="brand-logo-img" src={crmSettings.logo} alt="Logo" />
          ) : (
            <div className="brand-logo">K</div>
          )}
          <div>
            <h2>{crmSettings.companyName || 'Kiambu CRM'}</h2>
            <p>{crmSettings.companySubtitle || 'Fertilizers Business OS'}</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {groups.map(group => (
            <div className="nav-group" key={group.title}>
              <span className="nav-group-title">{group.title}</span>

              {group.items.map(([name, icon, badge]) => (
                <button
                  key={name}
                  className={page === name ? 'nav-link active' : 'nav-link'}
                  onClick={() => setPage(name)}
                >
                  <span className="nav-icon">{icon}</span>
                  <span>{name}</span>
                  {badge && <b>{badge}</b>}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="user-card-clean">
          <div className="user-avatar">AD</div>
          <div>
            <small>Logged in as</small>
            <strong>Admin</strong>
            <p>Active user</p>
          </div>
        </div>
      </aside>

      <main className="crm-main">
        {pages[page] || <Dashboard />}
      </main>
    </div>
  );
}
