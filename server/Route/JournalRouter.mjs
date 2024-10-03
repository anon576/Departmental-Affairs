import express from 'express'
import multer from 'multer'
import JournalHandler from '../Handler/JournalHandler.mjs'
const JournalRouter = express.Router()



// Configure Multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });

// Routes

// Add conference with file upload (published paper)
JournalRouter.post(
    '/add', 
    upload.single('publishedPaper'),  // Expecting file to be sent as 'publishedPaper'
    JournalHandler.add
);

// Fetch all conferences for a specific user by userId
JournalRouter.get(
    '/user/:userId', 
    JournalHandler.viewById
);

// Update conference details by journalID
JournalRouter.put(
    '/update/:journalID',  upload.single('publishedPaper'),
    JournalHandler.update
);

// Delete conference by journalID
JournalRouter.delete(
    '/delete/:journalID', 
    JournalHandler.delete
);

// Fetch conferences for users of a specific department
JournalRouter.get(
    '/department/:department', 
    JournalHandler.viewByBranch
);

export default JournalRouter