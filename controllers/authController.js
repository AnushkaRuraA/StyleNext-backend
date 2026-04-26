import jwt from 'jsonwebtoken';
import admin from '../config/firebaseAdmin.js';

const adminLogin = async (req, res) => {
    const { username, password } = req.body;

    // Check against .env credentials
    if (username === process.env.ADMIN && password === process.env.PASS) {
        // Create Node JWT
        const token = jwt.sign(
            { id: 'admin', role: 'admin' },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '1d' }
        );

        // Generate Firebase Custom Token
        try {
            const firebaseToken = await admin.auth().createCustomToken('admin_user', { role: 'admin' });
            
            return res.json({
                success: true,
                token,
                firebaseToken,
                message: 'Login successful'
            });
        } catch (error) {
            console.error('Error creating custom token:', error);
            return res.status(500).json({
                success: false,
                message: 'Error during Firebase initialization'
            });
        }
    }

    return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
    });
};

export { adminLogin };
