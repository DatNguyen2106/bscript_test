const express = require('express');
const student_add_router = express.Router();
const db = require('../../db/connectDB');
const verifyTokenStudent = require('../../middleware/verifyTokenStudent');
student_add_router.post('/confirmSup1', verifyTokenStudent, async (req, res) =>{
    try {
        var role = req.role;
        var thesisId = (req.body.thesisId === null || req.body.thesisId === undefined) ? null : req.body.thesisId;
        var studentId;
        console.log(role);
        if(req.username && req.userId) {
            if(role){
                if(req.userId === undefined || req.userId === ''){
                    res.status(500).send("Undefined id for update")
                } 
                else {
                studentId = req.userId;
                const query = "INSERT INTO students_theses VALUES (?,?,?)";
                const queryParams = [studentId, thesisId, 0];
                const results = await executeQuery(res, query, queryParams);
                res.send(results);
                }
            }
            else res.status(405).send("You are not allowed to access, You are not student")
        }
        else res.status(404).send("No user with that username");

    } catch (error) {
            console.log(error.message);
            res.status(404).send("You got an error " + error.message);
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
module.exports = student_add_router;
