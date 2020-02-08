const fs = require('fs');
const TodoList = require('./todo');

class DataStore {
  constructor(filePath) {
    this.filePath = filePath;
    this.todo = '';
  }
  load() {
    if (!fs.existsSync(this.filePath)) {
      this.todo = TodoList.load([]);
      return;
    }
    const content = fs.readFileSync(this.filePath, 'utf8') || '[]';
    this.todo = TodoList.load(JSON.parse(content));
  }
  get allTodoList() {
    return this.todo.getAllTodo();
  }
  editTitle(cardId, title) {
    this.todo.editTitle(cardId, title);
    this.save();
  }
  deleteItem(cardId, taskId) {
    this.todo.deleteItem(cardId, taskId);
    this.save();
  }
  toggleStatus(cardId, taskId) {
    this.todo.toggleStatus(cardId, taskId);
    this.save();
  }
  deleteTodoCard(todoId) {
    this.todo.deleteTodoCard(todoId);
    this.save();
  }
  addNewItem(content, cardId, id) {
    const {item} = this.todo.addNewItem(content, cardId, id);
    this.save();
    return {item};
  }
  addNewTodo(newTodoContent) {
    this.todo.addNewTodo(newTodoContent);
    this.save();
  }
  save() {
    fs.writeFile(this.filePath, JSON.stringify(this.todo.todoCards), () => {});
  }
}

module.exports = DataStore;
