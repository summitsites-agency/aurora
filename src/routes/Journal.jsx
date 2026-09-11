import { useDocumentTitle } from '../lib/useDocumentTitle.js';

export default function Journal() {
  useDocumentTitle('Journal');

  return (
    <main style={{ padding: 'calc(var(--gutter) * 4) var(--gutter)' }}>
      <h1>Journal</h1>
    </main>
  );
}
