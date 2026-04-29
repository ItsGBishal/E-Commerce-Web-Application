import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const isOut = product.stock < 1;

  return (
    <article className="overflow-hidden rounded-lg bg-white shadow-ambient">
      <Link to={`/products/${product._id}`}>
        <img className="h-56 w-full object-cover" src={product.imageUrl} alt={product.name} />
      </Link>
      <div className="space-y-4 p-5">
        <div>
          <p className="text-xs font-bold uppercase text-primary">{product.category}</p>
          <Link to={`/products/${product._id}`} className="mt-1 block font-headline text-lg font-bold text-ink">
            {product.name}
          </Link>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="font-headline text-xl font-extrabold">₹{product.price.toLocaleString('en-IN')}</span>
          <button
            className={isOut ? 'btn-secondary cursor-not-allowed opacity-60' : 'btn-primary'}
            onClick={() => addToCart(product, 1)}
            disabled={isOut}
          >
            {isOut ? 'Out' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
