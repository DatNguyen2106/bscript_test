const express = require('express');
const admin_assign_router = express.Router();
const verifyTokenAdmin = require('../../middleware/verifyTokenAdmin');
const db = require('../../db/connectDB');

admin_assign_router.post('/lecturerToThesis', verifyTokenAdmin, async (req,res) => {
    var role = req.role;
    var lecturerId = (req.body.lecturerId === "" || req.body.lecturerId === undefined) ?  null : req.body.lecturerId;
    var thesisId = (req.body.thesisId === "" || req.body.thesisId === undefined) ?  null : req.body.thesisId;
    var lecturer2 = (req.body.lecturer2 === "" || req.body.lecturer2 === undefined) ?  null : req.body.lecturer2;

    if(req.username){
        if(role){
            query = "INSERT INTO lecturers_theses (lecturer_id, thesis_id,lecturer2) VALUES (?,?,?)";
            queryParams = [lecturerId, thesisId, lecturer2];
            const dbResults = await executeQuery(res, query, queryParams);
            console.log(dbResults);
        }
        else res.status(405).send("You are not allowed to access, You are not admin")}
     else res.status(404).send("No user with that username");
})

admin_assign_router.post('/studentToThesis', verifyTokenAdmin, async (req,res) => {
    var role = req.role;
    var studentId = (req.body.studentId === "" || req.body.studentId === undefined) ?  null : req.body.studentId;
    var thesisId = (req.body.thesisId === "" || req.body.thesisId === undefined) ?  null : req.body.thesisId;

    if(req.username){
        if(role){
            query = "INSERT INTO students_theses (student_id, thesis_id) VALUES (?,?)";
            queryParams = [studentId, thesisId];
            const dbResults = await executeQuery(res, query, queryParams);
            console.log(dbResults);
        }
        else res.status(405).send("You are not allowed to access, You are not admin")}
     else res.status(404).send("No user with that username");
})

admin_assign_router.delete('/studentToThesis/:id', verifyTokenAdmin, async (req,res) => {
    var role = req.role;
    var studentId = (req.params.id === "" || req.body.id === undefined) ?  null : req.body.id;

    if(req.username){
        if(role){
            query = "DELETE FROM students_theses WHERE student_id = ?";
            queryParams = [studentId];
            const dbResults = await executeQuery(res, query, queryParams);
            console.log(dbResults);
        }
        else res.status(405).send("You are not allowed to access, You are not admin")}
     else res.status(404).send("No user with that username");
    })
    
admin_assign_router.delete('/lecturerToThesis/:id', verifyTokenAdmin, async (req,res) => {
    var role = req.role;
    var lecturerId = (req.params.id === "" || req.params.id === undefined) ?  null : req.params.id;

    if(req.username){
        if(role){
            query = "DELETE FROM lecturers_theses WHERE lecturer_id = ?";
            queryParams = [lecturerId];
            const dbResults = await executeQuery(res, query, queryParams);
            console.log(dbResults);
        }
        else res.status(405).send("You are not allowed to access, You are not admin")}
        else res.status(404).send("No user with that username");
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
module.exports = admin_assign_router;
