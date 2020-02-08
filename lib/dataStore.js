const fs = require('fs');
const TodoList = require('./todo');

class DataStore {
  constructor(filePath) {
    this.filePath = filePath;
    this.todoContent = '';
  }
  load() {
    if (!fs.existsSync(this.filePath)) {
      this.todoContent = TodoList.load([]);
      return;
    }
    const content = fs.readFileSync(this.filePath, 'utf8') || '[]';
    this.todoContent = TodoList.load(JSON.parse(content));
  }
  get allTodoList() {
    return this.todoContent.getAllTodo();
  }
  editTitle(cardId, title) {
    this.todoContent.editTitle(cardId, title);
    this.save();
  }
  deleteItem(cardId, taskId) {
    this.todoContent.deleteItem(cardId, taskId);
    this.save();
  }
  toggleStatus(cardId, taskId) {
    this.todoContent.toggleStatus(cardId, taskId);
    this.save();
  }
  deleteTodoCard(todoId) {
    this.todoContent.deleteTodoCard(todoId);
    this.save();
  }
  addNewItem(content, cardId, id) {
    const {item} = this.todoContent.addNewItem(content, cardId, id);
    this.save();
    return {item};
  }
  addNewTodo(newTodoContent) {
    this.todoContent.addNewTodo(newTodoContent);
    this.save();
  }
  save() {
    fs.writeFile(this.filePath, JSON.stringify(this.todoContent.todoCards), () => {});
  }
}

module.exports = DataStore;
