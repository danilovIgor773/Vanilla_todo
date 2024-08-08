console.log('Hello, World!');

const form = document.getElementById('main-form');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const desc = data.get('todo').trim();
  if(desc !== '') {
      createTask(desc);
  }
  form.reset();
})

// document.getElementById('todo-input').addEventListener('keypress', function(event) {
//   if(event.key === "Enter") {
//     const taskDescription = this.value.trim();

//     if(taskDescription) {
//       createTask(taskDescription);
//       this.value = '';
//     }
//   }
// });

function attachCheckboxListener(checkbox, taskId) {
  checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
      deleteTask(taskId);
    }
  });
}

function displaySingleTask(task) {
  const todoList = document.querySelector('.todo-list');
  const todoItem = document.createElement('div');
  todoItem.className = 'todo-item';

  const todoNumber = document.createElement('span');
  todoNumber.className = 'todo-number';
  todoNumber.textContent = task.id;

  const todoCheck = document.createElement('input');
  todoCheck.type = 'checkbox';
  todoCheck.checked = task.completed;
  todoCheck.className = 'todo-check';

  attachCheckboxListener(todoCheck, task.id);

  const todoDescription = document.createElement('p');
  todoDescription.textContent = task.description;

  todoItem.appendChild(todoNumber);
  todoItem.appendChild(todoCheck);
  todoItem.appendChild(todoDescription);
  todoList.appendChild(todoItem);
}

function displayTasks(tasks) {
  const todoList = document.querySelector('.todo-list');
  todoList.innerHTML = '';

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

    attachCheckboxListener(todoCheck, task.id);

    const todoDescription = document.createElement('p');
    todoDescription.textContent = task.description;

    todoItem.appendChild(todoNumber);
    todoItem.appendChild(todoCheck);
    todoItem.appendChild(todoDescription);
    todoList.appendChild(todoItem);
  });
}

function fetchTasks() {
  fetch('http://127.0.0.1:3000/tasks')
    .then(response => response.json())
    .then(tasks => {
      console.log('[fetchTasks] TASKS', tasks);
      displayTasks(tasks);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function createTask(description) {
  const newTask = {
    description: description,
    completed: false
  };

  fetch('http://127.0.0.1:3000/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newTask)
  })
  .then(response => response.json())
  .then(task => {
    console.log('Received task:', task);
    fetchTasks();
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

function deleteTask(taskId) {
  fetch(`http://127.0.0.1:3000/tasks/${taskId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  .then(response => response.json())
  .then(() => {
    fetchTasks();
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

document.addEventListener('DOMContentLoaded', (event) => {
  fetchTasks();
});
