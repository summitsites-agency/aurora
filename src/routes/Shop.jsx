import { Link } from 'react-router-dom';
import { products } from '../data/products.js';
import { formatPrice } from '../lib/format.js';
import { useGround } from '../ground/GroundProvider.jsx';

export default function Shop() {
  const { setGround, resetGround } = useGround();

  return (
    <main style={{ padding: 'calc(var(--gutter) * 4) var(--gutter)' }}>
      <h1>Eight shades. One silhouette.</h1>
      <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 'var(--gutter)', gridTemplateColumns: 'repeat(auto-fit, minmax(14rem, 1fr))' }}>
        {products.map((p) => (
          <li
            key={p.slug}
            onMouseEnter={() => setGround(p)}
            onMouseLeave={resetGround}
          >
            <Link to={`/shop/${p.slug}`} onFocus={() => setGround(p)} onBlur={resetGround}>
              <img src={p.image.card} alt={`Aurora bikini in ${p.name}`} width="880" height="1100" />
              <p>{p.name}</p>
              <p className="u-label">{formatPrice(p.priceCents)}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
