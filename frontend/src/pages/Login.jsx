import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Sales Rep'
  });

  const update = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const getUsers = () => {
    return JSON.parse(localStorage.getItem('crm_users') || '[]');
  };

  const saveUsers = (users) => {
    localStorage.setItem('crm_users', JSON.stringify(users));
  };

  const submit = (e) => {
    e.preventDefault();

    const users = getUsers();

    if (mode === 'register') {
      if (!form.name || !form.email || !form.password) {
        alert('Fill all required fields');
        return;
      }

      if (users.find(u => u.email === form.email)) {
        alert('User already exists. Login instead.');
        return;
      }

      const newUser = {
        id: Date.now(),
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role
      };

      saveUsers([...users, newUser]);

      const sessionUser = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      };

      localStorage.setItem('crm_user', JSON.stringify(sessionUser));
      onLogin(sessionUser);
      return;
    }

    const foundUser = users.find(
      u => u.email === form.email && u.password === form.password
    );

    if (!foundUser) {
      alert('Invalid email or password');
      return;
    }

    const sessionUser = {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      role: foundUser.role
    };

    localStorage.setItem('crm_user', JSON.stringify(sessionUser));
    onLogin(sessionUser);
  };

  return React.createElement(
    'div',
    { className: 'auth-page' },

    React.createElement(
      'div',
      { className: 'auth-left' },

      React.createElement(
        'div',
        { className: 'auth-brand' },
        React.createElement('div', { className: 'auth-logo' }, '🤖'),
        React.createElement('strong', null, 'Kiambu CRM')
      ),

      React.createElement(
        'form',
        { className: 'auth-form', onSubmit: submit },

        React.createElement(
          'h1',
          null,
          mode === 'login' ? 'Welcome Back' : 'Create Account'
        ),

        React.createElement(
          'p',
          null,
          mode === 'login'
            ? 'Sign in to your workspace to continue.'
            : 'Set up your staff profile to track leads and operations.'
        ),

        mode === 'register' &&
          React.createElement(
            'div',
            { className: 'auth-group' },
            React.createElement('label', null, 'Full Name'),
            React.createElement('input', {
              placeholder: 'Your full name',
              value: form.name,
              onChange: e => update('name', e.target.value)
            })
          ),

        React.createElement(
          'div',
          { className: 'auth-group' },
          React.createElement('label', null, 'Work Email'),
          React.createElement('input', {
            type: 'email',
            placeholder: 'you@company.com',
            value: form.email,
            onChange: e => update('email', e.target.value)
          })
        ),

        React.createElement(
          'div',
          { className: 'auth-group' },
          React.createElement(
            'div',
            { className: 'auth-row' },
            React.createElement('label', null, 'Password'),
            mode === 'login' && React.createElement('span', null, 'Forgot password?')
          ),
          React.createElement('input', {
            type: 'password',
            placeholder: '••••••••',
            value: form.password,
            onChange: e => update('password', e.target.value)
          })
        ),

        mode === 'register' &&
          React.createElement(
            'div',
            { className: 'auth-group' },
            React.createElement('label', null, 'Role'),
            React.createElement(
              'select',
              {
                value: form.role,
                onChange: e => update('role', e.target.value)
              },
              React.createElement('option', null, 'Sales Rep'),
              React.createElement('option', null, 'Manager'),
              React.createElement('option', null, 'Admin')
            )
          ),

        React.createElement(
          'button',
          { className: 'auth-submit', type: 'submit' },
          mode === 'login' ? 'Sign In' : 'Create Account'
        ),

        React.createElement(
          'button',
          {
            type: 'button',
            className: 'auth-switch',
            onClick: () => setMode(mode === 'login' ? 'register' : 'login')
          },
          mode === 'login'
            ? 'New user? Create an account'
            : 'Already registered? Sign in'
        )
      )
    ),

    React.createElement(
      'div',
      { className: 'auth-right' },
      React.createElement('div', { className: 'auth-bot' }, '🤖'),
      React.createElement(
        'h2',
        null,
        'Operational clarity for ambitious African SMEs.'
      ),
      React.createElement(
        'p',
        null,
        'Every lead, customer, order and payment is tracked against the staff member who created it.'
      )
    )
  );
}
