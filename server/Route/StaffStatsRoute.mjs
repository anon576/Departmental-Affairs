import express from 'express';
import StaffStatsHandler from '../Handler/StaffStatshandler.mjs';

const StaffStatRouter = express.Router()

StaffStatRouter.get("/staff-stats/:userId",StaffStatsHandler.fetchStaffStats)

StaffStatRouter.get("/dept-stats/:dept",StaffStatsHandler.fetchDeptStats)

export default StaffStatRouter