import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, role, logout, isAuthenticated } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="font-headline text-xl font-extrabold text-accent">
          BlueCart
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-semibold text-soft md:flex">
          <NavLink className={({ isActive }) => (isActive ? 'text-primary' : 'hover:text-primary')} to="/">
            Catalog
          </NavLink>
          {isAuthenticated && (
            <NavLink className={({ isActive }) => (isActive ? 'text-primary' : 'hover:text-primary')} to="/orders">
              Orders
            </NavLink>
          )}
          {role === 'admin' && (
            <NavLink className={({ isActive }) => (isActive ? 'text-primary' : 'hover:text-primary')} to="/admin">
              Admin
            </NavLink>
          )}
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/cart" className="relative rounded-lg bg-muted px-3 py-2 text-sm font-bold text-primary">
            Cart
            {itemCount > 0 && <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-white">{itemCount}</span>}
          </Link>
          {isAuthenticated ? (
            <>
              <span className="hidden text-sm text-outline sm:inline">{user?.name}</span>
              <button onClick={handleLogout} className="btn-secondary">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="btn-primary">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
