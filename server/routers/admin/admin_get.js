const express = require('express');
const admin_get_router = express.Router();
const verifyTokenAdmin = require('../../middleware/verifyTokenAdmin');
const verifyToken = require('../../middleware/verifyTokenAdmin');
const db = require('../../db/connectDB');

admin_get_router.get('/test', verifyToken, (req, res) => {
    console.log(req.body);
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

admin_get_router.post('/lecturers', verifyTokenAdmin, async (req, res) =>{
    try {
        var chunkForPage = 5;
        var emailFormat = /^[a-zA-Z0-9_.+]*[a-zA-Z][a-zA-Z0-9_.+]*@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        var page = (req.body.page === "" || req.body.page === undefined) ?  1 : req.body.page;
        var id  = (req.body.id === "" || req.body.id === undefined) ?  '%' : ('%' +req.body.id +'%');
        var title = (req.body.title === "" || req.body.title === undefined) ? '%' : ('%' + req.body.title + '%');
        var userName = (req.body.username === "" || req.body.username === undefined) ?  '%' : ('%' + req.body.username  + '%');
        var fullName = (req.body.fullname === "" || req.body.fullname === undefined) ?  '%' :  ('%' + req.body.fullname  + '%');
        var email ;
        console.log(emailFormat);
        if(req.body.email === "" || req.body.email === undefined){
             email =  '%';
        }
        else { email = ('%' +req.body.email +'%')}
        console.log(email);
        var supervisor = (req.body.supervisor === "" || req.body.supervisor === undefined) ?  '%' : req.body.supervisor;
        var role = req.role;
        if(req.username) {
            if(role){
                {   console.log(id);
                    console.log("userName = " + userName);
                    console.log("fullName = " + fullName);
                    var filterQuery = "SELECT * FROM lecturers where lecturer_id LIKE ? AND lecturer_user_name LIKE ? AND fullname LIKE ? AND title LIKE ? AND email LIKE ? AND supervisor LIKE ?;";
                    const results = await new Promise((resolve) => {
                        db.query(filterQuery, [id, userName, fullName, title, email, supervisor], (err, result) => {
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
                        res.send({
                            "totalPage" : results.chunk(chunkForPage).length,
                            "list" : []
                        })
                    }
                    else {res.send({
                        "totalPage" : results.chunk(chunkForPage).length,
                        "list" : results.chunk(chunkForPage)[page-1]
                    })}
                }
            }
            else res.send("You are not allowed to access, You are not admin")
        }   
    } catch (error) {
        res.status(404).send(error.message);
    }
    
})
admin_get_router.get('/lecturer/:id', verifyTokenAdmin, async (req, res) =>{
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
                        { res.send(results)}
                        else {
                            // case return number of objects > 1
                            // but in this case the number of results are only 1 and 0.
                            for (let i = 0; i < results.length; i++){
                            res.send({
                                "id" : results[i].lecturer_id,
                                "userName" : results[i].lecturer_user_name,
                                "fullName" : results[i].fullname,
                                "email" : results[i].email,
                                "supervisor" : results[i].supervisor,
                                "signature" : results[i].signature
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
admin_get_router.post('/students', verifyTokenAdmin, async (req, res) =>{
    try {
        var chunkForPage = 5;
        const emailFormat = /^([a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)$/;
        // yyyy - mm - dd
        const ectsFormat = /^\d+$/;
        var page = (req.body.page === "" || req.body.page === undefined) ?  1 : req.body.page;
        var id  = (req.body.id === "" || req.body.id === undefined) ?  '%' : ('%' + req.body.id +'%');
        var userName = (req.body.username === "" || req.body.username === undefined) ?  '%' : ('%' + req.body.username  + '%');
        var fullName = (req.body.fullname === "" || req.body.fullname === undefined) ?  '%' :  ('%' + req.body.fullname  + '%');
        var intake = (req.body.intake === "" || req.body.intake === undefined) ? '%' : ('%' +  req.body.intake + '%'); 
        var email = (req.body.email === "" || req.body.email === undefined) ? '%' : ('%' + req.body.email + '%');
        var ects  = (req.body.etcs === "" || req.body.ects === undefined) ? '%' : ('%' +  req.body.ects + '%'); 
        var signature = (req.body.signature === "" || req.body.signature === undefined) ?  '%' : ('%' + req.body.signature + '%');        
        console.log("id = " + id);
        console.log("username = " + userName);
        console.log("fullName = " + fullName);
        console.log("intake = " + intake);
        console.log("email = " + email);
        console.log("ects = " + ects);
        var role = req.role;
        if(req.username) {
            if(role){
                {  
                     console.log(id);
                    var filterQuery = "SELECT * FROM students where student_id LIKE ? AND student_user_name LIKE ? AND fullname LIKE ? AND intake LIKE ? AND email LIKE ? AND ects LIKE ?;";
                    const results = await new Promise((resolve) => {
                        db.query(filterQuery, [id, userName, fullName, intake, email, ects, signature], (err, result) => {
                          if(err) {res.send(err);}
                          else
                          {  
                            console.log(filterQuery);
                            resolve(JSON.parse(JSON.stringify(result)))
                          }
                        })
                      })
                    console.log(results);
                    console.log(results.chunk(page)[page-1]);
                    console.log("TotalPage " + results.chunk(chunkForPage).length);
                    if(page > results.chunk(chunkForPage).length){
                        res.send({
                            "totalPage" : results.chunk(chunkForPage).length,
                            "list" : []
                        })
                    }
                    else {res.send({
                        "totalPage" : results.chunk(chunkForPage).length,
                        "list" : results.chunk(chunkForPage)[page-1]
                    })}
                }
            }
            else res.send("You are not allowed to access, You are not admin")
        }   
    } catch (error) {
        res.status(404).send(error.message);
    }
})
admin_get_router.get('/student/:id', verifyTokenAdmin, async (req, res) =>{
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
                            var filterQuery = "SELECT * FROM students where student_id = ?";
                            const results = await new Promise((resolve) => {
                                db.query(filterQuery, [id], (err, result) => {
                                    if(err) {res.send(err);}
                                    else
                                    {  resolve(JSON.parse(JSON.stringify(result)))}
                                })
                                })
                            if( results.length === 0 || results === null || results === undefined || results === [])
                            { res.send(results)}
                            else {
                                // case return number of objects > 1
                                // but in this case the number of results are only 1 and 0.
                                for (let i = 0; i < results.length; i++){
                                res.send({
                                    "id" : results[i].student_id,
                                    "userName" : results[i].student_user_name,
                                    "fullName" : results[i].fullname,
                                    "intake" : results[i].intake,
                                    "email" : results[i].email,
                                    "ects" : results[i].ects,
                                    "signature" : results[i].signature
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


admin_get_router.get('/lecturer', (req, res) => {
    res.send("Default routes for admin/get/lecturer");
})
admin_get_router.get('/student', (req, res) => {
    res.send("Default routes for admin/get/student");
})



function checkTypeToSearch (value) {
    if( value === "" || value === undefined){
        return '%';
   }
   else { return ('%' + value +'%')}
}

// Exports cho biến admin_router
module.exports = admin_get_router;
