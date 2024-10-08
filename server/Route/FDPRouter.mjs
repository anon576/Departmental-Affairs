import express from 'express'
import FDPHandler from '../Handler/FDPHandler.mjs'
import multer from 'multer'
const FDPRouter = express.Router()






// Configure Multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });

// Routes

// Add conference with file upload (published paper)
FDPRouter.post(
    '/add', 
    upload.single('certificate'),  // Expecting file to be sent as 'publishedPaper'
    FDPHandler.add
);

// Fetch all conferences for a specific user by userId
FDPRouter.get(
    '/user/:userId', 
    FDPHandler.viewById
);

// Update conference details by proposalID
FDPRouter.put(
    '/update/:fdpID',  upload.single('publishedPaper'),
    FDPHandler.update
);

// Delete conference by proposalID
FDPRouter.delete(
    '/delete/:fdpID', 
    FDPHandler.delete
);

// Fetch conferences for users of a specific department
FDPRouter.get(
    '/department/:department', 
    FDPHandler.viewByBranch
);



export default FDPRouter