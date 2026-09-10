export const emptyCart = { lines: [] };

const sameLine = (a, slug, size) => a.slug === slug && a.size === size;

export function cartReducer(state, action) {
  switch (action.type) {
    case 'add': {
      const { slug, size, qty = 1, priceCents } = action.line;
      const existing = state.lines.find((l) => sameLine(l, slug, size));
      if (existing) {
        return {
          lines: state.lines.map((l) =>
            sameLine(l, slug, size) ? { ...l, qty: l.qty + qty } : l,
          ),
        };
      }
      return { lines: [...state.lines, { slug, size, qty, priceCents }] };
    }

    case 'setQty': {
      const { slug, size, qty } = action;
      if (qty <= 0) {
        return { lines: state.lines.filter((l) => !sameLine(l, slug, size)) };
      }
      return {
        lines: state.lines.map((l) => (sameLine(l, slug, size) ? { ...l, qty } : l)),
      };
    }

    case 'remove':
      return {
        lines: state.lines.filter((l) => !sameLine(l, action.slug, action.size)),
      };

    case 'clear':
      return emptyCart;

    default:
      return state;
  }
}

export const cartTotalCents = (state) =>
  state.lines.reduce((sum, l) => sum + l.priceCents * l.qty, 0);

export const cartCount = (state) =>
  state.lines.reduce((sum, l) => sum + l.qty, 0);
