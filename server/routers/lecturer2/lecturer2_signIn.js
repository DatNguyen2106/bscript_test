const express = require('express');
const lecturer2_signIn_router = express.Router();
const db = require('../../db/connectDB');
const verifyTokenLecturer2 = require('../../middleware/verifyTokenLecturer2');
lecturer2_signIn_router.post('/registrationBachelorThesis', verifyTokenLecturer2, async (req, res) =>{
    // because of unique id value, so this api just returns 1 or no value.
        try {
            var role = req.role;
            var studentId = (req.body.studentId === undefined || req.body.studentId === null || req.body.studentId === "") ? null : req.body.studentId;
            var confirmSignature = req.body.confirmSignature; 
            if(req.username && req.userId) {
                if(role){
                    if(confirmSignature === true) {
                        const changeStepRegistrationBachelorThesisQuery = "Update registrations_for_bachelor_thesis SET step = ? where student_id = ?";
                        const changeStepRegistrationBachelorThesisQueryParams = [3, studentId];
                        const changeStepRegistrationBachelorThesisResults = await executeQuery(res, changeStepRegistrationBachelorThesisQuery, changeStepRegistrationBachelorThesisQueryParams);

                        const getThesisIdByStudentIdQuery = " call getThesisIdByStudentId(?)";
                        const getThesisIdByStudentIdQueryParams = [studentId];
                        const getThesisIdByStudentIdResults = await executeQuery(res, getThesisIdByStudentIdQuery, getThesisIdByStudentIdQueryParams);
                        const thesisId = getThesisIdByStudentIdResults[0][0].thesis_id;
                        console.log(thesisId);
                        
                        const changeStep3InThesesQuery = " call updateStep3OnThesesByThesisId(?)";
                        const changeStep3InThesesQueryParams = [thesisId];
                        const changeStep3InThesesResults = await executeQuery(res, changeStep3InThesesQuery, changeStep3InThesesQueryParams);

                        //final results
                        res.send(changeStep3InThesesResults);
                    }
                    else if (confirmSignature === false){
                        // do something here 

                    }
                    else {
                        res.send("invalid confirmSignature")
                    }
                }
                else res.status(405).send("You are not allowed to access, You are not lecturer2")
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
module.exports = lecturer2_signIn_router;
