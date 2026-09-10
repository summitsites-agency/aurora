import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { bySlug } from '../data/products.js';
import { formatPrice } from '../lib/format.js';
import { useGround } from '../ground/GroundProvider.jsx';

export default function Product() {
  const { slug } = useParams();
  const product = bySlug(slug);
  const { setGround, resetGround } = useGround();

  useEffect(() => {
    if (product) setGround(product);
    return resetGround;
  }, [product, setGround, resetGround]);

  if (!product) {
    return (
      <main style={{ padding: 'calc(var(--gutter) * 4) var(--gutter)' }}>
        <h1>Not found</h1>
        <Link to="/shop">Back to the shop</Link>
      </main>
    );
  }

  return (
    <main style={{ padding: 'calc(var(--gutter) * 4) var(--gutter)' }}>
      <h1>{product.name}</h1>
      <p>{product.note}</p>
      <p>{formatPrice(product.priceCents)}</p>
      <img src={product.image.card} alt={`Aurora bikini in ${product.name}`} width="880" height="1100" />
    </main>
  );
}
