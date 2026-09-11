import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--sand)', color: 'var(--paper)', padding: 'calc(var(--gutter) * 2) var(--gutter)' }}>
      <p style={{ letterSpacing: 'var(--track-wordmark)', textTransform: 'uppercase' }}>Aurora</p>
      <nav style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginTop: '1.5rem' }} className="u-label">
        <Link to="/shop">Shop</Link>
        <Link to="/craft">The Craft</Link>
        <Link to="/journal">Journal</Link>
        <Link to="/contact">Contact</Link>
      </nav>
    </footer>
  );
}
