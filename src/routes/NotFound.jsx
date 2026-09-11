import { Link } from 'react-router-dom';
import { useDocumentTitle } from '../lib/useDocumentTitle.js';
import './NotFound.css';

/** Added when /journal and /contact were removed. Without a catch-all those
 *  two URLs rendered nav + footer with an empty <main> between them, which
 *  looks like a broken page rather than a moved one. Anything already linking
 *  to them lands here instead. */
export default function NotFound() {
  useDocumentTitle('Not found');

  return (
    <main className="nf">
      <p className="u-label">404</p>
      <h1 className="nf__title">That page is not here.</h1>
      <p className="nf__body">
        It may have moved. The journal now lives on the{' '}
        <Link to="/">home page</Link>, and the make of the suit is on{' '}
        <Link to="/anatomy">The Anatomy</Link>.
      </p>
      <Link to="/shop" className="nf__cta u-label">View all</Link>
    </main>
  );
}
