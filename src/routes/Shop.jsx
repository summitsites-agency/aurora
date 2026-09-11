import { Link } from 'react-router-dom';
import { products } from '../data/products.js';
import { formatPrice } from '../lib/format.js';
import { useGround } from '../ground/GroundProvider.jsx';
import SplitReveal from '../motion/SplitReveal.jsx';
import { useDocumentTitle } from '../lib/useDocumentTitle.js';
import './Shop.css';

export default function Shop() {
  useDocumentTitle('Shop');
  const { setGround, resetGround } = useGround();

  return (
    <main className="shop">
      <div className="shop__head">
        <p className="u-label">The collection</p>
        <SplitReveal as="h1" className="shop__title">Eight shades. One silhouette.</SplitReveal>
        <p className="shop__body">
          The same considered cut, dyed eight ways. Every piece is made to order.
        </p>
        <p className="shop__count u-label">{products.length} colourways</p>
      </div>

      <ul className="shop__grid">
        {products.map((p) => (
          <li
            className="shop__card"
            key={p.slug}
            onMouseEnter={() => setGround(p)}
            onMouseLeave={resetGround}
          >
            <Link to={`/shop/${p.slug}`} onFocus={() => setGround(p)} onBlur={resetGround}>
              {/* groundSoft, not hex — a multiply blend over a saturated ground
                  would swallow the garment. */}
              <span className="shop__plate" style={{ background: p.groundSoft }}>
                <img
                  className="shop__img"
                  src={p.image.card}
                  alt={`The Aurora bikini in ${p.name}`}
                  width="880" height="1100" loading="lazy"
                />
              </span>
              <div className="shop__meta">
                <span className="shop__name">
                  <span
                    className="shop__swatch"
                    style={{ '--sw': p.hex, '--sw-light': p.hexLight }}
                    aria-hidden="true"
                  />
                  {p.name}
                </span>
                <span className="u-label">{formatPrice(p.priceCents)}</span>
              </div>
              <p className="shop__note">{p.note}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
