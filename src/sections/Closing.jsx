import { Link } from 'react-router-dom';
import { home } from '../data/content.js';
import './Closing.css';

export default function Closing() {
  return (
    <section className="closing">
      {/* fontFamily inline, not in Closing.css — see the comment on
          .closing__script in that file. */}
      <p className="closing__script" style={{ fontFamily: 'var(--font-display)' }}>{home.closing.script}</p>
      <Link to="/shop" className="closing__cta u-label">{home.closing.cta}</Link>
    </section>
  );
}
