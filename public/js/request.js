const addNewTodo = () => {
  const title = document.querySelector('#title').value;
  document.querySelector('#title').value = '';
  const addTodo = function() {
    const ok = 200;
    if (this.status === ok) {
      const todoList = document.querySelector('#todoList');
      const newTodo = document.createElement('div');
      const {id, title} = JSON.parse(this.responseText);
      newTodo.className = 'box';
      newTodo.id = id;
      newTodo.innerHTML = todoHtml(title, [], id);
      todoList.prepend(newTodo);
    }
  };
  newReq('POST', '/addTodo', JSON.stringify({title: title}), addTodo);
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
  const addTodoItem = function() {
    const newItem = document.createElement('div');
    newItem.className = 'content';
    const card = document.getElementById(`${cardId}`);
    const taskArea = card.querySelector('.taskArea');
    const {id, content, status} = JSON.parse(this.responseText);
    newItem.id = id;
    newItem.innerHTML = makeItemHtml(status, content, cardId);
    taskArea.appendChild(newItem);
  };
  newReq('POST', '/addItem', JSON.stringify(data), addTodoItem);
};

const toggleStatus = id => {
  const taskId = event.target.parentElement.id;
  const data = {cardId: id, taskId};
  newReq('POST', '/toggleState', JSON.stringify(data), () => {});
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
