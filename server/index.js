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

// app.use('/chat', chatRoute);
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`running on port ${PORT}`));
