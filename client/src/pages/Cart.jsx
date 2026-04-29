import { Link } from 'react-router-dom';
import CartItem from '../components/CartItem';
import { useCart } from '../context/CartContext';

const money = (value) => `₹${value.toLocaleString('en-IN')}`;

const Cart = () => {
  const { items, subtotal, tax, total } = useCart();

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
      <section>
        <h1 className="font-headline text-4xl font-extrabold">Shopping Cart</h1>
        {items.length === 0 ? (
          <div className="mt-6 rounded-lg bg-white p-8 shadow-ambient">
            <p className="text-soft">Your cart is empty.</p>
            <Link to="/" className="btn-primary mt-5 inline-flex">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {items.map((item) => (
              <CartItem key={item._id} item={item} />
            ))}
          </div>
        )}
      </section>
      <aside className="h-fit rounded-lg bg-white p-6 shadow-ambient">
        <h2 className="font-headline text-2xl font-bold">Order Summary</h2>
        <div className="mt-6 space-y-3 text-soft">
          <div className="flex justify-between"><span>Subtotal</span><span>{money(subtotal)}</span></div>
          <div className="flex justify-between"><span>Tax (10%)</span><span>{money(tax)}</span></div>
          <div className="flex justify-between pt-4 font-headline text-xl font-extrabold text-ink"><span>Total</span><span>{money(total)}</span></div>
        </div>
        <Link to="/checkout" className={`btn-primary mt-6 flex justify-center ${items.length === 0 ? 'pointer-events-none opacity-60' : ''}`}>
          Proceed to Checkout
        </Link>
      </aside>
    </div>
  );
};

export default Cart;
