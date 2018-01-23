const { ObjectID } = require('mongodb');
const expect = require('expect');
const request = require('supertest');

const { app } = require('./../server');
const { Todo } = require('./../models/todos');
const { User } = require('./../models/users');
const { Data, populateData, users, populateUsers } = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateData);

describe('POST /todos', () => {
    it('should create new Todo', (done) => {
        var text = 'Test todo text';
        request(app)
            .post('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .send({ text })
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) return done(err);
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(3);
                    expect(todos[2].text).toBe(text);
                    done();
                }).catch((e) => done(e));
            });
    });
});

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(1);
            })
            .end(done);
    });
});

describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
            .get(`/todos/${Data[0]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.text).toBe(Data[0].text);

            })
            .end(done);
    });

    it('should not return todo doc created by other', (done) => {
        request(app)
            .get(`/todos/${Data[1]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('should return 404 if todo not found', (done) => {
        var hexId = new ObjectID().toHexString();
        request(app)
            .get(`/todos/${hexId}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('should return 404 for non-object ids', (done) => {
        request(app)
            .get('/todos/123asd')
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });
});

describe('DELETE /todos/id:', () => {
    it('should remove a todo', (done) => {
    var hexId = Data[1]._id.toHexString();
    request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexId);
            })
            .end((err, res) => {
                if (err)
                    return done(err);
                Todo.findById(hexId).then((todo)=>{
                    expect(todo).toBeFalsy();
                    done();
                }).catch((e)=> done(e));
            });
    });

    it('should remove a todo', (done) => {
    var hexId = Data[0]._id.toHexString();
    request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end((err, res) => {
                if (err)
                    return done(err);
                Todo.findById(hexId).then((todo)=>{
                    expect(todo).toBeTruthy();
                    done();
                }).catch((e)=> done(e));
            });
    });

    it('should return 404 if todo not found', (done) => {
        var hexId = new ObjectID().toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('should return 404 if object id is invalid', (done) => {
        request(app)
            .delete(`/todos/1123asd`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });
});

describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
        var hexId = Data[0]._id.toHexString();
        var text = 'This should be a new text';

        request(app)
            .patch(`/todos/${hexId}`)
            .set('x-auth',users[0].tokens[0].token)
            .expect(200)
            .send({
                completed: true,
                text
            })
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(true);
                expect(typeof res.body.todo.completedAt).toBe('number');
            })
            .end(done);
    });

    it('should not update the todo created by other user', (done) => {
        var hexId = Data[0]._id.toHexString();
        var text = 'This should be a new text';

        request(app)
            .patch(`/todos/${hexId}`)
            .set('x-auth',users[1].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('should clear CompletedAt when todo is not completed', (done) => {
        var hexId = Data[1]._id.toHexString();
        var text = 'This should be a new text';

        request(app)
            .patch(`/todos/${hexId}`)
            .set('x-auth',users[1].tokens[0].token)
            .expect(200)
            .send({
                completed: false,
                text
            })
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toBeFalsy();
            })
            .end(done);
    });
});

describe('GET /users/me', () => {
    it('should return if user is authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });

    it('should return 401 if not authenticated', (done) => {
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
    it('should create a user', (done) => {
        var email = 'mehta@gmail.com';
        var password = 'abc123'
        request(app)
            .post('/users')
            .send({ email, password })
            .expect(200)
            .expect((res) => {
                expect(res.header['x-auth']).toBeTruthy();
                expect(res.body._id).toBeTruthy();
                expect(res.body.email).toBe(email);
            })
            .end((err) => {
                if (err)
                    return done(err);
                User.findOne({ email }).then((user) => {
                    expect(user).toBeTruthy();
                    expect(user.password).not.toBe(password);
                    done();
                });
            });
    });

    it('should return validation errors if request invalid', (done) => {
        request(app)
            .post('/users')
            .send({ email: 'mehta@gmail.com', password: 'abc12' })
            .expect(400)
            .end(done);
    });

    it('should not create user if email in use', (done) => {
        request(app)
            .post('/users')
            .send({ email: users[0].email, password: '123123' })
            .expect(400)
            .end(done);
    });
});

describe('POST /users/login', () => {
    it('should login user and return auth token', (done) => {

        request(app)
            .post('/users/login')
            .send({ 'email': users[1].email, 'password': users[1].password })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeTruthy();
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                User.findById(users[1]._id).then((user) => {
                    // expect(user.tokens.length).not.toBe(0);

                    expect(user.toObject().tokens[1]).toMatchObject({
                        access:'auth',
                        token: res.header['x-auth']
                    });
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should return invalid login', (done) => {
        request(app)
            .post('/users/login')
            .send({ 'email': users[1].email, 'password': users[1].password + '1' })
            .expect(400)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeFalsy();
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens.length).toBe(1);
                    done();
                }).catch((e) => done(e));
            });
    });
});

describe('DELETE /users/me/token', () => {
    it('should remove auth token on logout', (done) => {
        request(app)
            .delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end((err, res) => {
                if (err)
                    return done(err);
                User.findById(users[0]._id).then((user) => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((e) => done(e));
            })
    });
});