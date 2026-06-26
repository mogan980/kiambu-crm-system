import kiambuLogo from '../assets/kiambu-logo.jpeg';
import React from 'react';

export default function Dashboard() {
  const crmUser = JSON.parse(localStorage.getItem('crm_user') || '{}');
  const fullName = crmUser.name || 'Admin';

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' :
    hour < 17 ? 'Good afternoon' :
    hour < 21 ? 'Good evening' :
    'Good night';

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 51 }, (_, i) => currentYear - 50 + i);
  const [selectedYear, setSelectedYear] = React.useState(currentYear);
  const [selectedQuarter, setSelectedQuarter] = React.useState('Q1');

  const quarterMultiplier = {
    Q1: 1,
    Q2: 1.18,
    Q3: 1.34,
    Q4: 1.56
  }[selectedQuarter];

  const yearGrowth = 1 + ((selectedYear - (currentYear - 50)) * 0.012);

  const filteredData = {
    sales: Math.round(245000 * quarterMultiplier * yearGrowth),
    customers: Math.round(156 * quarterMultiplier),
    invoices: Math.round(24 * quarterMultiplier),
    payments: Math.round(189500 * quarterMultiplier * yearGrowth)
  };

  const chartData = [
    { month: 'Jan', value: Math.round(22 * quarterMultiplier) },
    { month: 'Feb', value: Math.round(35 * quarterMultiplier) },
    { month: 'Mar', value: Math.round(50 * quarterMultiplier) },
    { month: 'Apr', value: Math.round(72 * quarterMultiplier) },
    { month: 'May', value: Math.round(95 * quarterMultiplier) }
  ];

  const viewReport = () => {
    alert(`Dashboard Report\\nYear: ${selectedYear}\\nQuarter: ${selectedQuarter}\\nSales: KES ${filteredData.sales.toLocaleString()}\\nCustomers: ${filteredData.customers}\\nInvoices: ${filteredData.invoices}\\nPayments: KES ${filteredData.payments.toLocaleString()}`);
  };

  const printBarGraphReport = () => {
    const rows = chartData.map(d => `<tr><td>${d.month}</td><td>${d.value}%</td></tr>`).join('');

    const html = `
      <html>
        <head>
          <title>Sales Overview Report</title>
          <style>
            .doc-logo{width:120px;height:120px;object-fit:contain;border-radius:24px;margin-bottom:12px;} body{font-family:Arial;padding:30px;background:#f7fbf6}
            .report{max-width:760px;margin:auto;background:white;border:1px solid #dce8d7;border-radius:18px;padding:28px}
            h1{color:#185c22;margin:0}
            p{color:#66746a}
            table{width:100%;border-collapse:collapse;margin-top:20px}
            th,td{padding:12px;border-bottom:1px solid #e5e7eb;text-align:left}
            th{background:#eef6ec;color:#185c22}
            .summary{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-top:20px}
            .card{border:1px solid #dce8d7;border-radius:14px;padding:14px}
            .card b{color:#078144;font-size:20px}
          </style>
        </head>
        <body>
          <div class="report">
            <h1>Sales Overview Report</h1>
            <p>Period: ${selectedYear} ${selectedQuarter}</p>

            <div class="summary">
              <div class="card">Sales<br><b>KES ${filteredData.sales.toLocaleString()}</b></div>
              <div class="card">Customers<br><b>${filteredData.customers.toLocaleString()}</b></div>
              <div class="card">Invoices<br><b>${filteredData.invoices.toLocaleString()}</b></div>
              <div class="card">Payments<br><b>KES ${filteredData.payments.toLocaleString()}</b></div>
            </div>

            <table>
              <thead><tr><th>Month</th><th>Bar Graph Value</th></tr></thead>
              <tbody>${rows}</tbody>
            </table>

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
  const invoices = [
    ['INV-00124', 'John Kamau', 'KES 5,000', '2026-05-18', 'Paid'],
    ['INV-00123', 'Mary Njeri', 'KES 1,750', '2026-05-18', 'Pending'],
    ['INV-00122', 'Agrovet Kiambu', 'KES 32,000', '2026-05-17', 'Overdue'],
    ['INV-00121', 'Brian Mwangi', 'KES 8,500', '2026-05-16', 'Paid']
  ];

  const products = [
    ['DAP Fertilizer 50KG', 'KES 72,500', '320 bags'],
    ['CAN 26% Fertilizer 50KG', 'KES 58,000', '250 bags'],
    ['NPK 17:17:17 50KG', 'KES 46,000', '200 bags'],
    ['Urea Fertilizer 50KG', 'KES 38,000', '180 bags']
  ];

  return (
    <section className="kf-dashboard">

      <div className="kf-topbar">
        <div>
          <h1>{greeting}, {fullName} 👋</h1>
          <p>Here’s what’s happening with your business today.</p>
        </div>
      </div>

      <div className="dashboard-filter-bar">
        <div>
          <strong>Performance Filter</strong>
          <span>Viewing dashboard data for {selectedYear} · {selectedQuarter}</span>
        </div>

        <div className="dashboard-filter-controls">
          <select value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))}>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>

          <select value={selectedQuarter} onChange={e => setSelectedQuarter(e.target.value)}>
            <option>Q1</option>
            <option>Q2</option>
            <option>Q3</option>
            <option>Q4</option>
          </select>

          <input
            type="date"
            value={`${selectedYear}-01-01`}
            onChange={e => setSelectedYear(new Date(e.target.value).getFullYear())}
          />
        </div>
      </div>

      <div className="kf-kpi-grid">
        <div className="kf-kpi"><p>Total Sales</p><h2>KES {filteredData.sales.toLocaleString()}</h2><span>↗ +18% from last month</span></div>
        <div className="kf-kpi"><p>Total Customers</p><h2>{filteredData.customers.toLocaleString()}</h2><span>↗ +12 new this month</span></div>
        <div className="kf-kpi"><p>Total Invoices</p><h2>{filteredData.invoices.toLocaleString()}</h2><span>↗ +8% from last month</span></div>
        <div className="kf-kpi"><p>Total Payments</p><h2>KES {filteredData.payments.toLocaleString()}</h2><span>↗ +15% from last month</span></div>
      </div>

      <div className="kf-main-grid">
        <div className="kf-card large">
          <h3>🌿 Sales Overview — {selectedYear} {selectedQuarter}</h3>
          <div className="kf-chart">
            {chartData.map(item => (
              <div key={item.month} style={{height: `${item.value}%`}} title={`${item.month}: ${item.value}%`}></div>
            ))}
          </div>

          <div className="kf-months">
            {chartData.map(item => <span key={item.month}>{item.month}</span>)}
          </div>

          <div className="chart-actions">
            <button onClick={printBarGraphReport}>Print</button>
          </div>
        </div>

        <div className="kf-card">
          <h3>🌿 Top Selling Products</h3>
          {products.map((p,i) => (
            <div className="kf-product-row" key={i}>
              <div className="kf-bag">🌾</div>
              <strong>{p[0]}</strong>
              <div><b>{p[1]}</b><span>{p[2]}</span></div>
            </div>
          ))}
        </div>

        <div className="kf-card">
          <h3>🧾 Recent Invoices</h3>
          <table className="kf-mini-table">
            <thead><tr><th>Invoice</th><th>Customer</th><th>Amount</th><th>Status</th></tr></thead>
            <tbody>
              {invoices.map(inv => (
                <tr key={inv[0]}>
                  <td>{inv[0]}</td><td>{inv[1]}</td><td>{inv[2]}</td>
                  <td><span className={'kf-status ' + inv[4].toLowerCase()}>{inv[4]}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="kf-card">
          <h3>📢 Company Announcements</h3>
          <div className="kf-news"><b>New fertilizer stock available</b><p>DAP and CAN stock has been received.</p></div>
          <div className="kf-news"><b>Farmers training program</b><p>Modern farming techniques training scheduled.</p></div>
          <div className="kf-news"><b>Payment reminder</b><p>Please clear pending payments on time.</p></div>
        </div>
      </div>

      <div className="kf-footer">
        <strong>KIAMBU FERTILIZERS COMPANY LIMITED</strong>
        <span>THE FARMER’S FRIEND · ESTABLISHED IN 1969</span>
      </div>

    </section>
  );
}
