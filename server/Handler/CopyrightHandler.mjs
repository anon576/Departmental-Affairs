import pool from '../Database/Database.mjs'

class CopyRightHandler{
    static add = async (req, res) => {
        const { title, applicant, status } = req.body;
        const { userId } = req.body; // Make sure userId is sent in the form data
        const certificate = req.file ? req.file.buffer : null; // Get the certificate file buffer
        console.log("here")
        // Check for missing fields
        if (!title || !applicant || !status || !userId) {
          return res.status(400).json({
            success: false,
            message: "All fields (title, applicant, status, userId) are required.",
          });
        }
    
        try {
          // Insert query using a parameterized SQL statement
          const query = `
            INSERT INTO Copyright (title, applicant, status, certificate, userId) 
            VALUES (?,?,?,?,?)
          `;
    
          // Execute the insert
          await pool.query(query, [title, JSON.stringify(applicant), status, certificate, userId]);
    
          return res.status(201).json({ success: true, message: "Copyright added successfully." });
        } catch (error) {
          console.error("Error adding copyright:", error);
          return res.status(500).json({ success: false, message: "Failed to add copyright." });
        }
      };

      static viewById = async (req, res) => {
        const { userId } = req.params;
        console.log("here")
        try {
          const [result] = await pool.query(
            "SELECT * FROM Copyright WHERE userID = ?",
            [userId]
          );
            console.log(result)
          if (result.length === 0) {
            return res.status(404).json({ success: false, message: "Copyright not found." });
          }
      
          res.json({ success: true, copyrights: result});
        } catch (error) {
          console.error("Error retrieving copyright:", error);
          res.status(500).json({ success: false, message: "Error retrieving copyright." });
        }
      };
      

      static update = async (req, res) => {
        const { title, applicant, status } = req.body;
        const { copyrightID } = req.params;
      console.log("here")
        if (!title || !applicant || !status) {
          return res.status(400).json({ success: false, message: "All fields are required." });
        }
      
        try {
          const updated = await pool.query(
            "UPDATE Copyright SET title = ?, applicant = ?, status = ? WHERE copyrightID = ?",
            [title, JSON.stringify(applicant), status, copyrightID]
          );
      
          if (updated.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Copyright not found." });
          }
      
          return res.status(200).json({ success: true, message: "Copyright updated successfully." });
        } catch (error) {
          console.error("Error updating copyright:", error);
          return res.status(500).json({ success: false, message: "Failed to update copyright." });
        }
      };
      

      static delete = async (req, res) => {
        try {
            const { copyrightID } = req.params;
            console.log("here")
            // Check i  f copyrightID is provided
            if (!copyrightID) {
                return res.status(400).json({
                    success: false,
                    message: "Copyright ID is required"
                });
            }
    
            
            const query = `DELETE FROM Copyright WHERE copyrightID = ?`;
            const result = await pool.query(query, [copyrightID]);
            console.log(result)
            // Check if the Copyright was found and deleted
            if (result[0].affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Copyright not found"
                });
            }
    
            // Success response
            return res.status(200).json({
                success: true,
                message: "Copyright deleted successfully"
            });
    
        } catch (error) {
            console.error("Error deleting Copyright:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    };

    static viewByBranch = async(req,res)=>{
      try {
        const { dept } = req.params; 
        if (!dept) {
          return res.status(400).json({ success: false, message: "User ID is required" });
        }
    
       
        const query = `  SELECT *
        FROM Copyright f
        JOIN User u ON f.userId = u.userId
        WHERE u.department = ?`;
        const [fdps] = await pool.execute(query, [dept]);
    
        
        if (fdps.length === 0) {
          return res.status(404).json({ success: false, message: "No FDPs found for this user" });
        }
    
        // Respond with the FDP records
        res.status(200).json({ success: true, fdps });
      } catch (error) {
        console.error("Error fetching FDPs:", error);
        res.status(500).json({ success: false, message: "Failed to fetch FDPs. Please try again." });
      }
    }
}

export default CopyRightHandler;
