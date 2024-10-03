import express from 'express';
import AuthHandler from '../Handler/AuthHandler.mjs'
const AuthRouter = express.Router()

// Define routes and map them to the AuthHandler methods
AuthRouter.post('/admin/login', AuthHandler.adminLogin); // Admin login route
AuthRouter.post('/register', AuthHandler.userRegister);  // User registration route
AuthRouter.post('/login', AuthHandler.userLogin);        // User login route
AuthRouter.post('/update-password', AuthHandler.updatePassword);  // Password update route
AuthRouter.post('/forget-password', AuthHandler.forgetPassword);  // Forget password route

export default AuthRouter;
