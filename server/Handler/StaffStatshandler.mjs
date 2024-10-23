import pool from '../Database/Database.mjs'

class StaffStatsHandler {
    static fetchStaffStats = async (req, res) => {
        const userId = req.params.userId;

        try {
            const [patents] = await pool.query('SELECT COUNT(*) as count FROM Patent WHERE userId = ?', [userId]);
            const [conferences] = await pool.query('SELECT COUNT(*) as count FROM Conference WHERE userId = ?', [userId]);
            const [journals] = await pool.query('SELECT COUNT(*) as count FROM Journal WHERE userId = ?', [userId]);
            const [proposals] = await pool.query('SELECT COUNT(*) as count FROM Proposal WHERE userId = ?', [userId]);
            const [copyrights] = await pool.query('SELECT COUNT(*) as count FROM Copyright WHERE userId = ?', [userId]);
            const [fdps] = await pool.query('SELECT COUNT(*) as count FROM FDP WHERE userId = ?', [userId]);
            const [sdps] = await pool.query('SELECT COUNT(*) as count FROM SDP WHERE userId = ?', [userId]);
           
         
            const stats = {
                patents: patents[0].count,
                conferences: conferences[0].count,
                journals: journals[0].count,
                proposals: proposals[0].count,
                copyrights: copyrights[0].count,
                fdps: fdps[0].count,
                sdps: sdps[0].count,
            };

            return res.status(200).json({
                success: true,
                stats: stats,
            });
        } catch (error) {
            console.error('Error fetching staff stats:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch staff stats. Please try again later.',
            });
        };
    }


    static fetchDeptStats = async (req, res) => {
        const department = req.params.dept; 
    
        try {
            // Query to fetch count of patents for the department
            const [patents] = await pool.query(`
                SELECT COUNT(*) as count 
                FROM Patent p
                JOIN User u ON p.userId = u.userId
                WHERE u.department = ?`, [department]);
    
            // Query to fetch count of conferences for the department
            const [conferences] = await pool.query(`
                SELECT COUNT(*) as count 
                FROM Conference c
                JOIN User u ON c.userId = u.userId
                WHERE u.department = ?`, [department]);
    
            // Query to fetch count of journals for the department
            const [journals] = await pool.query(`
                SELECT COUNT(*) as count 
                FROM Journal j
                JOIN User u ON j.userId = u.userId
                WHERE u.department = ?`, [department]);
    
            // Query to fetch count of proposals for the department
            const [proposals] = await pool.query(`
                SELECT COUNT(*) as count 
                FROM Proposal p
                JOIN User u ON p.userId = u.userId
                WHERE u.department = ?`, [department]);
    
            // Query to fetch count of copyrights for the department
            const [copyrights] = await pool.query(`
                SELECT COUNT(*) as count 
                FROM Copyright c
                JOIN User u ON c.userId = u.userId
                WHERE u.department = ?`, [department]);
    
            // Query to fetch count of FDPs for the department
            const [fdps] = await pool.query(`
                SELECT COUNT(*) as count 
                FROM FDP f
                JOIN User u ON f.userId = u.userId
                WHERE u.department = ?`, [department]);
    
            // Query to fetch count of SDPs for the department
            const [sdps] = await pool.query(`
                SELECT COUNT(*) as count 
                FROM SDP s
                JOIN User u ON s.userId = u.userId
                WHERE u.department = ?`, [department]);

                const [staff] = await pool.query(`SELECT * FROM User where department = ?`,[department])
                console.log(staff)



            const stats = {
                patents: patents[0].count,
                conferences: conferences[0].count,
                journals: journals[0].count,
                proposals: proposals[0].count,
                copyrights: copyrights[0].count,
                fdps: fdps[0].count,
                sdps: sdps[0].count,
            };
           
    
            return res.status(200).json({
                success: true,
                stats: stats,
                staff:staff
            });
        } catch (error) {
            console.error('Error fetching department stats:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch department stats. Please try again later.',
            });
        }
    };
    

}

export default StaffStatsHandler