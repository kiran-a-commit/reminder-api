const TelegramBot = require('node-telegram-bot-api');
const apiToken = process.env.TELEGRAM_API_TOKEN;
const User = require('../models/User');
const Task = require('../models/Task');

const schedule = require('node-schedule');

// Created instance of TelegramBot
const bot = new TelegramBot(apiToken, {
    polling: true
 });

 listeners = () => {
    // Listener (handler) for telegram's /getTasks event
bot.onText(/\/start/, (msg, match) => {
    const chatId = msg.chat.id;
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message
 
    bot.sendMessage(
        chatId,
        'Hello!',
    );
 });


// Listener (handler) for telegram's /getTasks event
bot.onText(/\myTasks/, async (msg, match) => {
    const chatId = msg.chat.id;
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message.
    var messageString = ""
    try {
         if(!User.find({userId: chatId})) {
              messageString = "Please register to use this service."
         } else {
              await Task.find({owner: chatId}).then((tasks) => {
                   for(let i=0; i< tasks.length; i++) {
                        messageString = messageString + '\n' + 
                        `${i + 1}.` + '\n' + 
                        "Description: " + tasks[i].reminder_description + '\n' + 
                        "Responsible: " + tasks[i].reminder_responsible + '\n' + 
                        "Frequency: " + tasks[i].reminder_frequency + '\n' +
                        "Time: " + tasks[i].reminder_time
                   }
              })
           
              bot.sendMessage(
                  chatId,
                  messageString,
              );
         }
    } catch(e) {
         console.log(e);
    }
 });  
 }

 scheduler = async (taskIdString, reminder_time) => {
     var jobId = taskIdString
     console.log("Job Id = ", jobId)
     const hrs = reminder_time.substr(0, reminder_time.indexOf(':'));
     console.log(hrs)
     const min = reminder_time.substr(reminder_time.indexOf(':') + 1, reminder_time.length)
     console.log(min)
    var rule = new schedule.RecurrenceRule();
            rule.dayOfWeek = [0, 1, 2, 3, 4, 5, 6];
            rule.hour = hrs;
            rule.minute = min;
            rule.tz = 'Asia/Kolkata';
            schedule.scheduleJob(jobId, rule, async function(){
                const task = await Task.findById(jobId);
                console.log("Task to schedule = ", task);
                console.log("Bot = ", bot)
                bot.sendMessage(task.owner, "1." + '\n' + "Description: " + task.reminder_description + '\n' + 
                "Responsible: " + task.reminder_responsible + '\n' + 
                "Frequency: " + task.reminder_frequency + 
                '\n' + 
                "Time: " + task.reminder_time)
            });
 }

 descheduler = async (taskIdString) => {
    await schedule.scheduledJobs[taskIdString].cancel()
 } 

 module.exports = {
     listeners,
     scheduler,
     descheduler
 }