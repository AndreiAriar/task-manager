// Variables
let tasks = [];
const taskList = document.getElementById('taskList');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const clockElement = document.getElementById('clock');
const themeToggle = document.getElementById('themeToggle');
const editModal = document.getElementById('editModal');
const editForm = document.getElementById('editForm');
const closeModalButton = document.getElementById('closeModal');

// Add Task
function addTask(event) {
    event.preventDefault();

    const title = document.getElementById('taskTitle').value.trim();
    const description = document.getElementById('taskDescription').value.trim();
    const dueDate = document.getElementById('taskDueDate').value;
    const priority = document.getElementById('taskPriority').value;

    if (!title || !dueDate) {
        alert('Please fill in all required fields!');
        return;
    }

    const task = {
        id: Date.now(),
        title,
        description,
        dueDate,
        priority,
        status: 'todo',
    };

    tasks.push(task);
    renderTasks();
    updateProgress();
    document.getElementById('taskForm').reset();
}

// Render Tasks
function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <div>
                <h3>${task.title}</h3>
                <p>${task.description || 'No description provided.'}</p>
                <p><strong>Due:</strong> ${new Date(task.dueDate).toLocaleDateString()}</p>
                <p><strong>Priority:</strong> ${task.priority}</p>
            </div>
            <div>
                <button class="btn btn-done" onclick="markCompleted(${task.id})">✔ Done</button>
                <button class="btn btn-edit" onclick="openEditModal(${task.id})">✏ Edit</button>
                <button class="btn btn-cancel" onclick="deleteTask(${task.id})">❌ Delete</button>
            </div>
        `;
        taskList.appendChild(listItem);
    });
}

// Update Progress
function updateProgress() {
    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    const progress = (completedTasks / tasks.length) * 100 || 0;
    progressBar.style.width = `${progress}%`;
    progressText.textContent = `${Math.round(progress)}% Completed`;
}

// Mark Task as Completed
function markCompleted(id) {
    tasks = tasks.map(task => (task.id === id ? { ...task, status: 'completed' } : task));
    renderTasks();
    updateProgress();
}

// Delete Task
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    renderTasks();
    updateProgress();
}

// Open Edit Modal
function openEditModal(id) {
    const task = tasks.find(task => task.id === id);
    if (!task) return;

    // Populate the form fields in the modal
    document.getElementById('editTaskId').value = task.id;
    document.getElementById('editTaskTitle').value = task.title;
    document.getElementById('editTaskDescription').value = task.description;
    document.getElementById('editTaskDueDate').value = task.dueDate;
    document.getElementById('editTaskPriority').value = task.priority;

    // Show the modal
    editModal.style.display = 'block';
}

// Save Edited Task
editForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const id = Number(document.getElementById('editTaskId').value);
    const title = document.getElementById('editTaskTitle').value.trim();
    const description = document.getElementById('editTaskDescription').value.trim();
    const dueDate = document.getElementById('editTaskDueDate').value;
    const priority = document.getElementById('editTaskPriority').value;

    tasks = tasks.map(task => 
        task.id === id ? { ...task, title, description, dueDate, priority } : task
    );

    // Close the modal after saving
    editModal.style.display = 'none';
    renderTasks();
    updateProgress();
});

// Close Edit Modal
closeModalButton.addEventListener('click', () => {
    editModal.style.display = 'none';
});

// Close modal when clicking outside of the modal content
window.addEventListener('click', (event) => {
    if (event.target === editModal) {
        editModal.style.display = 'none';
    }
});

// Theme Toggle
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    themeToggle.textContent = document.body.classList.contains('light-mode') ? '🌙' : '🌞';
});

// Real-time Clock (Philippine Time)
function updateClock() {
    const now = new Date().toLocaleString('en-PH', {
        timeZone: 'Asia/Manila',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
    });
    clockElement.textContent = now;
}

// Call clock function every second
setInterval(updateClock, 1000);

// Event Listener for Task Form
document.getElementById('taskForm').addEventListener('submit', addTask);
