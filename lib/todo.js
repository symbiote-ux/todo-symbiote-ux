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
  findCard(cardId) {
    return this.todoCards.find(todoCard => {
      return +todoCard.id === cardId;
    });
  }
}

module.exports = TodoList;
