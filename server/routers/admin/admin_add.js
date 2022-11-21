const express = require('express');
const admin_add_router = express.Router();
const verifyTokenAdmin = require('../../middleware/verifyTokenAdmin');
const db = require('../../db/connectDB');
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
                    var addQuery = "INSERT INTO lecturers (lecturer_id, lecturer_user_name, fullname, title, email, supervisor, signature) VALUES(?, ?, ?, ?, ?, ?, ?)";
                    const results = await new Promise((resolve) => {
                        db.query(addQuery, [id, userName, fullName, title, email, supervisor, signature], (err, result) => {
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
            const dateFormat = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;
            var thesisId;
            var thesisTopic = (req.body.thesisTopic === "" || req.body.thesisTopic === undefined) ? null : (req.body.thesisTopic);
            var thesisField = (req.body.thesisField === "" || req.body.thesisField === undefined) ?  null :  (req.body.thesisField);
            var availableDay = checkTypeToAdd(req.body.availableDay, dateFormat);
            var defenseDay = checkTypeToAdd(req.body.defenseDay, dateFormat);
            var slot = (req.body.slot === "" || req.body.slot === undefined) ?  null : (req.body.slot);
            var slotMaximum = (req.body.slotMaximum === "" || req.body.slotMaximum === undefined) ? null : (req.body.slotMaximum);
            console.log("id = " + thesisId);
            console.log("thesisTopic = " + thesisTopic);
            console.log("thesisField = " + thesisField);
            console.log("availableDay = " + availableDay);
            console.log("defenseDay = " + defenseDay);
            console.log("slot = " + slot);
            console.log("slotMaximum = "  + slotMaximum);
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
                        var addQuery = "INSERT INTO theses (thesis_id, thesis_topic, thesis_field, available_day, defense_day, slot, slot_maximum) VALUES(?, ?, ?, ?, ?, ?, ?)";
                        const results = await new Promise((resolve) => {
                            db.query(addQuery, [thesisId, thesisTopic, thesisField, availableDay, defenseDay, slot, slotMaximum], (err, result) => {
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
        });
        
// use for email
    function checkTypeToAdd (value, type) {
        if( value === "" || value === undefined){
            return null; 
       } else if(!value.toString().match(type)){
            return '';
       }
       else { return value;}
    }

    
// Exports cho biến admin_router
module.exports = admin_add_router;