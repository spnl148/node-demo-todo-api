var mongoose = require('mongoose');

var Todo = mongoose.model('todo', {
    text: {
        required: true,
        type: String,
        minlength: 1,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type : Number,
        default : null
    }
});

var User = mongoose.connect('users', {
    email: {
        type: String
    }
});

module.exports = {Todo,User};