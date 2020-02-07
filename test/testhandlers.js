const fs = require('fs');
const request = require('supertest');
const config = require('../config');
const {app} = require('../lib/handlers');
const FILE_PATH = config.DATA_FILE_PATH;

const testFileContent = fs.readFileSync(FILE_PATH, 'utf8');

after(() => {
  fs.writeFile(FILE_PATH, testFileContent, () => {});
});

describe('Get home page ', () => {
  it('serves home page on "/" path', done => {
    request(app.serve.bind(app))
      .get('/')
      .expect(200)
      .expect('Content-Type', 'text/html', done)
      .expect(/ToDo/);
  });
});

describe('Get non Existing url', () => {
  it('responds page not found for non existing url', done => {
    request(app.serve.bind(app))
      .get('/badUrl')
      .expect(404, done)
      .expect(/Page Not Found/);
  });
});

describe('PUT /url', () => {
  it('responds as method not allowed', done => {
    request(app.serve.bind(app))
      .put('/url')
      .expect(400, done)
      .expect(/Method Not Allowed/);
  });
});

describe('GET /allTodo', () => {
  it('should display all todoList on window load', done => {
    request(app.serve.bind(app))
      .get('/allTodo')
      .set('Accept', '*/*')
      .expect(200, done)
      .expect('Content-Type', 'application/json');
  });
});

describe('POST /addTodo', () => {
  it('should add New todo on /addTodo req', done => {
    request(app.serve.bind(app))
      .post('/addTodo')
      .send('{"title":"Hello"}')
      .expect(200, done)
      .expect('Content-Type', 'application/json');
  });
});

describe('POST  /toggleState', () => {
  it('should mark done or undone on clicking on checkBox', done => {
    request(app.serve.bind(app))
      .post('/toggleState')
      .send('{"cardId":"H_1","taskId": "T_1"}')
      .expect(200, done)
      .expect('Content-Type', 'application/json');
  });
});

describe('POST  /deleteItem', () => {
  it('should delete the item on /deleteItem req', done => {
    request(app.serve.bind(app))
      .post('/deleteItem')
      .send('{"cardId":"H_1","taskId":"T_1"}')
      .expect(200, done)
      .expect('Content-Type', 'application/json');
  });
});

describe('POST  /addItem', () => {
  it('should  add the new item to the existing selected todo', done => {
    request(app.serve.bind(app))
      .post('/addItem')
      .send('{"content":"Cat","cardId":"H_1"}')
      .expect(200, done)
      .expect('Content-Type', 'application/json');
  });
});

describe('POST  /removeTodo', () => {
  it('should remove the selected todo on /removeTodo req', done => {
    request(app.serve.bind(app))
      .post('/removeTodo')
      .send('{"cardId":"H_1"}')
      .expect(200, done)
      .expect('Content-Type', 'application/json');
  });
});
