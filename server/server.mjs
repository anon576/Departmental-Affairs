import cors from 'cors';  // Import the cors module
import dotenv from 'dotenv'; 
import express from 'express';
import AuthRouter from './Route/AuthRouter.mjs'
import JwtOperation from './Utils/jwtoken.mjs'
import ConferanceRouter from './Route/ConferanceRouter.mjs';
import JournalRouter from './Route/JournalRouter.mjs';
import PraposalRouter from './Route/PraposalRouter.mjs';
import PatentRouter from './Route/PatentRouter.mjs';
import CopyrightRouter from './Route/CopyrightRouter.mjs';
import FDPRouter from './Route/FDPRouter.mjs';
import SDPRouter from './Route/SDPRouter.mjs';
import StaffStatRouter from './Route/StaffStatsRoute.mjs';
dotenv.config();

const app = express();


// JSON Parsing Middleware
app.use(express.json());


app.use(cors({
    // origin: "http://localhost:3000",
    origin:"*",
    methods: ["GET", "POST", "PUT", "DELETE"],
}));

// Logging Middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.use((req, res, next) => {

    if (req.path.startsWith('/api/auth')) {
        // Skip JWT verification for /api/auth routes
        return next();
    }

    const token = req.headers['authorization'];
    
    if (!token) {
        return res.status(403).send('A token is required for authentication');
    }
    try {
        const decoded = JwtOperation.verifyToken(token);
        req.user = decoded;
    } catch (err) {
        return res.status(401).send('Invalid Token');
    }
    next();
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});


app.use("/api/auth",AuthRouter)
app.use("/api/conferences",ConferanceRouter)
app.use("/api/journal",JournalRouter)
app.use("/api/proposals",PraposalRouter)
app.use("/api/patents",PatentRouter)
app.use("/api/copyright",CopyrightRouter)
app.use("/api/fdp/",FDPRouter)
app.use("/api/sdp",SDPRouter)
app.use("/api/staff/",StaffStatRouter)

app.listen(5000, '0.0.0.0');