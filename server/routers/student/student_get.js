const express = require('express');
const student_get_router = express.Router();
const readStudentMiddleware = require('../../middleware/readStudentMiddleware');
const db = require('../../db/connectDB');
const verifyTokenStudent = require('../../middleware/verifyTokenStudent');
const { request } = require('express');

student_get_router.post('/lecturers', verifyTokenStudent, async (req, res) =>{
    // because of unique id value, so this api just returns 1 or no value.
        try {
            var chunkForPage = 5;
            var lecturerId  = (req.body.lecturerId === null || req.body.lecturerId === undefined || req.body.lecturerId === "") ?  '%' : ('%' + req.body.lecturerId +'%');
            var lecturerTitle = (req.body.lecturerTitle === "" || req.body.lecturerTitle === undefined || req.body.lecturerTitle === "") ?  '%' : req.body.lecturerTitle;
            var lecturerFullName = (req.body.lecturerFullName === "" || req.body.lecturerFullName === undefined || req.body.lecturerFullName === null)  ?  '%' : req.body.lecturerFullName;
            var email = (req.body.email === "" || req.body.email === undefined || req.body.email === null) ? '%' : ('%' + req.body.email + '%');
            var supervisor = (req.body.supervisor === "" || req.body.supervisor === undefined || req.body.supervisor === null) ? '%' : ('%' + req.body.supervisor +  '%')
            var isAvailable = (req.body.isAvailable === "" || req.body.isAvailable === undefined || req.body.isAvailable === null || req.body.isAvailable === true) ? req.body.isAvailable : false ;
            var page = (req.body.page === "" || req.body.page === undefined) ?  1 : req.body.page;
            console.log(isAvailable);
            var role = req.role;
            if(req.username && req.userId) {
                if(role){
                    var results;
                    console.log(isAvailable);
                    if(isAvailable === true) {
                        console.log(isAvailable);
                        var query = "SELECT * FROM lecturers WHERE lecturer_id LIKE ? AND fullname LIKE ? AND title LIKE ?  AND email LIKE ? AND supervisor LIKE ? AND number_of_theses < maximum_of_theses"
                        var queryParams = [lecturerId, lecturerTitle, lecturerFullName, email, supervisor]
                        results =  await executeQuery(res, query, queryParams);
                        console.log(results);
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
                    else if (isAvailable === false) {
                        console.log(isAvailable);
                        var query = "SELECT * FROM lecturers WHERE lecturer_id LIKE ? AND fullname LIKE ? AND title LIKE ?  AND email LIKE ? AND supervisor LIKE ? AND number_of_theses = maximum_of_theses"
                        var queryParams = [lecturerId, lecturerTitle, lecturerFullName, email, supervisor]
                        results = await executeQuery(res, query, queryParams);
                        console.log(results);
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
                    else {res.sendStatus(404).send("Unavailable value")}
                }
                else res.status(405).send("You are not allowed to access, You are not student")
            }
            else res.status(404).send("No user with that username");    
        } catch (error) {
            console.log(error.message);
            res.status(404).send("You got an error" + error.message);
        }
        
    })
student_get_router.get('/lecturer/:id', verifyTokenStudent, async (req, res) =>{
    // because of unique id value, so this api just returns 1 or no value.
        try {
            var lecturerId;
            var role = req.role;
            if(req.username && req.userId) {
                if(role){
                    if(req.params.id === undefined || req.params.id === ""){
                        res.status(404).send("Invalid username with that id")
                    } else if(!(req.params.id)){
                        res.status(404).send("Need a number Parameter Id");
                    } else {
                        lecturerId = req.params.id;
                        const query = "CALL getLecturer1(?)";
                        const queryParams = [lecturerId];
                        const results = await executeQuery(res, query, queryParams);
                        results.pop();
                        res.send(results[0]);
                    }               
                }
                else res.status(405).send("You are not allowed to access, You are not student")
            }
            else res.status(404).send("No user with that username");    
        } catch (error) {
            console.log(error.message);
            res.status(404).send("You got an error" + error.message);
        }
        
    })
student_get_router.get('/theses', verifyTokenStudent, async (req, res) =>{
    // because of unique id value, so this api just returns 1 or no value.
        try {
            var studentId;
            var role = req.role;
            if(req.username && req.userId) {
                if(role){
                    if(req.userId === undefined || req.userId === ""){
                        res.status(404).send("Invalid username with that id")
                    } else if(!(req.userId) === "number"){
                        res.status(404).send("Need a number Parameter Id");
                    } else {
                        studentId = req.userId;
                        const query = "CALL getThesesFromStudent()";
                        const results = await executeQuery(res, query);
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
                        results.pop();
                        res.send({"list": results[0], registrationBachelorThesisResults, registrationOralDefenseResults, assessmentBachelorThesisResults, assessmentOralDefenseResults});
                    }               
                }
                else res.status(405).send("You are not allowed to access, You are not student")
            }
            else res.status(404).send("No user with that username");    
        } catch (error) {
            console.log(error.message);
            res.status(404).send("You got an error" + error.message);
        }
        
    })

student_get_router.get('/thesis', verifyTokenStudent, async (req, res) =>{
    // because of unique id value, so this api just returns 1 or no value.
        try {
            var studentId;
            var role = req.role;
            if(req.username && req.userId) {
                if(role){
                    if(req.userId === undefined || req.userId === ""){
                        res.status(404).send("Invalid username with that id")
                    } else if(!(req.userId) === "number"){
                        res.status(404).send("Need a number Parameter Id");
                    } else {
                        studentId = req.userId;
                        const query = "CALL getThesisFromStudentId(?)";
                        const queryParams = [studentId];
                        const results = await executeQuery(res, query, queryParams);
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
                        results.pop();
                        results[0]['student_id'] = studentId;
                        res.send({"list": results[0], registrationBachelorThesisResults, registrationOralDefenseResults, assessmentBachelorThesisResults, assessmentOralDefenseResults});
                    }               
                }
                else res.status(405).send("You are not allowed to access, You are not student")
            }
            else res.status(404).send("No user with that username");    
        } catch (error) {
            console.log(error.message);
            res.status(404).send("You got an error" + error.message);
        }
        
    })
student_get_router.get('/account', verifyTokenStudent, async (req, res) =>{
    // because of unique id value, so this api just returns 1 or no value.
        try {
            var studentId;
            var role = req.role;
            if(req.username && req.userId) {
                if(role){
                    if(req.userId === undefined || req.userId === ""){
                        res.status(404).send("Invalid username with that id")
                    } else if(!(req.userId) === "number"){
                        res.status(404).send("Need a number Parameter Id");
                    } else {
                        studentId = req.userId;
                        const query = "call getAccountByStudentId(?)";
                        const queryParams = [studentId];
                        const results = await executeQuery(res, query, queryParams);
                        res.send(results[0]);
                    }               
                }
                else res.status(405).send("You are not allowed to access, You are not student")
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
