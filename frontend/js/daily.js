// daily.js
// Phase 3 responsibility: full CRUD (Create, Read, Update, Delete)
// for daily routine tasks, backed by an in-memory array that is
// seeded once from data/routines.json via fetch().
//
// IMPORTANT LIMITATION (read this before testing):
// fetch() can only load local files when the page is served over
// http:// (e.g. via VS Code's "Live Server" extension), not when
// opened directly as a file:// path — browsers block that for
// security reasons. If fetch fails, we fall back to a small
// built-in dataset so the page still works either way.

let tasks = [];

const fallbackTasks = [
  { id: 't1', time: '06:30', label: 'Wake up', category: 'routine', done: true },
  { id: 't2', time: '09:00', label: 'Study', category: 'productivity', done: false },
];

async function loadTasks() {
  try {
    const response = await fetch('data/routines.json');
    if (!response.ok) throw new Error('Could not load routines.json');
    const data = await response.json();
    tasks = data.tasks;
  } catch (error) {
    console.warn('Falling back to built-in data (are you opening this file directly instead of via Live Server?):', error);
    tasks = fallbackTasks;
  }
  render();
}

// ----- Rendering -----
function render() {
  renderDate();
  renderSummary();
  renderTaskList();
}

function renderDate() {
  document.getElementById('routineDate').textContent =
    new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

function renderSummary() {
  const total = tasks.length;
  const doneCount = tasks.filter((t) => t.done).length;
  const percent = total === 0 ? 0 : Math.round((doneCount / total) * 100);

  document.getElementById('routinePercent').textContent = `${percent}%`;
  document.getElementById('routineProgressFill').style.width = `${percent}%`;
  document.getElementById('routineCount').textContent = `${doneCount} of ${total} done`;
}

function renderTaskList() {
  const list = document.getElementById('taskCardList');
  list.innerHTML = '';

  if (tasks.length === 0) {
    list.innerHTML = `<li class="empty-state">No tasks yet — add your first one above.</li>`;
    return;
  }

  // sort a COPY of the array by time, so the original order in
  // `tasks` doesn't matter for editing/deleting logic
  const sorted = [...tasks].sort((a, b) => a.time.localeCompare(b.time));

  sorted.forEach((task) => {
    const li = document.createElement('li');
    li.className = `task-card ${task.done ? 'is-done' : ''}`;
    li.innerHTML = `
      <button class="task-checkbox ${task.done ? 'checked' : ''}" data-action="toggle" data-id="${task.id}">
        ${task.done ? '✓' : ''}
      </button>
      <span class="task-time">${task.time}</span>
      <div class="task-main">
        <p class="task-label">${escapeHtml(task.label)}</p>
        <span class="task-category">${task.category}</span>
      </div>
      <div class="task-actions">
        <button class="task-icon-btn" data-action="edit" data-id="${task.id}">Edit</button>
        <button class="task-icon-btn delete" data-action="delete" data-id="${task.id}">Delete</button>
      </div>
    `;
    list.appendChild(li);
  });
}

// Basic protection against user input accidentally being read as
// HTML tags when we insert it via innerHTML above.
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ----- CRUD operations -----
function addTask(newTask) {
  tasks.push(newTask);
  render();
}

function toggleTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (task) task.done = !task.done;
  render();
}

function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  render();
}

function editTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;

  // Simple prompt-based edit for now. A nicer inline editor
  // (turning the row into input fields) is a good next upgrade
  // once the core CRUD is working.
  const newLabel = prompt('Edit task name:', task.label);
  if (newLabel === null) return; // user clicked cancel
  const newTime = prompt('Edit time (HH:MM):', task.time);
  if (newTime === null) return;

  task.label = newLabel.trim() || task.label;
  task.time = newTime.trim() || task.time;
  render();
}

// ----- Event listeners -----

// Add task form
document.getElementById('addTaskForm').addEventListener('submit', (event) => {
  event.preventDefault();

  const time = document.getElementById('taskTime').value;
  const label = document.getElementById('taskLabel').value.trim();
  const category = document.getElementById('taskCategory').value;

  if (!time || !label) return;

  addTask({
    id: 't' + Date.now(), // simple unique id using the current timestamp
    time,
    label,
    category,
    done: false,
  });

  event.target.reset();
});

// One shared listener on the list, instead of one per button.
// This is called "event delegation" — since task cards are added
// and removed dynamically, attaching a listener to each button
// individually would mean re-attaching after every render().
// Listening on the parent once, and checking which button was
// clicked via data-action, avoids that entirely.
document.getElementById('taskCardList').addEventListener('click', (event) => {
  const button = event.target.closest('[data-action]');
  if (!button) return;

  const id = button.dataset.id;
  const action = button.dataset.action;

  if (action === 'toggle') toggleTask(id);
  if (action === 'delete') deleteTask(id);
  if (action === 'edit') editTask(id);
});

loadTasks();
