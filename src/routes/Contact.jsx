import { useDocumentTitle } from '../lib/useDocumentTitle.js';

export default function Contact() {
  useDocumentTitle('Contact');

  return (
    <main style={{ padding: 'calc(var(--gutter) * 4) var(--gutter)' }}>
      <h1>Contact</h1>
    </main>
  );
}
