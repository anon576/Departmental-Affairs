import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BACKEND_API } from '../../constant'
import AffairSelect from '../../Utils/AffairSelection'
import PieChartComp from '../../Utils/PieChartComp'


const EmployeeLayout = () => {
	const { userId } = useParams();
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
		console.log(userId)
		fetchStaffStats();
	}, []);

	const data = [
		{ name: 'Patent', value: stats.patents, color: "red", route: `/employee/patent/${userId}` },
		{ name: 'Conference', value: stats.conferences, color: "GREEN", route: `/employee/conference/${userId}` },
		{ name: 'Journal', value: stats.journals, color: "#f72585", route: `/employee/journal/${userId}` },
		{ name: 'Proposal', value: stats.proposals, color: "blue", route: `/employee/praposal/${userId}` },
		{ name: 'Copyright', value: stats.copyrights, color: "orange", route: `/employee/copyrights/${userId}` },
		{ name: 'FDP/STTP', value: stats.fdps, color: "#219ebc", route: `/employee/fdp/${userId}` },
		{ name: 'SDP', value: stats.sdps, color: "#d62828", route: `/employee/sdp/${userId}` }
	];



	if (loading) {
		return <p>Loading...</p>; // Show a loading message while fetching data
	}

	return (
		<div className="faculty-container">
			<div className="conference-list-main-container">
				<div className="p-4 bg-gray-100 w-[95%] mx-auto">
					<h1 className="text-2xl font-bold mb-6">Dashboard</h1>

					<div className="grid grid-cols-3 gap-6">
						<div className="col-span-1 md:col-span-2 bg-white p-4 rounded-lg shadow">
							<PieChartComp data={data} deptStats={stats} title="Overview" />
						</div>

						<AffairSelect affairs={data} />
					</div>
				</div>
			</div>

		</div>

	);
};

export default EmployeeLayout;
