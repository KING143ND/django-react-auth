import React, { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import usePasswordToggle from "../utils/usePasswordToggle";
import LoaderContext from "../context/LoaderContext.js";

function LoginPage() {
	const { loginUser } = useContext(AuthContext);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [passwordType, toggleIcon] = usePasswordToggle();
	const navigate = useNavigate();
	const { showLoader, hideLoader } = useContext(LoaderContext);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			showLoader();
			const response = await loginUser(email, password);

			const { status: resStatus, message } = response;

			if (resStatus === 200 || resStatus === 201) {
				toast.success("Login successful");
				navigate("/dashboard");
			} else {
				toast.error(message || "Login failed");
			}
		} catch (err) {
			const message = err?.response?.data?.message || "Invalid credentials";
			toast.error(message);
		} finally {
			hideLoader();
		}
	};

	return (
		<div className="min-h-screen flex flex-col">
			<Navbar />
			<div className="flex-grow flex items-center justify-center px-4">
				<div className="bg-blue-200 px-8 py-4 mb-4 rounded-xl shadow-xl w-full sm:max-w-md">
					<h2 className="text-3xl font-bold text-center text-gray-800 my-2">
						Welcome Back
					</h2>
					<form onSubmit={handleSubmit} className="space-y-2">
						<div>
							<label className="block mb-2 text-sm font-medium text-gray-600">
								Email
							</label>
							<input
								type="email"
								placeholder="Enter your email"
								className="w-full p-3 rounded-lg bg-gray-50 text-gray-800 border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>
						<div>
							<label className="block mb-2 text-sm font-medium text-gray-600">
								Password
							</label>
							<div className="relative">
								<input
									type={passwordType}
									value={password}
									placeholder="Enter your password"
									className="w-full p-3 rounded-lg bg-gray-50 text-gray-800 border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none pr-10"
									onChange={(e) => setPassword(e.target.value)}
									required
								/>
								<span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 cursor-pointer">
									{toggleIcon}
								</span>
							</div>
						</div>
						<div className="flex justify-between items-center">
							<label className="flex items-center text-sm text-gray-600">
								<input type="checkbox" className="mr-2" />
								Remember me
							</label>
							<Link
								to="/forgot-password"
								className="text-sm text-indigo-600 hover:text-indigo-800"
							>
								Forgot Password?
							</Link>
						</div>
						<button
							type="submit"
							className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition ease-in-out duration-200"
						>
							Log In
						</button>
					</form>
					<div className="text-center mt-3">
						<p className="text-sm text-gray-600">
							Don’t have an account?
							<Link
								to="/register"
								className="text-indigo-600 hover:text-indigo-800"
							>
								{" "}
								Sign Up
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default LoginPage;
