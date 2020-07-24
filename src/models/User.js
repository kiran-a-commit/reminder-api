const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    userId: {
        type: String,
        required: true
    }
})

UserSchema.virtual('tasks', {
    ref: 'Task',
    localField: 'userId',
    foreignField: 'owner',
    justOne: false // set true for one-to-one relationship
})

module.exports = mongoose.model('User', UserSchema);
