import JwtOperation from '../Utils/jwtoken.mjs'
import  pool  from '../Database/Database.mjs'
import { generateOTP, sendOTPMail } from '../Utils/email.mjs'
import bcrypt from 'bcrypt'


class AuthHandler {

    static adminLogin = async (req, res) => {

        const { username, password } = req.body;
        if (username === process.env.ADMIN && password === process.env.ADMINPASSWORD) {
            const payload = {
                "id": username,
                "role": "Admin"
            }
            const token = JwtOperation.generateToken(payload);

            res.status(201).json({
                token: token
            });
        } else {
            res.status(401).json({
                message: 'Unauthorized'
            });
        }
    };


    static userRegister = async (req, res) => {
        try {
            const { email, password, name, role, department, employeeId } = req.body;

            // Check if the user already exists with the same email
            const [existingUser] = await pool.query('SELECT * FROM User WHERE email = ?', [email]);
            if (existingUser.length !== 0) {
                return res.status(400).json({
                    success: false,
                    message: "User with the same email already exists",
                });
            }
            console.log(password.length)
            // Hash the user's password before saving it
            const hashedPassword = await bcrypt.hash(password, 10);
            console.log(hashedPassword)
            // Insert new user into the User table
            const [newUser] = await pool.query(
                "INSERT INTO User (email, password, name, role, department, employeeId) VALUES (?, ?, ?, ?, ?, ?)",
                [email, hashedPassword, name, role, department, employeeId]
            );
          
            if (newUser.affectedRows === 1) {
                return res.status(201).json({
                    success: true,
                    message: "User registered successfully"
                });
            } else {
                return res.status(500).json({
                    success: false,
                    message: "Failed to register user",
                });
            }

        } catch (error) {
            console.error("Error during user registration:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    };

    static userLogin = async (req, res) => {
        try {
            const { email, password } = req.body;
            const [userRows] = await pool.query('SELECT * FROM User WHERE email = ?', [email]);
    
            if (userRows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }
    
            const user = userRows[0];
    
            // Compare the plain password with the hashed password stored in the DB
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: "Incorrect password",
                });
            }
    
            // Generate JWT token upon successful login
            const payload = {
                id: user.id,
                role: user.role,
            };
            const token = JwtOperation.generateToken(payload);
    
            return res.status(200).json({
                token: token,
                success: true,
                message: "User Found",
                user: user,
            });
        } catch (error) {
            console.error("Error during login:", error);
            return res.status(500).json({
                success: false,
                message: "Internal Server Error",
            });
        }
    };
    



    static updatePassword = async (req, res) => {
        try {
            const { email, password, } = req.body;
            console.log(email, password)
            if (!email || !password) {
                return res.status(400).json({ error: 'Email and password are required.' });
            }

            let query = 'UPDATE User SET password = ? where email = ?';
            let values = [password,email];

            const result = await pool.query(query, values);

            return res.status(200).json({
                message: 'Password updated successfully'
            });
        } catch (err) {
            console.error('Error updating password:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    };


    static forgetPassword = async (req, res) => {
        try {
            const { email } = req.body;

            if (!email) {
                return res.status(400).json({ message: 'Email is required' });
            }


            const [userResult] = await pool.query('SELECT * FROM User WHERE email = ?', [email]);

            if (userResult.length === 0) {
                return res.status(404).json({ message: 'User with this email does not exist' });
            }

            // Generate OTP
            const otp = generateOTP();
            console.log(otp)

            // Send OTP email
            sendOTPMail(email, otp, 'Password Reset OTP');

            // Respond with success message
            return res.status(200).json({ message: 'OTP has been sent to your email', otp: otp, user: userResult[0] });
        } catch (error) {
            console.error('Error in forgetPassword:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    };
}



export default AuthHandler;
