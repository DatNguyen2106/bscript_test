const { request } = require('express');
const express = require('express');
const lecturer1_get_router = express.Router();
const db = require('../../db/connectDB');
const getThesesLecturer1 = require('../../middleware/getThesesLecturer1');
const verifyTokenLecturer1 = require('../../middleware/verifyTokenLecturer1');
const moment = require('moment');
lecturer1_get_router.post('/theses', getThesesLecturer1, async (req, res) =>{
    // because of unique id value, so this api just returns 1 or no value.
        try {
            var role = req.role;
            var chunkForPage = 5;
            var thesisTopic = (req.body.thesisTopic === undefined || req.body.thesisTopic === null || req.body.thesisTopic === "") ? '%' : ('%' + req.body.thesisTopic + '%');
            var thesisField = (req.body.thesisField === undefined || req.body.thesisField === null || req.body.thesisField === "") ? '%' : ('%' + req.body.thesisTopic + '%');
            var lecturer2Id = (req.body.lecturer2Id === undefined || req.body.lecturer2Id === null || req.body.lecturer2Id === "") ? null : ('%' + req.body.lecturer2Id + '%');
            var step = (req.body.step === undefined || req.body.step === null || req.body.step == "") ? '%' : ('%' + req.body.step + '%');
            var slot = (req.body.slot === undefined || req.body.slot === null || req.body.slot == "") ? '%' : ('%' + req.body.slot + '%');
            var slotMaximum = (req.body.slotMaximum === undefined || req.body.slotMaximum === null || req.body.slotMaximum == "") ? '%' : ('%' + req.body.slotMaximum + '%');
            var wasDefended = (req.body.wasDefended === undefined || req.body.wasDefended === null || typeof(req.body.wasDefended) != 'boolean') ? false : req.body.wasDefended;
            var page = (req.body.page === "" || req.body.page === undefined) ?  1 : req.body.page;
            console.log(wasDefended)
            if(req.username && req.userId) {
                if(role){
                    console.log("thesisTopic" + thesisTopic);
                    console.log("thesisField" +thesisField);
                    console.log("lecturer1ID"+ lecturer2Id);
                    console.log("step" +step);
                    console.log("slot" +slot);
                    console.log("slotMaximum" +slotMaximum);
                    const query = "call getThesesByLecturer1(?,?,?,?,?,?,?,?);"
                    const queryParams = [thesisTopic, thesisField, lecturer2Id, step, slot, slotMaximum, req.userId, wasDefended];
                    const results = await executeQuery(res, query, queryParams);
                    console.log("results" + results)
                    if(page > results[0].chunk(chunkForPage).length){
                        res.send({
                            "totalPage" : results[0].chunk(chunkForPage).length,
                            "lecturer_id" : req.userId,
                            "list" : []
                        })
                    }
                    else {res.send({
                        "totalPage" : results[0].chunk(chunkForPage).length,
                        "lecturer_id" : req.userId,
                        "list" : results[0].chunk(chunkForPage)[page-1]
                    })}
                }
                else res.status(405).send("You are not allowed to access, You are not lecturer1")
            }
            else res.status(404).send("No user with that username");    
        } catch (error) {
            console.log(error.message);
            res.status(404).send("You got an error" + error.message);
        }
        
    })
lecturer1_get_router.get('/thesis/:id', verifyTokenLecturer1, async (req, res) =>{
    // because of unique id value, so this api just returns 1 or no value.
        try {
            var role = req.role;
            var thesisId;
            if(req.username && req.userId) {
                if(role){
                    if(req.params.id === undefined || req.params.id === ""){
                        res.status(404).send("Invalid username with that id")
                    } else {
                    thesisId = req.params.id;
                    var studentId;
                    const query = "call getThesesByThesisId(?);"
                    const queryParams = [thesisId];
                    const results = await executeQuery(res, query, queryParams);
                    console.log(results[0].length);
                    for(var i = 0; i < results[0].length; i++){
                        studentId  = results[0][i].student_id;
                        const registrationBachelorThesisQuery = "SELECT * FROM registrations_for_bachelor_thesis WHERE student_id  = ?";
                        const queryParamsRegistrationBachelorThesis = [studentId]
                        const registrationBachelorThesisResults = await executeQuery(res, registrationBachelorThesisQuery,  queryParamsRegistrationBachelorThesis);
                     
                        const assessmentBachelorThesisQuery = "SELECT * FROM assessment_for_bachelor_thesis WHERE student_id  = ?";
                        const queryParamsAssessmentBachelorThesisQuery = [studentId];
                        const assessmentBachelorThesisResults = await executeQuery(res, assessmentBachelorThesisQuery, queryParamsAssessmentBachelorThesisQuery);

                        const registrationOralDefenseQuery = "SELECT * FROM registrations_for_oral_defense WHERE student_id  = ?";
                        const queryParamsRegistrationOralDefense = [studentId]
                        const registrationOralDefenseResults = await executeQuery(res, registrationOralDefenseQuery,  queryParamsRegistrationOralDefense);  
                     
                     
                        const assessmentOralDefenseQuery = "SELECT * FROM assessment_for_oral_defense WHERE student_id  = ?";
                        const queryParamsAssessmentOralDefense = [studentId]
                        const assessmentOralDefenseResults = await executeQuery(res, assessmentOralDefenseQuery,  queryParamsAssessmentOralDefense);  

                        results[0][i]['registrationBachelorThesis'] = registrationBachelorThesisResults;
                        results[0][i]['registrationOralDefenseResults'] = registrationOralDefenseResults;
                        results[0][i]['assessmentBachelorThesisResults'] = assessmentBachelorThesisResults;
                        results[0][i]['assessmentOralDefenseResults'] = assessmentOralDefenseResults;
                      } 
                      console.log(results);
                      results.id = req.userId;
                      res.send({"lecturer_id" : results.id, "list" : results[0]});
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
lecturer1_get_router.get('/account', verifyTokenLecturer1, async (req, res) =>{
    // because of unique id value, so this api just returns 1 or no value.
            try {
                var role = req.role;
                var thesisId;
                if(req.username) {
                    if(role){
                        if(req.userId === undefined || req.userId === ""){
                            res.status(404).send("Invalid username with that id")
                        } else {
                        var lecturerId = req.userId;
                        const query = "call getAccountByLecturer(?);"
                        const queryParams = [lecturerId];
                        const results = await executeQuery(res, query, queryParams);
                        if(results){
                            res.send(results[0]);
                        }
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
module.exports = lecturer1_get_router;
