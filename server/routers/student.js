const express = require('express');
const student_router = express.Router();
const db = require('./../db/connectDB')

const student_get_router = require('./student/student_get');
const student_registrationBachelorThesis_router = require('./student/student_registrationBachelorThesis')
const student_registrationOralDefense_router = require('./student/student_registrationOralDefense');
student_router.use('/get', student_get_router);
student_router.use('/registrationBachelorThesis', student_registrationBachelorThesis_router);
student_router.use('/registrationOralDefense', student_registrationOralDefense_router)
module.exports = student_router;