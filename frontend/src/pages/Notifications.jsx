import React from 'react';

export default function Notifications() {
  const items = [
    ['Invoice paid', 'Customer payment confirmed successfully.'],
    ['New lead added', 'A new lead was captured from WhatsApp.'],
    ['Low stock alert', 'Some products need restocking.'],
    ['AI summary ready', 'Daily business report generated.']
  ];

  return (
    <section>
      <div className="page-header premium-header">
        <div>
          <h2>Notifications & Alerts</h2>
          <p>Track important CRM alerts, stock alerts, payments and lead activity.</p>
        </div>
      </div>

      <div className="panel">
        {items.map((item, i) => (
          <div className="activity-item" key={i}>
            <div className="activity-dot"></div>
            <div>
              <strong>{item[0]}</strong>
              <p>{item[1]}</p>
            </div>
            <small>Today</small>
          </div>
        ))}
      </div>
    </section>
  );
}
