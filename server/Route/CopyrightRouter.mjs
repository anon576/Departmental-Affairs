import express from 'express'
import CopyRightHandler from '../Handler/CopyrightHandler.mjs'
import multer from 'multer'
const CopyrightRouter = express.Router()






// Configure Multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });

// Routes

// Add conference with file upload (published paper)
CopyrightRouter.post(
    '/add', 
    upload.single('certificate'),  // Expecting file to be sent as 'publishedPaper'
    CopyRightHandler.add
);

// Fetch all conferences for a specific user by userId
CopyrightRouter.get(
    '/user/:userId', 
    CopyRightHandler.viewById
);

// Update conference details by proposalID
CopyrightRouter.put(
    '/update/:copyrightID',  upload.single('publishedPaper'),
    CopyRightHandler.update
);

// Delete conference by proposalID
CopyrightRouter.delete(
    '/delete/:copyrightID', 
    CopyRightHandler.delete
);

// Fetch conferences for users of a specific department
CopyrightRouter.get(
    '/department/:department', 
    CopyRightHandler.viewByBranch
);



export default CopyrightRouter