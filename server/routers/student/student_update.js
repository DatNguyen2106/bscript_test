const express = require('express');
const student_update_router = express.Router();
const db = require('../../db/connectDB');
const verifyTokenStudent = require('../../middleware/verifyTokenStudent');
student_update_router.put('/registrationBachelorThesis', verifyTokenStudent, async (req, res) =>{
    try {
        var role = req.role;
        var studentId;
        var surName = (req.body.surName === "" || req.body.surName === undefined) ?  null : req.body.surName;    
        var foreName = (req.body.foreName === "" || req.body.foreName === undefined) ? null : req.body.foreName;
        var dateOfBirth = (req.body.dateOfBirth === "" || req.body.dateOfBirth === undefined) ?  null : req.body.dateOfBirth;
        var placeOfBirth = (req.body.placeOfBirth === "" || req.body.placeOfBirth === undefined) ?  null : req.body.placeOfBirth;
        var signature = (req.body.signature === "" || req.body.signature === undefined) ? null : req.body.signature;
        var titleBachelorThesis = (req.body.titleBachelorThesis === "" || req.body.titleBachelorThesis === undefined) ?  null : req.body.titleBachelorThesis;
        var thesisType = (req.body.thesisType === "" || req.body.thesisType === undefined) ?  null : req.body.thesisType;
        var furtherParticipants = (req.body.furtherParticipants === "" || req.body.furtherParticipants === undefined) ?  null : req.body.furtherParticipants;
        var supervisor1_title = (req.body.supervisor1_title === "" || req.body.supervisor1_title === undefined) ?  null : req.body.supervisor1_title;
        var supervisor1_signature = (req.body.supervisor1_signature === "" || req.body.supervisor1_signature === undefined) ?  null : req.body.signature;
        var supervisor1_date = (req.body.supervisor1_date === "" || req.body.supervisor1_date === undefined) ?  null : req.body.supervisor1_date;
        var supervisor2_title = (req.body.supervisor2_title === "" ||req.body.supervisor2_title === undefined) ?  null : req.body.supervisor2_title;
        var supervisor2_signature = (req.body.supervisor2_signature === "" || req.body.supervisor2_signature === undefined) ?  null : req.body.supervisor2_signature;
        var supervisor2_date = (req.body.supervisor2_date === "" || req.body.supervisor2_date === undefined) ?  null : req.body.supervisor2_date;
        var issued = (req.body.issued === "" || req.body.issued === undefined) ?  null : req.body.issued;
        var deadlineCopy = (req.body.deadlineCopy === "" || req.body.deadlineCopy === undefined) ?  null : req.body.deadlineCopy;
        var extensionGranted = (req.body.extensionGranted === "" || req.body.extensionGranted === undefined) ?  null : req.body.extensionGranted;
        var chairmanOfExamination = (req.body.chairmanOfExamination === "" || req.body.chairmanOfExamination === undefined) ?  null : req.body.chairmanOfExamination;
        var dateOfIssue = (req.body.dateOfIssue === "" || req.body.dateOfIssue === undefined) ?  null : req.body.dateOfIssue;
        if(req.username && req.userId) {
            if(role){
                // if(req.body.matriculationNumber === undefined  || req.body.matriculationNumber === ''){
                //     res.status(500).send("Undefined matriculation number for add");
                // } else if (typeof(req.body.matriculationNumber) != 'number'){
                //     res.status(500).send("Invalid Type for matriculation number, need a number")
                // }
                // else {
                //     matriculationNumber = req.body.matriculationNumber;
                if(req.userId === undefined || req.userId === ''){
                    res.status(500).send("Undefined id for update")
                }
                else {
                studentId = req.userId;
                const query = "UPDATE registrations_for_bachelor_thesis SET surname = ?, forename = ?, date_of_birth = ?, place_of_birth = ?, signature = ?, title_bachelor_thesis = ?, thesis_type = ?, further_participants = ?, supervisor1_title = ?, supervisor1_signature = ?, supervisor1_date = ?, supervisor2_title = ?, supervisor2_signature = ?, supervisor2_date = ?, issued = ?, deadline_copy = ?, extension_granted = ?, chairman_of_examination = ?, date_of_issue = ?, step = ? where student_id = ?";
                const queryParams = [surName, foreName, dateOfBirth, placeOfBirth, signature, titleBachelorThesis, thesisType, furtherParticipants, supervisor1_title, supervisor1_signature, supervisor1_date, supervisor2_title, supervisor2_signature, supervisor2_date, issued, deadlineCopy, extensionGranted, chairmanOfExamination, dateOfIssue, 1, studentId]
                const dbResults = await executeQuery(res, query, queryParams);
                res.send(dbResults);  
                }
                // }
            }
            else res.status(405).send("You are not allowed to access, You are not student")
        }
        else res.status(404).send("No user with that username");

    } catch (error) {
            console.log(error.message);
            res.status(404).send("You got an error " + error.message);
        }
        
    })
