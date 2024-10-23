import React, { useEffect, useState } from "react";
import axios from 'axios';
import {  useParams } from "react-router-dom";
import { toast } from 'react-toastify'; 
import { BACKEND_API } from "../constant";
import AffairSelect from '../Utils/AffairSelection';
import PieChartComp from '../Utils/PieChartComp';

const DeptDashboard = () => {
    const { dept } = useParams()
	const [deptStats, setDeptStats] = useState({
		patents: 0,
		conferences: 0,
		journals: 0,
		proposals: 0,
		copyrights: 0,
		fdps: 0,
		sdps: 0,
	});
	const [staff, setStaff] = useState([]); // Ensure default value is an empty array
	const [loading, setLoading] = useState(true);
	const token = localStorage.getItem("authToken");

	const fetchDeptStats = async () => {
		setLoading(true);
		try {
			const config = {
				headers: {
					Authorization: `${token}`, 
				},
			};

			const response = await axios.get(`${BACKEND_API}/staff/dept-stats/${dept}`, config);

			if (response.data.success) {
				setDeptStats(response.data.stats);
				setStaff(response.data.staff);
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
	}, []);



	const deptData = [
		{ name: 'Patent', value: deptStats.patents, color: "red", route: '/patent/hod/' },
		{ name: 'Conference', value: deptStats.conferences, color: "GREEN", route: 'conferance/hod/' },
		{ name: 'Journal', value: deptStats.journals, color: "#f72585", route: '/journal/hod' },
		{ name: 'Proposal', value: deptStats.proposals, color: "blue", route: '/praposal/hod/' },
		{ name: 'Copyright', value: deptStats.copyrights, color: "orange", route: '/copyright/hod/' },
		{ name: 'FDP/STTP', value: deptStats.fdps, color: "#219ebc", route: '/fdp/hod' },
		{ name: 'SDP', value: deptStats.sdps, color: "#d62828", route: '/sdp/hod' },
	];

	// Only transform staff data if it exists and is an array
	const transformResponse = (data) => {
		return Array.isArray(data)
			? data.map(item => ({
				name: item.name,
				value: item.role, // changing 'role' to 'value'
				department: item.department,
				employeeId: item.employeeId,
				email: item.email,
				password: item.password,
				route: `/employee/dashboard/${item.userId}` // changing 'userId' to 'route'
			  }))
			: [];
	};

	// Transform staff data
	const transformedStaff = transformResponse(staff);

	if (loading) {
		return <p>Loading...</p>;
	}

	return (
		<div className="faculty-container">
			<div className="conference-list-main-container">
				<div className="p-4 bg-gray-100 w-[95%] mx-auto">
					<h1 className="text-2xl font-bold mb-6">Dashboard</h1>
					<div className="grid grid-cols-3 gap-6 mb-4">
						<div className="col-span-1 md:col-span-2 bg-white p-4 rounded-lg shadow">
							<PieChartComp data={deptData} title="Department Overview Dashboard" deptStats={deptStats}></PieChartComp>
						</div>
						<div className="mt4">
						<AffairSelect affairs={transformedStaff}></AffairSelect>
						<AffairSelect affairs={deptData}></AffairSelect>
						</div>
						
					</div>
				</div>
			</div>
		</div>
	);
};

export default DeptDashboard;
