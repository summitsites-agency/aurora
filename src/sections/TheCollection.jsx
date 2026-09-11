import { Link } from 'react-router-dom';
import { products } from '../data/products.js';
import { formatPrice } from '../lib/format.js';
import { useGround } from '../ground/GroundProvider.jsx';
import { home } from '../data/content.js';
import SplitReveal from '../motion/SplitReveal.jsx';
import Reveal from '../motion/Reveal.jsx';
import './TheCollection.css';

export default function TheCollection() {
  const { setGround, resetGround } = useGround();

  return (
    <section className="coll">
      <div className="coll__head">
        <p className="u-label">{home.collection.label}</p>
        <SplitReveal as="h2" className="coll__title">{home.collection.title}</SplitReveal>
        <p className="coll__body">{home.collection.body}</p>
      </div>

      {/* Staggered so the row builds left to right rather than all seven
          cards popping at once. `as="ul"` keeps the list semantics — a plain
          wrapper div here would put a div between <ul> and its <li>s. */}
      <Reveal as="ul" className="coll__grid" stagger={0.07} duration={0.8}>
        {products.map((p) => (
          <li
            className="coll__card"
            key={p.slug}
            onMouseEnter={() => setGround(p)}
            onMouseLeave={resetGround}
          >
            <Link to={`/shop/${p.slug}`} onFocus={() => setGround(p)} onBlur={resetGround}>
              <span className="coll__plate" style={{ background: p.groundSoft }}>
                <img
                  className="coll__img"
                  src={p.image.card}
                  alt={`The Aurora bikini in ${p.name}`}
                  width="880"
                  height="1100"
                  loading="lazy"
                />
              </span>
              <div className="coll__meta">
                <span>{p.name}</span>
                <span className="u-label">{formatPrice(p.priceCents)}</span>
              </div>
            </Link>
          </li>
        ))}
      </Reveal>

      {/* Mobile only. The grid shows one card there, so without this the
          section is a dead end. */}
      <Link to="/shop" className="coll__more u-label">View all seven</Link>
    </section>
  );
}
