import React, { useRef, useState, useEffect, useContext } from "react";
import Navbar from "../components/Navbar";
import axios from "../utils/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoaderContext from "../context/LoaderContext.js";

function OtpVerificationPage() {
	const navigate = useNavigate();
	const [otp, setOtp] = useState(["", "", "", "", "", ""]);
	const inputsRef = useRef([]);

	const [timer, setTimer] = useState(60);
	const [canResend, setCanResend] = useState(false);
	const { showLoader, hideLoader } = useContext(LoaderContext);

	const userId = localStorage.getItem("otp_user_id");

	useEffect(() => {
		const countdown = setInterval(() => {
			setTimer((prev) => {
				if (prev <= 1) {
					clearInterval(countdown);
					setCanResend(true);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(countdown);
	}, []);

	const handleChange = (index, value) => {
		if (!/^\d?$/.test(value)) return;

		const updatedOtp = [...otp];
		updatedOtp[index] = value;
		setOtp(updatedOtp);

		if (value && index < 5) {
			inputsRef.current[index + 1]?.focus();
		}
	};

	const handleKeyDown = (index, e) => {
		if (e.key === "Backspace" && !otp[index] && index > 0) {
			inputsRef.current[index - 1]?.focus();
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const code = otp.join("");
		if (code.length !== 6) {
			alert("Please enter all 6 digits");
			return;
		}
		try {
      showLoader();
			const res = await axios.post("auth/otp-validate/", {
				user_id: userId,
				otp_code: code,
			});
			toast.success(res.data.message);
			localStorage.removeItem("otp_user_id");
			navigate("/login");
		} catch (err) {
			toast.error(err?.response?.data?.message || "Invalid or expired OTP");
		} finally {
      hideLoader();
    }
	};

	const handleResend = async () => {
		try {
      showLoader();
			const res = await axios.post("auth/otp-resend/", { user_id: userId });
			toast.success(res.data.message);

			setOtp(["", "", "", "", "", ""]);
			setCanResend(false);

			setTimer(60);

			const countdown = setInterval(() => {
				setTimer((prev) => {
					if (prev <= 1) {
						clearInterval(countdown);
						setCanResend(true);
						return 0;
					}
					return prev - 1;
				});
			}, 1000);

			inputsRef.current[0]?.focus();
		} catch (err) {
			toast.error(err?.response?.data?.message || "Failed to resend OTP");
		} finally {
      hideLoader();
    }
	};

	return (
		<div className="min-h-screen bg-gray-100 flex flex-col">
			<Navbar />
			<div className="flex-grow flex items-center justify-center px-4">
				<div className="bg-green-200 px-2 sm:px-8 py-6 rounded-xl shadow-xl w-full sm:max-w-md">
					<h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
						Verify OTP
					</h2>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="flex flex-wrap justify-center gap-2">
							{otp.map((digit, i) => (
								<input
									key={i}
									type="text"
									inputMode="numeric"
									maxLength={1}
									value={digit}
									onChange={(e) => handleChange(i, e.target.value)}
									onKeyDown={(e) => handleKeyDown(i, e)}
									ref={(el) => (inputsRef.current[i] = el)}
									className="w-9 sm:w-12 h-9 sm:h-12 text-center text-xl font-bold rounded-lg bg-white border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
									required
								/>
							))}
						</div>
						<button
							type="submit"
							className="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition ease-in-out duration-200"
						>
							Verify
						</button>

						<div className="text-center mt-2 text-sm text-gray-700">
							{canResend ? (
								<button
									type="button"
									onClick={handleResend}
									className="text-indigo-600 font-medium hover:text-indigo-700 transition duration-300"
								>
									Resend OTP
								</button>
							) : (
								<span>Resend OTP in {timer} seconds</span>
							)}
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}

export default OtpVerificationPage;
