import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useCart } from '../cart/CartProvider.jsx';
import './Nav.css';

const LINKS = [
  ['/shop', 'Shop'],
  ['/craft', 'The Craft'],
  ['/anatomy', 'The Anatomy'],
];

export default function Nav() {
  const { count, openCart } = useCart();
  const [shrunk, setShrunk] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setShrunk(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close on navigation, or the overlay stays up over the page you just opened.
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  // Escape closes, and the page behind must not scroll while it is open.
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  // White type only while the bar is transparent AND sitting over the hero
  // photograph. Every other route opens on paper, so an unshrunk nav there is
  // dark-on-light — flipping it white by shrink state alone would make the
  // links invisible on /shop, /craft, /anatomy and /checkout.
  const overHero = pathname === '/' && !shrunk;

  return (
    <>
      <nav className="nav" data-shrunk={shrunk} data-over-hero={overHero}>
        <Link to="/" className="nav__mark">Aurora</Link>

        {/* Desktop: the links inline. Hidden below 860px, where the labels
            plus the bag collide with the wordmark. */}
        <div className="nav__links nav__links--wide u-label">
          {LINKS.map(([to, label]) => (
            <NavLink key={to} to={to}>{label}</NavLink>
          ))}
          <button type="button" onClick={openCart} className="u-label">Bag ({count})</button>
        </div>

        {/* Mobile: bag stays reachable in one tap; everything else behind Menu. */}
        <div className="nav__compact u-label">
          <button type="button" onClick={openCart} className="u-label">Bag ({count})</button>
          <button
            type="button"
            className="u-label"
            aria-expanded={menuOpen}
            aria-controls="nav-menu"
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? 'Close' : 'Menu'}
          </button>
        </div>
      </nav>

      <div className="nav__sheet" id="nav-menu" data-open={menuOpen} inert={!menuOpen}>
        <ul>
          {LINKS.map(([to, label]) => (
            <li key={to}><NavLink to={to}>{label}</NavLink></li>
          ))}
        </ul>
      </div>
    </>
  );
}
