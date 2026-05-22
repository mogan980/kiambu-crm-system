import React, { useState } from 'react';

export default function Leads({ user }) {
  const [showForm, setShowForm] = useState(false);

  const leads = [
    ['Brian Mwangi', 'brian@safaricom.co.ke', 'Safaricom Ltd', 'Negotiation', 'KES 850K', '92', 'Sarah K.'],
    ['Alice Njoroge', 'alice@kcb.co.ke', 'KCB Group', 'Proposal', 'KES 420K', '78', 'Mike O.'],
    ['James Kariuki', 'j.kariuki@kplc.co.ke', 'KPLC', 'Qualified', 'KES 200K', '65', 'Sarah K.']
  ];

  const stageClass = stage =>
    stage === 'Negotiation' ? 'stage negotiation' :
    stage === 'Proposal' ? 'stage proposal' :
    'stage qualified';

  return React.createElement(
    'section',
    { className: 'lead-crm-page' },

    React.createElement(
      'div',
      { className: 'crm-leads-header' },
      React.createElement(
        'div',
        null,
        React.createElement('h2', null, 'CRM & Leads'),
        React.createElement('p', null, '142 active leads · KES 4.8M pipeline')
      ),
      React.createElement(
        'div',
        { className: 'crm-header-actions' },
        React.createElement('button', { className: 'outline-btn' }, 'Import CSV'),
        React.createElement('button', { className: 'outline-btn', onClick: () => setShowForm(true) }, '+ Add Lead')
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
            React.createElement('h3', null, 'Add Lead'),
            React.createElement('button', { className: 'close-btn', onClick: () => setShowForm(false) }, '×')
          ),
          React.createElement(
            'form',
            { className: 'popup-form' },
            React.createElement('input', { placeholder: 'Contact Name' }),
            React.createElement('input', { placeholder: 'Email Address' }),
            React.createElement('input', { placeholder: 'Company' }),
            React.createElement('input', { placeholder: 'Deal Value e.g KES 850K' }),
            React.createElement('select', null,
              React.createElement('option', null, 'Qualified'),
              React.createElement('option', null, 'Proposal'),
              React.createElement('option', null, 'Negotiation')
            ),
            React.createElement('input', { placeholder: 'Sales Rep' }),
            React.createElement('textarea', { placeholder: 'Lead notes' }),
            React.createElement(
              'div',
              { className: 'popup-actions' },
              React.createElement('button', { type: 'button', className: 'secondary-btn', onClick: () => setShowForm(false) }, 'Cancel'),
              React.createElement('button', { type: 'button', className: 'primary-btn', onClick: () => setShowForm(false) }, 'Save Lead')
            )
          )
        )
      ),

    React.createElement(
      'div',
      { className: 'lead-stats-grid' },
      React.createElement('div', { className: 'lead-stat blue' },
        React.createElement('p', null, 'TOTAL LEADS'),
        React.createElement('h3', null, '142'),
        React.createElement('span', null, '↑ 24 this week')
      ),
      React.createElement('div', { className: 'lead-stat cyan' },
        React.createElement('p', null, 'CONVERSION RATE'),
        React.createElement('h3', null, '23%'),
        React.createElement('span', null, '↑ 3% MoM')
      ),
      React.createElement('div', { className: 'lead-stat green' },
        React.createElement('p', null, 'PIPELINE VALUE'),
        React.createElement('h3', null, 'KES 4.8M'),
        React.createElement('small', null, 'Active deals')
      ),
      React.createElement('div', { className: 'lead-stat orange' },
        React.createElement('p', null, 'AVG DEAL SIZE'),
        React.createElement('h3', null, 'KES 340K'),
        React.createElement('span', null, '↑ 12%')
      )
    ),

    React.createElement(
      'div',
      { className: 'lead-table-card' },
      React.createElement(
        'table',
        { className: 'crm-leads-table' },
        React.createElement(
          'thead',
          null,
          React.createElement(
            'tr',
            null,
            React.createElement('th', null, 'CONTACT'),
            React.createElement('th', null, 'COMPANY'),
            React.createElement('th', null, 'STAGE'),
            React.createElement('th', null, 'VALUE'),
            React.createElement('th', null, 'AI SCORE'),
            React.createElement('th', null, 'REP')
          )
        ),
        React.createElement(
          'tbody',
          null,
          leads.map((lead, i) =>
            React.createElement(
              'tr',
              { key: i },
              React.createElement('td', null,
                React.createElement('strong', null, lead[0]),
                React.createElement('small', null, lead[1])
              ),
              React.createElement('td', null, lead[2]),
              React.createElement('td', null, React.createElement('span', { className: stageClass(lead[3]) }, lead[3])),
              React.createElement('td', null, lead[4]),
              React.createElement('td', null, React.createElement('b', { className: 'ai-score' }, lead[5])),
              React.createElement('td', null, lead[6])
            )
          )
        )
      )
    )
  );
}
