const express = require('express');
const admin_update_router = express.Router();
const verifyTokenAdmin = require('../../middleware/verifyTokenAdmin');
const verifyToken = require('../../middleware/verifyTokenAdmin');
const db = require('../../db/connectDB');

admin_update_router.put('/lecturer/:id', verifyTokenAdmin, async (req, res) =>{
    // because of unique id value, so this api just returns 1 or no value.
    var role = req.role;
    var emailFormat = /^([a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)$/;
    var paramId;
    var userName = req.body.username;
    var fullName = (req.body.fullname === "" || req.body.fullname === undefined) ?  null : req.body.fullname;
    var title = (req.body.title === "" || req.body.title === undefined) ?  null : req.body.title;
    var signature = (req.body.signature === "" || req.body.signature === undefined) ?  null : req.body.signature;
    var maximumTheses = (req.body.maximumTheses === "" || req.body.maximumTheses === undefined) ?  0 : req.body.maximumTheses;

    var email;
    email = checkTypeToUpdate(req.body.email,emailFormat);
    var supervisor = (req.body.supervisor === "" || req.body.supervisor === undefined) ?  null : req.body.supervisor;
    if(req.username) {
        if(role){
            if(req.params.id === undefined || req.params.id === ""){
                res.status(404).send("Invalid username with that id")
            } else if(!(req.params.id)){
                res.status(404).send("Need a number Parameter Id");
            } else {
                    paramId = req.params.id;
                    console.log(paramId);
                    console.log(userName);
                    if(userName === null || userName === undefined || userName === ""){
                        res.status(404).send("need a valid user name");
                    } 
                    else {
                        if(email === null || email === ''){
                            res.status(404).send("unvalid email with that");
                        }
                        else{
                        var updateQuery = "UPDATE lecturers SET lecturer_user_name = ? , fullname = ? , title = ?, email = ? , supervisor = ?, signature = ?, maximum_of_theses = ? WHERE  lecturer_id = ?";
                        const results = await new Promise((resolve) => {
                            db.query(updateQuery, [userName, fullName, title, email, supervisor, signature, maximumTheses, paramId], (err, result) => {
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



admin_update_router.put('/student/:id', verifyTokenAdmin, async (req, res) =>{
    // because of unique id value, so this api just returns 1 or no value.
    var role = req.role;
    var emailFormat = /^([a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)$/;
    var paramId;
    var userName = req.body.username;
    var fullName = (req.body.fullname === "" || req.body.fullname === undefined) ?  null : req.body.fullname;
    var intake = (req.body.intake === "" || req.body.intake === undefined) ?  null : req.body.intake;
    var ects = (req.body.ects === "" || req.body.ects === undefined) ?  null : req.body.ects;
    var signature = (req.body.signature === "" || req.body.signature === undefined) ?  null : req.body.signature;
    var email;
    email = checkTypeToUpdate(req.body.email,emailFormat);
    if(req.username) {
        if(role){
            if(req.params.id === undefined || req.params.id === ""){
                res.status(404).send("Invalid username with that id")
            } else if(!(req.params.id)){
                res.status(404).send("Need a number Parameter Id");
            } else {
                    paramId = req.params.id;
                    console.log(paramId);
                    console.log(userName);
                    if(userName === null || userName === undefined || userName === ""){
                        res.status(404).send("need a valid user name");
                    } 
                    else {
                        if(email === null || email === ''){
                            res.status(404).send("unvalid email with that");
                        }
                        else{
                        var updateQuery = "UPDATE students SET student_user_name = ? , fullname = ? , intake = ?, email = ? , ects = ?, signature = ? WHERE student_id = ?";
                        const results = await new Promise((resolve) => {
                            db.query(updateQuery, [userName, fullName, intake, email, ects, signature, paramId], (err, result) => {
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

admin_update_router.put('/thesis/:thesisId', verifyTokenAdmin, async (req, res) =>{
    // because of unique id value, so this api just returns 1 or no value.
    var role = req.role;
    var role = req.role;
    const dateFormat = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;
    var thesisTopic = (req.body.thesisTopic === "" || req.body.thesisTopic === undefined) ? null : (req.body.thesisTopic);
    var thesisField = (req.body.thesisField === "" || req.body.thesisField === undefined) ?  null :  (req.body.thesisField);
    var availableDay = checkTypeToUpdate(req.body.availableDay, dateFormat);
    var defenseDay = checkTypeToUpdate(req.body.defenseDay, dateFormat);
    var slot = (req.body.slot === "" || req.body.slot === undefined) ?  null : (req.body.slot);
    var slotMaximum = (req.body.slotMaximum === "" || req.body.slotMaximum === undefined) ? null : (req.body.slotMaximum);
    if(req.username) {
        if(role){
            if(req.params.thesisId === undefined || req.params.thesisId === ""){
                res.status(404).send("Invalid username with that id")
            } else if(!(req.params.thesisId)){
                res.status(404).send("Need a number Parameter Id");
            } else {
                    paramId = req.params.thesisId;
                    console.log(paramId);
                    var updateQuery = "UPDATE theses SET thesis_topic = ? , thesis_field = ? , available_day = ?, defense_day = ? , slot = ?, slot_maximum = ? WHERE thesis_id = ?";
                    const results = await new Promise((resolve) => {
                        db.query(updateQuery, [thesisTopic, thesisField, availableDay, defenseDay, slot, slotMaximum, paramId], (err, result) => {
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
admin_update_router.get('/lecturer', (req, res) => {
    res.send("Default routes for admin/update/lecturer");
})
admin_update_router.get('/student', (req, res) => {
    res.send("Default routes for admin/update/student");
})
admin_update_router.get('/thesis', (req, res) => {
    res.send("Default routes for admin/update/thesis");
})
// use for email
function checkTypeToUpdate (value, type) {
    if( value === "" || value === undefined){
        return null; 
   } else if(!value.toString().match(type)){
        return '';
   }
   else { return value;}
}

// Exports cho biến admin_router
module.exports = admin_update_router;