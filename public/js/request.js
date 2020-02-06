const todoHtml = (title, tasks, cardId) => {
  const html =
    `<div><h3 class="title">${title}<span onclick="removeTodo(${cardId})">&#9988;</span></h3></div>` +
    '<div class="taskArea">' +
    tasks
      .map(
        task =>
          `<div id="${task.id}" class="content">` +
          makeItemHtml(task.status, task.content, cardId) +
          '</div>'
      )
      .join('') +
    '</div>' +
    '<div id="addTextArea" style="display:flex;justify-content:start;">' +
    '<textarea id="textArea" placeholder="  Add Tasks..."></textarea>' +
    `<button class="button" onclick="addNewItem(${cardId})">&#10009;</button>` +
    '</div>';
  return html;
};

const makeItemHtml = (status, content, cardId) => {
  if (status) {
    return `<input type="checkbox" onclick="toggleStatus(${cardId})" checked/> ${content} <span onclick="deleteItem(${cardId})">&#9988;</span>`;
  }
  return `<input type="checkbox" onclick="toggleStatus(${cardId})"/> ${content} <span onclick="deleteItem(${cardId})">&#9988;</span>`;
};

const addNewTodo = () => {
  const title = document.querySelector('#title').value;
  document.querySelector('#title').value = '';
  const xmlReq = new XMLHttpRequest();
  xmlReq.onload = function() {
    const ok = 201;
    if (xmlReq.status === ok) {
      const todoList = document.querySelector('#todoList');
      const newTodo = document.createElement('div');
      const {id, title} = JSON.parse(xmlReq.responseText);
      newTodo.className = 'box';
      newTodo.id = id;
      newTodo.innerHTML = todoHtml(title, [], id);
      todoList.prepend(newTodo);
    }
  };
  xmlReq.open('POST', '/addTodo');
  xmlReq.send(JSON.stringify({title: title}));
};

const fetchAllTodo = () => {
  const xmlReq = new XMLHttpRequest();
  xmlReq.onload = function() {
    const todoList = document.querySelector('#todoList');
    const allTodo = JSON.parse(xmlReq.responseText);
    todoList.innerHTML = allTodo
      .map(todo => {
        return `<div id="${todo.id}"class="box">
    ${todoHtml(todo.title, todo.tasks, todo.id)}
    </div>`;
      })
      .join('');
  };
  xmlReq.open('GET', '/allTodo');
  xmlReq.send();
};

const addNewItem = cardId => {
  const tasks = Array.from(document.querySelectorAll('#textArea'));
  const taskValues = tasks.map(task => {
    return task.value;
  });
  const content = taskValues.find(task => task);
  tasks.forEach(task => (task.value = ''));
  const data = {content, cardId};
  const xmlReq = new XMLHttpRequest();
  xmlReq.onload = function() {
    const newItem = document.createElement('div');
    newItem.className = 'content';
    const card = document.getElementById(`${cardId}`);
    const taskArea = card.querySelector('.taskArea');
    const {id, content, status} = JSON.parse(xmlReq.responseText);
    newItem.id = id;
    newItem.innerHTML = makeItemHtml(status, content, cardId);
    taskArea.appendChild(newItem);
  };
  xmlReq.open('POST', '/addItem');
  xmlReq.send(JSON.stringify(data));
};

const toggleStatus = id => {
  const taskId = event.target.parentElement.id;
  const data = {cardId: id, taskId};
  const xmlReq = new XMLHttpRequest();
  xmlReq.open('POST', '/toggleState');
  xmlReq.send(JSON.stringify(data));
  xmlReq.onload = () => {};
};

const removeTodo = cardId => {
  const card = document.getElementById(`${cardId}`);
  const list = document.querySelector('#todoList');
  const deleteTodo = function() {
    if (this.status === 200) {
      list.removeChild(card);
    }
  };
  newReq('POST', '/removeTodo', cardId, deleteTodo);
};

const deleteItem = cardId => {
  const taskId = event.target.parentElement.id;
  const data = {cardId, taskId};
  const removeItem = function() {
    if (this.status === 200) {
      const item = document.getElementById(taskId);
      item.remove();
    }
  };
  newReq('POST', '/deleteItem', JSON.stringify(data), removeItem);
};

const newReq = (method, url, data, callback) => {
  const req = new XMLHttpRequest();
  req.open(method, url);
  req.onload = callback;
  req.send(data);
};

window.onload = fetchAllTodo;
