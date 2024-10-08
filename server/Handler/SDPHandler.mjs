import pool from '../Database/Database.mjs'

class SDPHandler{

    static add = async (req, res) => {
        const { title, duration, noOfDays, noOfBeneficiary, userId } = req.body;
    
        // Validate input
        if (!title || !duration || noOfDays <= 0 || noOfBeneficiary < 0) {
          return res.status(400).json({
            success: false,
            message: "Please provide valid SDP details.",
          });
        }
    
        try {
          // Insert the new SDP record into the database
          const query = `
            INSERT INTO SDP (title, duration, noOfDays, noOfBeneficiary,userId) 
            VALUES (?, ?, ?, ?,?)
          `;
          const [result] = await pool.query(query, [title, duration, noOfDays, noOfBeneficiary,userId]);
    
          // Check if the insert was successful
          if (result.affectedRows > 0) {
            return res.status(201).json({
              success: true,
              message: "SDP added successfully.",
              sdpID: result.insertId, // Returning the ID of the newly created SDP
            });
          } else {
            return res.status(500).json({
              success: false,
              message: "Failed to add SDP.",
            });
          }
        } catch (error) {
          console.error("Error adding SDP:", error);
          return res.status(500).json({
            success: false,
            message: "An error occurred while adding the SDP.",
            error: error.message,
          });
        }
      };

     static viewById = async (req, res) => {
    const { userId } = req.params; // Extract userId from the request parameters

    try {
      // Query to fetch SDPs associated with the given userId
      const query = `
        SELECT * FROM SDP 
        WHERE userId = ?
      `;

      const [sdps] = await pool.query(query, [userId]); // Execute the query with userId

      if (sdps.length > 0) {
        // If SDPs are found, return them with a success response
        return res.status(200).json({
          success: true,
          sdps, // Sending the fetched SDP records
        });
      } else {
        // If no SDPs are found for the user
        return res.status(404).json({
          success: false,
          message: "No SDPs found for this user.",
        });
      }
    } catch (error) {
      console.error("Error fetching SDPs:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while fetching SDPs.",
        error: error.message,
      });
    }
  };

  static update = async (req, res) => {
    const { sdpID } = req.params; // Extract sdpID from request parameters
    const { title, duration, noOfDays, noOfBeneficiary } = req.body; // Extract SDP fields from request body

    try {
      // Check if the SDP exists
      const [existingSDP] = await pool.query('SELECT * FROM SDP WHERE sdpID = ?', [sdpID]);

      if (existingSDP.length === 0) {
        // If SDP is not found, return a 404 error
        return res.status(404).json({
          success: false,
          message: "SDP not found.",
        });
      }

      // Prepare the SQL update query
      const query = `
        UPDATE SDP
        SET title = ?, duration = ?, noOfDays = ?, noOfBeneficiary = ?
        WHERE sdpID = ?
      `;

      // Execute the update query with the provided values
      const [result] = await pool.query(query, [title, duration, noOfDays, noOfBeneficiary, sdpID]);

      if (result.affectedRows > 0) {
        // If the update was successful, return a success response
        return res.status(200).json({
          success: true,
          message: "SDP updated successfully.",
        });
      } else {
        // If no rows were affected, something went wrong
        return res.status(500).json({
          success: false,
          message: "Failed to update SDP. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error updating SDP:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while updating the SDP.",
        error: error.message,
      });
    }
  };

   // Delete SDP record
  static delete = async (req, res) => {
    const { sdpID } = req.params; // Extract sdpID from request parameters

    try {
      // Check if the SDP exists
      const [existingSDP] = await pool.query('SELECT * FROM SDP WHERE sdpID = ?', [sdpID]);

      if (existingSDP.length === 0) {
        // If SDP is not found, return a 404 error
        return res.status(404).json({
          success: false,
          message: "SDP not found.",
        });
      }

      // Prepare the SQL delete query
      const query = 'DELETE FROM SDP WHERE sdpID = ?';

      // Execute the delete query
      const [result] = await pool.query(query, [sdpID]);

      if (result.affectedRows > 0) {
        // If the deletion was successful, return a success response
        return res.status(200).json({
          success: true,
          message: "SDP deleted successfully.",
        });
      } else {
        // If no rows were affected, something went wrong
        return res.status(500).json({
          success: false,
          message: "Failed to delete SDP. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error deleting SDP:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while deleting the SDP.",
        error: error.message,
      });
    }
  };

  static viewByBranch = async(req,res)=>{

  }
}

export default SDPHandler;