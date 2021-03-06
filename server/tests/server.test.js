const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {dummyTodos, populateTodos, dummyUsers, populateUsers} = require('./seed/seed');

beforeEach(populateTodos);
beforeEach(populateUsers);

describe('POST /todos', () => {
    it('Should create a new todo.', (done) => {
        var text = 'Add success system';

        request(app)
            .post('/todos')
            .set('x-auth', dummyUsers[0].tokens[0].token)
            .send({
                text
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    done(err);
                    return;
                }

                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((err) => done(err));
            });
    });

    it('Should not create todo with invalid body data', (done) => {
        request(app)
            .post('/todos')
            .set('x-auth', dummyUsers[0].tokens[0].token)
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((err) => done(err));
            })
    });
});

describe('GET /todos', () => {
    it('Should get all todos', (done) => {
        request(app)
            .get('/todos')
            .set('x-auth', dummyUsers[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(1);
            })
            .end(done);
    });
});

describe('GET /todos/:id', () => {
    it('Should return todo document', (done) => {
        request(app)
            .get(`/todos/${dummyTodos[0]._id.toHexString()}`)
            .set('x-auth', dummyUsers[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(dummyTodos[0].text);
            })
            .end(done);
    });

    it('Should return 404 if todo not found', (done) => {
        var randomID = new ObjectID().toHexString();
        request(app)
            .get(`/todos/${randomID}`)
            .set('x-auth', dummyUsers[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('Should return 404 for non-object ids', (done) => {
        request(app)
            .get('/todos/123')
            .set('x-auth', dummyUsers[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('Should not return a todo document created by another user', (done) => {
        request(app)
            .get(`/todos/${dummyTodos[1]._id.toHexString()}`)
            .set('x-auth', dummyUsers[0].tokens[0].token)
            .expect(404)
            .end(done);
    });
});

describe('DELETE /todos/:id', () => {
    it('Should remove a todo', (done) => {
        var hexId = dummyTodos[1]._id.toHexString();

        request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth', dummyUsers[1].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexId);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.findById(hexId).then((todo) => {
                    expect(todo).toNotExist();
                    done();
                }).catch((err) => done(err));
            });
    });

    it('Should not remove a todo not owned', (done) => {
        var hexId = dummyTodos[0]._id.toHexString();

        request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth', dummyUsers[1].tokens[0].token)
            .expect(404)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.findById(hexId).then((todo) => {
                    expect(todo).toExist();
                    done();
                }).catch((err) => done(err));
            });
    });

    it('Should return 404 if todo not found', (done) => {
        var randomID = new ObjectID().toHexString();
        request(app)
            .delete(`/todos/${randomID}`)
            .set('x-auth', dummyUsers[1].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('Should return 404 if invalid ID', (done) => {
        request(app)
            .delete('/todos/123')
            .set('x-auth', dummyUsers[1].tokens[0].token)
            .expect(404)
            .end(done);
    });
});

describe('PATCH /todos/:id', () => {
    it('Should update a todo', (done) => {
        var hexId = dummyTodos[0]._id.toHexString();
        var text = 'Updated for the test';

        request(app)
            .patch(`/todos/${hexId}`)
            .set('x-auth', dummyUsers[0].tokens[0].token)
            .send({
                "text": text,
                "completed": true
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.completedAt).toBeA('number');
            })
            .end(done);
    });

    it('Should clear completedAt when todo is not completed', (done) => {
        var hexId = dummyTodos[1]._id.toHexString();
        var text = 'Updated for the test';

        request(app)
            .patch(`/todos/${hexId}`)
            .set('x-auth', dummyUsers[1].tokens[0].token)
            .send({
                text,
                completed: false
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toNotExist();
            })
            .end(done);
    });

    it('Should not update a todo not owned', (done) => {
        var hexId = dummyTodos[0]._id.toHexString();
        var text = 'Update';

        request(app)
            .patch(`/todos/${hexId}`)
            .set('x-auth', dummyUsers[1].tokens[0].token)
            .send({
                "text": text,
                "completed": true
            })
            .expect(404)
            .end(done);
    });
});

describe('GET /users/me', () => {
    it('Should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', dummyUsers[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(dummyUsers[0]._id.toHexString());
                expect(res.body.email).toBe(dummyUsers[0].email);
            })
            .end(done);
    });

    it('Should return 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});

describe('POST /users', () => {
    it('Should create a user', (done) => {
        var email = 'example@example.com';
        var password = '123mlb';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toBe(email);
            })
            .end((err) => {
                if (err) {
                    return done(err);
                }

                User.findOne({email}).then((data) => {
                    expect(data).toExist();
                    expect(data.password).toNotBe(password); // because hashed
                    done();
                }).catch((err) => {
                    console.log(err);
                });
            });
    });

    it('Should return validation errors if request invalid', (done) => {
        var email = 'email-invalide';
        var password = 'abc'; // invalid because too short

        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done);
    });

    it('Should not create user if email in use', (done) => {
        var email = 'sofiane@gmail.com'; // used in populateUsers
        var password = 'ignzoienroezinr'; // who cares

        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done);
    });
});

describe('POST /users/login', () => {
    it('Should login user and return auth token', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: dummyUsers[1].email,
                password: dummyUsers[1].password
            })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                User.findById(dummyUsers[1]._id).then((user) => {
                    expect(user.tokens[0]).toInclude({
                        access: 'auth',
                        token: res.headers['x-auth']
                    });
                    done();
                }).catch((err) => done(err));
            });
    });

    it('Should reject invalid login', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: dummyUsers[1].email,
                password: 'incorrectPwd'
            })
            .expect(400)
            .expect((res) => {
                expect(res.headers['x-auth']).toNotExist();
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                User.findById(dummyUsers[1]._id).then((user) => {
                    expect(user.tokens.length).toBe(1);
                    done();
                }).catch((err) => done(err));
            });
    });
});

describe('DELETE /users/me/token', () => {
    it('Should remove auth token on logout', (done) => {
        request(app)
            .delete('/users/me/token')
            .set('x-auth', dummyUsers[0].tokens[0].token)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                User.findById(dummyUsers[0]._id).then((user) => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((err) => done(err));
            });
    });
});
