import { craft } from '../data/content.js';
import { useDocumentTitle } from '../lib/useDocumentTitle.js';
import SplitReveal from '../motion/SplitReveal.jsx';
import GrainReveal from '../motion/GrainReveal.jsx';
import './Craft.css';

export default function Craft() {
  useDocumentTitle('The Craft');

  return (
    <main className="craft-p">
      <div className="craft-p__head">
        <p className="u-label">{craft.label}</p>
        <SplitReveal as="h1" className="craft-p__title">{craft.title}</SplitReveal>
        <p className="craft-p__standfirst">{craft.standfirst}</p>
      </div>

      {/* A model shot is allowed here: no colourway is named anywhere near it,
          so it cannot imply a match with the tan suit in the photograph. */}
      <div className="craft-p__band">
        <GrainReveal
          src={craft.band.src}
          alt={craft.band.alt}
          width="2400"
          height="1340"
        />
      </div>

      <div className="craft-p__sections">
        {craft.sections.map((s, i) => (
          <section className="craft-p__sec" key={s.title}>
            <span className="craft-p__num u-label">{String(i + 1).padStart(2, '0')}</span>
            <h2>{s.title}</h2>
            <p>{s.body}</p>
          </section>
        ))}
      </div>
    </main>
  );
}
