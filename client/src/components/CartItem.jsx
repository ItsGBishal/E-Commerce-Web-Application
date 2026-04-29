import { useCart } from '../context/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="grid gap-4 rounded-lg bg-white p-4 shadow-ambient sm:grid-cols-[96px_1fr_auto] sm:items-center">
      <img src={item.imageUrl} alt={item.name} className="h-24 w-24 rounded-lg object-cover" />
      <div>
        <h3 className="font-headline text-lg font-bold">{item.name}</h3>
        <p className="text-sm text-outline">₹{item.price.toLocaleString('en-IN')} each</p>
        <button onClick={() => removeFromCart(item._id)} className="mt-2 text-sm font-bold text-danger">
          Remove
        </button>
      </div>
      <div className="flex items-center gap-3">
        <button className="btn-secondary px-3" onClick={() => updateQuantity(item._id, item.quantity - 1)}>
          -
        </button>
        <span className="w-8 text-center font-bold">{item.quantity}</span>
        <button className="btn-secondary px-3" onClick={() => updateQuantity(item._id, item.quantity + 1)}>
          +
        </button>
      </div>
    </div>
  );
};

export default CartItem;
