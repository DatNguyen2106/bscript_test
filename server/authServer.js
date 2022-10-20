require('dotenv').config();
// const {getList} = require("./query/query");
const bcrypt = require('bcrypt');
const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const app = express();
const verifyToken = require('./middleware/auth');
const jwt = require('jsonwebtoken');
app.use(cors());
app.use(express.json());
var users = [];

const db = mysql.createConnection(
    {
        user: 'root',
        host: 'localhost',
        password: 'admin',
        database : 'bscriptTest'
    }
)

app.post('/signup', async (req , res) => {
    const {username, password} = req.body;
    const saltRounds = 10;
    var insertUserQuery = "INSERT INTO users (username, password, salt) VALUES (?, ?, ?)";
        bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(password, salt, function(err, hash) {
            if(err) {res.send(err);}     
            // Store hash in database here
            else  { 
                db.query(insertUserQuery,[username,hash,salt], (err, result) => {
                    if(err) {
                        res.send("Cannot Insert user into database")
                    }
                    else res.json(result);
                })} 
         });
      });
})
app.post('/token', (req, res) => {
    const refreshToken = req.body.refreshToken;
    if(!refreshToken) return res.sendStatus(401);

    // find users with exact refresh token
    const user = users.find(user => user.refreshToken === refreshToken)

    // if no specified
    if(!user)  return res.sendStatus(403);

    try {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
// create tokens 
        const tokens = generateTokens(user);
        updateRefreshToken(user.username, tokens.refreshToken)
        res.json(tokens);
    } catch (error) {
        console.log(error);
        res.sendStatus(403);
    }

})
app.post('/login',  async (req, res) => {
    const {username, password} = req.body;

  
    var queries = {
        query: "SELECT * FROM users"
    };
    const getList = (queryName, queryParams) => {
        return new Promise(function(resolve, reject){
            db.query(queries[queryName], queryParams, function(err, result, fields){
                if (!err){ resolve(JSON.parse(JSON.stringify(result))); // Hacky solution
            }
                else reject(err);
            });
        });
    };
    module.exports = {
        getList
    };
    users = await getList("query");
    const user = users.find((u) => u.username === username);
    if(!user) {
        res.send("No user");
        return;
        }
    const isValid = await bcrypt.compare(password, user.password);
    console.log(isValid)
    if(!isValid) {
        res.send("Wrong User Name or Password")
        return;
    };
    // send jwt
    if(user && isValid){
        const tokens = generateTokens(user);
        console.log(tokens.refreshToken)
        updateRefreshToken(user.username, tokens.refreshToken)
        console.log(users);
        res.json(tokens);
    }

})
const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`running on port ${PORT}`));

// generate access token and refresh token based on payload
const generateTokens = payload => {
// create to remove old refresh token from re-login
    const {id, username} = payload;
 /* create JWT token */
 const accessToken = jwt.sign({id,username}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '30s'})
 
 const refreshToken   = jwt.sign({id,username}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '3600s'})
return {accessToken, refreshToken};
}
app.delete('/logout', verifyToken, (req, res) => {
    const user = users.find(user => user.id === req.userId)
    updateRefreshToken(user.username, null)
    console.log(users)
    res.sendStatus(204)
})


//find user by username and replace refresh token
const updateRefreshToken = (username, refreshToken) => {
    var updateRefreshToken = "UPDATE users SET refreshToken= ? WHERE username = ?;";
         db.query(updateRefreshToken,[refreshToken, username], function(err, result) {
            if(err) return console.log(err);
        })
    // find user by username and replace refresh token
    
    users = users.map(user => {
        if(user.username === username) return{
            ...user, refreshToken
    }
    // if user is not = username pass through, return user
    return user;
})
}
