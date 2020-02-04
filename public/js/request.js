const todoHtml = responseText => {
  const {title, tasks} = responseText;
  const html =
    `
<div class="box">
<div><h3>${title}</h3></div>` +
    tasks
      .map(task => {
        return `<div>${task.content}</div>`;
      })
      .join('') +
    '</div>';
  return html;
};

const addItem = () => {
  const table = document.querySelector('#table');
  const newLine = document.createElement('textarea');
  newLine.setAttribute('cols', '50');
  newLine.id = 'content';
  newLine.setAttribute('name', 'tasks');
  table.appendChild(newLine);
};

const sendRequest = () => {
  const title = document.querySelector('#title').value;
  const tasks = Array.from(document.querySelectorAll('#content'));
  const taskValues = tasks.map(task => {
    return task.value;
  });
  const reqData = {
    title: title,
    tasks: taskValues
  };
  const xmlReq = new XMLHttpRequest();
  xmlReq.open('POST', '/index.html');
  xmlReq.send(JSON.stringify(reqData));
  xmlReq.onload = function() {
    const ok = 201;
    if (xmlReq.status === ok) {
      const todoList = document.querySelector('#todoList');
      const newTodo = document.createElement('div');
      newTodo.innerHTML = todoHtml(JSON.parse(xmlReq.responseText));
      todoList.append(newTodo);
    }
  };
};

const fetchTodo = () => {
  const xmlReq = new XMLHttpRequest();
  xmlReq.onload = function() {
    const todoList = document.querySelector('#todoList');
    const allTodo = JSON.parse(xmlReq.responseText);
    todoList.innerHTML = allTodo.map(todo => {
      return `<div>
    ${todoHtml(todo)}
    </div>`;
    });
  };

  xmlReq.open('GET', '/allTodo');
  xmlReq.send();
};

window.onload = fetchTodo;
