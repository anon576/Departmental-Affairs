import express from 'express'
import SDPHandler from '../Handler/SDPHandler.mjs'
import multer from 'multer'
const SDPRouter = express.Router()






// Configure Multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });

// Routes

SDPRouter.post(
    '/add', 
    upload.single('certificate'),  
    SDPHandler.add
);

SDPRouter.get(
    '/user/:userId', 
    SDPHandler.viewById
);


SDPRouter.put(
    '/update/:sdpID',  upload.single('publishedPaper'),
    SDPHandler.update
);

SDPRouter.delete(
    '/delete/:sdpID', 
    SDPHandler.delete
);


SDPRouter.get(
    '/department/:dept', 
    SDPHandler.viewByBranch
);



export default SDPRouter