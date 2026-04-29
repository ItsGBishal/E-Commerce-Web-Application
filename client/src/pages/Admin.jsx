import { useEffect, useMemo, useState } from 'react';
import StatusBadge from '../components/StatusBadge';
import axiosInstance from '../utils/axiosInstance';

const emptyProduct = {
  name: '',
  description: '',
  price: '',
  category: 'Electronics',
  stock: '',
  imageUrl: ''
};

const Admin = () => {
  const [tab, setTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(emptyProduct);
  const [editingId, setEditingId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const [productResponse, orderResponse] = await Promise.all([
        axiosInstance.get('/products'),
        axiosInstance.get('/orders')
      ]);
      setProducts(productResponse.data);
      setOrders(orderResponse.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load admin data');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const kpis = useMemo(() => ({
    totalRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
    totalOrders: orders.length,
    totalProducts: products.length
  }), [orders, products]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyProduct);
    setModalOpen(true);
  };

  const openEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      imageUrl: product.imageUrl
    });
    setModalOpen(true);
  };

  const saveProduct = async (event) => {
    event.preventDefault();
    const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };

    try {
      if (editingId) await axiosInstance.put(`/products/${editingId}`, payload);
      else await axiosInstance.post('/products', payload);
      setModalOpen(false);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await axiosInstance.delete(`/products/${id}`);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete product');
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axiosInstance.put(`/orders/${id}/status`, { status });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update order');
    }
  };

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[240px_1fr] lg:px-8">
      <aside className="h-fit rounded-lg bg-muted p-3">
        {['dashboard', 'products', 'orders'].map((item) => (
          <button
            key={item}
            className={`mb-2 w-full rounded-lg px-4 py-3 text-left font-bold capitalize ${tab === item ? 'bg-white text-primary shadow-ambient' : 'text-soft'}`}
            onClick={() => setTab(item)}
          >
            {item}
          </button>
        ))}
      </aside>

      <section>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-headline text-4xl font-extrabold capitalize">{tab}</h1>
          {tab === 'products' && <button className="btn-primary" onClick={openCreate}>+ Add Product</button>}
        </div>
        {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-danger">{error}</p>}

        {tab === 'dashboard' && (
          <div className="grid gap-4 sm:grid-cols-3">
            <KpiCard label="Total Revenue" value={`₹${kpis.totalRevenue.toLocaleString('en-IN')}`} />
            <KpiCard label="Total Orders" value={kpis.totalOrders} />
            <KpiCard label="Total Products" value={kpis.totalProducts} />
          </div>
        )}

        {tab === 'products' && (
          <div className="overflow-x-auto rounded-lg bg-white p-4 shadow-ambient">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="text-outline">
                <tr><th className="p-3">Product</th><th className="p-3">Category</th><th className="p-3">Price</th><th className="p-3">Stock</th><th className="p-3">Actions</th></tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="odd:bg-muted">
                    <td className="p-3 font-bold">{product.name}</td>
                    <td className="p-3">{product.category}</td>
                    <td className="p-3">₹{product.price.toLocaleString('en-IN')}</td>
                    <td className="p-3">{product.stock}</td>
                    <td className="space-x-2 p-3">
                      <button className="font-bold text-primary" onClick={() => openEdit(product)}>Edit</button>
                      <button className="font-bold text-danger" onClick={() => deleteProduct(product._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'orders' && (
          <div className="overflow-x-auto rounded-lg bg-white p-4 shadow-ambient">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="text-outline">
                <tr><th className="p-3">Order</th><th className="p-3">Customer</th><th className="p-3">Total</th><th className="p-3">Status</th><th className="p-3">Update</th></tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="odd:bg-muted">
                    <td className="p-3 font-bold">#{order._id.slice(-8)}</td>
                    <td className="p-3">{order.user?.email || 'Unknown'}</td>
                    <td className="p-3">₹{order.totalAmount.toLocaleString('en-IN')}</td>
                    <td className="p-3"><StatusBadge status={order.status} /></td>
                    <td className="p-3">
                      <select className="field max-w-40" value={order.status} onChange={(event) => updateStatus(order._id, event.target.value)}>
                        {['pending', 'processing', 'shipped', 'delivered'].map((status) => <option key={status} value={status}>{status}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {modalOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 px-4">
          <form onSubmit={saveProduct} className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-ambient">
            <h2 className="font-headline text-2xl font-bold">{editingId ? 'Edit Product' : 'Add Product'}</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <input className="field" placeholder="Name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
              <select className="field" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
                <option>Electronics</option><option>Clothing</option><option>Books</option>
              </select>
              <input className="field" type="number" step="0.01" placeholder="Price" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} required />
              <input className="field" type="number" placeholder="Stock" value={form.stock} onChange={(event) => setForm({ ...form, stock: event.target.value })} required />
              <input className="field sm:col-span-2" placeholder="Image URL" value={form.imageUrl} onChange={(event) => setForm({ ...form, imageUrl: event.target.value })} required />
              <textarea className="field sm:col-span-2" rows="4" placeholder="Description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} required />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
              <button className="btn-primary">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

const KpiCard = ({ label, value }) => (
  <div className="rounded-lg bg-white p-6 shadow-ambient">
    <p className="text-sm font-bold uppercase text-outline">{label}</p>
    <p className="mt-3 font-headline text-3xl font-extrabold">{value}</p>
  </div>
);

export default Admin;
