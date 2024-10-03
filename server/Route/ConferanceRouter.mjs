import express from 'express';
import ConferanceHandler from '../Handler/CoferanceHandler.mjs'
import multer from 'multer';

// Initialize Express Router
const ConferanceRouter = express.Router();

// Configure Multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });

// Routes

// Add conference with file upload (published paper)
ConferanceRouter.post(
    '/add', 
    upload.single('publishedPaper'),  // Expecting file to be sent as 'publishedPaper'
    ConferanceHandler.addConferenceHandler
);

// Fetch all conferences for a specific user by userId
ConferanceRouter.get(
    '/user/:userId', 
    ConferanceHandler.fetchAllConferenceWithUserId
);

// Update conference details by conferenceId
ConferanceRouter.put(
    '/update/:conferenceID',  upload.single('publishedPaper'),
    ConferanceHandler.updateConferanceWithConferanceId
);

// Delete conference by conferenceId
ConferanceRouter.delete(
    '/delete/:conferenceID', 
    ConferanceHandler.deleteConferanceWithConferanceId
);

// Fetch conferences for users of a specific department
ConferanceRouter.get(
    '/department/:department', 
    ConferanceHandler.fetchConferaceWithDepartment
);

export default ConferanceRouter;