student_update_router.put('/registrationOralDefense', verifyTokenStudent, async (req, res) =>{
    try {
        var role = req.role;
        var studentId;
        var surName = (req.body.surName === "" || req.body.surName === undefined) ?  null : req.body.surName;    
        var foreName = (req.body.foreName === "" || req.body.foreName === undefined) ? null : req.body.foreName;
        var supervisor1_title = (req.body.supervisor1_title === "" || req.body.supervisor1_title === undefined) ?  null : req.body.supervisor1_title;
        var supervisor2_title = (req.body.supervisor2_title === "" || req.body.supervisor2_title === undefined) ?  null : req.body.supervisor2_title;
        var spectatorsPresent = (req.body.spectatorsPresent === "" || req.body.spectatorsPresent === undefined) ?  null : req.body.spectatorsPresent;
        var weekDate = (req.body.weekDate === "" || req.body.weekDate === undefined) ?  null : req.body.weekDate;
        var proposedDate = (req.body.proposedDate === "" || req.body.proposedDate === undefined) ?  null : req.body.proposedDate;
        var proposedTime = (req.body.proposedTime === "" || req.body.proposedTime === undefined) ?  null : req.body.proposedTime;
        var room = (req.body.room === "" || req.body.room === undefined) ?  null : req.body.room;
        var concernedAgreed = (req.body.concernedAgreed === "" || req.body.concernedAgreed === undefined) ?  null : req.body.concernedAgreed;
        var dateReceive = (req.body.dateReceive === "" || req.body.dateReceive === undefined) ?  null : req.body.dateReceive;
        var dateSubmission = (req.body.dateSubmission === "" || req.body.dateSubmission === undefined) ?  null : req.body.dateSubmission;
        if(req.username) {
            if(role){
                if(req.userId === undefined || req.userId === ''){
                    res.status(500).send("Undefined id for add")
                }
                else {
                studentId = req.userId;
                const query = "UPDATE registrations_for_oral_defense SET surname = ?, forename = ?, supervisor1_title = ?, supervisor2_title = ?, spectators_present = ?, weekdate = ?, proposed_date = ?, proposed_time = ?, room = ?, concerned_agreed = ?, date_receive = ?, date_submission = ?, step = ? where student_id = ?";
                const queryParams = [surName, foreName, supervisor1_title, supervisor2_title, spectatorsPresent, weekDate, proposedDate, proposedTime, room, concernedAgreed, dateReceive, dateSubmission, 1, studentId]
                const dbResults = await executeQuery(res, query, queryParams);
                res.send(dbResults);  
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
student_update_router.put('/confirmSup2', verifyTokenStudent, async (req, res) =>{
    try {
        var role = req.role;
        var lecturer2_id = (req.body.lecturer2_id === null || req.body.lecturer2_id === undefined) ? null : req.body.lecturer2_id;
        if(req.username) {
            if(role){
                if(req.userId === undefined || req.userId === ''){
                    res.status(500).send("Undefined id for add")
                }
                else {
                studentId = req.userId;
                var thesisId;
                const getThesisByStudentIdQuery = "call getThesisByStudentId(?)"
                const getThesisByStudentIdQueryParams = [studentId];
                const thesisResults = await executeQuery(res, getThesisByStudentIdQuery, getThesisByStudentIdQueryParams);
                console.log(thesisResults[0][0].thesis_id);
                thesisId = thesisResults[0][0].thesis_id;
                console.log(thesisId);
                const query = "call addLecturer2ByStudent(?,?)";
                const queryParams = [lecturer2_id, thesisId];
                console.log(lecturer2_id)
                const results = await executeQuery(res, query,queryParams);
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
module.exports = student_update_router;