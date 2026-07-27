
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    username: {
        type: String,
        require: true,
        unique: true
    },

    email:{
        type: true,
        require: true,
        unique: true
    },

    password: {
        type: String,
        require: true
    },

    role:{
        type: String,
        enum: ['user', 'artist'],
        default: 'user'
    }
})

module.exports = mongoose.model('User', userSchema);