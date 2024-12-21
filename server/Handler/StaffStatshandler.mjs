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

    static adminStats = async (req, res) => {
        try {
          // Querying all the tables and getting counts grouped by department
          const [patents] = await pool.query(`
            SELECT u.department, COUNT(p.patentID) as totalPatents
            FROM Patent p
            JOIN User u ON p.userId = u.userId
            GROUP BY u.department
          `);
      
          const [conferences] = await pool.query(`
            SELECT u.department, COUNT(c.conferenceID) as totalConferences
            FROM Conference c
            JOIN User u ON c.userId = u.userId
            GROUP BY u.department
          `);
      
          const [journals] = await pool.query(`
            SELECT u.department, COUNT(j.journalID) as totalJournals
            FROM Journal j
            JOIN User u ON j.userId = u.userId
            GROUP BY u.department
          `);
      
          const [proposals] = await pool.query(`
            SELECT u.department, COUNT(pr.proposalID) as totalProposals
            FROM Proposal pr
            JOIN User u ON pr.userId = u.userId
            GROUP BY u.department
          `);
      
          const [copyrights] = await pool.query(`
            SELECT u.department, COUNT(c.copyrightID) as totalCopyrights
            FROM Copyright c
            JOIN User u ON c.userId = u.userId
            GROUP BY u.department
          `);
      
          const [fdps] = await pool.query(`
            SELECT u.department, COUNT(f.fdpID) as totalFdps
            FROM FDP f
            JOIN User u ON f.userId = u.userId
            GROUP BY u.department
          `);
      
          const [sdps] = await pool.query(`
            SELECT u.department, COUNT(s.sdpID) as totalSdps
            FROM SDP s
            JOIN User u ON s.userId = u.userId
            GROUP BY u.department
          `);
      
          // Create a set of all departments found across all categories
          const departments = new Set([
            ...patents.map(p => p.department),
            ...conferences.map(c => c.department),
            ...journals.map(j => j.department),
            ...proposals.map(p => p.department),
            ...copyrights.map(c => c.department),
            ...fdps.map(f => f.department),
            ...sdps.map(s => s.department),
          ]);
      
          // Merge the results for all departments
          const stats = Array.from(departments).map(department => {
            return {
              department,
              patents: patents.find(p => p.department === department)?.totalPatents || 0,
              conferences: conferences.find(c => c.department === department)?.totalConferences || 0,
              journals: journals.find(j => j.department === department)?.totalJournals || 0,
              proposals: proposals.find(p => p.department === department)?.totalProposals || 0,
              copyrights: copyrights.find(c => c.department === department)?.totalCopyrights || 0,
              fdps: fdps.find(f => f.department === department)?.totalFdps || 0,
              sdps: sdps.find(s => s.department === department)?.totalSdps || 0,
            };
          });
      
          return res.status(200).json({
            success: true,
            stats
          });
      
        } catch (error) {
          console.error("Error fetching admin stats:", error);
          return res.status(500).json({ success: false, message: "Failed to fetch stats" });
        }
      };
      
    

}

export default StaffStatsHandler