import './MarqueeRail.css';

const WORDS = [
  'Handmade in small batches',
  'Italian fabric',
  'Made to order',
  'One silhouette, eight shades',
];

export default function MarqueeRail({ side = 'left' }) {
  // Two copies: the keyframe translates by -50%, which lands on the start of
  // the second copy — pixel-identical to frame zero, so the loop is seamless.
  const items = [...WORDS, ...WORDS];
  return (
    <div className={`rail-edge rail-edge--${side}`} aria-hidden="true">
      <div className="rail-edge__track u-label">
        {items.map((w, i) => <span key={i}>{w}</span>)}
      </div>
    </div>
  );
}
