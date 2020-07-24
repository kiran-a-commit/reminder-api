const Task = require('../models/Task');
const express = require('express');
const helper = require('../misc/helpers');
const telegramService = require('../telegramService/telegram');
const router = express.Router();

router.post('/createTask', async (req, res) => {
    const getTaskBody = {
        ...req.body,
        reminder_time: helper.convertTo24TimeFormat(req.body.reminder_time)
    }
    const task = new Task(getTaskBody);

    try {
         await task.save()
         console.log(task)
         await telegramService.scheduler(String(task._id), task.reminder_time);
         res.status(201).send(task)
     }
 
     catch(e) {
          console.log(e)
         res.status(400).send(e)
     }
})

router.get('/tasks/:id', async (req, res) => {
    const getTasks = await Task.find({owner: req.params.id})
    res.status(200).send(getTasks);
})

module.exports = router;