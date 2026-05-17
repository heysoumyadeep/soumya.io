'use client';

import { useState } from 'react';
import { Button } from '@components';
import './ContactForm.scss';

const INITIAL_FIELDS = { name: '', email: '', message: '' };
const INITIAL_ERRORS = { name: '', email: '', message: '' };

function validate({ name, email, message }) {
  const errors = { ...INITIAL_ERRORS };
  if (!name.trim()) errors.name = 'Name is required.';
  if (!email.trim()) errors.email = 'Email is required.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Enter a valid email.';
  if (!message.trim()) errors.message = 'Message is required.';
  else if (message.trim().length < 10) errors.message = 'Message is too short.';
  return errors;
}

export default function ContactForm() {
  const [fields, setFields] = useState(INITIAL_FIELDS);
  const [errors, setErrors] = useState(INITIAL_ERRORS);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(fields);
    if (Object.values(errs).some(Boolean)) {
      setErrors(errs);
      return;
    }

    setStatus('loading');
    setServerError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(data.error || 'Something went wrong. Please try again.');
        setStatus('error');
      } else {
        setStatus('success');
      }
    } catch {
      setServerError('Network error. Please try again.');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="contact-form contact-form--success">
        <div className="contact-form__success-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3>Message sent!</h3>
        <p>
          Thanks for reaching out. I read every message personally and
          I'll get back to you soon. Check your inbox, I've sent you a
          confirmation too.
        </p>
        <Button
          variant="ghost"
          onClick={() => { setFields(INITIAL_FIELDS); setErrors(INITIAL_ERRORS); setStatus('idle'); }}
        >
          Send another
        </Button>
      </div>
    );
  }

  const busy = status === 'loading';

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="contact-form__field">
        <label className="contact-form__label" htmlFor="cf-name">Name</label>
        <input
          id="cf-name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Your name"
          className={`contact-form__input${errors.name ? ' has-error' : ''}`}
          value={fields.name}
          onChange={handleChange}
          disabled={busy}
        />
        {errors.name && <span className="contact-form__error">{errors.name}</span>}
      </div>

      <div className="contact-form__field">
        <label className="contact-form__label" htmlFor="cf-email">Email</label>
        <input
          id="cf-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className={`contact-form__input${errors.email ? ' has-error' : ''}`}
          value={fields.email}
          onChange={handleChange}
          disabled={busy}
        />
        {errors.email && <span className="contact-form__error">{errors.email}</span>}
      </div>

      <div className="contact-form__field">
        <label className="contact-form__label" htmlFor="cf-message">Message</label>
        <textarea
          id="cf-message"
          name="message"
          rows={5}
          placeholder="What's on your mind?"
          className={`contact-form__input contact-form__input--textarea${errors.message ? ' has-error' : ''}`}
          value={fields.message}
          onChange={handleChange}
          disabled={busy}
        />
        {errors.message && <span className="contact-form__error">{errors.message}</span>}
      </div>

      {serverError && <p className="contact-form__error">{serverError}</p>}

      <Button variant="primary" type="submit" disabled={busy}>
        {busy ? 'Sending…' : 'Send message'}
      </Button>
    </form>
  );
}
