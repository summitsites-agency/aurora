import { Link } from 'react-router-dom';
import { products } from '../data/products.js';
import './ColourRail.css';

/** The other seven colourways. Each links to its own URL so every colourway
 *  stays independently shareable — the ground tween survives the navigation
 *  because GroundProvider sits above the router outlet. */
export default function ColourRail({ currentSlug }) {
  const others = products.filter((p) => p.slug !== currentSlug);

  return (
    <section className="rail" aria-label="Other colourways">
      <p className="u-label">The other {others.length}</p>
      <ul className="rail__list">
        {others.map((p) => (
          <li key={p.slug}>
            <Link to={`/shop/${p.slug}`}>
              <span className="rail__plate" style={{ background: p.groundSoft }}>
                <img
                  className="rail__img"
                  src={p.image.card}
                  alt={`The Aurora bikini in ${p.name}`}
                  width="880" height="1100" loading="lazy"
                />
              </span>
              <span className="rail__name u-label">{p.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
