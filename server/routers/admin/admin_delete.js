const express = require('express');
const admin_delete_router = express.Router();
const verifyTokenAdmin = require('../../middleware/verifyTokenAdmin');
const db = require('../../db/connectDB');
// api for delete by id
admin_delete_router.delete('/lecturer/:id', verifyTokenAdmin, async (req, res) =>{
    // because of unique id value, so this api just returns 1 or no value.
        var id;
        var role = req.role;
        console.log(req.params.id);
        console.log(typeof(req.params.id));
        if(req.username) {
            if(role){
                if(req.params.id === undefined  || req.params.id === ''){
                    res.status(404).send("Undefined id for delete");
                } 
                else {
                    id = req.params.id;
                    console.log(id);
                    var deleteQuery = "DELETE FROM lecturers where lecturer_id = ?";
                    const results = await new Promise((resolve) => {
                        db.query(deleteQuery, [id], (err, result) => {
                            if(err) {res.status(500).send(err.message);}
                            else
                            {  resolve(JSON.parse(JSON.stringify(result)))}
                        })
                        })
                    res.send(results);
                }
            }
            else res.status(405).send("You are not allowed to access, You are not admin")
        }
        else res.status(404).send("No user with that username");
    })
admin_delete_router.delete('/lecturer', (req, res) => {
    res.send("Default routes for admin/lecturer");
})

admin_delete_router.delete('/student/:id', verifyTokenAdmin, async (req, res) =>{
    // because of unique id value, so this api just returns 1 or no value.
        var id;
        var role = req.role;
        console.log(req.params.id);
        console.log(typeof(req.params.id));
        if(req.username) {
            if(role){
                if(req.params.id === undefined  || req.params.id === ''){
                    res.status(404).send("Undefined id for delete");
                } 
                else {
                    id = req.params.id;
                    console.log(id);
                    var deleteQuery = "DELETE FROM students where student_id = ?";
                    const results = await new Promise((resolve) => {
                        db.query(deleteQuery, [id], (err, result) => {
                            if(err) {res.status(500).send(err.message);}
                            else
                            {  resolve(JSON.parse(JSON.stringify(result)))}
                        })
                        })
                    res.send(results);
                }
            }
            else res.status(405).send("You are not allowed to access, You are not admin")
        }
        else res.status(404).send("No user with that username");
    })
admin_delete_router.delete('/student', (req, res) => {
    res.send("Default routes for admin/student");
})

// Exports cho admin_delete_router
module.exports = admin_delete_router;