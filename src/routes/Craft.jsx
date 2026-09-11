import { useDocumentTitle } from '../lib/useDocumentTitle.js';

export default function Craft() {
  useDocumentTitle('The Craft');

  return (
    <main style={{ padding: 'calc(var(--gutter) * 4) var(--gutter)' }}>
      <h1>The Craft</h1>
    </main>
  );
}
