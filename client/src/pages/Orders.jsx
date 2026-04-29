import { useEffect, useState } from 'react';
import StatusBadge from '../components/StatusBadge';
import axiosInstance from '../utils/axiosInstance';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axiosInstance.get('/orders/my');
        setOrders(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load orders');
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-headline text-4xl font-extrabold">Order History</h1>
      {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-danger">{error}</p>}
      <div className="mt-6 space-y-4">
        {orders.length === 0 && <p className="rounded-lg bg-white p-6 shadow-ambient">No orders yet.</p>}
        {orders.map((order) => (
          <article key={order._id} className="rounded-lg bg-white p-5 shadow-ambient">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-outline">#{order._id}</p>
                <p className="mt-1 text-sm text-soft">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <StatusBadge status={order.status} />
            </div>
            <div className="mt-4 flex justify-between font-headline text-xl font-extrabold">
              <span>Total</span>
              <span>₹{order.totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Orders;
