const todoHtml = responseText => {
  const {title, tasks} = responseText;
  const html =
    `<div><h3 class="title">${title}</h3></div>` +
    tasks
      .map(task => {
        return `<div class="content"><input type="checkbox"/> ${task.content}</div>`;
      })
      .join('') +
    '<div>' +
    '<button class="button">+</button>' +
    '</div>';
  return html;
};

const createTextArea = () => {
  const area = document.querySelector('#addTextArea');
  const textArea = document.createElement('textarea');
  textArea.id = 'textArea';
  const button = document.createElement('button');
  button.innerText = 'Save';
  button.onclick = addTodoItem;
  area.prepend(button);
  area.prepend(textArea);
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
      newTodo.className = 'box';
      newTodo.innerHTML = todoHtml(JSON.parse(xmlReq.responseText));
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
        return `<div class="box">
    ${todoHtml(todo)}
    </div>`;
      })
      .join('');
  };

  xmlReq.open('GET', '/allTodo');
  xmlReq.send();
};

window.onload = fetchTodo;
