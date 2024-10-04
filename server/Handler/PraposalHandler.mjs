import pool from '../Database/Database.mjs'

class PraposalHandler{
    static add = async (req, res) => {
        try {
            const { proposalTitle, proposalDate, agency, submissionStatus, fundingAmount, PI, CoPI, userId } = req.body;
            console.log(proposalTitle, proposalDate, agency, submissionStatus, fundingAmount, PI, CoPI, userId)
            const publishedPaper = req.file;
        
            if(!proposalTitle || !proposalDate || !agency || !submissionStatus || !fundingAmount || !PI || !CoPI || !userId){
                return res.status(400).json({
                    success: false,
                    message: 'Please fill all required fields'
                });
            }
    
            const query = `
            INSERT INTO Proposal
            (title, dateOfSubmission, agency, status, amountClaimed, PI, CoPI, proposalPDF, userId)
            VALUES(?,?,?,?,?,?,?,?,?)
            `
            const [result] = await pool.query(query,[proposalTitle, proposalDate, agency, submissionStatus, fundingAmount, PI, CoPI, publishedPaper ? publishedPaper.buffer : null, userId])
         
             // Check if the insertion was successful
             if (result.affectedRows === 1) {
                return res.status(201).json({
                    success: true,
                    message: 'Praposal added successfully',
                    conferenceID: result.insertId
                });
            } else {
                return res.status(500).json({
                    success: false,
                    message: 'Failed to add Praposal'
                });
            }
        } catch (error) {
            console.error('Error adding conference:', error);
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
    
            // Fetch proposals from the database based on userId
            const query = `
                SELECT proposalID, title, agency, status, amountClaimed, PI, CoPI, dateOfSubmission, createdAt
                FROM Proposal 
                WHERE userId = ?
            `;
            const [proposals] = await pool.query(query, [userId]);
    
            // If no proposals found
            if (proposals.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "No proposals found for the provided User ID"
                });
            }
    
            // Send response with fetched proposals
            return res.status(200).json({
                success: true,
                message: "Proposals fetched successfully",
                proposals: proposals
            });
    
        } catch (error) {
            console.error('Error fetching proposals:', error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    };
    

    static update = async (req, res) => {
        try {
            const { proposalID } = req.params;
            const {
                title,
                agency,
                status,
                amountClaimed,
                PI,
                CoPI,
                dateOfSubmission,
            } = req.body;
            console.log(  title,
                agency,
                status,
                amountClaimed,
                PI,
                CoPI,
                dateOfSubmission,)
            // Check if proposalID is provided
            if (!proposalID) {
                return res.status(400).json({
                    success: false,
                    message: "Proposal ID is required"
                });
            }
    
            // Validate required fields
            if (!title || !agency || !status || !amountClaimed || !PI || !CoPI || !dateOfSubmission) {
                return res.status(400).json({
                    success: false,
                    message: "All fields except proposal PDF are required"
                });
            }
    
            // Start constructing the update query and parameters
            let query = `
                UPDATE Proposal 
                SET 
                    title = ?, 
                    agency = ?, 
                    status = ?, 
                    amountClaimed = ?, 
                    PI = ?, 
                    CoPI = ?, 
                    dateOfSubmission = ?
            `;
            let queryParams = [
                title,
                agency,
                status,
                amountClaimed,
                PI,
                CoPI,
                dateOfSubmission,
            ];
    
            // If updating proposalPDF, append it to the query and params
            if (req.file) { // Check if a new file is uploaded
                query += `, proposalPDF = ?`;
                queryParams.push(req.file.buffer); // Use buffer from uploaded file
            }
    
            // Complete the query
            query += ` WHERE proposalID = ?`;
            queryParams.push(proposalID);
    
            const result = await pool.query(query, queryParams);
    
            // Check if the proposal was found and updated
            if (result[0].affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Proposal not found"
                });
            }
    
            // Success response
            return res.status(200).json({
                success: true,
                message: "Proposal updated successfully"
            });
    
        } catch (error) {
            console.error("Error updating proposal:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    };
    

 
    static delete = async (req, res) => {
        try {
            const { proposalID } = req.params;
          
            // Check i  f proposalID is provided
            if (!proposalID) {
                return res.status(400).json({
                    success: false,
                    message: "Proposal ID is required"
                });
            }
    
            
            // Delete the proposal from the database
            const query = `DELETE FROM Proposal WHERE proposalID = ?`;
            const result = await pool.query(query, [proposalID]);
            console.log(result)
            // Check if the proposal was found and deleted
            if (result[0].affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Proposal not found"
                });
            }
    
            // Success response
            return res.status(200).json({
                success: true,
                message: "Proposal deleted successfully"
            });
    
        } catch (error) {
            console.error("Error deleting proposal:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    };
    

    static viewByBranch = async (req, res) => {
        try {
            const { branch } = req.params;
    
            // Check if branch is provided
            if (!branch) {
                return res.status(400).json({
                    success: false,
                    message: "Branch is required"
                });
            }
    
            // Fetch proposals of users belonging to the specified branch
            const query = `
                SELECT p.proposalID, p.title, p.agency, p.status, 
                       p.amountClaimed, p.PI, p.CoPI, p.dateOfSubmission, 
                       p.proposalPDF, p.createdAt, u.name AS userName
                FROM Proposal p
                INNER JOIN User u ON p.userId = u.userId
                WHERE u.branch = ?`;
    
            const [proposals] = await pool.query(query, [branch]);
    
            // If no proposals are found for the branch
            if (proposals.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: `No proposals found for the branch: ${branch}`
                });
            }
    
            // Success response with the fetched proposals
            return res.status(200).json({
                success: true,
                message: "Proposals fetched successfully",
                data: proposals
            });
    
        } catch (error) {
            console.error("Error fetching proposals by branch:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    };
    
}



export default PraposalHandler