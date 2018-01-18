const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

const { ObjectID } = require('mongodb');
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
    Todo.findById({ _id: id }).then((todos) => {
        if (!todos)
            return res.status(404).send();
        else res.send({ todos });
    }).catch((e) => {
        res.status(400).send();
    })
});

app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)){
        return res.status(404).send("Invalid ID");
    }
    Todo.findByIdAndRemove(id).then((todo) => {
        if (!todo)
            return res.status(404).send()
        res.send(todo);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.patch('/todos/:id',(req,res) => {
    var id = req.params.id;
    var body = _.pick(req.body,['text','completed']);
    if(!ObjectID.isValid(id))
        return res.status(404).send('Invalid ID');

    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime();
    }
    else{
        body.completedAt = null;
        body.completed = false;
    }

    Todo.findByIdAndUpdate(id,{$set:body},{new:true}).then((todo) => {
        if(!todo)
            return res.status(404).send('Record not found');
        
        res.send({todo});
    }).catch((e) => {
        res.status(400).send();
    });

});

app.listen(2300, () => {
    console.log('Started on localhost:2300');
});

module.exports = { app };