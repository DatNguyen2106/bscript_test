const express = require('express');
const verifyToken = require('../middleware/auth');
const chatRouter = express.Router();

// chatRouter.route("/").post(verifyToken, accessChat);
// chatRouter.route("/").get(verifyToken, fetchChats);

// chatRouter.route("/group").post(verifyToken, createGroupChat);
// chatRouter.route("/rename").post(verifyToken, renameGroup);
// chatRouter.route("/groupremove").post(verifyToken, removeFromGroup);
// chatRouter.route("/groupadd").post(verifyToken, addToGroup);

module.exports = chatRouter;