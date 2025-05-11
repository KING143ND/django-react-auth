import React, { useState, useEffect, useContext } from "react";
import axios from "../utils/axios";
import Navbar from "../components/Navbar";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import { toast } from "react-toastify";
import LoaderContext from "../context/LoaderContext.js";

function DashboardPage() {
	const [stats, setStats] = useState({
		totalUsers: 0,
		totalOTPs: 0,
		activeUsers: 0,
		signupsThisWeek: 0,
	});

	const [chartData, setChartData] = useState([]);

    const { showLoader, hideLoader } = useContext(LoaderContext);

	useEffect(() => {
		const fetchDashboardData = async () => {
			try {
                showLoader();
				const response = await axios.get("auth/dashboard");
				const data = response.data;
				setStats({
					totalUsers: data.totalUsers,
					totalOTPs: data.totalOTPs,
					activeUsers: data.activeUsers,
					signupsThisWeek: data.signupsThisWeek,
				});
				setChartData(data.chartData);
			} catch (error) {
				toast.error("Error fetching dashboard data");
			} finally {
                hideLoader();
            }
		};

		fetchDashboardData();
	}, []);

	return (
		<div className="min-h-screen flex flex-col">
			<Navbar />
			<div className="flex-grow p-4">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
					<div className="bg-white p-4 rounded-xl shadow-md text-center">
						<h3 className="text-xl font-semibold text-gray-800">Total Users</h3>
						<p className="text-2xl font-bold text-indigo-600">
							{stats.totalUsers}
						</p>
					</div>

					<div className="bg-white p-4 rounded-xl shadow-md text-center">
						<h3 className="text-xl font-semibold text-gray-800">
							Total OTPs Generated
						</h3>
						<p className="text-2xl font-bold text-indigo-600">
							{stats.totalOTPs}
						</p>
					</div>

					<div className="bg-white p-4 rounded-xl shadow-md text-center">
						<h3 className="text-xl font-semibold text-gray-800">
							Active Users
						</h3>
						<p className="text-2xl font-bold text-green-600">
							{stats.activeUsers}
						</p>
					</div>

					<div className="bg-white p-4 rounded-xl shadow-md text-center">
						<h3 className="text-xl font-semibold text-gray-800">
							Signups This Week
						</h3>
						<p className="text-2xl font-bold text-yellow-600">
							{stats.signupsThisWeek}
						</p>
					</div>
				</div>

				<div className="mt-6">
					<div className="bg-white p-4 rounded-xl shadow-md h-[350px] pb-10">
						<h3 className="text-xl text-center text-gray-800">
							OTP Generation Trends
						</h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill="#8884d8" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
					</div>
				</div>
			</div>
		</div>
	);
}

export default DashboardPage;
