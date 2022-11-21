const express = require('express');
const student_get_router = express.Router();
const readStudentMiddleware = require('../../middleware/readStudentMiddleware');
const db = require('../../db/connectDB');

student_get_router.get('/:id', readStudentMiddleware, async (req, res) =>{
    // because of unique id value, so this api just returns 1 or no value.
        try {
            var role = req.role;
            if(req.username && req.userId) {
                if(role){
                    console.log (req.params.id);
                    console.log(req.userId);
                    if(req.params.id.toString() === req.userId.toString()) {
                        console.log("This is student access");
                    }
                    else console.log("This is role " + role + " access with this ID " + req.userId);
                    var studentId = req.params.id;
                    if(!studentId || typeof(studentId) === 'undefined') {
                        res.send("No user params");
                    } else {
                        {
                            var filterQuery = "SELECT * FROM students where student_id = ?";
                            var queryParams = [studentId];
                            const results = await executeQuery(res, filterQuery, queryParams);
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
module.exports = student_get_router;
