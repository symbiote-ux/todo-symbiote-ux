const searchByTitle = () => {
  const titleElements = Array.from(document.querySelectorAll('.titleText'));
  const searchedText = event.target.value;
  titleElements.forEach(titleElement => {
    titleElement.parentNode.parentElement.className = 'hide';
  });

  titleElements.forEach(titleElement => {
    if (titleElement.value.includes(searchedText)) {
      titleElement.parentNode.parentElement.className = 'box';
    }
  });
};
