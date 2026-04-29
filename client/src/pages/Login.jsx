import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const user = await login(form);
      navigate(user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-64px)] max-w-md items-center px-4 py-10">
      <form onSubmit={handleSubmit} className="w-full rounded-lg bg-white p-6 shadow-ambient">
        <h1 className="font-headline text-4xl font-extrabold">Login</h1>
        {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-danger">{error}</p>}
        <div className="mt-6 space-y-4">
          <input className="field" type="email" placeholder="Email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
          <input className="field" type="password" placeholder="Password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
        </div>
        <button className="btn-primary mt-6 w-full">Login</button>
        <p className="mt-5 text-center text-sm text-soft">
          Need an account? <Link className="font-bold text-primary" to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
