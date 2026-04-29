import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axiosInstance from '../utils/axiosInstance';

const initialAddress = { name: '', address: '', city: '', zip: '', country: '' };

const Checkout = () => {
  const navigate = useNavigate();
  const { items, subtotal, tax, total, clearCart } = useCart();
  const [shippingAddress, setShippingAddress] = useState(initialAddress);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    setShippingAddress({ ...shippingAddress, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await axiosInstance.post('/orders', {
        shippingAddress,
        items: items.map((item) => ({ product: item._id, quantity: item.quantity }))
      });
      clearCart();
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Checkout failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
      <form onSubmit={handleSubmit} className="rounded-lg bg-white p-6 shadow-ambient">
        <h1 className="font-headline text-4xl font-extrabold">Checkout</h1>
        {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm font-bold text-danger">{error}</p>}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {Object.keys(initialAddress).map((field) => (
            <label key={field} className={field === 'address' ? 'sm:col-span-2' : ''}>
              <span className="mb-2 block text-sm font-bold capitalize text-outline">{field}</span>
              <input className="field" name={field} value={shippingAddress[field]} onChange={handleChange} required />
            </label>
          ))}
        </div>
        <button className="btn-primary mt-8" disabled={submitting || items.length === 0}>
          {submitting ? 'Placing Order...' : 'Place Order'}
        </button>
      </form>
      <aside className="h-fit rounded-lg bg-white p-6 shadow-ambient">
        <h2 className="font-headline text-2xl font-bold">Order Summary</h2>
        <div className="mt-4 space-y-3">
          {items.map((item) => (
            <div key={item._id} className="flex justify-between gap-4 text-sm text-soft">
              <span>{item.name} x {item.quantity}</span>
              <span>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 space-y-2 pt-4 text-soft">
          <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
          <div className="flex justify-between"><span>Tax</span><span>₹{tax.toLocaleString('en-IN')}</span></div>
          <div className="flex justify-between font-headline text-xl font-extrabold text-ink"><span>Total</span><span>₹{total.toLocaleString('en-IN')}</span></div>
        </div>
      </aside>
    </div>
  );
};

export default Checkout;
