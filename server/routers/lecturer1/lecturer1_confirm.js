const express = require('express');
const lecturer1_confirm_router = express.Router();
const db = require('../../db/connectDB');
const verifyTokenLecturer1 = require('../../middleware/verifyTokenLecturer1');


lecturer1_confirm_router.post('/confirmStudent', verifyTokenLecturer1, async (req, res) =>{
    // because of unique id value, so this api just returns 1 or no value.
        try {
            var role = req.role;
            var studentId = (req.body.studentId === undefined || req.body.studentId === "" || req.body.studentId === null) ?  null : req.body.studentId;
            console.log("before " + req.body.confirmStudent)
            var confirmStudent = (req.body.confirmStudent === undefined || req.body.confirmStudent === null || req.body.confirmStudent === "") ? false : req.body.confirmStudent;
            if(req.username && req.userId) {
                if(role){
                    const query = "UPDATE students_theses SET confirm_sup1 = ? WHERE student_id = ?";
                    var queryParams;
                    if(confirmStudent === true) {
                        console.log(studentId);
                        queryParams = [true, studentId];
                        const results = await executeQuery(res, query, queryParams);
                        console.log(query)

                        const getThesisIdByStudentIdQuery = "call getThesisIdByStudentId(?)";
                        const getThesisIdByStudentIdQueryParams = [studentId];
                        const thesisIdResult = await executeQuery(res, getThesisIdByStudentIdQuery,getThesisIdByStudentIdQueryParams);
                        var thesisId = thesisIdResult[0][0].thesis_id;
                        console.log(thesisId);
                        const changeStepQuery = "UPDATE theses SET step = ? WHERE thesis_id = ?";
                        const changeStepQueryParams = [1, thesisId];
                        const changeStepResults = await executeQuery(res, changeStepQuery, changeStepQueryParams);
                        res.send(changeStepResults);
                    }
                    else if (confirmStudent === false){
                        queryParams = [false, studentId];
                        const results = await executeQuery(res, query, queryParams);
                        res.send(results);
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
module.exports = lecturer1_confirm_router;
