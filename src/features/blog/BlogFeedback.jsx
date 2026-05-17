'use client';

import { useState } from 'react';

const MAX_CHARS = 600;

export default function BlogFeedback({ slug, title }) {
  const [feedback, setFeedback] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [serverError, setServerError] = useState('');

  const charsLeft = MAX_CHARS - feedback.length;

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (emailError) setEmailError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!feedback.trim()) return;

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Enter a valid email or leave it blank.');
      return;
    }

    setStatus('loading');
    setServerError('');

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, title, feedback, email: email || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(data.error || 'Something went wrong.');
        setStatus('error');
      } else {
        setStatus('success');
      }
    } catch {
      setServerError('Network error. Please try again.');
      setStatus('error');
    }
  };

  return (
    <div className="blog-feedback">
      <div className="blog-feedback__inner">
        <h3 className="blog-feedback__heading">Was this useful?</h3>
        <p className="blog-feedback__lede">
          Thoughts, corrections, or just a reaction. I read every note.
        </p>

        {status === 'success' ? (
          <p className="blog-feedback__thanks">
            <span aria-hidden="true">✓</span>
            Thanks, genuinely appreciated.
          </p>
        ) : (
          <form className="blog-feedback__form" onSubmit={handleSubmit} noValidate>
            <div className="blog-feedback__field">
              <input
                type="email"
                className={`blog-feedback__email-input${emailError ? ' has-error' : ''}`}
                placeholder="Your email (optional, if you'd like a reply)"
                value={email}
                onChange={handleEmailChange}
                disabled={status === 'loading'}
                autoComplete="email"
              />
              {emailError && (
                <span className="blog-feedback__error">{emailError}</span>
              )}
            </div>

            <div className="blog-feedback__field">
              <textarea
                className="blog-feedback__input"
                placeholder="What did you think?"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value.slice(0, MAX_CHARS))}
                disabled={status === 'loading'}
                rows={4}
              />
            </div>

            {serverError && (
              <p className="blog-feedback__error">{serverError}</p>
            )}

            <div className="blog-feedback__actions">
              <button
                type="submit"
                className="btn btn--primary blog-feedback__submit"
                disabled={status === 'loading' || !feedback.trim()}
              >
                <span className="btn__label">
                  {status === 'loading' ? 'Sending…' : 'Send feedback'}
                </span>
              </button>

              <span className="blog-feedback__hint">
                Or{' '}
                <a href="/contact" className="blog-feedback__contact-link">
                  reach out directly
                </a>
                .
              </span>

              <span className="blog-feedback__char-count" aria-live="polite">
                {charsLeft}
              </span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
