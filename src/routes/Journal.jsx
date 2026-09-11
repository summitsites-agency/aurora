import { journal } from '../data/content.js';
import { useDocumentTitle } from '../lib/useDocumentTitle.js';
import SplitReveal from '../motion/SplitReveal.jsx';
import GrainReveal from '../motion/GrainReveal.jsx';
import './Journal.css';

export default function Journal() {
  useDocumentTitle('Journal');

  return (
    <main className="jr">
      <div className="jr__head">
        <p className="u-label">{journal.label}</p>
        <SplitReveal as="h1" className="jr__title">{journal.title}</SplitReveal>
        <p className="jr__standfirst">{journal.standfirst}</p>
      </div>

      {/* Editorial only. No prices and no colourway names anywhere on this
          page: the suit photographed is a tan that is not one of the eight. */}
      <div className="jr__plates">
        {journal.plates.map((p) => (
          <figure className={`jr__plate ${p.wide ? 'jr__plate--wide' : ''}`} key={p.src + p.caption}>
            <GrainReveal src={p.src} alt={p.alt} width="2400" height="1340" />
            <figcaption className="jr__caption u-label">{p.caption}</figcaption>
          </figure>
        ))}
      </div>
    </main>
  );
}
