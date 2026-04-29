import { useEffect, useMemo, useState } from 'react';
import ProductCard from '../components/ProductCard';
import axiosInstance from '../utils/axiosInstance';

const categories = ['All', 'Electronics', 'Clothing', 'Books'];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = {};
        if (search.trim()) params.search = search.trim();
        if (category !== 'All') params.category = category;
        const { data } = await axiosInstance.get('/products', { params });
        setProducts(data);
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(fetchProducts, 250);
    return () => clearTimeout(timeout);
  }, [search, category]);

  const productCount = useMemo(() => products.length, [products]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="mb-10 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
        <div className="max-w-2xl">
          <p className="mb-3 text-xs font-extrabold uppercase text-primary">Curated daily</p>
          <h1 className="font-headline text-4xl font-extrabold text-ink sm:text-5xl">Modern commerce, cleanly built.</h1>
          <p className="mt-4 text-lg text-soft">Shop electronics, clothing, and books with a fast cart and secure checkout.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <input className="field" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products..." />
          <select className="field" value={category} onChange={(event) => setCategory(event.target.value)}>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </section>

      {error && <p className="rounded-lg bg-red-50 p-4 font-semibold text-danger">{error}</p>}
      {loading ? (
        <p className="rounded-lg bg-white p-6 shadow-ambient">Loading products...</p>
      ) : (
        <>
          <p className="mb-5 text-sm font-semibold text-outline">{productCount} products found</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
