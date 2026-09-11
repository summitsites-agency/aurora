import { journal } from '../data/content.js';
import SplitReveal from '../motion/SplitReveal.jsx';
import './Journal.css';

/** Was the /journal route. Now the first section under the hero, so the
 *  heading is an h2 — the homepage's only h1 stays in Hero, which is what
 *  PageTransition focuses on navigation. */
export default function Journal() {
  return (
    <section className="jr">
      <div className="jr__head">
        <p className="u-label">{journal.label}</p>
        <SplitReveal as="h2" className="jr__title">{journal.title}</SplitReveal>
        <p className="jr__standfirst">{journal.standfirst}</p>
      </div>

      {/* Editorial only. No prices and no colourway names anywhere in here:
          the suit photographed is a tan that is not one of the seven.

          Plain <img>, not GrainReveal: the mosaic dissolve read as a
          pixelation artefact against this photography rather than as an
          effect. The plates now just load. */}
      <div className="jr__plates">
        {journal.plates.map((p) => (
          <figure className={`jr__plate ${p.wide ? 'jr__plate--wide' : ''}`} key={p.src + p.caption}>
            <img src={p.src} alt={p.alt} width="2400" height="1340" loading="lazy" />
            <figcaption className="jr__caption u-label">{p.caption}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
