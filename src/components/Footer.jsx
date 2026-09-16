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

      {/* Studio credit. Its own full-width row under the hairline — the row
          above is a three-item space-between that a fourth item would break. */}
      <p className="ft__credit u-label">
        <a
          className="ft__maker"
          href="https://mossimo-studios.vercel.app"
          target="_blank"
          rel="noopener"
          aria-label="mossimo Studios"
        >
          {/* Reversed one-colour mark: the sand ground is too dark to carry the
              wordmark's black ink. */}
          <img src="/mossimo-studios-reverse.png" alt="" width="900" height="304" />
        </a>
        <span>This website is the property of, and was made by, mossimo Studios · © 2026.</span>
      </p>
    </footer>
  );
}
