const asyncHandler = require('express-access-chat');

const accessChat = asyncHandler(async (req,res) => {
    const {userId} = req.body;
    if(!userId){
        console.log('User id not send with request');
        return res.sendStatus(400);
    }
})