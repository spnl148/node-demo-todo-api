var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todos');
var {User} = require('./models/users');

var app = express();

app.use(bodyParser.json());
app.post('/todos',(req,res) => {
    var todo = new Todo({
        text : req.body.text
    });

    todo.save().then((docs) => {
        res.send(docs);
    },(e)=>{
        res.status(400).send(e);
    });
});

app.listen(2200,() => {
    console.log('Started on port 2200');
});

module.exports = {app};