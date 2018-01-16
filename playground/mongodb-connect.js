const {MongoClient} = require('mongodb');

// MongoClient.connect('mongodb://localhost:27017', (err, database) => {
//     const context = database.db('db_Todo');
//     if (err)
//         return console.log('Unable to connect Monogo server');
//     console.log('Connected Mongo Server');

//     context.collection('Todos1').insertOne({
//         text: 'Something to do',
//         completed: false
//     }, (err, res) => {
//         if (err)
//             return console.log('Unable to insert todo', err);
//         console.log(JSON.stringify(res.ops, undefined, 2));
//     });


//     database.close();
// });

const DB_Uri = 'mongodb://localhost:27017';
const DB_Name = 'DB_Users';
MongoClient.connect(DB_Uri,(err,DataBase) => {
    const db = DataBase.db(DB_Name);
    if(err) return console.log(err);

    db.collection('Todos').insertOne({
        name : 'Swapnil' ,
        age : '25' , 
        location : 'India'
    },(err,res) => {
        if(err) return console.log('Unable to insert todo',err);

        console.log(JSON.stringify(res.ops,undefined,2));
    });

    DataBase.close();
});