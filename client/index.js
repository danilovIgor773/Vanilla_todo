console.log('Hello, World!');

function displayTasks(tasks) {
  const todoList = document.querySelector('.todo-list');

  tasks.forEach(task => {
    const todoItem = document.createElement('div');
    todoItem.className = 'todo-item';

    const todoNumber = document.createElement('span');
    todoNumber.className = 'todo-number';
    todoNumber.textContent = task.id;

    const todoCheck = document.createElement('input');
    todoCheck.type = 'checkbox';
    todoCheck.checked = task.completed;
    todoCheck.className = 'todo-check';

    const todoDescription = document.createElement('p');
    todoDescription.textContent = task.description;

    todoItem.appendChild(todoNumber);
    todoItem.appendChild(todoCheck);
    todoItem.appendChild(todoDescription);
    todoList.appendChild(todoItem);
  });
}

window.addEventListener('DOMContentLoaded', (event) => {
  fetch('http://127.0.0.1:3000/tasks')
    .then(response => response.json())
    .then(tasks => {
      console.log('[window.addEventListener] TASKS', tasks);
      displayTasks(tasks);
    })
    .catch(error => {
      console.error('Error:', error);
    });
});
