const hideBox = elements => {
  elements.forEach(element => {
    element.parentNode.parentElement.className = 'hide';
  });
};

const searchByTitle = () => {
  const titleElements = Array.from(document.querySelectorAll('.titleText'));
  const searchedText = event.target.value;
  hideBox(titleElements);
  titleElements.forEach(titleElement => {
    if (titleElement.value.includes(searchedText)) {
      titleElement.parentNode.parentElement.className = 'box';
    }
  });
};

const searchByTask = () => {
  const titleElements = Array.from(document.querySelectorAll('.titleText'));
  const todoElements = Array.from(document.querySelectorAll('.inputTag'));
  const searchedText = event.target.value;
  hideBox(titleElements);

  todoElements.forEach(todoElement => {
    if (todoElement.value.includes(searchedText)) {
      todoElement.parentElement.parentElement.parentElement.className = 'box';
    }
  });
};
