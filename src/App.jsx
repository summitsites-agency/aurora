import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SmoothScroll from './smooth/SmoothScroll.jsx';
import GroundProvider from './ground/GroundProvider.jsx';
import CartProvider from './cart/CartProvider.jsx';
import CartDrawer from './cart/CartDrawer.jsx';
import Nav from './components/Nav.jsx';
import Footer from './components/Footer.jsx';
import PageTransition from './components/PageTransition.jsx';
import Preloader from './motion/Preloader.jsx';
import Cursor from './motion/Cursor.jsx';

import Home from './routes/Home.jsx';
import Shop from './routes/Shop.jsx';
import Product from './routes/Product.jsx';
import Craft from './routes/Craft.jsx';
import Journal from './routes/Journal.jsx';
import Contact from './routes/Contact.jsx';
import Checkout from './routes/Checkout.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <SmoothScroll>
          <GroundProvider>
            <Preloader />
            <Cursor />
            <Nav />
            <CartDrawer />
            <PageTransition>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/shop/:slug" element={<Product />} />
                <Route path="/craft" element={<Craft />} />
                <Route path="/journal" element={<Journal />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/checkout" element={<Checkout />} />
              </Routes>
            </PageTransition>
            <Footer />
          </GroundProvider>
        </SmoothScroll>
      </CartProvider>
    </BrowserRouter>
  );
}
