import React from 'react';

export default function Subscription() {
  return (
    <section>
      <div className="page-header premium-header">
        <div>
          <h2>Subscription & Upgrade</h2>
          <p>Manage plans, billing, usage limits and upgrade flow.</p>
        </div>
      </div>

      <div className="cards">
        <div className="card"><p>Current Plan</p><h3>Growth</h3></div>
        <div className="card"><p>Users</p><h3>5 / 15</h3></div>
        <div className="card"><p>WhatsApp Messages</p><h3>1,847</h3></div>
        <div className="card"><p>Next Renewal</p><h3>Monthly</h3></div>
      </div>
    </section>
  );
}
