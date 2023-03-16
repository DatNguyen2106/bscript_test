const express = require('express');
const lecturer1_confirm_router = express.Router();
const db = require('../../db/connectDB');
const verifyTokenLecturer1 = require('../../middleware/verifyTokenLecturer1');
const io = require('../.././socketServer');


lecturer1_confirm_router.post('/confirmStudent', verifyTokenLecturer1, async (req, res) =>{
    // because of unique id value, so this api just returns 1 or no value.
        try {
            var role = req.role;
            var studentId = (req.body.studentId === undefined || req.body.studentId === "" || req.body.studentId === null) ?  null : req.body.studentId;
            console.log("before " + req.body.confirmStudent)
            var confirmStudent = (req.body.confirmStudent === undefined || req.body.confirmStudent === null || req.body.confirmStudent === "") ? false : req.body.confirmStudent;
            if(req.username && req.userId) {
                if(role){
                    const query = "UPDATE students_theses SET confirm_sup1 = ? WHERE student_id = ?";
                    var queryParams;
                    if(confirmStudent === true) {
                        console.log(studentId);
                        queryParams = [true, studentId];
                        const results = await executeQuery(res, query, queryParams);
                        console.log(query)

                        const getThesisIdByStudentIdQuery = "call getThesisIdByStudentId(?)";
                        const getThesisIdByStudentIdQueryParams = [studentId];
                        const thesisIdResult = await executeQuery(res, getThesisIdByStudentIdQuery,getThesisIdByStudentIdQueryParams);
                        var thesisId = thesisIdResult[0][0].thesis_id;
                        console.log(thesisId);
                        const changeStepQuery = "UPDATE theses SET step = ? WHERE thesis_id = ?";
                        const changeStepQueryParams = [1, thesisId];
                        const changeStepResults = await executeQuery(res, changeStepQuery, changeStepQueryParams);
                        
                        const getExactThesisFromStudentIdQuery = "call getExactThesisFromStudentId(?)";
                        const getExactThesisFromStudentIdParams = [studentId];
                        const getExactThesisFromStudentIdResults = await executeQuery(res, getExactThesisFromStudentIdQuery, getExactThesisFromStudentIdParams);
                        if(getExactThesisFromStudentIdResults){
                        const sendNotificationSup1Query = "INSERT INTO notifications (title, sender, receiver, content) VALUES (?, ?, ?, ?)";
                        const sendNotificationSup1Params = [`Lecturer1 confirm student` , req.userId, studentId, `You have been accepted to join "${getExactThesisFromStudentIdResults[0][0].thesis_topic}"`];
                        const sendNotificationSup1 = await sendNotification(res, sendNotificationSup1Query, sendNotificationSup1Params);      
                     
                        const notificationReceived = await getNotificationReceived(res, getExactThesisFromStudentIdResults[0][0].student_id);

                        const socket1 = await getSocketById(res, getExactThesisFromStudentIdResults[0][0].student_id);
                        const socketReceiver1 = socket1[0].socket_id;
                        if(socket1 === null || socket1 === undefined){
                        }
                        else { io.to(socketReceiver1).emit("notificationReceived", (notificationReceived))};    
                    } else console.log("no thesis");
                        res.send(changeStepResults);
                    }
                    else if (confirmStudent === false){
                        queryParams = [false, studentId];
                        const results = await executeQuery(res, query, queryParams);

                        const getExactThesisFromStudentIdQuery = "call getExactThesisFromStudentId(?)";
                        const getExactThesisFromStudentIdParams = [studentId];
                        const getExactThesisFromStudentIdResults = await executeQuery(res, getExactThesisFromStudentIdQuery, getExactThesisFromStudentIdParams);

                        if(getExactThesisFromStudentIdResults){
                        const sendNotificationQuery = "INSERT INTO notifications (title, sender, receiver, content) VALUES (?, ?, ?, ?)";
                        const sendNotificationParams = [`Lecturer1 reject student` , req.userId, studentId, `You have been rejected to join thesis "${getExactThesisFromStudentIdResults[0][0].thesis_topic}"`];
                        const Notification = await sendNotification(res, sendNotificationQuery, sendNotificationParams);      
                        const notificationReceived = await getNotificationReceived(res, getExactThesisFromStudentIdResults[0][0].student_id);

                        const socket1 = await getSocketById(res, getExactThesisFromStudentIdResults[0][0].student_id);
                        const socketReceiver1 = socket1[0].socket_id;
                        if(socket1 === null || socket1 === undefined){
                        }
                        else { io.to(socketReceiver1).emit("notificationReceived", (notificationReceived))};   
                        } else console.log("no thesis");

                        const deleteStudentsThesesQuery = "DELETE FROM students_theses WHERE student_id = ?";
                        const deleteStudentsThesesQueryParams = [studentId];
                        const deleteStudentsThesesResults = await executeQuery(res, deleteStudentsThesesQuery, deleteStudentsThesesQueryParams);
                        

                        res.send(deleteStudentsThesesResults);
                    }
                }
                else res.status(405).send("You are not allowed to access, You are not lecturer1")
            }
            else res.status(404).send("No user with that username");    
        } catch (error) {
            console.log(error.message);
            res.status(404).send("You got an error" + error.message);
        }
        
    })
lecturer1_confirm_router.post('/confirmThesis', verifyTokenLecturer1, async (req, res) =>{
    // because of unique id value, so this api just returns 1 or no value.
        try {
            var role = req.role;
            var thesisId = (req.body.thesisId === undefined || req.body.thesisId === "" || req.body.thesisId === null) ?  null : req.body.thesisId;
            console.log("before " + req.body.confirmThesis)
            var confirmThesis = (req.body.confirmThesis === undefined || req.body.confirmThesis === null || req.body.confirmThesis === "") ? false : req.body.confirmThesis;
            if(req.username && req.userId) {
                if(role){
                    const query = "UPDATE lecturers_theses SET confirm_sup2 = ? where thesis_id = ?";
                    var queryParams;
                    if(confirmThesis === true) {
                        queryParams = [true, thesisId];
                        const results = await executeQuery(res, query, queryParams);
                        const changeStepQuery = "UPDATE theses SET step = ? where thesis_id = ?";
                        const changeStepQueryParams = [2, thesisId];
                        const changeStepResult = await executeQuery(res, changeStepQuery, changeStepQueryParams);
                        res.send(changeStepResult);
                    }
                    else if (confirmThesis === false){
                        queryParams = [false, thesisId];
                        const results = await executeQuery(res, query, queryParams);
                        const setNullLecturer2Query = "UPDATE lecturers_theses SET lecturer2 = NULL where thesis_id = ?";
                        const setNullLecturer2QueryParams = [thesisId];
                        const setNullLecturer2Results = await executeQuery(res, setNullLecturer2Query, setNullLecturer2QueryParams);
                        res.send(setNullLecturer2Results);
                    }
                }
                else res.status(405).send("You are not allowed to access, You are not lecturer1")
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

module.exports = lecturer1_confirm_router;
