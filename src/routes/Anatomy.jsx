import { Link } from 'react-router-dom';
import { anatomy } from '../data/content.js';
import { useDocumentTitle } from '../lib/useDocumentTitle.js';
import SplitReveal from '../motion/SplitReveal.jsx';
import Reveal from '../motion/Reveal.jsx';
import AnatomyScrub from '../sections/Anatomy.jsx';
import './Anatomy.css';

export default function Anatomy() {
  useDocumentTitle('The Anatomy');

  return (
    <main className="an">
      <div className="an__head">
        <p className="u-label">{anatomy.label}</p>
        <SplitReveal as="h1" className="an__title">{anatomy.title}</SplitReveal>
        <p className="an__standfirst">{anatomy.standfirst}</p>
      </div>

      {/* The scrub pins itself with `start: 'top top'`, so it must stay a
          direct child here — wrapping it in a padded container would offset
          the pin-spacer and leave a gap the length of the padding. */}
      <AnatomyScrub />

      <section className="an__build">
        <div className="an__buildhead">
          <p className="u-label">{anatomy.build.label}</p>
          <SplitReveal as="h2" className="an__buildtitle">{anatomy.build.title}</SplitReveal>
        </div>

        {/* <dl>, not a div grid: these are term/definition pairs and a screen
            reader should read them as such. */}
        <Reveal as="dl" className="an__rows" stagger={0.1}>
          {anatomy.build.rows.map((row) => (
            <div className="an__row" key={row.term}>
              <dt className="an__term">{row.term}</dt>
              <dd className="an__detail">{row.detail}</dd>
            </div>
          ))}
        </Reveal>
      </section>

      <Reveal as="section" className="an__coda" variant="fade">
        <p className="an__codaline">{anatomy.coda.line}</p>
        <p className="an__codabody">{anatomy.coda.body}</p>
        <Link to="/shop" className="an__codacta u-label">View all</Link>
      </Reveal>
    </main>
  );
}
