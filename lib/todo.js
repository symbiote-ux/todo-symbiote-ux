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
  addNewTask(content) {
    const task = {id: new Date().getTime().toString(), content: content, status: false};
    const newItem = new TodoItem(task);
    this.tasks.push(newItem);
    return newItem;
  }
  toggleStatus(taskId) {
    const task = this.findTask(taskId);
    task.status = !task.status;
  }
  findTask(taskId) {
    return this.tasks.find(task => {
      return task.id === taskId;
    });
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
  addNewTodo(newTodoContent) {
    const newCard = TodoCard.loadTodoCard(newTodoContent);
    this.todoCards.unshift(newCard);
    return this.todoCards;
  }
  addNewItem(content, cardId) {
    const card = this.findCard(cardId);
    const item = card.addNewTask(content);
    return {todoContent: this.todoCards, item};
  }
  deleteTodoCard(targetCardId) {
    const targetCard = this.findCard(targetCardId);
    const indexOfCard = this.todoCards.indexOf(targetCard);
    this.todoCards.splice(indexOfCard, 1);
    return this.todoCards;
  }
  toggleStatus(cardId, taskId) {
    const card = this.findCard(cardId);
    card.toggleStatus(taskId);
    return this.todoCards;
  }
  findCard(cardId) {
    return this.todoCards.find(todoCard => {
      return +todoCard.id === cardId;
    });
  }
}

module.exports = TodoList;
