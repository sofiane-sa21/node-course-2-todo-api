const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

var userOneId = new ObjectID();
var userTwoId = new ObjectID();
const dummyUsers = [
    {
        _id: userOneId,
        email: 'sofiane@gmail.com',
        password: 'userOnePass',
        tokens: [
            {
                access: 'auth',
                token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
            }
        ]
    },
    {
        _id: userTwoId,
        email: 'stuart@gmail.com',
        password: 'userTwoPass',
        tokens: [
            {
                access: 'auth',
                token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
            }
        ]
    }
];

const populateUsers = (done) => {
    User.remove({}).then(() => {
        var userOne = new User(dummyUsers[0]).save();
        var userTwo = new User(dummyUsers[1]).save();

        return Promise.all([userOne, userTwo]);
    }).then(() => done());
};

const dummyTodos = [
    {
        _id: new ObjectID(),
        text: 'Add a Workshop',
        _creator: userOneId
    }, {
        _id: new ObjectID(),
        text: 'Add a User module',
        completed: true,
        completedAt: 666,
        _creator: userTwoId
    }
];

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        Todo.insertMany(dummyTodos);
    }).then(() => done());
};

module.exports = {
    dummyTodos,
    populateTodos,
    dummyUsers,
    populateUsers
};
