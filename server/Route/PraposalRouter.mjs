import express from 'express'
import multer from 'multer'
import PraposalHandler from '../Handler/PraposalHandler.mjs'
const PraposalRouter = express.Router()



// Configure Multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });

// Routes

// Add conference with file upload (published paper)
PraposalRouter.post(
    '/add', 
    upload.single('proposalPDF'),  // Expecting file to be sent as 'publishedPaper'
    PraposalHandler.add
);

// Fetch all conferences for a specific user by userId
PraposalRouter.get(
    '/user/:userId', 
    PraposalHandler.viewById
);

// Update conference details by proposalID
PraposalRouter.put(
    '/update/:proposalID',  upload.single('publishedPaper'),
    PraposalHandler.update
);

// Delete conference by proposalID
PraposalRouter.delete(
    '/delete/:proposalID', 
    PraposalHandler.delete
);

// Fetch conferences for users of a specific department
PraposalRouter.get(
    '/department/:dept', 
    PraposalHandler.viewByBranch
);

export default PraposalRouter