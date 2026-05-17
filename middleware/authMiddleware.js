const jwt = require('jsonwebtoken');
const authMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if(!authHeader) {
        return res.status(401).json({ message: 'You have not got the token, go away! Authorisation denied.' });
    }
    const token = authHeader.replace('Bearer ', '');
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        next();
    } catch(err) {
        res.status(401).json({ message: 'Token is incorrect!' });
    }
};
module.exports = authMiddleware;