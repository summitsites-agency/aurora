import { Link } from 'react-router-dom';
import { products } from '../data/products.js';
import { shop } from '../data/content.js';
import { formatPrice } from '../lib/format.js';
import { useGround } from '../ground/GroundProvider.jsx';
import SplitReveal from '../motion/SplitReveal.jsx';
import Reveal from '../motion/Reveal.jsx';
import { useDocumentTitle } from '../lib/useDocumentTitle.js';
import './Shop.css';

export default function Shop() {
  useDocumentTitle('Shop');
  const { setGround, resetGround } = useGround();

  return (
    <main className="shop">
      <div className="shop__head">
        <p className="u-label">{shop.label}</p>
        <SplitReveal as="h1" className="shop__title">{shop.title}</SplitReveal>
        <p className="shop__body">{shop.body}</p>
        <p className="shop__count u-label">{products.length} colourways</p>
      </div>

      {/* The last thing read before the photography. Without it the grid is
          where someone first learns the suit is cut to order. */}
      <Reveal as="dl" className="shop__notes" stagger={0.1}>
        {shop.notes.map((note) => (
          <div className="shop__note-row" key={note.term}>
            <dt className="shop__note-term u-label">{note.term}</dt>
            <dd className="shop__note-detail">{note.detail}</dd>
          </div>
        ))}
      </Reveal>

      <Reveal as="ul" className="shop__grid" stagger={0.07} duration={0.8}>
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
      </Reveal>
    </main>
  );
}
