const {MongoClient} = require('mongodb');

var url = 'mongodb://localhost:27017';
           
MongoClient.connect(url,(err,database) => {
    if(err) return console.log('Unable to connect MongoDB Server',err);
    console.log('Connected to MongoDB Server');
    const db = database.db('db_Todo');

    db.collection('Users').deleteMany({'Location':'Canada'});

})