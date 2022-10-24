require('dotenv').config();
require('./prototype.js');
const db = require('./db/connectDB.js')
// const bcrypt = require('bcrypt');
const express = require('express');
const verifyToken = require('./middleware/auth');
const verifyTokenLecturer = require('./middleware/verifyTokenLecturer');
const verifyTokenAdmin = require('./middleware/verifyTokenAdmin');
const verifyTokenLecturer1 = require('./middleware/verifyTokenLecturer1');
const verifyTokenLecturer2 = require('./middleware/verifyTokenLecturer2');
const verifyTokenStudent = require('./middleware/verifyTokenStudent');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/test', verifyToken, (req, res) => {
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
app.get('/admin/get1', verifyToken, (req, res) => {
    console.log("access by access token successfully");
    const roles = req.role;
    if(req.username) {
        if(roles.indexOf("admin") > -1){
            {
                var testQuery = "SELECT * FROM posts";
                db.query(testQuery, function(err, results) {
                    {
                        if(err) {res.send(err);}
                        else res.json(results);
                    }
                })
            }
        }
        else console.log("You are not allowed to access, You are not admin")
    }
});

app.get('/admin/get2', verifyTokenAdmin, (req, res) => {
    console.log(" admin access by access token successfully");
    const role = req.role;
    if(req.username) {
        if(role){
            {
                var testQuery = "SELECT * FROM posts";
                db.query(testQuery, function(err, results) {
                    {
                        if(err) {res.send(err);}
                        else res.json(results);
                    }
                })
            }
        }
        else console.log("You are not allowed to access, You are not admin")
    }
});
app.get('/lecturer1/get', verifyTokenLecturer1, (req, res) => {
    console.log(" admin access by access token successfully");
    const role = req.role;
    if(req.username) {
        if(role){
            {
                var testQuery = "SELECT * FROM posts where username = ?";
                db.query(testQuery,[req.username],  function(err, results) {
                    {
                        if(err) {res.send(err);}
                        else res.json(results);
                    }
                })
            }
        }
        else console.log("You are not allowed to access, You are not lecturer1")
    }
});

app.get('/lecturer2/get', verifyTokenLecturer2, (req, res) => {
    console.log(" admin access by access token successfully");
    const role = req.role;
    if(req.username) {
        if(role){
            {
                var testQuery = "SELECT * FROM posts where username = ?";
                db.query(testQuery,[req.username],  function(err, results) {
                    {
                        if(err) {res.send(err);}
                        else res.json(results);
                    }
                })
            }
        }
        else console.log("You are not allowed to access, You are not lecturer2")
    }
});

app.get('/student/get', verifyTokenStudent, (req, res) => {
    console.log(" student access by access token successfully");
    const role = req.role;
    if(req.username) {
        if(role){
            {
                var testQuery = "SELECT * FROM posts where username = ?";
                db.query(testQuery,[req.username],  function(err, results) {
                    {
                        if(err) {res.send(err);}
                        else res.json(results);
                    }
                })
            }
        }
        else console.log("You are not allowed to access, You are not student")
    }
});

app.get('/lecturer2/test', verifyTokenAdmin, verifyTokenLecturer2, async (req, res) => {
    console.log(" admin -> lecturer2 access by access token successfully");
    const role = req.role;
    if(req.username) {
        if(role){
            {
                var testQuery = "SELECT * FROM posts where username = ? ORDER BY post";
                const results = await new Promise((resolve) => {
                    db.query(testQuery, [req.username], (err, result) => {
                      if(err) {res.send(err);}
                      else
                      {  
                        resolve(JSON.parse(JSON.stringify(result)))
                      }
                    })
                  })
                console.log(results);
                console.log(results.chunk(3));
                console.log(results.chunk())
            }
        }
        else console.log("You are not allowed to access, You are not lecturer2")
    }
});

app.post('/lecturers/get/:page', verifyTokenLecturer, async (req, res) =>{
    const page = req.params.page;
    const chunkForPage = 5;
    const id  = (req.body.id === "" || req.body.id === undefined) ?  '%' : req.body.id;
    const userName = (req.body.userName === "" || req.body.userName === undefined) ?  '%' : req.body.userName;
    const fullName = (req.body.fullName === "" || req.body.fullName === undefined) ?  '%' : req.body.fullName;
    const email = (req.body.email === "" || req.body.email === undefined) ?  '%' : req.body.email;
    const supervisor = (req.body.supervisor === "" || req.body.supervisor === undefined) ?  '%' : req.body.supervisor;
    const role = req.role;
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
                console.log("TotalPage " + results.chunk(page).length)
                res.send({
                    "totalPage" : results.chunk(chunkForPage).length,
                    "list" : results.chunk(chunkForPage)[page-1]
                })
            }
        }
        else console.log("You are not allowed to access, You are not lecturer")
    }
})
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`running on port ${PORT}`));


