import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div>
      <Navbar />

      <main className="min-h-screen flex justify-center items-center px-4 mb-5">
        <div className="bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100  backdrop-blur-md rounded-2xl shadow-lg p-10 w-full max-w-md text-center space-y-6">
          <h1 className="text-4xl font-bold text-purple-500">Welcome to Django React Authentication</h1>
          <p className="text-lg text-gray-700">Secure. Simple. Modern Authentication.</p>

          <div className="space-y-4">
            <Link to="/login" className="block w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white py-2 px-4 rounded-lg shadow-md transition-all">
              Login
            </Link>
            <Link to="/register" className="block w-full bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white py-2 px-4 rounded-lg shadow-md transition-all">
              Register
            </Link>
            <Link to="/forgot-password" className="block w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white py-2 px-4 rounded-lg shadow-md transition-all">
              Forgot Password
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
