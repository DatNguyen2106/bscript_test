// const express = require('express');
// const http = require('http');

// const verifyToken = require("../middleware/auth");
// const db =  require("../db/connectDB");
// const chat_router = express.Router();

// const httpServer = require("http").createServer();
// const io = require("socket.io")(httpServer,{
//     cors: {
//         origin: "http://localhost:3000/", 
//       }
// });
// chat_router.post('/addSocket', verifyToken, async (req,res) => {
//     var role = req.role;
//     var username = req.username;
//     console.log(role, username);
//     var addQuery = "INSERT INTO tbl_user(socket_id) VALUES ? WHERE username = ?";
//     var socketId;
// io.on("connection", (socket) => {
//   socket.on("newUser", (username) => {
//     console.log(username);
//     console.log(socket.id);
//   });



//   socket.on("sendNotification", ({ senderName, receiverName, type }) => {
//     const receiver = getUser(receiverName);
//     io.to(receiver.socketId).emit("getNotification", {
//       senderName,
//       type,
//     });
//   });

//   socket.on("sendText", ({ senderName, receiverName, text }) => {
//     const receiver = getUser(receiverName);
//     io.to(receiver.socketId).emit("getText", {
//       senderName,
//       text,
//     });
//   });

//   socket.on("disconnect", () => {
//     removeUser(socket.id);
//   });
// });
         
//     console.log(socketId);
//     var addQuery = "INSERT INTO tbl_user(socket_id) VALUES ? WHERE username = ?";
//     const results = await new Promise((resolve) => {
//         db.query(addQuery, [socketId, username], (err, result) => {
//           if(err) {res.send(err);}
//           else
//           {  
//             resolve(JSON.parse(JSON.stringify(result)))
//           }
//         })
//       })    

// });
// module.exports = chat_router;