import React, {useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify'; // Assuming you're using react-toastify for notifications
import { BACKEND_API } from "../constant";

const DashboardCard = ({ title, value, onButtonClick }) => (
	<div className="bg-white p-4 rounded-lg shadow">
		<h3 className="text-sm font-medium text-gray-500">{title}</h3>
		<p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
		<button
			className="mt-2 px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600"
			onClick={onButtonClick}
		>
			View Details
		</button>
	</div>
);

const HODLayout = () => {
		const navigate = useNavigate();
	const [stats, setStats] = useState({
		patents: 0,
		conferences: 0,
		journals: 0,
		proposals: 0,
		copyrights: 0,
		fdps: 0,
		sdps: 0,
	});
  const [deptStats, setDeptStats] = useState({
		patents: 0,
		conferences: 0,
		journals: 0,
		proposals: 0,
		copyrights: 0,
		fdps: 0,
		sdps: 0,
	});
	const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("authToken");
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const dept = storedUser?.department; 
  const userId = storedUser?.userId;// Use optional chaining
	// Fetch staff stats from the backend
	const fetchDeptStats = async () => {
		setLoading(true);
		try {
			const config = {
				headers: {
					Authorization: `${token}`, // Add the token to the request header
				},
			};

			const response = await axios.get(`${BACKEND_API}/staff/dept-stats/${dept}`, config);

			if (response.data.success) {
				setDeptStats(response.data.stats);
				setLoading(false);
			} else {
				toast.error(response.data.message);
				setLoading(false);
			}
		} catch (error) {
			console.error("Error fetching staff stats:", error);
			toast.error("Failed to fetch staff stats. Please try again.");
			setLoading(false);
		}
	};

  const fetchStaffStats = async () => {
		setLoading(true);
		try {
			const config = {
				headers: {
					Authorization: `${token}`, // Add the token to the request header
				},
			};

			const response = await axios.get(`${BACKEND_API}/staff//staff-stats/${userId}`, config);

			if (response.data.success) {
				setStats(response.data.stats);
				setLoading(false);
			} else {
				toast.error(response.data.message);
				setLoading(false);
			}
		} catch (error) {
			console.error("Error fetching staff stats:", error);
			toast.error("Failed to fetch staff stats. Please try again.");
			setLoading(false);
		}
	};

	// Call fetchStaffStats on component mount
	useEffect(() => {
		fetchDeptStats();
    fetchStaffStats();
	}, []);

	const data = [
		{ name: 'Patent', value: stats.patents, color: "red", route: '/patent/list' },
		{ name: 'Conference', value: stats.conferences, color: "GREEN", route: '/conference/list' },
		{ name: 'Journal', value: stats.journals, color: "#f72585", route: '/journal/list' },
		{ name: 'Proposal', value: stats.proposals, color: "blue", route: '/praposal/list' },
		{ name: 'Copyright', value: stats.copyrights, color: "orange", route: '/copyright/list' },
		{ name: 'FDP/STTP', value: stats.fdps, color: "#219ebc", route: '/fdp/list' },
		{ name: 'SDP', value: stats.sdps, color: "#d62828", route: '/sdp/list' },
	];


  const deptData = [
		{ name: 'Patent', value: deptStats.patents, color: "red", route: '/patent/hod/' },
		{ name: 'Conference', value: deptStats.conferences, color: "GREEN", route: 'conferance/hod/' },
		{ name: 'Journal', value: deptStats.journals, color: "#f72585", route: '/journal/hod' },
		{ name: 'Proposal', value: deptStats.proposals, color: "blue", route: '/praposal/hod/' },
		{ name: 'Copyright', value: deptStats.copyrights, color: "orange", route: '/copyright/hod/' },
		{ name: 'FDP/STTP', value: deptStats.fdps, color: "#219ebc", route: '/fdp/hod' },
		{ name: 'SDP', value: deptStats.sdps, color: "#d62828", route: '/sdp/hod' },
	];
	const handleButtonClick = (route) => {
		navigate(route);
	};

	if (loading) {
		return <p>Loading...</p>; 
	}

	return (
		<div className="faculty-container">
      <div className="conference-list-main-container">
			<div className="p-4 bg-gray-100 w-[95%] mx-auto">
				<h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <div className="grid grid-cols-3 gap-6">
					<div className="col-span-1 md:col-span-2 bg-white p-4 rounded-lg shadow">
						<h2 className="text-2xl font-bold mb-6">Department Overview Dashboard</h2>
						<ResponsiveContainer width="100%" height={400}>
							<PieChart>
								<Pie
									data={deptData}
									cx="50%"
									cy="50%"
									labelLine={false}
									outerRadius={150}
									fill="#8884d8"
									dataKey="value"
									label={({ name, value }) => `${name}: ${value}`}
								>
									{deptData.map((entry, index) => (
										<Cell key={`cell-${index}`} fill={entry.color} />
									))}
									<Label
										value={`Total Entries: ${Object.values(deptStats).reduce((acc, val) => acc + val, 0)}`}
										position="center"
										fill="#000"
										style={{ fontSize: "16px", fontWeight: "bold" }}
									/>
								</Pie>
							</PieChart>
						</ResponsiveContainer>
						<div className="flex justify-center space-x-4 mt-4">
							<div className="w-60 p-2 bg-gray-100 rounded-lg mt-4">
								{deptData.map((entry, index) => (
									<div key={`legend-${index}`} className="flex items-center mb-2">
										<div
											className="w-3 h-3 mr-2"
											style={{ backgroundColor: entry.color }}
										></div>
										<span>{entry.name}</span>
									</div>
								))}
							</div>
						</div>
					</div>

					<div className="space-y-5">
						{deptData.map((data, index) => (
							<DashboardCard 
								title={data.name} 
								value={data.value} 
								key={index} 
								onButtonClick={() => handleButtonClick(data.route)}
							/>
						))}
					</div>
				</div>
				<div className="grid grid-cols-3 gap-6 mt-5">
					<div className="col-span-1 md:col-span-2 bg-white p-4 rounded-lg shadow">
						<h2 className="text-2xl font-bold mb-6">HOD Dashboard</h2>
						<ResponsiveContainer width="100%" height={400}>
							<PieChart>
								<Pie
									data={data}
									cx="50%"
									cy="50%"
									labelLine={false}
									outerRadius={150}
									fill="#8884d8"
									dataKey="value"
									label={({ name, value }) => `${name}: ${value}`}
								>
									{data.map((entry, index) => (
										<Cell key={`cell-${index}`} fill={entry.color} />
									))}
									<Label
										value={`Total Entries: ${Object.values(stats).reduce((acc, val) => acc + val, 0)}`}
										position="center"
										fill="#000"
										style={{ fontSize: "16px", fontWeight: "bold" }}
									/>
								</Pie>
							</PieChart>
						</ResponsiveContainer>
						<div className="flex justify-center space-x-4 mt-4">
							<div className="w-60 p-2 bg-gray-100 rounded-lg mt-4">
								{data.map((entry, index) => (
									<div key={`legend-${index}`} className="flex items-center mb-2">
										<div
											className="w-3 h-3 mr-2"
											style={{ backgroundColor: entry.color }}
										></div>
										<span>{entry.name}</span>
									</div>
								))}
							</div>
						</div>
					</div>

					<div className="space-y-5">
						{data.map((data, index) => (
							<DashboardCard 
								title={data.name} 
								value={data.value} 
								key={index} 
								onButtonClick={() => handleButtonClick(data.route)}
							/>
						))}
					</div>
				</div>
			</div>
		</div>
    </div>
	);
};

export default HODLayout;
