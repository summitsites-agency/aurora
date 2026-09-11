import { Link } from 'react-router-dom';
import { products } from '../data/products.js';
import { formatPrice } from '../lib/format.js';
import { useGround } from '../ground/GroundProvider.jsx';
import { home } from '../data/content.js';
import SplitReveal from '../motion/SplitReveal.jsx';
import './TheEight.css';

export default function TheEight() {
  const { setGround, resetGround } = useGround();

  return (
    <section className="eight">
      <div className="eight__head">
        <p className="u-label">{home.eight.label}</p>
        <SplitReveal as="h2" className="eight__title">{home.eight.title}</SplitReveal>
        <p className="eight__body">{home.eight.body}</p>
      </div>

      <ul className="eight__grid">
        {products.map((p) => (
          <li
            className="eight__card"
            key={p.slug}
            onMouseEnter={() => setGround(p)}
            onMouseLeave={resetGround}
          >
            <Link to={`/shop/${p.slug}`} onFocus={() => setGround(p)} onBlur={resetGround}>
              <span className="eight__plate" style={{ background: p.groundSoft }}>
                <img
                  className="eight__img"
                  src={p.image.card}
                  alt={`The Aurora bikini in ${p.name}`}
                  width="880"
                  height="1100"
                  loading="lazy"
                />
              </span>
              <div className="eight__meta">
                <span>{p.name}</span>
                <span className="u-label">{formatPrice(p.priceCents)}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
