const { ObjectID } = require('mongodb');
const { Todo } = require('./../../models/todos');
const { User } = require('./../../models/users');
const jwt = require('jsonwebtoken');

var Data = [
    { _id: new ObjectID(), text: "First test todo" },
    { _id: new ObjectID(), text: "Second test todo", completed: true, completedAt: 123 }
];

var userOneId = new ObjectID();
var userTwoId = new ObjectID();
const users = [
    {
        _id: userOneId,
        email: 's1@gmail.com',
        password: 'abc111',
        tokens: [{
            access: 'auth',
            token: jwt.sign({ _id: userOneId, access: 'auth' }, 'mine').toString()
        }]
    }, {
        _id: userTwoId,
        email: 's2@gmail.com',
        password: 'abc222'
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