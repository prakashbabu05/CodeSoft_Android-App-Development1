const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list');

let tasks = [];

// Check if there are tasks in local storage
const tasksFromLocalStorage = JSON.parse(localStorage.getItem('tasks'));
if (tasksFromLocalStorage) {
    tasks = tasksFromLocalStorage;
    tasks.forEach(task => {
        addTaskToDOM(task);
    });
}

// Event listener for form submission
taskForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const taskTitle = document.getElementById('task-title').value;
    const taskDescription = document.getElementById('task-description').value;
    const priority = document.getElementById('priority').value;
    const dueDate = document.getElementById('due-date').value;

    if (taskTitle.trim() === '') {
        alert('Please enter a task title');
        return;
    }

    const newTask = {
        id: new Date().getTime(),
        title: taskTitle,
        description: taskDescription,
        priority: priority,
        dueDate: dueDate,
        completed: false
    };

    tasks.push(newTask);
    addTaskToDOM(newTask);
    updateLocalStorage();

    taskForm.reset();
});

// Function to add task to DOM
function addTaskToDOM(task) {
    const taskItem = document.createElement('li');
    taskItem.dataset.taskId = task.id;
    taskItem.classList.add('task-item');
    taskItem.innerHTML = `
        <span class="task-title">${task.title}</span>
        <div class="actions">
            <button class="btn-complete">${task.completed ? 'Undo' : 'Complete'}</button>
            <button class="btn-edit">Edit</button>
            <button class="btn-delete">Delete</button>
        </div>
    `;

    if (task.completed) {
        taskItem.classList.add('completed');
    }

    taskList.appendChild(taskItem);

    // Add event listeners to task actions
    const btnComplete = taskItem.querySelector('.btn-complete');
    btnComplete.addEventListener('click', function() {
        task.completed = !task.completed;
        if (task.completed) {
            taskItem.classList.add('completed');
            btnComplete.textContent = 'Undo';
        } else {
            taskItem.classList.remove('completed');
            btnComplete.textContent = 'Complete';
        }
        updateLocalStorage();
    });

    const btnEdit = taskItem.querySelector('.btn-edit');
    btnEdit.addEventListener('click', function() {
        const newTitle = prompt('Enter new title:', task.title);
        if (newTitle && newTitle.trim() !== '') {
            task.title = newTitle;
            taskItem.querySelector('.task-title').textContent = newTitle;
            updateLocalStorage();
        }
    });

    const btnDelete = taskItem.querySelector('.btn-delete');
    btnDelete.addEventListener('click', function() {
        if (confirm('Are you sure you want to delete this task?')) {
            tasks = tasks.filter(t => t.id !== task.id);
            taskItem.remove();
            updateLocalStorage();
        }
    });
}

// Function to update local storage with tasks array
function updateLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
