import React, { useEffect, useMemo, useState } from 'react';
import api from '../services/api';

export default function WhatsApp() {
  const crmUser = JSON.parse(localStorage.getItem('crm_user') || '{}');

  const owner = {
    owner_email: crmUser.email || 'admin@crm.local',
    owner_name: crmUser.name || 'Admin'
  };

  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [showConnect, setShowConnect] = useState(false);
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const [connectForm, setConnectForm] = useState({
    display_phone: '',
    phone_number_id: '',
    business_account_id: '',
    access_token: '',
    verify_token: 'hakim_crm_verify_token'
  });

  const loadWhatsApp = () => {
    api.get('/whatsapp/conversations', { params: owner })
      .then(res => {
        setConnected(res.data.connected);
        setAccount(res.data.account || null);
        setConversations(res.data.conversations || []);

        if (!activeId && res.data.conversations?.length) {
          setActiveId(res.data.conversations[0].id);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadWhatsApp();
    const t = setInterval(loadWhatsApp, 10000);
    return () => clearInterval(t);
  }, []);

  const activeConversation = conversations.find(c => c.id === activeId) || conversations[0];

  const filteredConversations = useMemo(() => {
    return conversations.filter(c =>
      `${c.customer_name || ''} ${c.customer_phone || ''} ${(c.messages || []).map(m => m.message).join(' ')}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [conversations, search]);

  const connectAccount = () => {
    setLoading(true);

    api.post('/whatsapp/connect', {
      ...owner,
      ...connectForm
    })
      .then(() => {
        setShowConnect(false);
        loadWhatsApp();
        alert('WhatsApp connected successfully');
      })
      .catch(err => {
        alert(err.response?.data?.message || 'Connection failed');
      })
      .finally(() => setLoading(false));
  };

  const sendMessage = (phone, customerName) => {
    if (!message.trim()) {
      alert('Type a message first');
      return;
    }

    setLoading(true);

    api.post('/whatsapp/send', {
      ...owner,
      phone,
      customer_name: customerName,
      message
    })
      .then(() => {
        setMessage('');
        setShowNewMessage(false);
        setNewName('');
        setNewPhone('');
        loadWhatsApp();
      })
      .catch(err => {
        alert(err.response?.data?.message || 'Message failed');
      })
      .finally(() => setLoading(false));
  };

  const aiReply = activeConversation
    ? `Hi ${(activeConversation.customer_name || 'there').split(' ')[0]}, thank you for contacting us. We have received your message and will confirm the details shortly.`
    : '';

  return (
    <section className="wa-page">

      <div className="wa-hero">
        <div>
          <span className="dash-tag">USER-BASED WHATSAPP</span>
          <h2>My WhatsApp Inbox</h2>
          <p>Each senior staff/admin connects and manages their own WhatsApp Business account inside the CRM.</p>
        </div>

        <div style={{display:'flex', gap:12}}>
          <button className="ghost-btn" onClick={() => setShowConnect(true)}>
            {connected ? 'Manage Connection' : 'Connect WhatsApp'}
          </button>
          <button className="top-add-btn" onClick={() => setShowNewMessage(true)}>
            + New Message
          </button>
        </div>
      </div>

      <div className="cards">
        <div className="card"><p>Status</p><h3>{connected ? 'Connected' : 'Offline'}</h3></div>
        <div className="card"><p>My Number</p><h3>{account?.display_phone || '—'}</h3></div>
        <div className="card"><p>Conversations</p><h3>{conversations.length}</h3></div>
        <div className="card"><p>Unread</p><h3>{conversations.reduce((s,c)=>s + Number(c.unread || 0),0)}</h3></div>
      </div>

      {!connected && (
        <div className="panel">
          <h3>Connect your WhatsApp Business API</h3>
          <p>Click “Connect WhatsApp” and add your Meta WhatsApp Cloud API credentials. After connecting, this inbox will send and receive messages inside the CRM.</p>
        </div>
      )}

      <div className="wa-grid">
        <div className="wa-inbox-panel">
          <div className="wa-panel-head">
            <h3>My Inbox</h3>
            <span>{filteredConversations.length}</span>
          </div>

          <input
            className="wa-search"
            placeholder="Search conversations..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

          <div className="wa-chat-list">
            {filteredConversations.length === 0 ? (
              <p style={{color:'#66746a'}}>No conversations yet.</p>
            ) : filteredConversations.map(c => (
              <button
                key={c.id}
                className={c.id === activeId ? 'wa-chat active' : 'wa-chat'}
                onClick={() => setActiveId(c.id)}
              >
                <div className="wa-avatar">{(c.customer_name || 'WA').substring(0,2).toUpperCase()}</div>
                <div>
                  <strong>{c.customer_name || c.customer_phone}</strong>
                  <small>{c.customer_phone}</small>
                </div>
                {Number(c.unread || 0) > 0 && <i></i>}
              </button>
            ))}
          </div>
        </div>

        <div className="wa-conversation-panel">
          {activeConversation ? (
            <>
              <div className="wa-phone-header">
                <div className="wa-avatar">{(activeConversation.customer_name || 'WA').substring(0,2).toUpperCase()}</div>
                <div>
                  <strong>{activeConversation.customer_name || activeConversation.customer_phone}</strong>
                  <small>{activeConversation.customer_phone}</small>
                </div>
              </div>

              <div className="wa-message-area">
                {(activeConversation.messages || []).map(m => (
                  <div key={m.id} className={m.sender_type === 'admin' ? 'wa-bubble me' : 'wa-bubble them'}>
                    {m.message}
                    <small>{m.status} · {new Date(m.created_at).toLocaleString()}</small>
                  </div>
                ))}

                <div className="wa-ai-draft">
                  <b>AI Suggested Reply</b>
                  <p>{aiReply}</p>
                  <button onClick={() => setMessage(aiReply)}>Use Reply</button>
                </div>
              </div>

              <div className="wa-composer">
                <input
                  placeholder={connected ? 'Type message...' : 'Connect WhatsApp first...'}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  disabled={!connected}
                />
                <button disabled={!connected || loading} onClick={() => sendMessage(activeConversation.customer_phone, activeConversation.customer_name)}>
                  {loading ? 'Sending...' : 'Send'}
                </button>
              </div>
            </>
          ) : (
            <div className="panel">
              <h3>No conversation selected</h3>
              <p>Start a new message or wait for customers to message your connected WhatsApp number.</p>
            </div>
          )}
        </div>

        <div className="wa-side-panel">
          <h3>Templates</h3>
          <button onClick={() => setMessage('Hi, your order is being processed. We will update you shortly.')}>Order update</button>
          <button onClick={() => setMessage('Hi, your invoice is due. Kindly complete payment via M-Pesa.')}>Invoice reminder</button>
          <button onClick={() => setMessage('Hi, thank you for your interest. Which product quantity do you need?')}>New lead welcome</button>

          <h3 style={{marginTop:20}}>Webhook URL</h3>
          <div className="wa-auto-card">
            <b>Use this on Meta</b>
            <small>https://your-domain.com/api/whatsapp/webhook</small>
          </div>
        </div>
      </div>

      {showConnect && (
        <div className="modal-overlay">
          <div className="customer-popup">
            <div className="popup-header">
              <h3>Connect My WhatsApp</h3>
              <button className="close-btn" onClick={() => setShowConnect(false)}>×</button>
            </div>

            <form className="popup-form">
              <input placeholder="Display Phone e.g +254700000000" value={connectForm.display_phone} onChange={e => setConnectForm({...connectForm, display_phone:e.target.value})} />
              <input placeholder="Phone Number ID" value={connectForm.phone_number_id} onChange={e => setConnectForm({...connectForm, phone_number_id:e.target.value})} />
              <input placeholder="Business Account ID" value={connectForm.business_account_id} onChange={e => setConnectForm({...connectForm, business_account_id:e.target.value})} />
              <textarea placeholder="Access Token" value={connectForm.access_token} onChange={e => setConnectForm({...connectForm, access_token:e.target.value})} />
              <input placeholder="Verify Token" value={connectForm.verify_token} onChange={e => setConnectForm({...connectForm, verify_token:e.target.value})} />

              <div className="popup-actions">
                <button type="button" className="secondary-btn" onClick={() => setShowConnect(false)}>Cancel</button>
                <button type="button" className="primary-btn" onClick={connectAccount}>{loading ? 'Connecting...' : 'Save Connection'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showNewMessage && (
        <div className="modal-overlay">
          <div className="customer-popup">
            <div className="popup-header">
              <h3>New WhatsApp Message</h3>
              <button className="close-btn" onClick={() => setShowNewMessage(false)}>×</button>
            </div>

            <form className="popup-form">
              <input placeholder="Customer Name" value={newName} onChange={e => setNewName(e.target.value)} />
              <input placeholder="Phone e.g 0700000000" value={newPhone} onChange={e => setNewPhone(e.target.value)} />
              <textarea placeholder="Type message..." value={message} onChange={e => setMessage(e.target.value)} />

              <div className="popup-actions">
                <button type="button" className="secondary-btn" onClick={() => setShowNewMessage(false)}>Cancel</button>
                <button type="button" className="primary-btn" disabled={!connected || loading} onClick={() => sendMessage(newPhone, newName)}>
                  {connected ? 'Send Message' : 'Connect WhatsApp First'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </section>
  );
}
