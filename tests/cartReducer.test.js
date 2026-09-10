import { describe, it, expect } from 'vitest';
import { cartReducer, emptyCart, cartTotalCents, cartCount } from '../src/cart/cartReducer.js';

const add = (slug, size, qty = 1) => ({
  type: 'add',
  line: { slug, size, qty, priceCents: 19800 },
});

describe('cartReducer', () => {
  it('starts empty', () => {
    expect(emptyCart.lines).toEqual([]);
  });

  it('adds a line', () => {
    const s = cartReducer(emptyCart, add('ember', 'S'));
    expect(s.lines).toHaveLength(1);
    expect(s.lines[0]).toMatchObject({ slug: 'ember', size: 'S', qty: 1 });
  });

  it('increments quantity when slug and size both match', () => {
    let s = cartReducer(emptyCart, add('ember', 'S'));
    s = cartReducer(s, add('ember', 'S'));
    expect(s.lines).toHaveLength(1);
    expect(s.lines[0].qty).toBe(2);
  });

  it('keeps sizes of the same colourway as separate lines', () => {
    let s = cartReducer(emptyCart, add('ember', 'S'));
    s = cartReducer(s, add('ember', 'M'));
    expect(s.lines).toHaveLength(2);
  });

  it('sets an explicit quantity', () => {
    let s = cartReducer(emptyCart, add('kelp', 'L'));
    s = cartReducer(s, { type: 'setQty', slug: 'kelp', size: 'L', qty: 4 });
    expect(s.lines[0].qty).toBe(4);
  });

  it('removes a line when quantity is set to zero', () => {
    let s = cartReducer(emptyCart, add('kelp', 'L'));
    s = cartReducer(s, { type: 'setQty', slug: 'kelp', size: 'L', qty: 0 });
    expect(s.lines).toHaveLength(0);
  });

  it('removes a line explicitly', () => {
    let s = cartReducer(emptyCart, add('salt', 'XS'));
    s = cartReducer(s, { type: 'remove', slug: 'salt', size: 'XS' });
    expect(s.lines).toHaveLength(0);
  });

  it('clears every line', () => {
    let s = cartReducer(emptyCart, add('salt', 'XS'));
    s = cartReducer(s, add('clay', 'M'));
    s = cartReducer(s, { type: 'clear' });
    expect(s.lines).toEqual([]);
  });

  it('totals in cents', () => {
    let s = cartReducer(emptyCart, add('ember', 'S', 2));
    s = cartReducer(s, add('clay', 'M'));
    expect(cartTotalCents(s)).toBe(19800 * 3);
  });

  it('counts total units, not distinct lines', () => {
    let s = cartReducer(emptyCart, add('ember', 'S', 2));
    s = cartReducer(s, add('clay', 'M'));
    expect(cartCount(s)).toBe(3);
  });

  it('ignores an unknown action', () => {
    const s = cartReducer(emptyCart, { type: 'nope' });
    expect(s).toBe(emptyCart);
  });
});
