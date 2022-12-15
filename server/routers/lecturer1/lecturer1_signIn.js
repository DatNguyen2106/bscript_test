const { request } = require('express');
const express = require('express');
const lecturer1_signIn_router = express.Router();
const db = require('../../db/connectDB');
const getThesesLecturer1 = require('../../middleware/getThesesLecturer1');
const verifyTokenLecturer1 = require('../../middleware/verifyTokenLecturer1');

lecturer1_signIn_router.post('/registrationBachelorThesis', verifyTokenLecturer1, async (req, res) =>{
    // because of unique id value, so this api just returns 1 or no value.
        try {
            var role = req.role;
            var studentId = (req.body.studentId === undefined || req.body.studentId === null || req.body.studentId === "") ? null : req.body.studentId;
            var confirmSignature =  req.body.confirmSignature; 
            if(req.username && req.userId) {
                if(role){
                    if(confirmSignature === true){
                        const query = "UPDATE registrations_for_bachelor_thesis SET step = ? WHERE student_id = ?";
                        const queryParams = [2, studentId];
                        const result = await executeQuery(res, query, queryParams);
                        res.send(result);
                    }
                    else if (confirmSignature === false) {
                        const query = "UPDATE registrations_for_bachelor_thesis SET step = ? WHERE student_id = ?";
                        const queryParams = [0, studentId];
                        const result = await executeQuery(res, query, queryParams);
                        res.send(result);
                    }
                    else {
                        res.send("invalid confirm signature");
                    }
                }
                else res.status(405).send("You are not allowed to access, You are not lecturer1")
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
module.exports = lecturer1_signIn_router;