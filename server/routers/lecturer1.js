const express = require('express');
const lecturer1_router = express.Router();
const db = require('./../db/connectDB')
const lecturer1_get_router = require('./lecturer1/lecturer1_get');
const lecturer1_add_router = require('./lecturer1/lecturer1_add');
const lecturer1_confirm_router = require('./lecturer1/lecturer1_confirm');
const lecturer1_signIn_router = require('./lecturer1/lecturer1_signIn');
const lecturer1_update_router = require('./lecturer1/lecturer1_update');
lecturer1_router.use('/get', lecturer1_get_router);
lecturer1_router.use('/add', lecturer1_add_router);
lecturer1_router.use('/update', lecturer1_update_router)
lecturer1_router.use('/confirm', lecturer1_confirm_router);
lecturer1_router.use('/signIn', lecturer1_signIn_router);
module.exports = lecturer1_router;