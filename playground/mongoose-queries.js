const { ObjectID } = require('mongodb');
const { mogoose } = require('./../server/db/mongoose');
const  AA  = require('./../server/models/todos');
const { User } = require('./../server/models/users');

var id = '5a5f110b4179c047cacac3fb';

if (ObjectID.isValid(id))
    console.log('Invalid id');

// Todo.find({
//     _id: id
// }).then((todos) => {
//     console.log('1.', todos);
// });

// Todo.findOne({
//     _id: id
// }).then((todo1) => {
//     console.log('2.', todo1);
// });

// Todo.findById(id).then((todo) => {
//     console.log('3.', todo);
// });

AA.User.find({}).then((res) => {
    console.log(res);
});