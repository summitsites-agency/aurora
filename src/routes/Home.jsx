import Hero from '../sections/Hero.jsx';
import Journal from '../sections/Journal.jsx';
import TheCollection from '../sections/TheCollection.jsx';
import { useDocumentTitle } from '../lib/useDocumentTitle.js';

export default function Home() {
  useDocumentTitle(null);

  return (
    <main>
      {/* The page's only <h1> lives in Hero. PageTransition focuses it on
          navigation so screen readers announce the page. */}
      {/* Editorial used to close this page. It is now rendered globally in
          App.jsx, directly above the footer, so it appears on every route. */}
      <Hero />
      <Journal />
      <TheCollection />
    </main>
  );
}
