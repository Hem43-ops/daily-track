// health.js
// Same seed-then-in-memory pattern as daily.js and diary.js.
// Four independent widgets share one `healthLog` object.

let healthLog = {
  water: { glasses: 0, goal: 8 },
  sleep: { hours: 0 },
  meals: [],
  activity: [],
};

const fallbackHealthLog = {
  water: { glasses: 0, goal: 8 },
  sleep: { hours: 0 },
  meals: [],
  activity: [],
};

async function loadHealthLog() {
  try {
    const response = await fetch('data/health.json');
    if (!response.ok) throw new Error('Could not load health.json');
    const data = await response.json();
    healthLog = {
      water: data.water,
      sleep: data.sleep,
      meals: data.meals,
      activity: data.activity,
    };
  } catch (error) {
    console.warn('Falling back to built-in data (are you opening this file directly instead of via Live Server?):', error);
    healthLog = fallbackHealthLog;
  }
  renderAll();
}

function renderAll() {
  renderWater();
  document.getElementById('sleepHours').value = healthLog.sleep.hours || '';
  renderMeals();
  renderActivity();
}

// ----- Water -----
function renderWater() {
  const { glasses, goal } = healthLog.water;
  document.getElementById('waterCount').textContent = `${glasses} glasses`;
  document.getElementById('waterGoalText').textContent = `${glasses} of ${goal} glasses`;

  const dotsContainer = document.getElementById('waterGlasses');
  dotsContainer.innerHTML = '';
  for (let i = 0; i < goal; i++) {
    const dot = document.createElement('span');
    dot.className = `water-glass-dot ${i < glasses ? 'filled' : ''}`;
    dotsContainer.appendChild(dot);
  }
}

document.getElementById('waterPlus').addEventListener('click', () => {
  healthLog.water.glasses++;
  renderWater();
});

document.getElementById('waterMinus').addEventListener('click', () => {
  healthLog.water.glasses = Math.max(0, healthLog.water.glasses - 1);
  renderWater();
});

// ----- Sleep -----
document.getElementById('sleepSaveBtn').addEventListener('click', () => {
  const hours = parseFloat(document.getElementById('sleepHours').value);
  healthLog.sleep.hours = isNaN(hours) ? 0 : hours;
  alert(`Saved: ${healthLog.sleep.hours} hours of sleep.`);
});

// ----- Meals -----
function renderMeals() {
  const list = document.getElementById('mealList');
  list.innerHTML = '';

  if (healthLog.meals.length === 0) {
    list.innerHTML = `<li class="mini-list-empty">No meals logged yet.</li>`;
    return;
  }

  healthLog.meals.forEach((meal) => {
    const li = document.createElement('li');
    li.className = 'mini-list-item';
    li.innerHTML = `
      <span><span class="mini-list-item-tag">${escapeHtml(meal.meal)}</span> — ${escapeHtml(meal.food)} ${meal.calories ? `(${meal.calories} cal)` : ''}</span>
      <button class="mini-list-remove" data-id="${meal.id}" data-type="meal">✕</button>
    `;
    list.appendChild(li);
  });
}

document.getElementById('mealForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const meal = document.getElementById('mealType').value;
  const food = document.getElementById('mealFood').value.trim();
  const calories = parseInt(document.getElementById('mealCalories').value) || null;

  if (!food) return;

  healthLog.meals.push({ id: 'm' + Date.now(), meal, food, calories });
  event.target.reset();
  renderMeals();
});

// ----- Activity -----
function renderActivity() {
  const list = document.getElementById('activityList');
  list.innerHTML = '';

  if (healthLog.activity.length === 0) {
    list.innerHTML = `<li class="mini-list-empty">No activity logged yet.</li>`;
    return;
  }

  healthLog.activity.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'mini-list-item';
    li.innerHTML = `
      <span>${escapeHtml(item.type)} ${item.duration ? `— ${item.duration} min` : ''}</span>
      <button class="mini-list-remove" data-id="${item.id}" data-type="activity">✕</button>
    `;
    list.appendChild(li);
  });
}

document.getElementById('activityForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const type = document.getElementById('activityType').value.trim();
  const duration = parseInt(document.getElementById('activityDuration').value) || null;

  if (!type) return;

  healthLog.activity.push({ id: 'a' + Date.now(), type, duration });
  event.target.reset();
  renderActivity();
});

// ----- Shared remove handler (event delegation) for both mini-lists -----
document.querySelectorAll('.mini-list').forEach((list) => {
  list.addEventListener('click', (event) => {
    const button = event.target.closest('[data-id]');
    if (!button) return;

    const { id, type } = button.dataset;
    if (type === 'meal') {
      healthLog.meals = healthLog.meals.filter((m) => m.id !== id);
      renderMeals();
    } else if (type === 'activity') {
      healthLog.activity = healthLog.activity.filter((a) => a.id !== id);
      renderActivity();
    }
  });
});

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}

loadHealthLog();
