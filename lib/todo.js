class TodoItem {
  constructor(task) {
    this.id = task.id;
    this.content = task.content;
    this.status = task.status;
  }
}

class TodoCard {
  constructor(card) {
    this.id = card.id;
    this.title = card.title;
    this.tasks = card.tasks;
  }
  static loadTodoCard(card) {
    const todoCard = new TodoCard(card);
    todoCard.tasks.forEach(task => new TodoItem(task));
    return todoCard;
  }
}

class TodoList {
  constructor() {
    this.todoCards = [];
  }
  static load(fileContent) {
    const todoList = new TodoList();
    fileContent.forEach(card => todoList.save(TodoCard.loadTodoCard(card)));
    return todoList;
  }
  save(card) {
    this.todoCards.push(card);
  }
}

module.exports = TodoList;
