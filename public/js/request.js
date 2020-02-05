const todoHtml = (title, tasks) => {
  const html =
    `<div><h3 class="title">${title}</h3></div>` +
    '<div onclick="removeTodo()">X</div>' +
    tasks
      .map(task => {
        if (task.status) {
          return `<div class="content" id="${task.id}"><input type="checkbox" onclick="toggleStatus()" checked/> ${task.content} <span onclick="deleteItem()"> &nbsp X</span></div>`;
        }
        return `<div class="content" id="${task.id}"><input type="checkbox" onclick="toggleStatus()"/> ${task.content} <span onclick="deleteItem()">  &nbsp X</span></div>`;
      })
      .join('') +
    '<div id="addTextArea" style="display:flex;justify-content:start;">' +
    '<textarea id="textArea" placeholder="  Add Tasks..."></textarea>' +
    '<button class="button" onclick="addNewItem()">+</button>' +
    '</div>';
  return html;
};

const itemHtml = content => {
  return `<input type="checkbox"/>${content}`;
};

const toggleStatus = () => {
  const parentId = event.target.parentElement.parentElement.id;
  const taskId = event.target.parentElement.id;
  const data = {parentId, taskId};
  const xmlReq = new XMLHttpRequest();
  xmlReq.open('POST', '/toggleState');
  xmlReq.send(JSON.stringify(data));
  xmlReq.onload = () => {};
};

const removeTodo = () => {
  const cardId = event.target.parentElement.id;
  const card = document.getElementById(`${cardId}`);
  const list = document.querySelector('#todoList');
  const xmlReq = new XMLHttpRequest();
  xmlReq.open('POST', '/removeTodo');
  xmlReq.send(cardId);
  xmlReq.onload = function() {
    if (xmlReq.status === 201) {
      list.removeChild(card);
    }
  };
};

const deleteItem = () => {
  const parentId = event.target.parentElement.parentElement.id;
  const taskId = event.target.parentElement.id;
  const data = {parentId, taskId};
  const xmlReq = new XMLHttpRequest();
  xmlReq.onload = function() {
    if (xmlReq.status === 201) {
      const card = document.getElementById(parentId);
      const item = document.getElementById(taskId);
      card.removeChild(item);
    }
  };
  xmlReq.open('POST', '/deleteItem');
  xmlReq.send(JSON.stringify(data));
};

const addNewItem = () => {
  const tasks = Array.from(document.querySelectorAll('#textArea'));
  const taskValues = tasks.map(task => {
    return task.value;
  });
  const content = taskValues.find(task => task);
  const parentId = event.target.parentElement.parentElement.id;
  const data = {content, parentId};
  const xmlReq = new XMLHttpRequest();
  xmlReq.open('POST', '/addItem');
  xmlReq.send(JSON.stringify(data));
  xmlReq.onload = function() {
    const newItem = document.createElement('div');
    const parentTodo = document.getElementById(`${parentId}`);
    const {id, content} = JSON.parse(xmlReq.responseText);
    newItem.id = id;
    newItem.innerHTML = itemHtml(content);
    parentTodo.insertBefore(newItem, parentTodo.children[1]);
  };
};

const sendRequest = () => {
  const title = document.querySelector('#title').value;
  const tasks = document.querySelector('#content').value.split('\n');
  document.querySelector('#title').value = '';
  document.querySelector('#content').value = '';

  tasks.forEach(task => (task.value = ''));
  const reqData = {
    title: title,
    tasks: tasks
  };
  const xmlReq = new XMLHttpRequest();
  xmlReq.open('POST', '/addNewTodo');
  xmlReq.send(JSON.stringify(reqData));
  xmlReq.onload = function() {
    const ok = 201;
    if (xmlReq.status === ok) {
      const todoList = document.querySelector('#todoList');
      const newTodo = document.createElement('div');
      const {id, title, tasks} = JSON.parse(xmlReq.responseText);
      newTodo.className = 'box';
      newTodo.id = id;
      newTodo.innerHTML = todoHtml(title, tasks);
      todoList.prepend(newTodo);
    }
  };
};

const fetchTodo = () => {
  const xmlReq = new XMLHttpRequest();
  xmlReq.onload = function() {
    const todoList = document.querySelector('#todoList');
    const allTodo = JSON.parse(xmlReq.responseText);
    todoList.innerHTML = allTodo
      .map(todo => {
        return `<div id="${todo.id}"class="box">
    ${todoHtml(todo.title, todo.tasks)}
    </div>`;
      })
      .join('');
  };

  xmlReq.open('GET', '/allTodo');
  xmlReq.send();
};

window.onload = fetchTodo;
