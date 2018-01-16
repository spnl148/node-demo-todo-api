const {MongoClient} = require('mongodb');

var Url = 'mongodb://localhost:27017';
var DBName = 'db_Todo';

MongoClient.connect(Url,(err,database) => {
    if(err) return console.log('Unable to connect MongoDB Server');
    console.log('Connected MongoDB Server');

    const db = database.db(DBName);

    db.collection('Users').find({name :'Neel'}).count().then((docs) => {
        console.log(docs);
    });
})