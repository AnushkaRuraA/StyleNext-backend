import jwt from 'jsonwebtoken';

const adminLogin = async (req, res) => {
    const { username, password } = req.body;

    // Check against .env credentials
    if (username === process.env.ADMIN && password === process.env.PASS) {
        // Create JWT
        const token = jwt.sign(
            { id: 'admin', role: 'admin' },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '1d' }
        );

        return res.json({
            success: true,
            token,
            message: 'Login successful'
        });
    }

    return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
    });
};

export { adminLogin };
