var mongoose = require('mongoose');

var User = mongoose.connect('User', {
    email: {
        type: String
    }
});

module.exports = { User };