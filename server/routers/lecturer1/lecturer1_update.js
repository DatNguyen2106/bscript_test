const express = require('express');
const lecturer1_update_router = express.Router();
const db = require('../../db/connectDB');
const verifyTokenLecturer1 = require('../../middleware/verifyTokenLecturer1');
const moment = require('moment');
lecturer1_update_router.put('/assessmentBachelor', verifyTokenLecturer1, async (req, res) =>{
    // because of unique id value, so this api just returns 1 or no value.
        try {
            var role = req.role;
            var studentId;
            var matriculationNumber = req.body.matriculationNumber;
            var surName = (req.body.surName === "" || req.body.surName === undefined) ?  null : req.body.surName;    
            var foreName = (req.body.foreName === "" || req.body.foreName === undefined) ? null : req.body.foreName;
            var thesisTitle = (req.body.thesisTitle === "" || req.body.thesisTitle === undefined) ? null : req.body.thesisTitle;
            var thesisType = (req.body.thesisType === "" || req.body.thesisType === undefined) ?  null : req.body.thesisType;
            var furtherParticipants = (req.body.furtherParticipants === "" || req.body.furtherParticipants === undefined) ?  null : req.body.furtherParticipants;
            var supervisor1_title = (req.body.supervisor1_title === "" || req.body.supervisor1_title === undefined) ?  null : req.body.supervisor1_title;
            var supervisor1_grade = (req.body.supervisor1_grade === "" || req.body.supervisor1_grade === undefined) ?  null : req.body.supervisor1_grade;
            var supervisor2_title = (req.body.supervisor2_title === "" ||req.body.supervisor2_title === undefined) ?  null : req.body.supervisor2_title;
            var supervisor2_grade = (req.body.supervisor2_grade === "" || req.body.supervisor2_grade === undefined) ?  null : req.body.supervisor2_grade;
            var assessmentThesis = (req.body.assessmentThesis === "" || req.body.assessmentThesis === undefined)  ?  null : req.body.assessmentThesis;
            var assessmentDate = (req.body.assessmentDate === "" || req.body.assessmentDate === undefined)  ?  null : req.body.assessmentDate;
            var supervisor1_signature = (req.body.supervisor1_signature === "" ||req.body.supervisor1_signature === undefined) ?  null : req.body.supervisor1_signature;
            var supervisor2_signature = (req.body.supervisor2_signature === "" || req.body.supervisor2_signature === undefined) ?  null : req.body.supervisor2_signature;

            if(req.username && req.userId) {
                if(role){                
                        studentId = req.body.studentId;
                        const getBeforeAssessmentBachelorThesisQuery = "SELECT * FROM assessment_for_bachelor_thesis where student_id = ?";
                        const getBeforeAssessmentBachelorThesisParams = [studentId];
                        const getBeforeAssessmentBachelorThesisResults = await executeQuery(res, getBeforeAssessmentBachelorThesisQuery, getBeforeAssessmentBachelorThesisParams);
                        console.log(studentId);
                        console.log(matriculationNumber);
                        if(getBeforeAssessmentBachelorThesisResults === null || getBeforeAssessmentBachelorThesisResults === undefined){
                            res.send("not found")
                        }
                        else if(getBeforeAssessmentBachelorThesisResults[0].step === 0) {
                            const updateAssessmentBachelorThesisQuery = "UPDATE assessment_for_bachelor_thesis SET matriculation_number = ?, surname = ?, forename = ?, thesis_title = ?, thesis_type = ?, further_participants = ?, supervisor1_title = ?, supervisor1_grade = ?, supervisor2_title = ?, supervisor2_grade = ?, assessment_thesis = ?, assessment_date = ?, supervisor1_signature = ?, supervisor2_signature = ?, step = ? WHERE student_id = ?"
                            const updateAssessmentBachelorThesisParams = [matriculationNumber, surName, foreName, thesisTitle, thesisType, furtherParticipants, supervisor1_title, supervisor1_grade, supervisor2_title, supervisor2_grade, assessmentThesis, assessmentDate, supervisor1_signature, supervisor2_signature, 1, studentId];
                            const updateAssessmentBachelorThesisResults = await executeQuery(res, updateAssessmentBachelorThesisQuery, updateAssessmentBachelorThesisParams);
                            console.log("step 1");
                            console.log(updateAssessmentBachelorThesisParams)
                        } else if(getBeforeAssessmentBachelorThesisResults[0].step === 2){
                            const updateAssessmentBachelorThesisQuery = "UPDATE assessment_for_bachelor_thesis SET matriculation_number = ?, surname = ?, forename = ?, thesis_type = ?, further_participants = ?, supervisor1_title = ?, supervisor1_grade = ?, supervisor2_title = ?, supervisor2_grade = ?, assessment_thesis = ?, assessment_date = ?, supervisor1_signature = ?, supervisor2_signature = ?, step = ? WHERE student_id = ?"
                            const updateAssessmentBachelorThesisParams = [matriculationNumber, surName, foreName, thesisType, furtherParticipants, supervisor1_title, supervisor1_grade, supervisor2_title, supervisor2_grade, assessmentThesis, assessmentDate, supervisor1_signature, supervisor2_signature, 3, studentId];
                            const updateAssessmentBachelorThesisResults = await executeQuery(res, updateAssessmentBachelorThesisQuery, updateAssessmentBachelorThesisParams);
                        }
                }
                else res.status(405).send("You are not allowed to access, You are not lecturer1.1")
            }
            else res.status(404).send("No user with that username");    
        } catch (error) {
            console.log(error.message);
            res.status(404).send("You got an error" + error.message);
        }
        
    })
