const express = require('express');
const admin_router = express.Router();
const verifyTokenAdmin = require('../middleware/verifyTokenAdmin');
const verifyToken = require('../middleware/auth');
const db = require('../db/connectDB');
admin_router.get('/test', verifyToken, (req, res) => {
    console.log("access by access token successfully");
    if(req.username) {
        switch (req.role){
            case 'admin':
                {
                    var testQuery = "SELECT * FROM posts";
                    db.query(testQuery, function(err, results) {
                        {
                            if(err) {res.send(err);}
                            else res.json(results);
                        }
                    })
                }
                break;
            case 'lecturer1':
                {
                    console.log("You are the lecturer1, cannot access full, u can only access lecturer1 posts")
                    var testQuery = "SELECT * FROM posts where username = ?";
                    db.query(testQuery,[req.username], function(err, results) {
                        {
                            if(err) {res.send(err);}
                            else res.json(results);
                        }
                    })
                }
                break;
            case 'lecturer2':
                {
                    console.log("You are the lecturer2, cannot access this, only you can access lecturer2 post") 
                    var testQuery = "SELECT * FROM posts where username = ?";
                    db.query(testQuery,[req.username], function(err, results) {
                        {
                            if(err) {res.send(err);}
                            else res.json(results);
                        }
                    })
                }    
                break;
            case 'student':
                {
                    res.send("You are the student, cannot access this")
                }    
                break; 
            default : {console.log("this is default")}   
        }
    }
});

admin_router.post('/get/lecturers', verifyTokenAdmin, async (req, res) =>{
    try {
        var chunkForPage = 5;
        var emailFormat = /^[a-zA-Z0-9_.+]*[a-zA-Z][a-zA-Z0-9_.+]*@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        var page = (req.body.page === "" || req.body.page === undefined) ?  1 : req.body.page;
        var id  = (req.body.id === "" || req.body.id === undefined) ?  '%' : req.body.id;
        var userName = (req.body.userName === "" || req.body.userName === undefined) ?  '%' : req.body.userName;
        var fullName = (req.body.fullName === "" || req.body.fullName === undefined) ?  '%' : req.body.fullName;
        var email;
        console.log(emailFormat);
        if(req.body.email === "" || req.body.email === undefined){
             email =  '%';
        }
        else if (req.body.email.match(emailFormat)){
             email = ''
        }
        else { email = req.body.email;}
        console.log(email);
        var supervisor = (req.body.supervisor === "" || req.body.supervisor === undefined) ?  '%' : req.body.supervisor;
        var role = req.role;
        if(req.username) {
            if(role){
                {
                    var filterQuery = "SELECT * FROM lecturers where lecturer_id LIKE ? AND lecturer_user_name LIKE ? AND fullname LIKE ? AND email LIKE ? AND supervisor LIKE ?;";
                    const results = await new Promise((resolve) => {
                        db.query(filterQuery, [id, userName, fullName, email, supervisor], (err, result) => {
                          if(err) {res.send(err);}
                          else
                          {  
                            resolve(JSON.parse(JSON.stringify(result)))
                          }
                        })
                      })
                    console.log(results);
                    console.log(results.chunk(page)[page-1]);
                    console.log("TotalPage " + results.chunk(chunkForPage).length);
                    if(page > results.chunk(chunkForPage).length){
                        res.status(404).send("No page found");
                    }
                    else {res.send({
                        "totalPage" : results.chunk(chunkForPage).length,
                        "list" : results.chunk(chunkForPage)[page-1]
                    })}
                }
            }
            else console.log("You are not allowed to access, You are not admin")
        }   
    } catch (error) {
        res.status(404).send(error.message);
    }
    
})
admin_router.post('/get/lecturer/:id', verifyTokenAdmin, async (req, res) =>{
// because of unique id value, so this api just returns 1 or no value.
    try {
        var role = req.role;
        if(req.username) {
            if(role){
                const id  =  req.params.id;
                if(!id || typeof(id) === 'undefined') {
                    res.send("No user params");
                } else {
                    {
                        var filterQuery = "SELECT * FROM lecturers where lecturer_id = ?";
                        const results = await new Promise((resolve) => {
                            db.query(filterQuery, [id], (err, result) => {
                                if(err) {res.send(err);}
                                else
                                {  resolve(JSON.parse(JSON.stringify(result)))}
                            })
                            })
                        if( results.length === 0 || results === null || results === undefined || results === [])
                        { res.send("No user with that ID in lecturer table")}
                        else {
                            // case return number of objects > 1
                            // but in this case the number of results are only 1 and 0.
                            for (let i = 0; i < results.length; i++){
                            res.send({
                                "id" : results[i].lecturer_id,
                                "userName" : results[i].lecturer_user_name,
                                "fullName" : results[i].fullname,
                                "email" : results[i].email,
                                "supervisor" : results[i].supervisor
                                })
                            }
                        }
                    }
                }        
            }
            else res.status(405).send("You are not allowed to access, You are not admin")
        }
        else res.status(404).send("No user with that username");    
    } catch (error) {
        console.log(error.message);
        res.status(404).send("You got an error" + error.message);
    }
    
})


// api for get lecturer by id
admin_router.post('/add/lecturer', verifyTokenAdmin, async (req, res) =>{
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

// api for add lecturer table
admin_router.post('/update/lecturer/:id', verifyTokenAdmin, async (req, res) =>{
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
module.exports = admin_router;