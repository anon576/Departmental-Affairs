import  pool from '../Database/Database.mjs'

class ConferanceHandler{
    static addConferenceHandler = async (req, res) => {
        try {
            // Extract data from the request body
            const {
                conferenceName,
                venue,
                conferenceDate,
                registrationFee,
                attendedMode,
                authors,
                paperTitle,
                paperStatus,
                indexed,
                userId
            } = req.body;
            const indexedArray = JSON.parse(indexed);
           const  index = indexedArray[0]
           console.log('Indexed data:', index);
            // Extract the file from the request (published paper)
            const publishedPaper = req.file;

            // Check if required fields are present
            if (!conferenceName || !venue || !conferenceDate || !attendedMode || !authors || !paperTitle || !paperStatus || !indexed || !userId) {
                return res.status(400).json({
                    success: false,
                    message: 'Please fill all required fields'
                });
            }

            // Insert into the database
            const query = `
                INSERT INTO Conference 
                (conferenceName, venue, conferenceDate, registrationFee, attendedMode, authors, paperTitle, paperStatus, indexed, publishedPaper, userId) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const [result] = await pool.query(query, [
                conferenceName,
                venue,
                conferenceDate,
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
                    message: 'Conference added successfully',
                    conferenceID: result.insertId
                });
            } else {
                return res.status(500).json({
                    success: false,
                    message: 'Failed to add conference'
                });
            }
        } catch (error) {
            console.error('Error adding conference:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    };

    static fetchAllConferenceWithUserId = async (req, res) => {
        try {
            const { userId } = req.params;
   
            // Check if userId is provided
            if (!userId) {
                return res.status(400).json({
                    success: false,
                    message: "User ID is required"
                });
            }

            // Fetch conferences from the database based on userId
            const query = `
                SELECT conferenceID, conferenceName, venue, conferenceDate, registrationFee, attendedMode, authors, paperTitle, paperStatus, indexed, createdAt ,publishedPaper
                FROM Conference 
                WHERE userId = ?
            `;
            const [conferences] = await pool.query(query, [userId]);

            // If no conferences found
            if (conferences.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "No conferences found for the provided User ID"
                });
            }
            // Send response with fetched conferences
            return res.status(200).json({
                success: true,
                message: "Conferences fetched successfully",
                conferences: conferences
            });

        } catch (error) {
            console.error('Error fetching conferences:', error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    };

    static updateConferanceWithConferanceId = async (req, res) => {
        try {
            const { conferenceID } = req.params;
            const {
                conferenceName,
                venue,
                conferenceDate,
                registrationFee,
                attendedMode,
                authors,
                paperTitle,
                paperStatus,
                indexed
            } = req.body;
          
            // Check if conferenceID is provided
            if (!conferenceID) {
                return res.status(400).json({
                    success: false,
                    message: "Conference ID is required"
                });
            }
          

            // Validate required fields
            if (!conferenceName || !venue || !conferenceDate || !attendedMode || !authors || !paperTitle || !paperStatus || !indexed) {
                return res.status(400).json({
                    success: false,
                    message: "All fields except registration fee and published paper are required"
                });
            }    
    
            // Start constructing the update query and parameters
            let query = `
                UPDATE Conference 
                SET 
                    conferenceName = ?, 
                    venue = ?, 
                    conferenceDate = ?, 
                    registrationFee = ?, 
                    attendedMode = ?, 
                    authors = ?, 
                    paperTitle = ?, 
                    paperStatus = ?, 
                    indexed = ?
            `;
            let queryParams = [
                conferenceName,
                venue,
                conferenceDate,
                registrationFee,
                attendedMode,
                JSON.stringify(authors), // Convert authors array to JSON
                paperTitle,
                paperStatus,
                indexed,
            ];
    
            // Complete the query
            query += ` WHERE conferenceID = ?`;
            queryParams.push(conferenceID);
       
            const result = await pool.query(query, queryParams);
    
            // Check if the conference was found and updated
            if (result[0].affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Conference not found"
                });
            }
    
            // Success response
            return res.status(200).json({
                success: true,
                message: "Conference updated successfully"
            });
    
        } catch (error) {
            
            console.error("Error updating conference:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    };
    

    static deleteConferanceWithConferanceId = async (req, res) => {
        try {
            const { conferenceID } = req.params;

            // Check if conferenceID is provided
            if (!conferenceID) {
                return res.status(400).json({
                    success: false,
                    message: "Conference ID is required"
                });
            }

            // Delete the conference from the database
            const query = `DELETE FROM Conference WHERE conferenceID = ?`;
            const result = await pool.query(query, [conferenceID]);

            // Check if the conference was found and deleted
            if (result[0].affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Conference not found"
                });
            }

            // Success response
            return res.status(200).json({
                success: true,
                message: "Conference deleted successfully"
            });

        } catch (error) {
            console.error("Error deleting conference:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    };

    static fetchConferaceWithDepartment = async (req, res) => {
        try {
            const { department } = req.params;

            // Check if department is provided
            if (!department) {
                return res.status(400).json({
                    success: false,
                    message: "Department is required"
                });
            }

            // Fetch conferences of users belonging to the specified department
            const query = `
                SELECT c.conferenceID, c.conferenceName, c.venue, c.conferenceDate, 
                       c.registrationFee, c.attendedMode, c.authors, c.paperTitle, 
                       c.paperStatus, c.indexed, c.publishedPaper, c.createdAt, u.name AS userName
                FROM Conference c
                INNER JOIN User u ON c.userId = u.userId
                WHERE u.department = ?`;

            const [conferences] = await pool.query(query, [department]);

            // If no conferences are found for the department
            if (conferences.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: `No conferences found for the department: ${department}`
                });
            }

            // Success response with the fetched conferences
            return res.status(200).json({
                success: true,
                message: "Conferences fetched successfully",
                data: conferences
            });

        } catch (error) {
            console.error("Error fetching conferences by department:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    };

}


export default ConferanceHandler