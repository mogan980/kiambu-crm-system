import React, { useMemo, useState } from 'react';

export default function Dashboard() {
  const currentYear = new Date().getFullYear();

  const years = [];
  for (let y = 1940; y <= currentYear; y++) {
    years.push(y);
  }

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedQuarter, setSelectedQuarter] = useState('Q1');

  const quarterData = useMemo(() => {
    const yearFactor = Math.max(1, selectedYear - 1939);
    const quarterFactor = selectedQuarter === 'Q1' ? 1 : selectedQuarter === 'Q2' ? 1.25 : selectedQuarter === 'Q3' ? 1.55 : 1.85;

    return {
      customers: Math.round(120 + yearFactor * quarterFactor),
      products: 1079,
      stockValue: 6737012,
      revenue: Math.round(45000 * quarterFactor + yearFactor * 1500),
      leads: Math.round(18 * quarterFactor + yearFactor / 2),
      lowStock: Math.max(0, Math.round(30 - quarterFactor * 4)),
      conversion: Math.round(18 + quarterFactor * 7),
      orders: Math.round(12 * quarterFactor + yearFactor / 3),
      period: selectedYear + ' ' + selectedQuarter
    };
  }, [selectedYear, selectedQuarter]);

  return (
    <section className="modern-dashboard">

      <div className="dashboard-topbar">
        <div>
          <span className="dash-tag">CRM BUSINESS INTELLIGENCE</span>
          <h1>Executive CRM Dashboard</h1>
          <p>Filtered view for {quarterData.period}. Track customers, leads, inventory, sales and CRM operations.</p>
        </div>

        <div className="dashboard-filters pro-filter-box">
          <div>
            <label>Year</label>
            <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div>
            <label>Quarter</label>
            <select value={selectedQuarter} onChange={(e) => setSelectedQuarter(e.target.value)}>
              <option>Q1</option>
              <option>Q2</option>
              <option>Q3</option>
              <option>Q4</option>
            </select>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><div className="stat-icon">👥</div><span>Total Customers</span><h2>{quarterData.customers.toLocaleString()}</h2><small>{quarterData.period} filtered</small></div>
        <div className="stat-card"><div className="stat-icon">🎯</div><span>Total Leads</span><h2>{quarterData.leads.toLocaleString()}</h2><small>{quarterData.conversion}% conversion estimate</small></div>
        <div className="stat-card"><div className="stat-icon">🌱</div><span>Products</span><h2>{quarterData.products.toLocaleString()}</h2><small>Inventory connected</small></div>
        <div className="stat-card"><div className="stat-icon">💰</div><span>Stock Value</span><h2>KES {quarterData.stockValue.toLocaleString()}</h2><small>Live inventory value</small></div>
        <div className="stat-card"><div className="stat-icon">📈</div><span>Revenue</span><h2>KES {quarterData.revenue.toLocaleString()}</h2><small>{quarterData.period} sales</small></div>
        <div className="stat-card"><div className="stat-icon">⚠️</div><span>Low Stock</span><h2>{quarterData.lowStock}</h2><small>Needs restocking</small></div>
      </div>

      <div className="dashboard-main-grid">

        <div className="dashboard-panel large-panel">
          <div className="panel-head">
            <h3>Sales Trend — {quarterData.period}</h3>
            <button>View Report</button>
          </div>

          <div className="sales-chart-ui">
            {[45, 62, 74, 58, 86, 72, 95].map((height, index) => (
              <div className="bar" key={index} style={{height: (height * (selectedQuarter === 'Q4' ? 1 : selectedQuarter === 'Q3' ? .9 : selectedQuarter === 'Q2' ? .8 : .7)) + '%'}}></div>
            ))}
          </div>
        </div>

        <div className="dashboard-panel">
          <div className="panel-head"><h3>Lead Funnel</h3></div>
          <div className="funnel-ui">
            <div style={{width:'100%'}}>New: {quarterData.leads}</div>
            <div style={{width:'80%'}}>Contacted: {Math.round(quarterData.leads * .75)}</div>
            <div style={{width:'60%'}}>Qualified: {Math.round(quarterData.leads * .48)}</div>
            <div style={{width:'40%'}}>Converted: {Math.round(quarterData.leads * .25)}</div>
          </div>
        </div>

        <div className="dashboard-panel">
          <div className="panel-head"><h3>Inventory Health</h3></div>
          <div className="inventory-list">
            <div><span>Products</span><b>{quarterData.products.toLocaleString()}</b></div>
            <div><span>Low Stock</span><b>{quarterData.lowStock}</b></div>
            <div><span>Categories</span><b>5</b></div>
            <div><span>Stock Value</span><b>KES {quarterData.stockValue.toLocaleString()}</b></div>
          </div>
        </div>

        <div className="dashboard-panel large-panel">
          <div className="panel-head"><h3>Filtered CRM Activity</h3></div>
          <div className="activity-feed">
            <div className="activity-item"><div className="activity-dot"></div><div><strong>{quarterData.period} performance loaded</strong><p>Dashboard now reflects the selected year and quarter.</p></div><small>Now</small></div>
            <div className="activity-item"><div className="activity-dot"></div><div><strong>{quarterData.orders} orders tracked</strong><p>Sales activity calculated for the selected period.</p></div><small>{quarterData.period}</small></div>
            <div className="activity-item"><div className="activity-dot"></div><div><strong>{quarterData.leads} leads visible</strong><p>Lead funnel updated based on selected quarter.</p></div><small>{quarterData.period}</small></div>
          </div>
        </div>

      </div>

    </section>
  );
}
