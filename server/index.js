require('dotenv').config();
require('./prototype.js');
const db = require('./db/connectDB.js')
// const bcrypt = require('bcrypt');
const express = require('express');
const verifyToken = require('./middleware/auth');
const cors = require('cors');
const app = express();
const adminRoute = require('./routers/admin');
const studentRoute = require('./routers/student')
const chatRoute = require('./routers/chatRoutes')
app.use(cors());
app.use(express.json());
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// Dùng userRoute cho tất cả các route bắt đầu bằng '/users'
app.use('/admin', adminRoute);
app.use('/student', studentRoute);

app.get('/getNotifications', verifyToken, async (req, res) =>{
    // because of unique id value, so this api just returns 1 or no value.
        try {
            var role = req.role;
            if(req.username){
                var id = req.userId;
                console.log(id);
                const query = "SELECT * FROM notifications WHERE author = ?";
                const queryParams = [id];
                const dbResults = await executeQuery(res, query, queryParams); 
                console.log(dbResults);
                console.log(dbResults.length);
                res.send(dbResults);
            }
        } catch (error) {
            console.log(error.message);
            res.status(404).send("You got an error" + error.message);
        }
        
    })

const executeQuery = (res, query, queryParams) => {
    const results =  new Promise((resolve) => {
        db.query(query, queryParams, (err, result) => {
            if(err) {res.status(500).send(err.message)}
            else
            {  resolve(JSON.parse(JSON.stringify(result)))}
        })
        })
    return results;
}
// app.use('/chat', chatRoute);
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`running on port ${PORT}`));
