const fs = require('fs');
const App = require('./app');
const TodoList = require('./todo');
const CONTENT_TYPES = require('./mimeTypes');
const STATIC_FOLDER = `${__dirname}/../public`;
const DATA_STORE = `${__dirname}/../dataDepot/data.json`;
const statusCode = 200;

const fileContent = fs.readFileSync(DATA_STORE, 'utf8') || '[]';
const todoList = TodoList.load(JSON.parse(fileContent));

const deleteItem = (req, res) => {
  const {cardId, taskId} = JSON.parse(req.body);
  const content = JSON.parse(fs.readFileSync(DATA_STORE, 'utf8'));
  const card = content.find(card => {
    return +card.id === cardId;
  });
  const task = card.tasks.find(task => {
    return task.id === taskId;
  });
  const indexOfTask = card.tasks.indexOf(task);
  card.tasks.splice(indexOfTask, 1);
  fs.writeFileSync(DATA_STORE, JSON.stringify(content));
  res.writeHead(statusCode);
  res.end();
};

const toggleStatus = (req, res) => {
  const {cardId, taskId} = JSON.parse(req.body);
  const content = JSON.parse(fs.readFileSync(DATA_STORE, 'utf8'));
  const card = content.find(card => {
    return +card.id === cardId;
  });
  const task = card.tasks.find(task => {
    return task.id === taskId;
  });
  task.status = !task.status;
  fs.writeFileSync(DATA_STORE, JSON.stringify(content));
  res.writeHead(statusCode);
  res.end();
};

const deleteTodo = (req, res) => {
  const targetId = req.body;
  const content = JSON.parse(fs.readFileSync(DATA_STORE, 'utf8'));
  const targetCard = content.find(card => {
    return card.id === targetId;
  });
  const indexOfCard = content.indexOf(targetCard);
  content.splice(indexOfCard, 1);
  fs.writeFileSync(DATA_STORE, JSON.stringify(content));
  res.writeHead(statusCode);
  res.end();
};

const serveAddItem = (req, res) => {
  const {content, cardId} = JSON.parse(req.body);
  const allTodoContent = JSON.parse(fs.readFileSync(DATA_STORE, 'utf8'));
  const parent = allTodoContent.find(todo => {
    return +todo.id === cardId;
  });
  const task = {id: new Date().getTime().toString(), content: content, status: false};
  parent.tasks.push(task);
  fs.writeFileSync(DATA_STORE, JSON.stringify(allTodoContent));
  res.writeHead(statusCode, {'Content-Type': 'application/json'});
  res.end(JSON.stringify(task));
};

const serveAllTodo = (req, res) => {
  const extension = DATA_STORE.split('.').pop();
  res.writeHead(statusCode, {'Content-Type': CONTENT_TYPES[extension]});
  res.end(JSON.stringify(todoList.todoCards));
};

const parser = body => {
  const id = () => new Date().getTime().toString();
  return {
    id: id(),
    title: body.title,
    tasks: []
  };
};

const addNewTodo = (req, res) => {
  const parsedBody = parser(JSON.parse(req.body));
  let prevData = fs.readFileSync(DATA_STORE, 'utf8') || '[]';
  prevData = JSON.parse(prevData);
  prevData.unshift(parsedBody);
  fs.writeFileSync(DATA_STORE, JSON.stringify(prevData));
  res.writeHead(statusCode);
  res.end(JSON.stringify(parsedBody));
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
app.use(methodNotAllowed);

module.exports = {app};
