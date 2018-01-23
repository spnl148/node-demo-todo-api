const { ObjectID } = require('mongodb');
const { Todo } = require('./../../models/todos');
const { User } = require('./../../models/users');
const jwt = require('jsonwebtoken');

var userOneId = new ObjectID();
var userTwoId = new ObjectID();
var Data = [
    { _id: new ObjectID(), text: "First test todo", _creator: userOneId },
    { _id: new ObjectID(), text: "Second test todo", _creator: userTwoId, completed: true, completedAt: 123 }
];

const users = [
    {
        _id: userOneId,
        email: 's1@gmail.com',
        password: 'abc111',
        tokens: [{
            access: 'auth',
            token: jwt.sign({ _id: userOneId, access: 'auth' }, process.env.JWT_SECRET).toString()
        }]
    }, {
        _id: userTwoId,
        email: 's2@gmail.com',
        password: 'abc222',
        tokens: [{
            access: 'auth',
            token: jwt.sign({ _id: userTwoId, access: 'auth' }, process.env.JWT_SECRET).toString()
        }]
    }
];


var populateData = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(Data);
    }).then(() => done())
};

var populateUsers = (done) => {
    User.remove({}).then(() => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();
        return Promise.all([userOne, userTwo]);
    }).then(() => done());
};

module.exports = { Data, populateData, users, populateUsers };