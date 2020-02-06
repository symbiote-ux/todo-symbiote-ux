const todoHtml = (title, tasks) => {
  const html =
    `<div><h3 class="title">${title}<span onclick="removeTodo()">&#9988;</span></h3></div>` +
    '<div class="taskArea">' +
    tasks
      .map(
        task =>
          `<div id="${task.id}" class="content">` +
          makeItemHtml(task.status, task.content) +
          '</div>'
      )
      .join('') +
    '</div>' +
    '<div id="addTextArea" style="display:flex;justify-content:start;">' +
    '<textarea id="textArea" placeholder="  Add Tasks..."></textarea>' +
    '<button class="button" onclick="addNewItem()">&#10009;</button>' +
    '</div>';
  return html;
};

const makeItemHtml = (status, content) => {
  if (status) {
    return `<input type="checkbox" onclick="toggleStatus()" checked/> ${content} <span onclick="deleteItem()">&#9988;</span>`;
  }
  return `<input type="checkbox" onclick="toggleStatus()"/> ${content} <span onclick="deleteItem()">&#9988;</span>`;
};

const makeNewTodoHtml = title => {
  return (
    `<div><h3 class="title">${title}<span onclick="removeTodo()">&#9988;</span></h3></div>` +
    '<div class="taskArea"></div>' +
    '<div id="addTextArea" style="display:flex;justify-content:start;">' +
    '<textarea id="textArea" placeholder="  Add Tasks..."></textarea>' +
    '<button class="button" onclick="addNewItem()">&#10009;</button>' +
    '</div>'
  );
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
      newTodo.innerHTML = makeNewTodoHtml(title);
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
    ${todoHtml(todo.title, todo.tasks)}
    </div>`;
      })
      .join('');
  };
  xmlReq.open('GET', '/allTodo');
  xmlReq.send();
};

// const itemHtml = content => {
//   return `<input type="checkbox"/>${content}`;
// };

const addNewItem = () => {
  const tasks = Array.from(document.querySelectorAll('#textArea'));
  const taskValues = tasks.map(task => {
    return task.value;
  });
  const content = taskValues.find(task => task);
  tasks.forEach(task => (task.value = ''));

  const cardId = event.target.parentElement.parentElement.id;
  const data = {content, cardId};
  const xmlReq = new XMLHttpRequest();
  xmlReq.onload = function() {
    const newItem = document.createElement('div');
    newItem.className = 'content';
    const card = document.getElementById(`${cardId}`);
    const taskArea = card.querySelector('.taskArea');
    const {id, content, status} = JSON.parse(xmlReq.responseText);
    newItem.id = id;
    newItem.innerHTML = makeItemHtml(status, content);
    taskArea.appendChild(newItem);
  };
  xmlReq.open('POST', '/addItem');
  xmlReq.send(JSON.stringify(data));
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

// const removeTodo = () => {
//   const cardId = event.target.parentElement.id;
//   const card = document.getElementById(`${cardId}`);
//   const list = document.querySelector('#todoList');
//   const xmlReq = new XMLHttpRequest();
//   xmlReq.open('POST', '/removeTodo');
//   xmlReq.send(cardId);
//   xmlReq.onload = function() {
//     if (xmlReq.status === 201) {
//       list.removeChild(card);
//     }
//   };
// };

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

window.onload = fetchAllTodo;
