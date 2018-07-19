const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}).then((result) => {
//     console.log(result);
// });

// Todo.findOneAndRemove()
// Todo.findByIdAndRemove()

// Todo.findOneAndRemove({_id: '5b5090c77e22f88bad94d5d7'}).then((todo) => {
//
// });

// Todo.findByIdAndRemove('5b5090c77e22f88bad94d5d7').then((todo) => {
//     console.log(todo);
// });
