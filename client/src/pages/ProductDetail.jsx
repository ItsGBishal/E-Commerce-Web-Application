import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axiosInstance from '../utils/axiosInstance';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axiosInstance.get(`/products/${id}`);
        setProduct(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load product');
      }
    };

    fetchProduct();
  }, [id]);

  if (error) return <div className="mx-auto max-w-4xl px-4 py-10 text-danger">{error}</div>;
  if (!product) return <div className="mx-auto max-w-4xl px-4 py-10">Loading product...</div>;

  const isOut = product.stock < 1;

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:px-8">
      <img src={product.imageUrl} alt={product.name} className="h-full max-h-[560px] w-full rounded-lg object-cover shadow-ambient" />
      <section className="rounded-lg bg-white p-6 shadow-ambient">
        <p className="text-sm font-bold uppercase text-primary">{product.category}</p>
        <h1 className="mt-2 font-headline text-4xl font-extrabold">{product.name}</h1>
        <p className="mt-4 text-soft">{product.description}</p>
        <p className="mt-6 font-headline text-3xl font-extrabold">₹{product.price.toLocaleString('en-IN')}</p>
        <p className={`mt-3 font-bold ${isOut ? 'text-danger' : 'text-emerald-700'}`}>{isOut ? 'Out of Stock' : `In Stock: ${product.stock}`}</p>
        <label className="mt-8 block text-sm font-bold text-outline" htmlFor="quantity">
          Quantity
        </label>
        <input
          id="quantity"
          className="field mt-2 max-w-32"
          type="number"
          min="1"
          max={product.stock}
          value={quantity}
          onChange={(event) => setQuantity(Math.max(1, Math.min(Number(event.target.value), product.stock)))}
          disabled={isOut}
        />
        <div className="mt-8 flex flex-wrap gap-3">
          <button className={isOut ? 'btn-secondary opacity-60' : 'btn-primary'} onClick={() => addToCart(product, quantity)} disabled={isOut}>
            Add to Cart
          </button>
          <button className={isOut ? 'btn-secondary opacity-60' : 'btn-secondary'} onClick={handleBuyNow} disabled={isOut}>
            Buy Now
          </button>
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;
