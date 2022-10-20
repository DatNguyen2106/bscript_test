require('dotenv').config();
const bcrypt = require('bcrypt');
const express = require('express');
const verifyToken = require('./middleware/auth');
const cors = require('cors');
const mysql = require('mysql');
const app = express();
const jwt = require('jsonwebtoken');
app.use(cors());
app.use(express.json());


const db = mysql.createConnection(
    {
        user: 'root',
        host: 'localhost',
        password: 'admin',
        database : 'bscriptTest'
    }
)

app.get('/test', verifyToken, (req, res) => {
    console.log("access by access token successfully");
    var testQuery = "SELECT * FROM posts"
    db.query(testQuery,[req.username], function(err, results) {
        {
            if(err) {res.send(err);}
            else res.json(results);
        }})});
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`running on port ${PORT}`));


