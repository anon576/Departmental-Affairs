import express from 'express'
import multer from 'multer'
import PatentHandler from '../Handler/PatentHandler.mjs'
const PatentRouter = express.Router()



// Configure Multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });

// Routes

// Add conference with file upload (published paper)
PatentRouter.post(
    '/add', 
    upload.single('certificate'),  // Expecting file to be sent as 'publishedPaper'
    PatentHandler.add
);

// Fetch all conferences for a specific user by userId
PatentRouter.get(
    '/user/:userId', 
    PatentHandler.viewById
);

// Update conference details by proposalID
PatentRouter.put(
    '/update/:proposalID',  upload.single('publishedPaper'),
    PatentHandler.update
);

// Delete conference by proposalID
PatentRouter.delete(
    '/delete/:patentID', 
    PatentHandler.delete
);

// Fetch conferences for users of a specific department
PatentRouter.get(
    '/department/:dept', 
    PatentHandler.viewByBranch
);

export default PatentRouter