import pool from '../Database/Database.mjs';

class PatentHandler {
  static add = async (req, res) => {
    const { title, applicant, status, userId } = req.body;
    const certificate = req.file ? req.file.buffer : null;

    try {
      const query = `
        INSERT INTO Patent (title, applicant, status, certificate, userId)
        VALUES (?, ?, ?, ?, ?)
      `;
      const [result] = await pool.query(query, [title, applicant, status, certificate, userId]);
      console.log(result)
      if (result.affectedRows > 0) {
        res.status(201).json({ success: true, message: "Patent added successfully." });
      } else {
        res.status(400).json({ success: false, message: "Failed to add patent." });
      }
    } catch (error) {
      console.error("Error adding patent:", error);
      res.status(500).json({ success: false, message: "Server error. Please try again." });
    }
  };

  static viewById = async (req, res) => {
    try {
      const { userId } = req.params;

      // Check if userId is provided
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "User ID is required"
        });
      }

      // Fetch patents from the database based on userId
      const query = `
            SELECT *
            FROM Patent 
            WHERE userId = ?
        `;
      const [patents] = await pool.query(query, [userId]);

      // If no patents found
      console.log(patents)
      if (patents.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No patents found for the provided User ID"
        });
      }

      // Send response with fetched patents
      return res.status(200).json({
        success: true,
        message: "patents fetched successfully",
        patents: patents
      });

    } catch (error) {
      console.error('Error fetching patents:', error);
      return res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  };

  static update = async (req, res) => {
    const { title, applicant, status } = req.body; // Destructure fields from the request body
    const { patentID } = req.params; // Get patentID from the request parameters
    
    // Check for missing fields
    if (!title || !applicant || !status) {
      return res.status(400).json({
        success: false,
        message: "All fields (title, applicant, status) are required.",
      });
    }
   
    try {
      // Update query using a parameterized SQL statement
      const query = `
      UPDATE Patent 
      SET title = ?, applicant = ?, status = ? 
      WHERE patentID = ?
    `;

      
      const [result] = await pool.query(query, [title, JSON.stringify(applicant), status, patentID]);

      // Check if any row was affected
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: "Patent not found" });
      } 
      console.log(result)

      return res.status(200).json({ success: true, message: "Patent updated successfully" });
    } catch (error) {
      console.error("Error updating patent:", error);
      return res.status(500).json({ success: false, message: "Failed to update patent" });
    }
  }

  static delete = async (req, res) => {
    try {
        const { patentID } = req.params;
        console.log("here")
        // Check i  f patentID is provided
        if (!patentID) {
            return res.status(400).json({
                success: false,
                message: "Patent ID is required"
            });
        }

        
        const query = `DELETE FROM Patent WHERE patentID = ?`;
        const result = await pool.query(query, [patentID]);
        console.log(result)
        // Check if the Patent was found and deleted
        if (result[0].affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Patent not found"
            });
        }

        // Success response
        return res.status(200).json({
            success: true,
            message: "Patent deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting Patent:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


  static viewByBranch = async (req, res) => {

  }

}

export default PatentHandler;
