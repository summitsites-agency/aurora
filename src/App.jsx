import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SmoothScroll from './smooth/SmoothScroll.jsx';
import GroundProvider from './ground/GroundProvider.jsx';
import CartProvider from './cart/CartProvider.jsx';
import CartDrawer from './cart/CartDrawer.jsx';
import Nav from './components/Nav.jsx';
import Footer from './components/Footer.jsx';
import PageTransition from './components/PageTransition.jsx';
import Preloader from './motion/Preloader.jsx';
import Editorial from './sections/Editorial.jsx';

import Home from './routes/Home.jsx';
import Shop from './routes/Shop.jsx';
import Product from './routes/Product.jsx';
import Craft from './routes/Craft.jsx';
import Anatomy from './routes/Anatomy.jsx';
import Checkout from './routes/Checkout.jsx';
import NotFound from './routes/NotFound.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <SmoothScroll>
          <GroundProvider>
            <Preloader />
            <Nav />
            <CartDrawer />
            <PageTransition>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/shop/:slug" element={<Product />} />
                <Route path="/craft" element={<Craft />} />
                <Route path="/anatomy" element={<Anatomy />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </PageTransition>
            {/* Outside PageTransition, so it does not re-enter on every route
                change — it is a fixed part of the page furniture now, like the
                footer, not part of the content being swapped. */}
            <Editorial />
            <Footer />
          </GroundProvider>
        </SmoothScroll>
      </CartProvider>
    </BrowserRouter>
  );
}
