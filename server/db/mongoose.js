const mongoose = require('mongoose');

var promise = mongoose.connect('mongodb://localhost:27017/TodoApp1', {
    useMongoClient: true
});
promise.then(function (db) {});

module.exports = { mongoose };