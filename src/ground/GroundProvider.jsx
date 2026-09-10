import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

const GroundContext = createContext(null);

export const useGround = () => {
  const ctx = useContext(GroundContext);
  if (!ctx) throw new Error('useGround must be used inside <GroundProvider>');
  return ctx;
};

const PAPER = '#EFEDE7';

export default function GroundProvider({ children }) {
  const ref = useRef(null);
  const [active, setActive] = useState(null);

  /** @param {{hex:string, groundSoft:string, slug:string}|null} product */
  const setGround = useCallback((product) => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--ground', product ? product.hex : PAPER);
    el.style.setProperty('--ground-soft', product ? product.groundSoft : PAPER);
    setActive(product ? product.slug : null);
  }, []);

  const resetGround = useCallback(() => setGround(null), [setGround]);

  const value = useMemo(
    () => ({ setGround, resetGround, active }),
    [setGround, resetGround, active],
  );

  return (
    <GroundContext.Provider value={value}>
      <div className="ground" ref={ref}>{children}</div>
    </GroundContext.Provider>
  );
}
