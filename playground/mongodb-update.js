const { MongoClient,ObjectID } = require('mongodb');


var url = 'mongodb://localhost:27017';

MongoClient.connect(url, (err, database) => {
    if (err) return console.log('Unable to connect Mongo server', err); 
    console.log('Mongo server connected');
    const db = database.db('db_Todo');

    db.collection('Users').updateMany(
        { Age: 25 }, 
        {
            $set: {
                Location:'NewZealand'
            },
            $inc:{
                Age:1
            }
        },
        {
            returnOriginal : false
        }
    ).then((err,res)=>{
        if (err) return console.log('ERROR :', err); 
    });
});