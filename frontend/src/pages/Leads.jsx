import React, { useMemo, useState } from 'react';
import api from '../services/api';

export default function Leads({ user }) {
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('All');
  const [repFilter, setRepFilter] = useState('All');

  const leads = [
    ['Brian Mwangi', 'brian@safaricom.co.ke', 'Safaricom Ltd', 'Negotiation', 'KES 850K', '92', 'Sarah K.'],
    ['Alice Njoroge', 'alice@kcb.co.ke', 'KCB Group', 'Proposal', 'KES 420K', '78', 'Mike O.'],
    ['James Kariuki', 'j.kariuki@kplc.co.ke', 'KPLC', 'Qualified', 'KES 200K', '65', 'Sarah K.']
  ];

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const text = lead.join(' ').toLowerCase();
      return (
        text.includes(search.toLowerCase()) &&
        (stageFilter === 'All' || lead[3] === stageFilter) &&
        (repFilter === 'All' || lead[6] === repFilter)
      );
    });
  }, [search, stageFilter, repFilter]);

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fd = new FormData();
    fd.append('file', file);

    try {
      const res = await api.post('/leads/import', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert(`Successfully imported ${res.data.count || 0} leads`);
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('Import failed. Backend route /api/leads/import may not be ready yet.');
    }
  };

  const stageClass = stage =>
    stage === 'Negotiation' ? 'stage negotiation' :
    stage === 'Proposal' ? 'stage proposal' :
    'stage qualified';

  return (
    <section className="lead-crm-page">

      <div className="crm-leads-header">
        <div>
          <h2>CRM & Leads</h2>
          <p>{filteredLeads.length} visible leads · KES 4.8M pipeline</p>
        </div>

        <div className="leads-actions">
          <input
            type="file"
            id="leadCsvUpload"
            accept=".csv,.xlsx,.xls"
            style={{ display: 'none' }}
            onChange={handleImport}
          />

          <button
            className="import-btn"
            onClick={() => document.getElementById('leadCsvUpload').click()}
          >
            Import CSV
          </button>

          <button className="import-btn">+ Add Lead</button>
        </div>
      </div>

      <div className="lead-stats-grid">
        <div className="lead-stat blue"><p>TOTAL LEADS</p><h3>{filteredLeads.length}</h3><span>↑ filtered result</span></div>
        <div className="lead-stat cyan"><p>CONVERSION RATE</p><h3>23%</h3><span>↑ 3% MoM</span></div>
        <div className="lead-stat green"><p>PIPELINE VALUE</p><h3>KES 4.8M</h3><small>Active deals</small></div>
        <div className="lead-stat orange"><p>AVG DEAL SIZE</p><h3>KES 340K</h3><span>↑ 12%</span></div>
      </div>

      <div className="lead-filter-panel">
        <div>
          <h3>Lead Directory</h3>
          <p>Search and filter leads by contact, company, stage, value, score or sales rep.</p>
        </div>

        <div className="lead-filter-actions">
          <input placeholder="Search leads..." value={search} onChange={e => setSearch(e.target.value)} />

          <select value={stageFilter} onChange={e => setStageFilter(e.target.value)}>
            <option>All</option>
            <option>Negotiation</option>
            <option>Proposal</option>
            <option>Qualified</option>
          </select>

          <select value={repFilter} onChange={e => setRepFilter(e.target.value)}>
            <option>All</option>
            <option>Sarah K.</option>
            <option>Mike O.</option>
            {user?.name && <option>{user.name}</option>}
          </select>
        </div>
      </div>

      <div className="lead-table-card">
        <table className="crm-leads-table">
          <thead>
            <tr>
              <th>CONTACT</th>
              <th>COMPANY</th>
              <th>STAGE</th>
              <th>VALUE</th>
              <th>AI SCORE</th>
              <th>REP</th>
            </tr>
          </thead>

          <tbody>
            {filteredLeads.map((lead, i) => (
              <tr key={i}>
                <td><strong>{lead[0]}</strong><small>{lead[1]}</small></td>
                <td>{lead[2]}</td>
                <td><span className={stageClass(lead[3])}>{lead[3]}</span></td>
                <td>{lead[4]}</td>
                <td><b className="ai-score">{lead[5]}</b></td>
                <td>{lead[6]}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="clean-pagination">
          <span>
            Showing 1–10 of {filteredLeads.length} leads
          </span>

          <div className="pagination-controls">

            <button className="page-btn">
              ←
            </button>

            <button className="page-number active">
              1
            </button>

            <button className="page-number">
              2
            </button>

            <button className="page-number">
              3
            </button>

            <button className="page-btn">
              →
            </button>

          </div>
        </div>

      </div>

    </section>
  );
}
