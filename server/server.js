require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

const { ObjectID } = require('mongodb');
var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/todos');
var { User } = require('./models/users');


var app = express();
const port = process.env.PORT || 2300;

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
    if (!ObjectID.isValid(id)) {
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

app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);
    if (!ObjectID.isValid(id))
        return res.status(404).send();

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    }
    else {
        body.completedAt = null;
        body.completed = false;
    }

    Todo.findByIdAndUpdate(id, { $set: body }, { new: true }).then((todo) => {
        if (!todo)
            return res.status(404).send();

        res.send({ todo });
    }).catch((e) => {
        res.status(400).send();
    });

});

app.post('/users',(req,res) => {
    var body = _.pick(req.body,['email','password']);
    var user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth',token).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    });
});



app.listen(port, () => {
    console.log(`Started on localhost:${port}`);
});

module.exports = { app };   