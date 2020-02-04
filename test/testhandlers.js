const request = require('supertest');
const {app} = require('../lib/handlers');

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

describe('POST "/saveTask"', () => {
  it('should save the todo-tasks and redirect to home page', done => {
    request(app.serve.bind(app))
      .post('/saveTask')
      .send('title=make card&tasks=plan')
      .expect(303)
      .expect('Location', '/', done);
  });
  it('redirected to homePage', done => {
    request(app.serve.bind(app))
      .get('/')
      .expect(200)
      .expect('Content-Type', 'text/html', done)
      .expect(/ToDo/);
  });
});
