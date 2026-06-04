import jwt from 'jsonwebtoken';

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization || req.headers.token;
    const token = authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.slice(7)
        : authHeader;

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized. Token missing.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        req.body.userId = decoded.id;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error.message || error);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: 'Token expired. Please log in again.', tokenExpired: true });
        }
        return res.status(401).json({ success: false, message: 'Invalid token.' });
    }
};

export default authMiddleware;