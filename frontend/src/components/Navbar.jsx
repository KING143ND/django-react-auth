import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const linkStyle =
    'text-white text-lg font-medium hover:text-yellow-200 transition duration-300';

  return (
    <nav className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4 shadow-lg mb-5">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl tracking-wider font-semibold hover:opacity-90">
          Django React Auth
        </Link>

        <div className="hidden md:flex space-x-6 items-center">
          {!user ? (
            <>
              <Link to="/login" className={linkStyle}>Login</Link>
              <Link to="/register" className={linkStyle}>Register</Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className={linkStyle}>Dashboard</Link>
              <button onClick={logoutUser} className={linkStyle}>Logout</button>
            </>
          )}
          <Link to="/forgot-password" className={linkStyle}>Forgot</Link>
        </div>

        <div className="md:hidden">
          <button onClick={toggleMenu}>
            {menuOpen ? (
              <XMarkIcon className="h-6 w-6 text-white hover:text-yellow-200 text-lg" />
            ) : (
              <Bars3Icon className="h-6 w-6 text-white hover:text-yellow-200 text-xl" />
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden mt-2 px-4 py-3 space-y-2 rounded-md">
          {!user ? (
            <>
              <Link to="/login" onClick={closeMenu} className={`${linkStyle} block`}>Login</Link>
              <Link to="/register" onClick={closeMenu} className={`${linkStyle} block`}>Register</Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" onClick={closeMenu} className={`${linkStyle} block`}>Dashboard</Link>
              <button onClick={() => { logoutUser(); closeMenu(); }} className={`${linkStyle} block`}>
                Logout
              </button>
            </>
          )}
          <Link to="/forgot-password" onClick={closeMenu} className={`${linkStyle} block`}>Forgot</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
