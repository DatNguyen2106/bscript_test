const jwt = require('jsonwebtoken');

const readStudentMiddleware = (req,res,next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];
    if(!token) return res.sendStatus(401);
    
    try {
        const decoded =jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        console.log(decoded);
        console.log(typeof(JSON.parse(decoded.role)));
        // req.role = JSON.parse(decoded.role);
        const accessRole = ['student', 'admin', 'lecturer1', 'lecturer2', 'fullAccess'];
        const role = decoded.role.replace(/[[\]]/g,'');
        console.log(accessRole.includes(JSON.parse(role)));
        if(accessRole.includes(JSON.parse(role))){
            req.userId = decoded.id;
            req.username = decoded.username;
            req.role = decoded.role;
            next();
        } 
        else {console.log("You are not student, cannot execute this API (checked in middleware)")}
    } catch (error) {
        console.log(error);
        res.sendStatus(403);
    }
}
module.exports = readStudentMiddleware;