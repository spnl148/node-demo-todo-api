
const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

var data = {
    'name' :'SPnL'
};

var token = jwt.sign(data,'mine');
console.log(token);

var decoded = jwt.verify(token,'mine');
console.log('Decoded',decoded)
// var data = 'Testing'
// var HashData = SHA256(data).toString();

// console.log('Message:',data);
// console.log('Hash:',HashData);


// var data = {
//     id : 4
// }
// console.log(JSON.stringify(data)+"test");
// console.log(JSON.stringify(data)+"test");