
const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


var password = 'abc123'
// bcrypt.genSalt(10,(err,salt)=>{
//     bcrypt.hash(password,salt, (err,hash) =>{
//         console.log(hash);
//     });
// });

bcrypt.compare(password,'$2a$10$Rjbds51bqlgwf2IZZy1sxO4h1yMxkUBzLVX1toEcXqRC1gd4mcX16',(e,h) =>{
    console.log(h)
})

// var data = {
//     'name' :'SPnL'
// };

// var token = jwt.sign(data,'mine');
// console.log(token);

// var decoded = jwt.verify(token,'mine');
// console.log('Decoded',decoded)
// var data = 'Testing'
// var HashData = SHA256(data).toString();

// console.log('Message:',data);
// console.log('Hash:',HashData);


// var data = {
//     id : 4
// }
// console.log(JSON.stringify(data)+"test");
// console.log(JSON.stringify(data)+"test");