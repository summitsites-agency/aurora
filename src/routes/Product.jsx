import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { bySlug } from '../data/products.js';
import { detail } from '../data/productDetail.js';
import { formatPrice } from '../lib/format.js';
import { useCart } from '../cart/CartProvider.jsx';
import { useGround } from '../ground/GroundProvider.jsx';
import SizeSelector from '../components/SizeSelector.jsx';
import Accordion from '../components/Accordion.jsx';
import ColourRail from '../components/ColourRail.jsx';
import { useDocumentTitle } from '../lib/useDocumentTitle.js';
import './Product.css';

export default function Product() {
  const { slug } = useParams();
  const product = bySlug(slug);
  const { dispatch, openCart } = useCart();
  const { setGround, resetGround } = useGround();
  const [size, setSize] = useState(null);
  const [hint, setHint] = useState('');

  // Must sit above the `if (!product) return` below, or React sees a
  // different hook count between renders (found vs. not-found product).
  useDocumentTitle(product ? product.name : 'Not found');

  useEffect(() => {
    if (product) setGround(product);
    return resetGround;
  }, [product, setGround, resetGround]);

  // Changing colourway must not silently carry a stale size selection.
  useEffect(() => { setSize(null); setHint(''); }, [slug]);

  if (!product) {
    return (
      <main className="pdp">
        <h1 className="pdp__name">Not found</h1>
        <p className="pdp__note">That colourway does not exist.</p>
        <Link to="/shop" className="u-label">Back to the shop</Link>
      </main>
    );
  }

  const addToBag = () => {
    if (!size) { setHint('Choose a size first.'); return; }
    dispatch({
      type: 'add',
      line: { slug: product.slug, size, qty: 1, priceCents: product.priceCents },
    });
    setHint('');
    openCart();
  };

  return (
    <main className="pdp">
      <div className="pdp__top">
        <span className="pdp__plate" style={{ background: product.groundSoft }}>
          <img
            className="pdp__img"
            src={product.image.card}
            alt={`The Aurora bikini in ${product.name}`}
            width="880" height="1100"
          />
        </span>

        <div>
          <p className="u-label">The Aurora bikini</p>
          <h1 className="pdp__name">{product.name}</h1>
          <p className="pdp__price">{formatPrice(product.priceCents)}</p>
          <p className="pdp__note">{product.note}</p>

          <div className="pdp__field">
            <div className="pdp__fieldhead">
              <span className="u-label">Size</span>
              {/* No size-guide page: /fit was cut at the client's request.
                  Sizing lives in the "Fit notes" accordion below. */}
            </div>
            <SizeSelector value={size} onChange={(s) => { setSize(s); setHint(''); }} accent={product.hex} />
          </div>

          {/* Sweep fill, ported from the Summit rebrand's AccentButton. The
              button is already ink-on-paper, so it inverts the other way:
              paper rises from the bottom edge and the label darkens to ink.
              Both layers must share a duration and a curve, or the text
              changes colour before the fill arrives underneath it. */}
          <button type="button" className="pdp__add u-label" onClick={addToBag}>
            <span className="pdp__addfill" aria-hidden="true" />
            <span className="pdp__addlabel">{detail.addToBag}</span>
          </button>
          {/* aria-live so the "choose a size" hint is announced, not just shown. */}
          <p className="pdp__hint" role="status" aria-live="polite">{hint}</p>

          <div className="pdp__panels">
            {detail.panels.map((p, i) => (
              <Accordion key={p.id} title={p.title} defaultOpen={i === 0}>
                <p>{p.body}</p>
              </Accordion>
            ))}
          </div>
        </div>
      </div>

      <div className="pdp__rail">
        <ColourRail currentSlug={product.slug} />
      </div>
    </main>
  );
}
