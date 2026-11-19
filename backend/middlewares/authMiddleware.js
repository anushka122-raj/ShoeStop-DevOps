const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const authenticationMiddleware = asyncHandler(async (req, res, next) => {

    // First declare authHeader
    const authHeader = req.headers.authorization;

    console.log('REQUEST:', req.method, req.originalUrl);
    console.log('AUTH HEADER PRESENT:', Boolean(authHeader));

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            message: 'No token provided or invalid authorization format'
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        console.log('JWT VERIFIED:', true);
        console.log('USER ID:', decoded.id || decoded._id);

        next();

    } catch (error) {
        console.error('JWT VERIFICATION FAILED:', error.message);

        return res.status(401).json({
            message: 'Not authorized to access this route'
        });
    }
});

module.exports = authenticationMiddleware;