import Hero from '../sections/Hero.jsx';
import Anatomy from '../sections/Anatomy.jsx';
import TheEight from '../sections/TheEight.jsx';
import Editorial from '../sections/Editorial.jsx';
import JournalStrip from '../sections/JournalStrip.jsx';
import Closing from '../sections/Closing.jsx';

export default function Home() {
  return (
    <main>
      {/* The page's only <h1> lives in Hero. PageTransition focuses it on
          navigation so screen readers announce the page. */}
      <Hero />
      <Anatomy />
      <TheEight />
      <Editorial />
      <JournalStrip />
      <Closing />
    </main>
  );
}
