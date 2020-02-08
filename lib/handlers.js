const fs = require('fs');
const App = require('./app');
const DataStore = require('./dataStore');
const CONTENT_TYPES = require('./mimeTypes');
const STATIC_FOLDER = `${__dirname}/../public`;
const config = require('../config');
const FILE_PATH = config.DATA_FILE_PATH;
const statusCode = 200;
const dataStore = new DataStore(FILE_PATH);
dataStore.load();

const serveEditTitle = (req, res) => {
  const {cardId, title} = JSON.parse(req.body);
  dataStore.editTitle(cardId, title);
  res.writeHead(statusCode, {'Content-Type': 'application/json'});
  res.end();
};

const deleteItem = (req, res) => {
  const {cardId, taskId} = JSON.parse(req.body);
  dataStore.deleteItem(cardId, taskId);
  res.writeHead(statusCode, {'Content-Type': 'application/json'});
  res.end();
};

const toggleStatus = (req, res) => {
  const {cardId, taskId} = JSON.parse(req.body);
  dataStore.toggleStatus(cardId, taskId);
  res.writeHead(statusCode, {'Content-Type': 'application/json'});
  res.end();
};

const deleteTodo = (req, res) => {
  dataStore.deleteTodoCard(req.body);
  res.writeHead(statusCode, {'Content-Type': 'application/json'});
  res.end();
};

const serveAddItem = (req, res) => {
  const {content, cardId} = JSON.parse(req.body);
  const id = `TASK_${new Date().getTime()}`;
  const {item} = dataStore.addNewItem(content, cardId, id);
  res.writeHead(statusCode, {'Content-Type': 'application/json'});
  res.end(JSON.stringify(item));
};

const serveAllTodo = (req, res) => {
  const extension = FILE_PATH.split('.').pop();
  res.writeHead(statusCode, {'Content-Type': CONTENT_TYPES[extension]});
  res.end(JSON.stringify(dataStore.allTodoList));
};

const parser = body => {
  const id = () => `H_${new Date().getTime()}`;
  return {
    id: id(),
    title: body.title,
    tasks: []
  };
};

const addNewTodo = (req, res) => {
  const newTodoContent = parser(JSON.parse(req.body));
  dataStore.addNewTodo(newTodoContent);
  res.writeHead(statusCode, {'Content-Type': 'application/json'});
  res.end(JSON.stringify(newTodoContent));
};

const methodNotAllowed = (req, res) => {
  const statusCode = 400;
  res.writeHead(statusCode);
  res.end('Method Not Allowed');
};

const pageNotFound = (req, res) => {
  const statusCode = 404;
  res.writeHead(statusCode);
  res.end('Page Not Found');
};

const serveStaticFile = (req, res, next) => {
  const statusCode = 200;
  const path = req.url === '/' ? '/index.html' : req.url;
  const absPath = `${STATIC_FOLDER}${path}`;
  const extension = path.split('.').pop();
  fs.readFile(absPath, (err, data) => {
    if (err) {
      next();
      return;
    }
    res.writeHead(statusCode, {'Content-Type': CONTENT_TYPES[extension]});
    res.end(data);
  });
};

const readBody = (req, res, next) => {
  let content = '';
  req.on('data', chunk => {
    content += chunk;
  });
  req.on('end', () => {
    req.body = content;
    next();
  });
};

const app = new App();
app.use(readBody);
app.get('/allTodo', serveAllTodo);
app.get('', serveStaticFile);
app.get('', pageNotFound);

app.post('/addTodo', addNewTodo);
app.post('/toggleState', toggleStatus);
app.post('/deleteItem', deleteItem);
app.post('/addItem', serveAddItem);
app.post('/removeTodo', deleteTodo);
app.post('/editTitle', serveEditTitle);
app.use(methodNotAllowed);

module.exports = {app};
