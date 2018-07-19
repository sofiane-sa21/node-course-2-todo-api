const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// var id = '5b4f52a7388b38a62e0a8ab8';
//
// if (!ObjectID.isValid(id)) {
//     console.log('ID not valid.');
//     console.log('----------');
// }

// Todo.find({
//     _id: id
// }).then((todos) => {
//     console.log('Todos', todos);
//     console.log('----------');
// });
//
// Todo.findOne({
//     _id: id
// }).then((todo) => {
//     console.log('Todo', todo);
//     console.log('----------');
// });

// Todo.findById(id).then((todo) => {
//     if (!todo) {
//         console.log('Id not found');
//         console.log('----------');
//         return;
//     }
//     console.log('Todo By Id', todo);
//     console.log('----------');
// }).catch((err) => console.log(err));

var userId = '5b4e0da90de2af524a8c98d1';

User.findById(userId).then((user) => {
    if (!user) {
        console.log('User not found');
        console.log('--------------');
        return;
    }

    console.log('User By Id');
    console.log(JSON.stringify(user, undefined, 4));
}, (err) => {
    console.log(err);
});
