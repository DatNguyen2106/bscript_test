const express = require('express');
const admin_update_router = express.Router();
const verifyTokenAdmin = require('../../middleware/verifyTokenAdmin');
const verifyToken = require('../../middleware/verifyTokenAdmin');
const db = require('../../db/connectDB');

admin_update_router.put('/lecturer/:id', verifyTokenAdmin, async (req, res) =>{
    // because of unique id value, so this api just returns 1 or no value.
    var role = req.role;
    var emailFormat = /^[a-zA-Z0-9][a-zA-Z0-9.!#$%&'*+-/=?^_`{|}~]*?[a-zA-Z0-9._-]?@[a-zA-Z0-9][a-zA-Z0-9._-]*?[a-zA-Z0-9]?\\.[a-zA-Z]{2,63}$/;
    var paramId;
    var userName = req.body.username;
    var fullName = (req.body.fullname === "" || req.body.fullname === undefined) ?  null : req.body.fullname;
    var email;
    if(req.body.email === "" || req.body.email === undefined){
         email =  '%';
    }
    else if (req.body.email.match(emailFormat)){
         email = ''
    }
    else { email = req.body.email;}
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
                    var updateQuery = "UPDATE lecturers SET lecturer_user_name = ? , fullname = ? , email = ? , supervisor = ? WHERE  lecturer_id = ?";
                    const results = await new Promise((resolve) => {
                        db.query(updateQuery, [userName, fullName, email, supervisor, paramId], (err, result) => {
                            if(err) {res.status(500).send(err.message);}
                            else
                            {  resolve(JSON.parse(JSON.stringify(result)))}
                        })
                        })
                    res.send(results);
                        }
            }
            
        }
        else res.status(405).send("You are not allowed to access, You are not admin")
    }
    else res.status(404).send("No user with that username");
})



// Exports cho biến admin_router
module.exports = admin_update_router;