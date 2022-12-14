const jwt = require('jsonwebtoken');

const verifyToken = (req,res,next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];
    if(!token) return res.sendStatus(401);
    
    try {
        const decoded =jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        console.log(decoded);
        req.userId = decoded.id;
        req.username = decoded.username;
        req.role = decoded.role;
        console.log(req.role);
        console.log(typeof(req.role));
        next();
    } catch (error) {
        console.log(error);
        res.sendStatus(403);
    }
}
module.exports = verifyToken;