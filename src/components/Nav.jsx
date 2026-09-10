import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../cart/CartProvider.jsx';
import './Nav.css';

const LINKS = [
  ['/shop', 'Shop'],
  ['/craft', 'The Craft'],
  ['/journal', 'Journal'],
  ['/fit', 'Fit'],
  ['/contact', 'Contact'],
];

export default function Nav() {
  const { count, openCart } = useCart();
  const [shrunk, setShrunk] = useState(false);

  useEffect(() => {
    const onScroll = () => setShrunk(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className="nav" data-shrunk={shrunk}>
      <Link to="/" className="nav__mark">Aurora</Link>
      <div className="nav__links u-label">
        {LINKS.map(([to, label]) => (
          <NavLink key={to} to={to}>{label}</NavLink>
        ))}
        <button onClick={openCart} className="u-label">Bag ({count})</button>
      </div>
    </nav>
  );
}
