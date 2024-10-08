import pool from '../Database/Database.mjs'

class FDPHandler{

    static add = async (req, res) => {
        try {
          const {
            type,
            status,
            title,
            noOfDays,
            duration,
            regFee,
            venue,
            noOfParticipant,
            Sponsored,
            nameOfSponser,
            userId,
          } = req.body;
      
          // Validate required fields
          if (!type || !status || !title || !noOfDays || !duration || !venue || !noOfParticipant || !userId) {
            return res.status(400).json({ success: false, message: "All required fields must be filled" });
          }
      
          // Insert the FDP record into the database
          const query = `
            INSERT INTO FDP 
            (type, status, title, noOfDays, duration, regFee, venue, noOfParticipant, Sponsored, nameOfSponser, userId)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;
      
          const values = [
            type,
            status,
            title,
            noOfDays,
            duration,
            regFee || 0, // default regFee to 0 if not provided
            venue,
            noOfParticipant,
            Sponsored || "no", // default Sponsored to 'no' if not provided
            nameOfSponser || null, // null if not provided
            userId,
          ];
      
          // Execute query
          await pool.execute(query, values);
      
          // Respond with success
          res.status(200).json({ success: true, message: "FDP record added successfully" });
        } catch (error) {
          console.error("Error adding FDP:", error);
          res.status(500).json({ success: false, message: "Failed to add FDP. Please try again." });
        }
      };
      
    
      static viewById = async (req, res) => {
        try {
          const { userId } = req.params; // Get userId from the request parameters
      
          // Check if userId is provided
          if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
          }
      
          // Fetch FDPs associated with the userId
          const query = `SELECT * FROM FDP WHERE userId = ?`;
          const [fdps] = await pool.execute(query, [userId]);
      
          // If no FDPs are found for the user
          if (fdps.length === 0) {
            return res.status(404).json({ success: false, message: "No FDPs found for this user" });
          }
      
          // Respond with the FDP records
          res.status(200).json({ success: true, fdps });
        } catch (error) {
          console.error("Error fetching FDPs:", error);
          res.status(500).json({ success: false, message: "Failed to fetch FDPs. Please try again." });
        }
      };
      

      static update = async (req, res) => {
        try {
          const { fdpID } = req.params; // Get the FDP ID from the request parameters
          const {
            type,
            status,
            title,
            noOfDays,
            duration,
            regFee,
            venue,
            noOfParticipant,
            Sponsored,
            nameOfSponser
          } = req.body; // Extract updated fields from request body
         
          // Check if FDP ID is provided
          if (!fdpID) {
            console.log("here")
            return res.status(400).json({ success: false, message: "FDP ID is required" });
          }
      
          // Validation (optional): Check if required fields are provided
          if (!title || !type || !status) {
            return res.status(400).json({ success: false, message: "Title, Type, and Status are required" });
          }
      
          // SQL query to update the FDP
          const query = `
            UPDATE FDP 
            SET type = ?, status = ?, title = ?, noOfDays = ?, duration = ?, regFee = ?, 
                venue = ?, noOfParticipant = ?, Sponsored = ?, nameOfSponser = ?
            WHERE fdpID = ?
          `;
         
          // Execute the query using the pool
          const [result] = await pool.execute(query, [
            type,
            status,
            title,
            noOfDays,
            duration,
            regFee,
            venue,
            noOfParticipant,
            Sponsored,
            nameOfSponser,
            fdpID,
          ]);
      
          // Check if any rows were updated
          if (result.affectedRows === 0) {
            
            return res.status(404).json({ success: false, message: "FDP not found or no changes made" });
          }
          console.log("here")
      
          // Respond with success if the update was successful
          res.status(200).json({ success: true, message: "FDP updated successfully" });
        } catch (error) {
          console.error("Error updating FDP:", error);
          res.status(500).json({ success: false, message: "Failed to update FDP. Please try again." });
        }
      };
      

      static delete = async (req, res) => {
        try {
          const { fdpID } = req.params; // Get the FDP ID from the request parameters
      
          // Check if FDP ID is provided
          if (!fdpID) {
            return res.status(400).json({ success: false, message: "FDP ID is required" });
          }
      
          // SQL query to delete the FDP
          const query = `DELETE FROM FDP WHERE fdpID = ?`;
      
          // Execute the delete query using the pool
          const [result] = await pool.execute(query, [fdpID]);
      
          // Check if any rows were deleted
          if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "FDP not found" });
          }
      
          // Respond with success if the deletion was successful
          res.status(200).json({ success: true, message: "FDP deleted successfully" });
        } catch (error) {
          console.error("Error deleting FDP:", error);
          res.status(500).json({ success: false, message: "Failed to delete FDP. Please try again." });
        }
      };
      

    static viewByBranch = async(req,res)=>{

    }
}

export default FDPHandler;