import jwt from 'jsonwebtoken';

const protectAdmin = (req, res, next) => {
    const token = req.headers.authorization?.startsWith('Bearer') 
                  ? req.headers.authorization.split(' ')[1] 
                  : null;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized access'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        if (decoded.role !== 'admin') {
            throw new Error('Not an admin');
        }
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};

export { protectAdmin };
