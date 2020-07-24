const User = require('../models/User');
const express = require('express');
const router = express.Router();

router.get('/user', async (req, res) => {
     res.status(200).send("Success");
})

router.post('/createUser', async (req, res) => {
     req.header("Access-Control-Allow-Origin", "*")
    console.log("Came here")
    const userId = req.body.userId;
    console.log(req.body);
    const user = new User({userId: userId});
    await User.findOne({userId: userId}, async (error, isUserFound) => {
         if(isUserFound) {
              console.log("User already present. Just login")
         } else {
              const saveUser  = await user.save();
              res.status(200).send({success: saveUser});
         }
    })
})

module.exports = router;