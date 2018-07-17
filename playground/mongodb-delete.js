const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        console.log('Unable to connect to MongoDB server.');
        return;
    }

    console.log('Connected to MongoDB server.');

    // deleteMany
    // db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result) => {
    //     console.log(result);
    // });

    // deleteOne
    // db.collection('Todos').deleteOne({text: 'Eat lunch'}).then((result) => {
    //     console.log(result);
    // });

    // findOneAndDelete
    // db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
    //     console.log(result);
    // });

    // Exercice
    // db.collection('Users').deleteMany({name: 'Sofiane'}).then((result) => {
    //     console.log(result);
    // });
    // db.collection('Users').findOneAndDelete({_id: new ObjectID('5b393b09f2e6017841942238')}).then((result) => {
    //     console.log(result);
    // });


    // db.close();
});
