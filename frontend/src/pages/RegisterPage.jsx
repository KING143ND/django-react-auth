import React, { useState, useContext } from "react";
import axios from "../utils/axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import usePasswordToggle from "../utils/usePasswordToggle";
import LoaderContext from "../context/LoaderContext.js";

function RegisterPage() {
	const [form, setForm] = useState({
		username: "",
		email: "",
		password: "",
		password2: "",
	});

	const [passwordType, toggleIcon] = usePasswordToggle();
	const [password2Type, toggleIcon2] = usePasswordToggle();
	const { showLoader, hideLoader } = useContext(LoaderContext);

	const navigate = useNavigate();

	const handleChange = (e) =>
		setForm({ ...form, [e.target.name]: e.target.value });

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			showLoader();
			const res = await axios.post("auth/signup/", form);
			const userId = res.data.data.id;

			await axios.post("auth/otp-generate/", { user_id: userId });

			localStorage.setItem("otp_user_id", userId);

			toast.success(res.data.message || "Registration successful");

			navigate("/otp");
		} catch (err) {
			toast.error(err?.response?.data?.message || "Error during registration");
		} finally {
			hideLoader();
		}
	};

	return (
		<div className="min-h-screen flex flex-col">
			<Navbar />
			<div className="flex-grow flex items-center justify-center px-4">
				<div className="bg-red-200 px-8 py-4 mb-4 rounded-xl shadow-xl w-full sm:max-w-md">
					<h2 className="text-3xl font-bold text-center text-gray-800 my-2">
						Create an Account
					</h2>
					<form onSubmit={handleSubmit} className="space-y-2">
						<div>
							<label className="block mb-2 text-sm font-medium text-gray-600">
								Email
							</label>
							<input
								name="email"
								type="email"
								placeholder="Enter your email"
								className="w-full p-3 rounded-lg bg-gray-50 text-gray-800 border border-gray-300 focus:ring-2 focus:ring-red-500 outline-none"
								onChange={handleChange}
								value={form.email}
								required
							/>
						</div>
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
									{toggleIcon}
								</span>
							</div>
						</div>

						<div className="relative">
							<label className="block mb-2 text-sm font-medium text-gray-600">
								Confirm Password
							</label>
							<input
								name="password2"
								type={password2Type}
								placeholder="Confirm your password"
								className="w-full p-3 pr-10 rounded-lg bg-gray-50 text-gray-800 border border-gray-300 focus:ring-2 focus:ring-red-500 outline-none mb-3"
								onChange={handleChange}
								value={form.password2}
								required
							/>
							<span className="absolute top-1/2 right-3 flex items-center text-gray-600 cursor-pointer">
								{toggleIcon2}
							</span>
						</div>

						<button
							type="submit"
							className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition ease-in-out duration-200"
						>
							Register
						</button>
					</form>
					<div className="text-center mt-3">
						<p className="text-sm text-gray-600">
							Already have an account?
							<span
								onClick={() => navigate("/login")}
								className="text-indigo-600 hover:text-indigo-800 cursor-pointer"
							>
								Log In
							</span>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default RegisterPage;
