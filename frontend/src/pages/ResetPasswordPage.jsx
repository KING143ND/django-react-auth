import React, { useState, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from '../utils/axios';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify';
import usePasswordToggle from '../utils/usePasswordToggle';
import LoaderContext from '../context/LoaderContext.js';

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const uid = searchParams.get('user_id');
  const token = searchParams.get('token');

  const [form, setForm] = useState({ password: '', password2: '' });
  const [passwordType, togglePasswordIcon] = usePasswordToggle();
  const [password2Type, togglePassword2Icon] = usePasswordToggle();
  const { showLoader, hideLoader } = useContext(LoaderContext);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();

    if (!uid || !token) {
      toast.error('Invalid or missing reset credentials');
      return;
    }

    try {
      showLoader();
      const res = await axios.post(`auth/password-reset/${uid}/${token}/`, {
        new_password: form.password,
        confirm_password: form.password2,
      });
      toast.success(res.data.message || 'Password reset successfully!');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Error resetting password');
    } finally {
      hideLoader();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center px-4">
        <div className="bg-purple-200 px-8 py-4 rounded-xl shadow-xl w-full sm:max-w-md">
          <h2 className="text-3xl font-bold text-center text-gray-800 my-2">Reset Password</h2>
          <form onSubmit={handleSubmit} className="space-y-2">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-600">
                Password
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={passwordType}
                  value={form.password}
                  placeholder="Enter your password"
                  className="w-full p-3 rounded-lg bg-gray-50 text-gray-800 border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none pr-10"
                  onChange={handleChange}
                  required
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 cursor-pointer">
                  {togglePasswordIcon}
                </span>
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-600">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  name="password2"
                  type={password2Type}
                  value={form.password2}
                  placeholder="Confirm your password"
                  className="w-full p-3 rounded-lg bg-gray-50 text-gray-800 border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none pr-10"
                  onChange={handleChange}
                  required
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 cursor-pointer">
                  {togglePassword2Icon}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition ease-in-out duration-200"
            >
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
