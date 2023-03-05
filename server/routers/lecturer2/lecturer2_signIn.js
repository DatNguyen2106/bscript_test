const express = require('express');
const lecturer2_signIn_router = express.Router();
const db = require('../../db/connectDB');
const verifyTokenLecturer2 = require('../../middleware/verifyTokenLecturer2');
lecturer2_signIn_router.post('/registrationBachelorThesis', verifyTokenLecturer2, async (req, res) =>{
    // because of unique id value, so this api just returns 1 or no value.
        try {
            var role = req.role;
            var studentId = (req.body.studentId === undefined || req.body.studentId === null || req.body.studentId === "") ? null : req.body.studentId;
            var confirmSignature = req.body.confirmSignature; 
            if(req.username && req.userId) {
                if(role){
                const getBasicInfoLecturerByLecturerIdQuery = "call getBasicInfoLecturerByLecturerId(?)";
                const getBasicInfoLecturerByLecturerIdParams = [req.userId];
                const basicInfoLecturerResults = await executeQuery(res, getBasicInfoLecturerByLecturerIdQuery, getBasicInfoLecturerByLecturerIdParams);
                const lecturerTitle = basicInfoLecturerResults[0][0].title;
                if(confirmSignature === true) {
                    const changeStepRegistrationBachelorThesisQuery = "Update registrations_for_bachelor_thesis SET step = ? where student_id = ?";
                    const changeStepRegistrationBachelorThesisQueryParams = [3, studentId];
                    const changeStepRegistrationBachelorThesisResults = await executeQuery(res, changeStepRegistrationBachelorThesisQuery, changeStepRegistrationBachelorThesisQueryParams);

                    const getThesisIdByStudentIdQuery = " call getThesisIdByStudentId(?)";
                    const getThesisIdByStudentIdQueryParams = [studentId];
                    const getThesisIdByStudentIdResults = await executeQuery(res, getThesisIdByStudentIdQuery, getThesisIdByStudentIdQueryParams);
                    const thesisId = getThesisIdByStudentIdResults[0][0].thesis_id;
                    console.log(thesisId);
                    
                    const getExactThesisFromStudentIdQuery = "call getExactThesisFromStudentId(?)";
                    const getExactThesisFromStudentIdParams = [studentId];
                    const getExactThesisFromStudentIdResults = await executeQuery(res, getExactThesisFromStudentIdQuery, getExactThesisFromStudentIdParams);

                    if(getExactThesisFromStudentIdResults[0]){
                        if(getExactThesisFromStudentIdResults[0][0].studentId !== null && getExactThesisFromStudentIdResults[0][0].lecturer1_title !== null){
                        const sendNotificationAnotherSupQuery = "INSERT INTO notifications (title, sender, receiver, content) VALUES (?, ?, ?, ?)";
                        const sendNotificationAnotherSupParams = [`Lecturer sign-in registration bachelor` , req.userId, getExactThesisFromStudentIdResults[0][0].lecturer1_id, `${lecturerTitle} has signed the registration bachelor thesis form for the thesis "${getExactThesisFromStudentIdResults[0][0].thesis_topic}" from the student ${studentId}`];
                        const sendNotificationAnotherSup = await sendNotification(res, sendNotificationAnotherSupQuery, sendNotificationAnotherSupParams); 
                        
                        const sendNotificationStudentQuery = "INSERT INTO notifications (title, sender, receiver, content) VALUES (?, ?, ?, ?)";
                        const sendNotificationStudentParams = [`Lecturer sign-in registration bachelor` , req.userId, getExactThesisFromStudentIdResults[0][0].student_id, `${lecturerTitle} has signed the registration bachelor thesis form for the thesis "${getExactThesisFromStudentIdResults[0][0].thesis_topic}"`];
                        const sendNotificationStudent = await sendNotification(res, sendNotificationStudentQuery, sendNotificationStudentParams);      
                        }
                    }
                    
                    const changeStep3InThesesQuery = " call updateStep3OnThesesByThesisId(?)";
                    const changeStep3InThesesQueryParams = [thesisId];
                    const changeStep3InThesesResults = await executeQuery(res, changeStep3InThesesQuery, changeStep3InThesesQueryParams);
                    
                    const notificationSent = await getNotificationSent(res, req.userId);
                    const notificationReceived = await getNotificationReceived(res, req.userId);
                    console.log(notificationReceived);
                    const socket = await getSocketById(res, req.userId);
                    const socketId = socket[0].socket_id;
                    if(socketId === null || socketId === undefined){
                    }
                    else { io.to(socketId).emit("notificationReceived", (notificationReceived))};
                    //final results
                    res.send(changeStep3InThesesResults);
                }
                else if (confirmSignature === false){
                    // do something here 

                }
                else {
                    res.send("invalid confirmSignature")
                }
                }
                else res.status(405).send("You are not allowed to access, You are not lecturer2")
            }
            else res.status(404).send("No user with that username");    
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
var sendNotification = (res, query, queryParams) => {
    const results =  new Promise((resolve) => {
        db.query(query, queryParams, (err, result) => {
            if(err) {res.status(500).send(err.message)}
            else
            {  resolve(JSON.parse(JSON.stringify(result)))}
        })
        })
    return results;
}
const getSocketById = (res, id) => {
        const query = "select socket_id from tbl_user where id = ?"
        const queryParams = [id];
        const results =  new Promise((resolve) => {
            db.query(query, queryParams, (err, result) => {
                if(err) {res.status(500).send(err.message)}
                else
                {  resolve(JSON.parse(JSON.stringify(result)))}
            })
            })
        return results;
}
const getNotificationSent = (res, id) => {
    const query = "select * from notifications where sender = ?"
    const queryParams = [id];
    const results =  new Promise((resolve) => {
        db.query(query, queryParams, (err, result) => {
            if(err) {res.status(500).send(err.message)}
            else
            {  resolve(JSON.parse(JSON.stringify(result)))}
        })
        })
    return results;
}
const getNotificationReceived = (res, id) => {
    const query = "select * from notifications where receiver = ?"
    const queryParams = [id];
    const results =  new Promise((resolve) => {
        db.query(query, queryParams, (err, result) => {
            if(err) {res.status(500).send(err.message)}
            else
            {  resolve(JSON.parse(JSON.stringify(result)))}
        })
        })
    return results;
}
module.exports = lecturer2_signIn_router;
