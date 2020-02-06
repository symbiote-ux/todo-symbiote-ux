const todoHtml = (title, tasks, cardId) => {
  const html =
    `<div><h3 class="title"><span onclick="removeTodo(${cardId})">&#9988;</span> ${title}</h3></div>` +
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
    '<input id="textArea" type="text" placeholder="  Add Tasks..."/>' +
    `<button class="button" onclick="addNewItem(${cardId})">&#10009;</button>` +
    '</div>';
  return html;
};

const makeItemHtml = (status, content, cardId) => {
  if (status) {
    return `<span onclick="deleteItem(${cardId})">&#9988;</span> <input type="checkbox" onclick="toggleStatus(${cardId})" checked/> ${content}`;
  }
  return `<span onclick="deleteItem(${cardId})">&#9988;</span> <input type="checkbox" onclick="toggleStatus(${cardId})"/> ${content}`;
};
