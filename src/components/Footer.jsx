import { Link } from 'react-router-dom';
import { footer } from '../data/content.js';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="ft">
      <Link to="/" className="ft__brand" aria-label="Aurora Swimwear — home">
        {/* The client's logo is a JPEG photographed on cream paper, so it
            carries its own background. Squared off it reads as a pasted
            sticker; masked to the circle it already contains, it reads as a
            pressed seal. Ask the client for the vector before launch — then
            this can drop the mask and sit on any ground. */}
        <img className="ft__seal" src="/logo-emblem.png" alt="" width="160" height="160" />
        <span className="ft__words">
          <span className="ft__name">{footer.name}</span>
          <span className="ft__desc u-label">{footer.descriptor}</span>
        </span>
      </Link>

      {/* Was the homepage Closing section. Now global, so it is the only
          Pinyon that appears off the homepage. */}
      <p className="ft__script">{footer.script}</p>

      <nav className="ft__nav u-label">
        <Link to="/shop">Shop</Link>
        <Link to="/craft">The Craft</Link>
        <Link to="/anatomy">The Anatomy</Link>
      </nav>
    </footer>
  );
}
