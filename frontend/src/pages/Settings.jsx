import React, { useState } from 'react';

export default function Settings() {
  const saved = JSON.parse(localStorage.getItem('crm_settings') || '{}');

  const [settings, setSettings] = useState({
    companyName: saved.companyName || 'Kiambu CRM',
    companySubtitle: saved.companySubtitle || 'Fertilizers Business OS',
    logo: saved.logo || '',
    theme: saved.theme || '#064e2b',
    email: saved.email || 'admin@kiambucrm.co.ke',
    phone: saved.phone || '',
    branch: saved.branch || '',
    address: saved.address || '',
    password: ''
  });

  const saveSettings = () => {
    localStorage.setItem('crm_settings', JSON.stringify(settings));
    document.documentElement.style.setProperty('--brand-green', settings.theme);
    window.dispatchEvent(new Event('crmSettingsUpdated'));
    alert('Settings saved successfully');
  };

  const uploadLogo = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setSettings(prev => ({ ...prev, logo: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <section>
      <div className="settings-hero">
        <div>
          <span>SETTINGS CENTER</span>
          <h2>System Settings</h2>
          <p>Manage company branding, theme colors, account details and password settings.</p>
        </div>
        <button onClick={saveSettings}>Save Settings</button>
      </div>

      <div className="settings-grid">

        <div className="settings-card">
          <h3>Company Branding</h3>
          <p>Logo and company name shown on the sidebar.</p>

          <div className="logo-upload-box">
            {settings.logo ? (
              <img src={settings.logo} alt="Logo" />
            ) : (
              <div className="logo-placeholder">K</div>
            )}

            <label>
              Upload Logo
              <input type="file" accept="image/*" onChange={uploadLogo} hidden />
            </label>
          </div>

          <input
            placeholder="Company Name"
            value={settings.companyName}
            onChange={e => setSettings({ ...settings, companyName: e.target.value })}
          />

          <input
            placeholder="Company Subtitle"
            value={settings.companySubtitle}
            onChange={e => setSettings({ ...settings, companySubtitle: e.target.value })}
          />
        </div>

        <div className="settings-card">
          <h3>Theme Personalization</h3>
          <p>Customize your CRM brand color.</p>

          <div className="theme-row">
            {['#064e2b', '#075985', '#7c2d12', '#4c1d95', '#831843'].map(color => (
              <button
                key={color}
                style={{ background: color }}
                className={settings.theme === color ? 'theme-dot active' : 'theme-dot'}
                onClick={() => setSettings({ ...settings, theme: color })}
              />
            ))}
          </div>

          <input
            type="color"
            value={settings.theme}
            onChange={e => setSettings({ ...settings, theme: e.target.value })}
          />
        </div>

        <div className="settings-card wide">
          <h3>Account Information</h3>
          <p>Business contact and branch information.</p>

          <div className="settings-form-grid">
            <input placeholder="Email Address" value={settings.email} onChange={e => setSettings({ ...settings, email: e.target.value })} />
            <input placeholder="Phone Number" value={settings.phone} onChange={e => setSettings({ ...settings, phone: e.target.value })} />
            <input placeholder="Company Branch" value={settings.branch} onChange={e => setSettings({ ...settings, branch: e.target.value })} />
            <input placeholder="Business Address" value={settings.address} onChange={e => setSettings({ ...settings, address: e.target.value })} />
          </div>
        </div>

        <div className="settings-card wide">
          <h3>Password Settings</h3>
          <p>Set or change account password.</p>

          <div className="settings-form-grid">
            <input type="password" placeholder="New Password" value={settings.password} onChange={e => setSettings({ ...settings, password: e.target.value })} />
            <input type="password" placeholder="Confirm Password" />
          </div>

          <button className="settings-secondary-btn" onClick={() => alert('Password saved locally for now. Backend auth can be connected next.')}>
            Update Password
          </button>
        </div>

      </div>
    </section>
  );
}
