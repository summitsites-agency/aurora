import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './PageTransition.css';

export default function PageTransition({ children }) {
  const { pathname } = useLocation();
  const ref = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const heading = ref.current?.querySelector('h1');
    if (heading) {
      heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
    }
  }, [pathname]);

  return (
    <div className="page-transition" key={pathname} ref={ref}>
      {children}
    </div>
  );
}
