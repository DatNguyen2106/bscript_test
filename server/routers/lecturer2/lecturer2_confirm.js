const express = require('express');
const lecturer2_confirm_router = express.Router();
const db = require('../../db/connectDB');
const verifyTokenLecturer2 = require('../../middleware/verifyTokenLecturer2');
lecturer2_confirm_router.post('/confirmThesis', verifyTokenLecturer2, async (req, res) =>{
    // because of unique id value, so this api just returns 1 or no value.
        try {
            var role = req.role;
            var thesisId = (req.body.thesisId === undefined || req.body.thesisId === "" || req.body.thesisId === null) ?  null : req.body.thesisId;
            console.log("before " + req.body.confirmThesis)
            var confirmThesis = (req.body.confirmThesis === undefined || req.body.confirmThesis === null || req.body.confirmThesis === "") ? false : req.body.confirmThesis;
            if(req.username && req.userId) {
                if(role){
                    const query = "UPDATE lecturers_theses SET confirm_sup2 = ? where thesis_id = ?";
                    var queryParams;
                    if(confirmThesis === true) {
                        queryParams = [true, thesisId];
                        const results = await executeQuery(res, query, queryParams);
                        const changeStepQuery = "UPDATE theses SET step = ? where thesis_id = ?";
                        const changeStepQueryParams = [2, thesisId];
                        const changeStepResult = await executeQuery(res, changeStepQuery, changeStepQueryParams);
                        res.send(changeStepResult);
                    }
                    else if (confirmThesis === false){
                        queryParams = [false, thesisId];
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
module.exports = lecturer2_confirm_router;
