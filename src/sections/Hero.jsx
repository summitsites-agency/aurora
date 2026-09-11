import { Link } from 'react-router-dom';
import { gsap } from '../motion/gsap.js';
import { useGsapScope } from '../motion/useGsapScope.js';
import { home } from '../data/content.js';
import MarqueeRail from '../motion/MarqueeRail.jsx';
import Magnetic from '../motion/Magnetic.jsx';
import './Hero.css';

export default function Hero() {
  const scope = useGsapScope((el) => {
    const media = el.querySelector('.hero__media img');
    const inner = el.querySelector('.hero__inner');

    gsap.fromTo(media, { scale: 1.06 }, { scale: 1, duration: 1.6, ease: 'glide' });

    gsap.to(media, {
      yPercent: 12,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
    });
    gsap.to(inner, {
      yPercent: -28,
      opacity: 0.25,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
    });

    gsap.from(el.querySelectorAll('[data-hero-in]'), {
      yPercent: 60,
      opacity: 0,
      duration: 1.1,
      ease: 'glide',
      stagger: 0.12,
      delay: 0.15,
    });
  });

  return (
    <section className="hero" ref={scope}>
      <div className="hero__media">
        <img
          src="/images/photo/hero-2400.webp"
          srcSet="/images/photo/hero-1600.webp 1600w, /images/photo/hero-2400.webp 2400w"
          sizes="100vw"
          alt="A model lying in the shallows at the water's edge, wearing an Aurora bikini."
          width="2400"
          height="1340"
          fetchPriority="high"
        />
      </div>
      <div className="hero__scrim" />

      <div className="hero__inner">
        <h1 className="hero__line" data-hero-in>
          {home.hero.line1}
          {/* fontFamily inline, not in Hero.css — see the comment on
              .hero__script in that file. */}
          <span className="hero__script">{home.hero.script}</span>
        </h1>
        {/* `data-hero-in` stays on the Link, not on the Magnetic wrapper. The
            intro tween writes yPercent/opacity and Magnetic writes x/y — on one
            element those share a transform and fight for the 1.1s the intro
            runs. On separate elements they compose. */}
        <Magnetic>
          <Link to="/shop" className="hero__cta u-label" data-hero-in>{home.hero.cta}</Link>
        </Magnetic>
      </div>

      <MarqueeRail side="left" />
      <MarqueeRail side="right" />
    </section>
  );
}
