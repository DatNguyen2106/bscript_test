const express = require('express');
const admin_add_router = express.Router();
const verifyTokenAdmin = require('../../middleware/verifyTokenAdmin');
const db = require('../../db/connectDB');
const io = require('../.././socketServer');
// api for add lecturer by id
admin_add_router.post('/lecturer', verifyTokenAdmin, async (req, res) =>{
    // because of unique id value, so this api just returns 1 or no value.
        var role = req.role;
        var emailFormat = /^([a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)$/;
        var id;
        var title = (req.body.title === "" || req.body.title === undefined) ?  null : req.body.title;
        var signature = (req.body.signature === "" || req.body.signature === undefined) ?  null : req.body.signature;
        var userName = req.body.username;
        var fullName = (req.body.fullname === "" || req.body.fullname === undefined) ?  null : req.body.fullname;
        var email;
        console.log(req.body.email);
        email = checkTypeToAdd(req.body.email, emailFormat);
        var supervisor = (req.body.supervisor === "" || req.body.supervisor === undefined) ?  null : req.body.supervisor;
        var maximumTheses = (req.body.maximumTheses === "" || req.body.maximumTheses === undefined) ?  0 : req.body.maximumTheses;
        console.log(supervisor);
        if(req.username) {
            if(role){
                if(req.body.id === undefined  || req.body.id === ''){
                    res.status(500).send("Undefined id for add");
                } else if (typeof(req.body.id) != 'number'){
                    res.status(500).send("Invalid Type for Id, need a number")
                }
                else {
                    id = req.body.id;
                    console.log(id);
                    console.log(userName);
                    if(userName === null || userName === undefined || userName === ""){
                        res.status(500).send("need a valid user name");
                    } else {
                        if(email === null || email === ''){
                            res.status(500).send("Unvalid email");
                        }
                        else {
                            var addQuery = "INSERT INTO lecturers (lecturer_id, lecturer_user_name, fullname, title, email, supervisor, signature, maximum_of_theses) VALUES(?, ?, ?, ?, ?, ?, ?, ?)";                    const results = await new Promise((resolve) => {
                            db.query(addQuery, [id, userName, fullName, title, email, supervisor, signature, maximumTheses], (err, result) => {
                                    if(err) {res.status(500).send(err.message);}
                            else
                            {  resolve(JSON.parse(JSON.stringify(result)))}
                        })
                        })
                    res.send(results);
                        }
                    }
                }
            }
            else res.status(405).send("You are not allowed to access, You are not admin")
        }
        else res.status(404).send("No user with that username");
    })
admin_add_router.post('/student', verifyTokenAdmin, async (req, res) =>{
    // because of unique id value, so this api just returns 1 or no value.
        var role = req.role;
        var emailFormat = /^([a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)$/;
        var id;
        var signature = (req.body.signature === "" || req.body.signature === undefined) ?  null : req.body.signature;
        var userName = req.body.username;
        var intake = (req.body.intake === "" || req.body.intake === undefined) ?  null : req.body.intake;
        var fullName = (req.body.fullname === "" || req.body.fullname === undefined) ?  null : req.body.fullname;
        var ects = (req.body.ects === "" || req.body.ects === undefined ) ? null : req.body.ects;
        var email;
        console.log(req.body.email);
        email = checkTypeToAdd(req.body.email, emailFormat);
        var signature = (req.body.signature === "" || req.body.signature === undefined) ?  null : req.body.signature;
        if(req.username) {
            if(role){
                if(req.body.id === undefined  || req.body.id === ''){
                    res.status(500).send("Undefined id for add");
                } else if (typeof(req.body.id) != 'number'){
                    res.status(500).send("Invalid Type for Id, need a number")
                }
                else {
                    id = req.body.id;
                    console.log(id);
                    console.log(userName);
                    if(userName === null || userName === undefined || userName === ""){
                        res.status(500).send("need a valid user name");
                    } else {
                        if(email === null || email === ''){
                            res.status(500).send("Unvalid email");
                        }
                        else {
                    var addQuery = "INSERT INTO students (student_id, student_user_name, fullname, intake, email, ects, signature) VALUES(?, ?, ?, ?, ?, ?, ?)";
                    const results = await new Promise((resolve) => {
                        db.query(addQuery, [id, userName, fullName, intake, email, ects, signature], (err, result) => {
                            if(err) {res.status(500).send(err.message);}
                            else
                            {  resolve(JSON.parse(JSON.stringify(result)))}
                        })
                        })
                    res.send(results);
                        }
                    }
                }
            }
            else res.status(405).send("You are not allowed to access, You are not admin")
        }
        else res.status(404).send("No user with that username");
    })
admin_add_router.post('/thesis', verifyTokenAdmin, async (req, res) =>{
    // because of unique id value, so this api just returns 1 or no value.
        var role = req.role;
        var thesisId = (req.body.thesisId === "" || req.body.thesisId === undefined) ?  null : req.body.thesisId;
        var thesisTopic = (req.body.thesisTopic === "" || req.body.thesisTopic === undefined) ? null : req.body.thesisTopic;
        var thesisField = (req.body.thesisField === "" || req.body.thesisField === undefined) ? null : req.body.thesisField;
        var lecturer1_id = (req.body.lecturer1_id === "" || req.body.lecturer1_id === undefined) ? null : req.body.lecturer1_id;
        var lecturer2_id = (req.body.lecturer2_id === "" || req.body.lecturer2_id === undefined) ? null : req.body.lecturer2_id;
        var slotMaximum = (req.body.slotMaximum === "" || req.body.slotMaximum === undefined) ?  null : req.body.slotMaximum;
        if(req.username) {
            if(role){
                if(req.body.thesisId === undefined  || req.body.thesisId === ''){
                    res.status(500).send("Undefined id for add");
                } else if (typeof(req.body.thesisId) != 'number'){
                    res.status(500).send("Invalid Type for Id, need a number")
                }
                else {
                    thesisId = req.body.thesisId;
                    console.log(thesisId);
                    const insertThesesQuery = "call addNewThesis(?, ?, ?, ?, ?, ?)";
                    const queryParams = [thesisId, thesisTopic, thesisField, lecturer1_id, lecturer2_id, slotMaximum];
                    const results = await executeQuery(res, insertThesesQuery, queryParams);
                    res.send(results);
                }
                const sendNotificationQuery = "INSERT INTO notifications (title, sender, receiver, content) VALUES (?, ?, ?, ?)";
                const sendParams = [`Admin ${req.userId} add new thesis ${thesisId}` , req.userId, thesisId, "add new thesis successfully"];
                const notification = await sendNotification(res, sendNotificationQuery, sendParams);
                const notificationSent = await getNotificationSent(res, req.userId);
                const notificationReceived = await getNotificationReceived(res, req.userId);
                const socket = await getSocketById(res, req.userId);
                const socketId = socket[0].socket_id;
                if(socketId === null || socketId === undefined){
                    console.log("no socketId from database");
                }
                else { io.to(socketId).emit("notificationSent", (notificationSent))};
            }
            else res.status(405).send("You are not allowed to access, You are not admin")
        }
        else res.status(404).send("No user with that username");
    });
// admin_add_router.post('/signature', verifyTokenAdmin, async (req, res) =>{
//         // because of unique id value, so this api just returns 1 or no value.
//             var role = req.role;
//             var id;
//             var signature = req.params.signature;
//             if(req.username) {
//                 if(role){
//                     if(req.userId === undefined  || req.userId === ''){
//                         res.status(500).send("Undefined id for add");
//                     } 
//                     else {
//                         const insertSignatureQuery = "INSERT INTO admins(admin_id, signature) VALUES(?,?)";
//                         const insertSignatureQueryParams = [req.userId, signature];
//                         const results = await executeQuery(res, insertSignatureQuery, insertSignatureQueryParams);
//                         res.send(results);
//                     }
//                 }
//                 else res.status(405).send("You are not allowed to access, You are not admin")
//             }
//             else res.status(404).send("No user with that username");
// });
          
// use for email
function checkTypeToAdd (value, type) {
    if( value === "" || value === undefined){
        return null; 
    } else if(!value.toString().match(type)){
        return '';
    }
    else { return value;}
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

// Exports cho biến admin_router
module.exports = admin_add_router;