lecturer1_update_router.put('/assessmentOralDefense', verifyTokenLecturer1, async (req, res) =>{
        // because of unique id value, so this api just returns 1 or no value.
            try {
                var role = req.role;
                var studentId;
                var matriculationNumber = req.body.matriculationNumber;
                var surName = (req.body.surName === "" || req.body.surName === undefined) ?  null : req.body.surName;    
                var foreName = (req.body.foreName === "" || req.body.foreName === undefined) ? null : req.body.foreName;
                var dateDefense = (req.body.dateDefense === "" || req.body.dateDefense === undefined) ? null : req.body.dateDefense;
                var placeDefense = (req.body.placeDefense === "" || req.body.placeDefense === undefined) ? null : req.body.placeDefense;
                var startDate = (req.body.startDate === "" || req.body.startDate === undefined) ? null : req.body.startDate;
                var finishDate = (req.body.finishDate === "" || req.body.finishDate === undefined) ? null : req.body.finishDate;
                var stateOfHealth = (req.body.stateOfHealth === "" || req.body.stateOfHealth === undefined) ? null : req.body.stateOfHealth;
                var supervisor1_title = (req.body.supervisor1_title === "" || req.body.supervisor1_title === undefined) ? null : req.body.supervisor1_title;
                var supervisor1_grade = (req.body.supervisor1_grade === "" || req.body.supervisor1_grade === undefined) ?  null : req.body.supervisor1_grade;
                var supervisor2_title = (req.body.supervisor2_title === "" || req.body.supervisor2_title === undefined) ? null : req.body.supervisor2_title;
                var supervisor2_grade = (req.body.supervisor2_grade === "" || req.body.supervisor2_grade === undefined) ? null : req.body.supervisor2_grade;
                var record = (req.body.record === "" || req.body.record === undefined) ? null : req.body.record;
                var assessmentDate = (req.body.assessmentDate === "" || req.body.assessmentDate === undefined) ? null : req.body.assessmentDate;
                var supervisor1_signature = (req.body.supervisor1_signature === "" || req.body.supervisor1_signature === undefined) ? null : req.body.supervisor1_signature;
                var supervisor2_signature = (req.body.supervisor2_signature === "" || req.body.supervisor2_signature === undefined) ? null : req.body.supervisor1_signature;
        
                if(req.username && req.userId) {
                    if(role){                
                            studentId = req.body.studentId;
                            const getBeforeAssessmentOralDefenseQuery = "SELECT * FROM assessment_for_oral_defense where student_id = ?";
                            const getBeforeAssessmentOralDefenseParams = [studentId];
                            const getBeforeAssessmentOralDefenseResults = await executeQuery(res, getBeforeAssessmentOralDefenseQuery, getBeforeAssessmentOralDefenseParams);
                            console.log(studentId);
                            if(getBeforeAssessmentOralDefenseResults === null || getBeforeAssessmentOralDefenseResults === undefined){
                                res.send("not found")
                            }
                            else if(getBeforeAssessmentOralDefenseResults[0].step === 0) {
                                const updateAssessmentOralDefenseQuery = "UPDATE assessment_for_oral_defense SET matriculation_number = ?, surname = ?, forename = ?, date_defense = ?, place_defense = ?, start_date = ?, finish_date = ?, state_of_health = ?, supervisor1_title = ?, supervisor1_grade = ?, supervisor2_title = ?, supervisor2_grade = ?, record = ?, assessment_date = ?, supervisor1_signature = ?, supervisor2_signature = ?, step = ? WHERE student_id = ?"
                                const updateAssessmentOralDefenseParams = [matriculationNumber, surName, foreName, dateDefense, placeDefense, startDate, finishDate, stateOfHealth, supervisor1_title, supervisor1_grade, supervisor2_title, supervisor2_grade, record, assessmentDate, supervisor1_signature, supervisor2_signature, 1, studentId];
                                const updateAssessmentOralDefenseResults = await executeQuery(res, updateAssessmentOralDefenseQuery, updateAssessmentOralDefenseParams);
                                console.log("step 1");
                                res.send(updateAssessmentOralDefenseResults);
                            } else if(getBeforeAssessmentOralDefenseResults[0].step === 2){
                                const updateAssessmentOralDefenseQuery = "UPDATE assessment_for_oral_defense SET matriculation_number = ?, surname = ?, forename = ?, date_defense = ?, place_defense = ?, start_date = ?, finish_date = ?, state_of_health = ?, supervisor1_title = ?, supervisor1_grade = ?, supervisor2_title = ?, supervisor2_grade = ?, record = ?, assessment_date = ?, supervisor1_signature = ?, supervisor2_signature = ?, step = ? WHERE student_id = ?"
                                const updateAssessmentOralDefenseParams = [matriculationNumber, surName, foreName, dateDefense, placeDefense, startDate, finishDate, stateOfHealth, supervisor1_title, supervisor1_grade, supervisor2_title, supervisor2_grade, record, assessmentDate, supervisor1_signature, supervisor2_signature, 3, studentId];
                                const updateAssessmentOralDefenseResults = await executeQuery(res, updateAssessmentOralDefenseQuery, updateAssessmentOralDefenseParams);
                                res.send(updateAssessmentOralDefenseResults);
                            }
    
                    }
                    else res.status(405).send("You are not allowed to access, You are not lecturer1.1")
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
module.exports = lecturer1_update_router;
