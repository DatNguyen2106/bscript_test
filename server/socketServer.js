require('dotenv').config();
require('./socket.js')
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
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
const io = require("socket.io")(httpServer,{
    cors: {
        origin: "http://localhost:3000/", 
      }
});



const authenticateUser = async (reqToken, socketId) => {
  var authenticatedUser = {}; 
  if(!reqToken.token) return console.log("error 401");
    try {
        const decoded = jwt.verify(reqToken.token, process.env.ACCESS_TOKEN_SECRET);
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
    return results;
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
  authenticatedUser = await authenticateUser(reqToken, socket.id);
  if(authenticatedUser){
  let checkList = [];
  updateSocketStatus(socket.id, authenticatedUser.username);
  console.log(authenticatedUser.username);
  console.log(authenticatedUser.socketId);
  console.log(getOnlineUsers(authenticatedUser.username));
  checkList = await getOnlineUsers(authenticatedUser.username);
  // checkList.push(await getOnlineUsers(authenticatedUser.username));
  for (let i = 0; i < checkList.length; i++) {
      if(authenticatedUser.username === checkList[i].username && checkList[i].socketId){
        // if the user has the socket_id means that they have connection. So we log out this previous session.
        socket.disconnect(checkList[i].socket_id);
      }
    }
    for (let i = 0; i < checkList.length; i++) {
      if(checkList[i] && checkList[i] !== null && checkList[i] !== undefined && socket.id !== checkList[i].socket_id){
        // online users
        console.log(checkList[i].socket_id);
        console.log(socket.id);
        onlineUsers.push(checkList[i])
      }
    }
    console.log("online users" , onlineUsers);
    // console.log(userNames);
    io.to(socket.id).emit("getText", authenticatedUser);    
  }
})
  // socket.on("disconnect", async () => {
  //   console.log("online user 3" , onlineUsers);
  //   console.log(onlineUsers[0], "+" , typeof(onlineUsers));
  //   if(onlineUsers && onlineUsers !== null && onlineUsers !== undefined && authenticatedUser) {
  //   onlineUsers = onlineUsers.filter((user) => user.socket_id !== socket.id);
  //   console.log("online user 3" , onlineUsers);

  //   await socket.disconnect(authenticatedUser.socket_id);
  //   console.log("Disconnected");
  //   console.log("online user 4" , onlineUsers);
  //   }
  //   else { console.log("error disconnect")}
  // })
  socket.on('addUser', async () => {
    console.log("add User" + onlineUsers);
    for (let i = 0; i < onlineUsers.length; i++) {
      if(socket.id === onlineUsers[i].socket_id){
        socket.disconnect(true);
      }
    }
  })

});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {});
module.exports = io;