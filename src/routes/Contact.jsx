import { useState } from 'react';
import { contact } from '../data/content.js';
import { useDocumentTitle } from '../lib/useDocumentTitle.js';
import SplitReveal from '../motion/SplitReveal.jsx';
import './Contact.css';

const ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT;

export default function Contact() {
  useDocumentTitle('Contact');
  const [status, setStatus] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));

    if (!ENDPOINT) {
      // No endpoint configured: hand off to the user's mail client rather than
      // silently dropping the message.
      const body = encodeURIComponent(`${data.message}\n\n— ${data.name}`);
      window.location.href =
        `mailto:${contact.email}?subject=${encodeURIComponent('Enquiry from the website')}&body=${body}`;
      setStatus('Opening your email app…');
      return;
    }

    setStatus('Sending…');
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(e.target),
      });
      setStatus(res.ok ? 'Thank you — we will be in touch.' : 'Something went wrong. Please email us directly.');
      if (res.ok) e.target.reset();
    } catch {
      setStatus('Something went wrong. Please email us directly.');
    }
  };

  return (
    <main className="ct">
      <div className="ct__grid">
        <div>
          <p className="u-label">{contact.label}</p>
          <SplitReveal as="h1" className="ct__title">{contact.title}</SplitReveal>
          <p className="ct__standfirst">{contact.standfirst}</p>
          <div className="ct__aside">
            <p>{contact.commissions}</p>
            <p>
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
              <br />
              {contact.responseTime}
            </p>
          </div>
        </div>

        <form onSubmit={onSubmit}>
          <div className="ct__field">
            <label htmlFor="ct-name" className="u-label">Name</label>
            <input id="ct-name" name="name" type="text" required autoComplete="name" />
          </div>
          <div className="ct__field">
            <label htmlFor="ct-email" className="u-label">Email</label>
            <input id="ct-email" name="email" type="email" required autoComplete="email" />
          </div>
          <div className="ct__field">
            <label htmlFor="ct-message" className="u-label">Message</label>
            <textarea id="ct-message" name="message" required />
          </div>
          <button type="submit" className="ct__submit u-label">Send</button>
          <p className="ct__status" role="status" aria-live="polite">{status}</p>
        </form>
      </div>
    </main>
  );
}
