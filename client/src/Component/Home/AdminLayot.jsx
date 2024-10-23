import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BACKEND_API } from "../constant";
import AffairSelect from "../Utils/AffairSelection";


const AdminLayout = () => {
	const [stats, setStats] = useState({
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
	const userId = storedUser?.userId;

	const fetchStaffStats = async () => {
		setLoading(true);
		try {
			const config = {
				headers: {
					Authorization: `${token}`,
				},
			};
			const response = await axios.get(`${BACKEND_API}/staff/staff-stats/${userId}`, config);
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

	useEffect(() => {
		fetchStaffStats();
	}, []);

	const dataOptions = [
		{ name: 'Patent', value: stats.patents, route: '/patent/list' },
		{ name: 'Conference', value: stats.conferences, route: '/conference/list' },
		{ name: 'Journal', value: stats.journals, route: '/journal/list' },
		{ name: 'Proposal', value: stats.proposals, route: '/proposal/list' },
		{ name: 'Copyright', value: stats.copyrights, route: '/copyright/list' },
		{ name: 'FDP/STTP', value: stats.fdps, route: '/fdp/list' },
		{ name: 'SDP', value: stats.sdps, route: '/sdp/list' },
	];

	const deptData = [
		{ name: 'Patent', color: "red", route: '/patent/hod/' },
		{ name: 'Conference', color: "GREEN", route: 'conferance/hod/' },
		{ name: 'Journal', color: "#f72585", route: '/journal/hod' },
		{ name: 'Proposal', color: "blue", route: '/praposal/hod/' },
		{ name: 'Copyright', color: "orange", route: '/copyright/hod/' },
		{ name: 'FDP/STTP', color: "#219ebc", route: '/fdp/hod' },
		{ name: 'SDP', color: "#d62828", route: '/sdp/hod' },
	];

	const branchPublicationData = [
		{ name: 'Comp Tech', value: 20, patents: 10, conferences: 15, journals: 20, proposals: 8, copyrights: 5, fdps: 6, sdps: 3, route: '/dept-dashboard/Comp%20Tech' },
		{ name: 'Info Tech', value: 20, patents: 12, conferences: 10, journals: 18, proposals: 5, copyrights: 4, fdps: 8, sdps: 2, route: '/dept-dashboard/Info%20Tech' },
		{ name: 'Electronics', value: 20, patents: 8, conferences: 14, journals: 22, proposals: 6, copyrights: 3, fdps: 7, sdps: 5, route: '/dept-dashboard/Electronics' },
		{ name: 'ETC', value: 20, patents: 7, conferences: 12, journals: 19, proposals: 7, copyrights: 4, fdps: 5, sdps: 4, route: '/dept-dashboard/ETC' },
		{ name: 'Electrical', value: 20, patents: 9, conferences: 13, journals: 17, proposals: 9, copyrights: 2, fdps: 9, sdps: 6, route: '/dept-dashboard/Electrical' },
		{ name: 'Mechanical', value: 20, patents: 6, conferences: 11, journals: 16, proposals: 4, copyrights: 5, fdps: 6, sdps: 2, route: '/dept-dashboard/Mechanical' },
		{ name: 'Civil', value: 20, patents: 11, conferences: 16, journals: 21, proposals: 10, copyrights: 3, fdps: 4, sdps: 3, route: '/dept-dashboard/Civil' },
		{ name: 'AI-DS', value: 20, patents: 15, conferences: 20, journals: 25, proposals: 11, copyrights: 7, fdps: 8, sdps: 4, route: '/dept-dashboard/AI-DS' },
		{ name: 'AIML', value: 20, patents: 13, conferences: 18, journals: 23, proposals: 9, copyrights: 6, fdps: 7, sdps: 5, route: '/dept-dashboard/AIML' },
		{ name: 'IIOT', value: 20, patents: 14, conferences: 17, journals: 22, proposals: 12, copyrights: 6, fdps: 6, sdps: 3, route: '/dept-dashboard/IIOT' },
		{ name: 'CSD', value: 20, patents: 10, conferences: 14, journals: 20, proposals: 6, copyrights: 4, fdps: 5, sdps: 4, route: '/dept-dashboard/CSD' },
		{ name: 'CSE', value: 20, patents: 10, conferences: 14, journals: 20, proposals: 6, copyrights: 4, fdps: 5, sdps: 4, route: '/dept-dashboard/CSE' }
	  ];
	  

	const chartData = branchPublicationData.map(branch => ({
		name: branch.name,
		patents: branch.patents,
		conferences: branch.conferences,
		journals: branch.journals,
		proposals: branch.proposals,
		copyrights: branch.copyrights,
		fdps: branch.fdps,
		sdps: branch.sdps
	}));





	if (loading) {
		return <p>Loading...</p>;
	}

	return (

		<div className="faculty-container">
			<div className="conference-list-main-container">
				<div className="p-4 bg-gray-100 w-[105%] mx-auto">
					<h1 className="text-2xl font-bold mb-6">Dashboard</h1>

					<div className="grid grid-cols-3 gap-6">
						<div className="col-span-1 md:col-span-2 bg-white p-4 rounded-lg shadow">
							<h2 className="text-lg font-medium mb-4">Title</h2>
							<BarChart width={1100} height={500} data={chartData} >
								<CartesianGrid />
								<XAxis dataKey="name" />
								<YAxis />
								<Bar dataKey="patents" stackId="a" fill="red" />
								<Bar dataKey="conferences" stackId="a" fill="GREEN" />
								<Bar dataKey="journals" stackId="a" fill="#f72585" />
								<Bar dataKey="proposals" stackId="a" fill="blue" />
								<Bar dataKey="copyrights" stackId="a" fill="orange" />
								<Bar dataKey="fdps" stackId="a" fill="#219ebc" />
								<Bar dataKey="sdps" stackId="a" fill="#d62828" />
							</BarChart>
							<div className="flex justify-left space-x-4 mt-4">
								<div className="ml-10">
									<div className="p-2 bg-gray-100 rounded-lg mt-4 ml-10">
										<div className="flex space-x-6 overflow-x-auto"> {/* Set flex and horizontal scrolling if overflow */}
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
							</div>


						</div>

						<div className="mt4">
						<AffairSelect affairs={dataOptions}/>
						<AffairSelect affairs={branchPublicationData}/>
						</div>
						
					

					</div>


				</div>
			</div>

		</div>
	);
};

export default AdminLayout;
