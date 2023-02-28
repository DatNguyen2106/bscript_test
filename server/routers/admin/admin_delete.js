const express = require('express');
const admin_delete_router = express.Router();
const verifyTokenAdmin = require('../../middleware/verifyTokenAdmin');
const db = require('../../db/connectDB');
const io = require('../.././socketServer');

// api for delete by id
admin_delete_router.delete('/lecturer/:id', verifyTokenAdmin, async (req, res) =>{
    // because of unique id value, so this api just returns 1 or no value.
        var id;
        var role = req.role;
        console.log(req.params.id);
        console.log(typeof(req.params.id));
        if(req.username) {
            if(role){
                if(req.params.id === undefined  || req.params.id === ''){
                    res.status(404).send("Undefined id for delete");
                } 
                else {
                    id = req.params.id;
                    console.log(id);
                    var deleteQuery = "DELETE FROM lecturers where lecturer_id = ?";
                    const results = await new Promise((resolve) => {
                        db.query(deleteQuery, [id], (err, result) => {
                            if(err) {res.status(500).send(err.message);}
                            else
                            {  resolve(JSON.parse(JSON.stringify(result)))}
                        })
                        })
                    res.send(results);
                }
            }
            else res.status(405).send("You are not allowed to access, You are not admin")
        }
        else res.status(404).send("No user with that username");
    })
admin_delete_router.delete('/lecturer', (req, res) => {
    res.send("Default routes for admin/lecturer");
})

admin_delete_router.delete('/student/:id', verifyTokenAdmin, async (req, res) =>{
    // because of unique id value, so this api just returns 1 or no value.
        var id;
        var role = req.role;
        console.log(req.params.id);
        console.log(typeof(req.params.id));
        if(req.username) {
            if(role){
                if(req.params.id === undefined  || req.params.id === ''){
                    res.status(404).send("Undefined id for delete");
                } 
                else {
                    id = req.params.id;
                    console.log(id);
                    var deleteQuery = "DELETE FROM students where student_id = ?";
                    const results = await new Promise((resolve) => {
                        db.query(deleteQuery, [id], (err, result) => {
                            if(err) {res.status(500).send(err.message);}
                            else
                            {  resolve(JSON.parse(JSON.stringify(result)))}
                        })
                        })
                    res.send(results);
                }
            }
            else res.status(405).send("You are not allowed to access, You are not admin")
        }
        else res.status(404).send("No user with that username");
    })


admin_delete_router.delete('/thesis/:id', verifyTokenAdmin, async (req, res) =>{
    // because of unique id value, so this api just returns 1 or no value.
        var thesisId;
        var role = req.role;
        console.log(req.params.id);
        console.log(typeof(req.params.id));
        if(req.username) {
            if(role){
                if(req.params.id === undefined  || req.params.id === ''){
                    res.status(404).send("Undefined id for delete");
                } 
                else {
                    thesisId = req.params.id;
                    console.log(thesisId);
                    const getThesisInfoQuery = "call getThesisInfoById(?)";
                    const getThesisInfoQueryParams = [thesisId];
                    const getThesisInfoQueryResults = await executeQuery(res, getThesisInfoQuery, getThesisInfoQueryParams);
                    console.log(getThesisInfoQueryResults[0]);
                    for (var i = 0; i < getThesisInfoQueryResults[0].length; i++) {
                        if(getThesisInfoQueryResults[0][i].lecturer1_id !== null){
                            if(getThesisInfoQueryResults[0][i].student_id !== null){
                            console.log(getThesisInfoQueryResults[0][i].lecturer1_id);
                            const sendNotificationQuery = "INSERT INTO notifications (title, sender, receiver, content) VALUES (?, ?, ?, ?)";
                            const sendParams = [`Admin update thesis` , req.userId, getThesisInfoQueryResults[0][i].lecturer1_id, `An admin has updated the information of your thesis "${thesisTopic}" with the student id "${getThesisInfoQueryResults[0][i].student_id}"`];
                            const notification = await sendNotification(res, sendNotificationQuery, sendParams);  
                            } else {
                            const sendNotificationQuery = "INSERT INTO notifications (title, sender, receiver, content) VALUES (?, ?, ?, ?)";
                            const sendParams = [`Admin update thesis` , req.userId, getThesisInfoQueryResults[0][i].lecturer1_id, `An admin has updated the information of your thesis "${thesisTopic}" with no student`];
                            const notification = await sendNotification(res, sendNotificationQuery, sendParams);
                            } 
                        } else console.log("no sup 1");
                    }
                    var deleteQuery = "DELETE FROM theses where thesis_id = ?";
                    const results = await new Promise((resolve) => {
                        db.query(deleteQuery, [thesisId], (err, result) => {
                            if(err) {res.status(500).send(err.message);}
                            else
                            {  resolve(JSON.parse(JSON.stringify(result)))}
                        })
                        })
                    const notificationReceived = await getNotificationReceived(res, req.userId);
                    console.log(notificationReceived);
                                const socket = await getSocketById(res, req.userId);
                                const socketId = socket[0].socket_id;
                                if(socketId === null || socketId === undefined){
                                }
                                else { io.to(socketId).emit("notificationReceived", (notificationReceived))};
                    res.send(results);
                }
            }
            else res.status(405).send("You are not allowed to access, You are not admin")
        }
        else res.status(404).send("No user with that username");
    })
admin_delete_router.delete('/lecturer', (req, res) => {
    res.send("Default routes for admin/delete/lecturer");
})    
admin_delete_router.delete('/student', (req, res) => {
    res.send("Default routes for admin/delete/student");
})
admin_delete_router.delete('/thesis', (req, res) => {
    res.send("Default routes for admin/delete/thesis");
})
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
// Exports cho admin_delete_router
module.exports = admin_delete_router;