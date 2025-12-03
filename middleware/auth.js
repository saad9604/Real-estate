const jwt = require('jsonwebtoken');

/**
 * Middleware to verify JWT token
 * Add this middleware to routes that require authentication
 */
const verifyToken = (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({
                error: 'Access denied. No token provided.',
                authenticated: false
            });
        }

        // Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Add user info to request object
        req.admin = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                error: 'Token expired. Please login again.',
                authenticated: false
            });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                error: 'Invalid token.',
                authenticated: false
            });
        }

        return res.status(500).json({
            error: 'Failed to authenticate token.',
            authenticated: false
        });
    }
};

module.exports = { verifyToken };
