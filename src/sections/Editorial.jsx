import Parallax from '../motion/Parallax.jsx';
import { editorial } from '../data/content.js';
import './Editorial.css';

export default function Editorial() {
  return (
    <section className="editorial">
      <Parallax speed={-16} className="editorial__media">
        <img
          src="/images/photo/model4-2400.webp"
          srcSet="/images/photo/model4-1600.webp 1600w, /images/photo/model4-2400.webp 2400w"
          sizes="100vw"
          alt="A model walking at the shoreline in the surf."
          width="2400" height="1340" loading="lazy"
        />
      </Parallax>
      <div className="editorial__wash" />
      <figure className="editorial__quote">
        {/* fontFamily inline, not in Editorial.css — see the comment on
            .editorial__script in that file. */}
        <p className="editorial__script">{editorial.script}</p>
        <figcaption className="editorial__body u-label">{editorial.body}</figcaption>
      </figure>
    </section>
  );
}
