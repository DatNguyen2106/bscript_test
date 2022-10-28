const express = require('express');
const admin_add_router = express.Router();
const verifyTokenAdmin = require('../../middleware/verifyTokenAdmin');
const verifyToken = require('../../middleware/verifyTokenAdmin');
const db = require('../../db/connectDB');
// api for get lecturer by id
admin_add_router.post('/lecturer', verifyTokenAdmin, async (req, res) =>{
    // because of unique id value, so this api just returns 1 or no value.
        var role = req.role;
        var emailFormat = /^[a-zA-Z0-9][a-zA-Z0-9.!#$%&'*+-/=?^_`{|}~]*?[a-zA-Z0-9._-]?@[a-zA-Z0-9][a-zA-Z0-9._-]*?[a-zA-Z0-9]?\\.[a-zA-Z]{2,63}$/;
        var id;
    
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
        var supervisor = (req.body.supervisor === "" || req.body.supervisor === undefined ||
        req.body.supervisor === 'lecturer1' || req.body.supervisor === 'lecturer2') ?  null : req.body.supervisor;
        if(req.username) {
            if(role){
                if(req.body.id === undefined  || req.body.id === ''){
                    res.status(500).send("Undefined id for update");
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
                    var addQuery = "INSERT INTO lecturers (lecturer_id, lecturer_user_name, fullname, email, supervisor) VALUES(?, ?, ?, ?, ?)";
                    const results = await new Promise((resolve) => {
                        db.query(addQuery, [id, userName, fullName, email, supervisor], (err, result) => {
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
module.exports = admin_add_router;