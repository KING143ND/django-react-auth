import React, { useState, useContext } from 'react';
import axios from '../utils/axios';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify';
import LoaderContext from "../context/LoaderContext.js";

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const { showLoader, hideLoader } = useContext(LoaderContext);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      showLoader();
      const res = await axios.post('auth/password-forgot/', { email });
      toast.success(res.data.message || 'Check your email for the reset link');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Error sending email');
    } finally {
      hideLoader();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center px-4">
        <div className="bg-orange-200 px-8 py-4 rounded-xl shadow-xl w-full sm:max-w-md">
          <h2 className="text-3xl font-bold text-center text-gray-800 my-2">Forgot Password</h2>
          <form onSubmit={handleSubmit} className="space-y-2">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-600">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full p-3 rounded-lg bg-gray-50 text-gray-800 border border-gray-300 focus:ring-2 focus:ring-yellow-500 outline-none mb-3"
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition ease-in-out duration-200"
            >
              Send Reset Link
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
