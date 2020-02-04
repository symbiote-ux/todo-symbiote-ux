const fs = require('fs');
const App = require('./app');
const CONTENT_TYPES = require('./mimeTypes');
const STATIC_FOLDER = `${__dirname}/../public`;
const DATA_STORE = `${__dirname}/../dataDepot/data.json`;

const serveAllTodo = (req, res) => {
  const allTodoContent = fs.readFileSync(DATA_STORE, 'utf8');
  const extension = DATA_STORE.split('.').pop();
  const statusCode = 201;
  res.writeHead(statusCode, {'Content-Type': CONTENT_TYPES[extension]});
  res.end(allTodoContent);
};

const bodyParser = body => {
  return {
    id: new Date().toLocaleString(),
    title: body.title,
    tasks: body.tasks.map((task, index) => {
      return {id: index, content: task};
    })
  };
};

const serveSaveTasks = (req, res) => {
  const parsedBody = bodyParser(JSON.parse(req.body));
  let prevData = fs.readFileSync(DATA_STORE, 'utf8') || '[]';
  prevData = JSON.parse(prevData);
  prevData.push(parsedBody);
  fs.writeFileSync(DATA_STORE, JSON.stringify(prevData));
  res.statusCode = 201;
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
app.post('/index.html', serveSaveTasks);
app.use(methodNotAllowed);

module.exports = {app};
