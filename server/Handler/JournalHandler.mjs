import pool from '../Database/Database.mjs'

class JournalHandler {

    static add = async (req, res) => {
        try {
            // Extract data from the request body
            const {
                journalName,
                venue,
                journalDate,
                registrationFee,
                attendedMode,
                authors,
                paperTitle,
                paperStatus,
                indexed,
                userId
            } = req.body;
            const indexedArray = JSON.parse(indexed);
            const index = indexedArray[0]
            console.log("here")
            const publishedPaper = req.file;

            // Check if required fields are present
            if (!journalName || !venue || !journalDate || !attendedMode || !authors || !paperTitle || !paperStatus || !indexed || !userId) {
                return res.status(400).json({
                    success: false,
                    message: 'Please fill all required fields'
                });
            }

            // Insert into the database
            const query = `
                INSERT INTO Journal 
                (journalName, venue, journalDate, registrationFee, attendedMode, authors, paperTitle, paperStatus, indexed, publishedPaper, userId) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const [result] = await pool.query(query, [
                journalName,
                venue,
                journalDate,
                registrationFee,
                attendedMode,
                JSON.stringify(authors), // Convert authors array to JSON string
                paperTitle,
                paperStatus,
                index,
                publishedPaper ? publishedPaper.buffer : null, // Use buffer from uploaded file
                userId
            ]);

            // Check if the insertion was successful
            if (result.affectedRows === 1) {
                return res.status(201).json({
                    success: true,
                    message: 'Journal added successfully',
                    journalID: result.insertId
                });
            } else {
                return res.status(500).json({
                    success: false,
                    message: 'Failed to add Journal'
                });
            }
        } catch (error) {
            console.error('Error adding Journal:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

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

            // Fetch journal from the database based on userId
            const query = `
                SELECT journalID, journalName, venue, journalDate, registrationFee, attendedMode, authors, paperTitle, paperStatus, indexed, createdAt ,publishedPaper
                FROM Journal 
                WHERE userId = ?
            `;
            const [journal] = await pool.query(query, [userId]);
            console.log(journal)
            // If no journal found
            if (journal.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "No journal found for the provided User ID"
                });
            }
            // Send response with fetched journal
            return res.status(200).json({
                success: true,
                message: "journal fetched successfully",
                journal: journal
            });

        } catch (error) {
            console.error('Error fetching journal:', error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    }


    static update = async (req, res) => {
        try {
            const { journalID } = req.params;
            const {
                journalName,
                venue,
                journalDate,
                registrationFee,
                attendedMode,
                authors,
                paperTitle,
                paperStatus,
                indexed
            } = req.body;
            const indexedArray = JSON.parse(indexed);
            const  index = indexedArray[0]
          console.log(journalName,
            venue,
            journalDate,
            registrationFee,
            attendedMode,
            authors,
            paperTitle,
            paperStatus,
            indexed)
            // Check if journalID is provided
            if (!journalID) {
                return res.status(400).json({
                    success: false,
                    message: "Journal ID is required"
                });
            }
          

            // Validate required fields
            if (!journalName || !venue || !journalDate || !attendedMode || !authors || !paperTitle || !paperStatus || !indexed) {
                return res.status(400).json({
                    success: false,
                    message: "All fields except registration fee and published paper are required"
                });
            }    
    
            // Start constructing the update query and parameters
            let query = `
                UPDATE Journal 
                SET 
                    journalName = ?, 
                    venue = ?, 
                    journalDate = ?, 
                    registrationFee = ?, 
                    attendedMode = ?, 
                    authors = ?, 
                    paperTitle = ?, 
                    paperStatus = ?, 
                    indexed = ?
            `;
            let queryParams = [
                journalName,
                venue,
                journalDate,
                registrationFee,
                attendedMode,
                JSON.stringify(authors), // Convert authors array to JSON
                paperTitle,
                paperStatus,
                index 
                ,
            ];
    
          
            query += ` WHERE journalID = ?`;
            queryParams.push(journalID);
       
            const result = await pool.query(query, queryParams);
    
            // Check if the Journal was found and updated
            if (result[0].affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Journal not found"
                });
            }
    
            // Success response
            return res.status(200).json({
                success: true,
                message: "Journal updated successfully"
            });
    
        } catch (error) {
            
            console.error("Error updating Journal:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    }

    static delete = async (req, res) => {
        try {
            const { journalID } = req.params;

            // Check if journalID is provided
            if (!journalID) {
                return res.status(400).json({
                    success: false,
                    message: "journal ID is required"
                });
            }

            // Delete the journal from the database
            const query = `DELETE FROM Journal WHERE journalID = ?`;
            const result = await pool.query(query, [journalID]);

            // Check if the journal was found and deleted
            if (result[0].affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "journal not found"
                });
            }

            // Success response
            return res.status(200).json({
                success: true,
                message: "journal deleted successfully"
            });

        } catch (error) {
            console.error("Error deleting journal:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    }

    static viewByBranch = async (req, res) => {

    }

}


export default JournalHandler