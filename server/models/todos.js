const mongoose = require('mongoose');
const validator = require('validator');

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
        type: Number,
        default: null
    }
});


module.exports = { Todo };