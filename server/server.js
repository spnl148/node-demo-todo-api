var express = require('express');
var bodyParser = require('body-parser');

var { ObjectID } = require('mongodb');
var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/todos');
var { User } = require('./models/users');

var app = express();

app.use(bodyParser.json());
app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((docs) => {
        res.send(docs);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({ todos });
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos/:id', (req, res) => {
    var id = req.params.id;
    
    if (!ObjectID.isValid(id)) {
        return res.status(404).send("Invalid ID");
    }
    Todo.find({_id:id}).then((todos) => {
        if(todos.length === 0)
            res.status(404).send();
        else res.send(todos);
    }).catch((e)=>{
        res.status(400).send();
    })
});
app.listen(2200, () => {
    console.log('Started on port 2200');
});

module.exports = { app };