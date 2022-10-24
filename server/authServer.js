require('dotenv').config();
const db = require('./db/connectDB.js')
// const {getList} = require("./query/query");
const bcrypt = require('bcrypt');
const express = require('express');
const cors = require('cors');
const app = express();
const verifyToken = require('./middleware/auth');
const jwt = require('jsonwebtoken');
app.use(cors());
app.use(express.json());
var users = [];

app.post('/signup', async (req , res) => {
    const {id, username, password,role} = req.body;
    const roles = JSON.stringify(role);
    const saltRounds = 10;
    var insertUserQuery = "INSERT INTO tbl_user (id, username, password, salt, role) VALUES (?, ?, ?, ?, ?)";
        bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(password, salt, function(err, hash) {
            if(err) {res.send(err);}     
            // Store hash in database here
            else  { 
                db.query(insertUserQuery,[id,username,hash,salt,roles], (err, result) => {
                    if(err) {
                        res.send("Cannot Insert on tbl_user into database")
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
        console.log(users);
    } catch (error) {
        console.log(error);
        res.sendStatus(403);
    }
})

//login
app.post('/login',  async (req, res) => {
    const {username, password} = req.body;  
    var queries = {
        query: "SELECT * FROM tbl_user"
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
    const {id, username, role} = payload;
 /* create JWT token */
 console.log(process.env.ACCESS_TOKEN_SECRET + " and " + process.env.REFRESH_TOKEN_SECRET)
 const accessToken = jwt.sign({id,username,role}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '30s'})
 
 const refreshToken   = jwt.sign({id,username,role}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '3600s'})
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
    var updateRefreshToken = "UPDATE tbl_user SET refreshToken= ? WHERE username = ?;";
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
