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
    '<input id="textArea" type="text" placeholder="  Add Tasks..."/>' +
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
