// dashboard.js
// Phase 2 responsibility: render the dashboard from a DATA OBJECT,
// not hardcoded HTML. Right now that object is hand-written mock
// data. In Phase 4/5, mockDashboardData gets replaced by the JSON
// returned from something like GET /api/dashboard — but every
// render function below stays exactly the same, because they
// don't care where the data came from, only its shape.

const mockDashboardData = {
  user: { name: 'Alex' },

  routine: {
    completionPercent: 80,
    tasks: [
      { time: '06:30', label: 'Wake up', done: true },
      { time: '07:00', label: 'Exercise', done: true },
      { time: '08:00', label: 'Breakfast', done: true },
      { time: '09:00', label: 'Study', done: true },
      { time: '13:00', label: 'Lunch', done: false },
      { time: '18:00', label: 'Revision', done: false },
    ],
  },

  nextEvent: { time: '5:00 PM', title: 'Study — Chapter 4 revision' },

  health: {
    water: { current: 5, goal: 8 },
    sleep: { hours: 7 },
  },

  diary: {
    date: 'Tuesday, August 12',
    excerpt: 'Today I finally stuck to my morning routine without snoozing...',
  },

  streak: { days: 7 },

  week: [
    { day: 'Mon', percent: 80 },
    { day: 'Tue', percent: 60 },
    { day: 'Wed', percent: 90 },
    { day: 'Thu', percent: 50 },
    { day: 'Fri', percent: 80 },
    { day: 'Sat', percent: 30 },
    { day: 'Sun', percent: 0 },
  ],
};

// ----- Render functions: one per widget, each takes the slice of
// data it needs. Keeping them separate means later, swapping mock
// data for real API data only touches the top of this file. -----

function renderGreeting(data) {
  const hour = new Date().getHours();
  const timeOfDay = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';
  document.getElementById('greetingText').textContent =
    `Good ${timeOfDay}, ${data.user.name} 🌤️`;

  document.getElementById('todayDate').textContent =
    new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

function renderRoutine(routine) {
  document.getElementById('routinePercent').textContent = `${routine.completionPercent}%`;
  document.getElementById('routineProgressFill').style.width = `${routine.completionPercent}%`;

  const list = document.getElementById('routineTaskList');
  list.innerHTML = ''; // clear before rendering, in case this runs twice

  routine.tasks.forEach((task) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span class="task-dot ${task.done ? 'done' : ''}"></span>
      <span class="task-time">${task.time}</span>
      <span class="${task.done ? 'task-done' : ''}">${task.label}</span>
    `;
    list.appendChild(li);
  });
}

function renderNextEvent(nextEvent) {
  document.getElementById('nextUpTime').textContent = nextEvent.time;
  document.getElementById('nextUpTitle').textContent = nextEvent.title;
}

function renderHealth(health) {
  const grid = document.getElementById('healthMiniGrid');
  grid.innerHTML = `
    <div class="health-stat">
      <p class="health-stat-label">Water</p>
      <p class="health-stat-value">${health.water.current}/${health.water.goal} glasses</p>
    </div>
    <div class="health-stat">
      <p class="health-stat-label">Sleep</p>
      <p class="health-stat-value">${health.sleep.hours}h</p>
    </div>
  `;
}

function renderDiary(diary) {
  document.getElementById('diaryDate').textContent = diary.date;
  document.getElementById('diaryPreview').textContent = `"${diary.excerpt}"`;
}

function renderStreak(streak) {
  document.getElementById('streakCount').textContent = streak.days;
}

function renderWeekBars(week) {
  const container = document.getElementById('weekBars');
  container.innerHTML = '';

  week.forEach((entry) => {
    const col = document.createElement('div');
    col.className = 'week-bar-col';
    col.innerHTML = `
      <div class="week-bar" style="height: 80px;">
        <div class="week-bar-fill" style="height: ${entry.percent}%;"></div>
      </div>
      <span class="week-bar-day">${entry.day}</span>
    `;
    container.appendChild(col);
  });
}

// ----- Run everything once the page loads -----
function renderDashboard(data) {
  renderGreeting(data);
  renderRoutine(data.routine);
  renderNextEvent(data.nextEvent);
  renderHealth(data.health);
  renderDiary(data.diary);
  renderStreak(data.streak);
  renderWeekBars(data.week);
}

renderDashboard(mockDashboardData);
