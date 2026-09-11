import { Link } from 'react-router-dom';
import CountUp from '../motion/CountUp.jsx';
import { home } from '../data/content.js';
import './CraftTeaser.css';

export default function CraftTeaser() {
  return (
    <section className="craft">
      <p className="u-label">{home.craft.label}</p>
      <div className="craft__grid">
        {home.craft.stats.map((s) => (
          <div key={s.caption}>
            <CountUp className="craft__value" value={s.value} suffix={s.suffix} />
            <p className="craft__caption">{s.caption}</p>
          </div>
        ))}
      </div>
      <Link to="/craft" className="u-label" style={{ display: 'inline-block', marginTop: '2rem', borderBottom: '1px solid currentColor' }}>
        How it is made
      </Link>
    </section>
  );
}
