import React from 'react';

export default function CompanySwitcher() {
  return (
    <section>
      <div className="page-header premium-header">
        <div>
          <h2>Company Switcher</h2>
          <p>Manage multiple businesses, branches or companies from one CRM account.</p>
        </div>
        <button className="top-add-btn">+ Add Company</button>
      </div>

      <div className="cards">
        <div className="card"><p>Active Company</p><h3>Kiambu CRM</h3></div>
        <div className="card"><p>Branches</p><h3>1</h3></div>
        <div className="card"><p>Users</p><h3>5</h3></div>
      </div>
    </section>
  );
}
