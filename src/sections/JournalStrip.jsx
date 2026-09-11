import { Link } from 'react-router-dom';
import Parallax from '../motion/Parallax.jsx';
import { home } from '../data/content.js';
import './JournalStrip.css';

const SHOTS = [
  ['model1', 'A model seated on the sand at golden hour.'],
  ['model2', 'A model walking along the waterline.'],
  ['model3', 'A model reclining against a dune.'],
];

export default function JournalStrip() {
  return (
    <section className="jstrip">
      <p className="u-label">{home.journal.label}</p>
      <div className="jstrip__grid">
        {SHOTS.map(([slug, alt], i) => (
          <Parallax key={slug} speed={i === 1 ? -18 : -8}>
            <figure>
              <img
                src={`/images/photo/${slug}-1600.webp`}
                alt={alt}
                width="1600" height="893" loading="lazy"
              />
            </figure>
          </Parallax>
        ))}
      </div>
      <Link to="/journal" className="u-label" style={{ display: 'inline-block', marginTop: '2rem', borderBottom: '1px solid currentColor' }}>
        {home.journal.title}
      </Link>
    </section>
  );
}
