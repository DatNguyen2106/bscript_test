require('dotenv').config();
const { appendFile } = require("fs");
const httpServer = require("http").createServer();
const express = require('express');
const verifyToken = require('./middleware/auth');
const cors = require('cors');
const { verify } = require('crypto');
const jwt = require('jsonwebtoken');
const db = require('./db/connectDB')
const app = express();
const bodyParser = require('body-parser');

app.use(cors());
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
const io = require("socket.io")(httpServer,{
    cors: {
        origin: "http://localhost:3000/", 
      }
});


var onlineUsers = [];

const authenticateUser = (reqToken, socketId) => {
  var authenticatedUser = {}; 
  if(!reqToken.token) return console.log("error 401");
    try {
        const decoded =jwt.verify(reqToken.token, process.env.ACCESS_TOKEN_SECRET);
        console.log(decoded);
        authenticatedUser.userId = decoded.id;
        authenticatedUser.username = decoded.username;
        authenticatedUser.role = decoded.role;
        authenticatedUser.socketId = socketId;
        console.log(authenticatedUser.role);
        return authenticatedUser;
      } catch (error) {
        console.log(error);
    }
};
const removeUsers = async (username) => {
    var removeUserQuery = "UPDATE tbl_user SET socket_id = null WHERE username = ?;"
    const results = await new Promise((resolve) => {
      db.query(removeUserQuery, [username], (err, result) => {
        if(err) {console.log("error " + err);}
        else
        {  
          resolve(JSON.parse(JSON.stringify(result)))
        }
      })
    })
    console.log(results);
    return results;  
  }

// get onlineUsers 
const getOnlineUsers =  async () => {
    var getOnlineUserQuery = "SELECT username, socket_id FROM tbl_user where socket_id is not NULL"
    const results = await new Promise((resolve) => {
      db.query(getOnlineUserQuery, (err, result) => {
        if(err) {console.log("error " + err);}
        else
        {  
          resolve(JSON.parse(JSON.stringify(result)))
        }
      })
    })
    console.log(results);
    return results[0];
}
const updateSocketStatus = (socketId, username) => {
  var updateSocketQuery = "UPDATE tbl_user SET socket_id = ? WHERE username = ?;";
  const results = db.query(updateSocketQuery, [socketId, username], (err, result) => {
    if(err) {console.log("error " + err);}
    else
    {  
      (JSON.parse(JSON.stringify(result)))
    }
  })
}
const checkUser = (username, socketId) => {
  console.log("username: " + username);
  console.log("socketId: " + socketId);
};

io.on("connection", (socket) => {
  socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });
  var authenticatedUser;
  socket.on("updateSocket", async (reqToken) => {
  authenticatedUser =  authenticateUser(reqToken, socket.id);
  updateSocketStatus(socket.id, authenticatedUser.username);
  onlineUsers.push(await getOnlineUsers(authenticatedUser.username));
    console.log("online user" , onlineUsers);
    console.log(socket.connected);
    console.log("online user 2" , onlineUsers);
    // console.log(userNames);
    io.to(socket.id).emit("getText", authenticatedUser);    
  })
  socket.on("disconnect", async () => {
    console.log("online user 3" , onlineUsers);
    console.log(onlineUsers[0], "+" , typeof(onlineUsers));
    if(onlineUsers && onlineUsers !== null && onlineUsers !== undefined && authenticatedUser) {
    onlineUsers = onlineUsers.filter((user) => user.socket_id !== socket.id)
    await removeUsers(authenticatedUser.username);
    console.log("Disconnected");
    console.log("online user 4" , onlineUsers);
    }
    else { console.log("error disconnect")}
  })
});
const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {});
module.exports = io;