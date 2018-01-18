const { ObjectID } = require('mongodb');
const expect = require('expect');
const request = require('supertest');

const { app } = require('./../server');
const { Todo } = require('./../models/todos');

var Data = [
    { _id: new ObjectID(), text: "First test todo" },
    { _id: new ObjectID(), text: "Second test todo",completed:true, completedAt : 123 }
]
beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(Data);
    }).then(() => done())
});

describe('POST /todos', () => {
    it('should create new Todo', (done) => {
        var text = 'Test todo text';
        request(app)
            .post('/todos')
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
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });
});

describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
            .get(`/todos/${Data[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.text).toBe(Data[0].text);

            })
            .end(done);
    });

    it('should return 404 if todo not found',(done) => {
        var hexId = new ObjectID().toHexString();
        request(app)
         .get(`/todos/${hexId}`)
         .expect(404)
         .end(done);
    });

    it.skip('should return 404 for non-object ids',(done) => {
        request(app)
            .get('/todos/123asd')
            .expect(404)
            .end(done);
    }); 
});

describe('DELETE /todos/id:',() => {
    var hexId = Data[0]._id.toHexString();
    it('should remove a todo',(done) => {
        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .end(done);
    });

    it('should return 404 if todo not found',(done) =>{
        var hexId = new ObjectID().toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 if object id is invalid',(done) => {
        request(app)
            .delete(`/todos/1123asd`)
            .expect(404)
            .end(done);
    });
});

describe('PATCH /todos/:id',() => {
    it('should update the todo',(done) => {
        var hexId = Data[0]._id.toHexString();
        var text = 'This should be a new text';
        
        request(app)
            .patch(`/todos/${hexId}`)
            .expect(200)
            .send({
                completed : true,
                text
            })
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(true);
                expect(typeof res.body.todo.completedAt).toBe('number');
            })
            .end(done);
    });

    it('should clear CompletedAt when todo is not completed',(done) => {
        var hexId = Data[0]._id.toHexString();
        var text = 'This should be a new text';
        
        request(app)
            .patch(`/todos/${hexId}`)
            .expect(200)
            .send({
                completed : false,
                text
            })
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(false);
                //expect(res.body.todo.completedAt).toNotExist();
            })
            .end(done);
    });
});