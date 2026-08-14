// progress.js
// Same seed-JSON pattern as the other pages. This page is
// read-only (no add/edit/delete) — it just visualizes numbers
// that, in Phase 4/5, will be computed by the backend from your
// real routine/health/diary/timetable records, e.g. via
// GET /api/progress. For now that aggregation is faked in
// data/progress.json, but every render function below already
// expects the real shape that endpoint will eventually return.

const CATEGORY_COLORS = {
  productivity: 'var(--color-ink)',
  health: 'var(--color-slate)',
  routine: 'var(--color-clay)',
  other: '#B79A2E',
};

const fallbackProgress = {
  stats: { routineCompletion: 0, streakDays: 0, diaryEntries: 0, timetableCompletion: 0 },
  week: [],
  categoryBreakdown: { productivity: 0, health: 0, routine: 0, other: 0 },
  monthGrid: [],
};

async function loadProgress() {
  let data;
  try {
    const response = await fetch('data/progress.json');
    if (!response.ok) throw new Error('Could not load progress.json');
    data = await response.json();
  } catch (error) {
    console.warn('Falling back to built-in data (are you opening this file directly instead of via Live Server?):', error);
    data = fallbackProgress;
  }

  renderStats(data.stats);
  renderWeekBars(data.week);
  renderDonut(data.categoryBreakdown);
  renderInkGrid(data.monthGrid);
}

// ----- Stat cards -----
function renderStats(stats) {
  const row = document.getElementById('statRow');
  const cards = [
    { value: `${stats.routineCompletion}%`, label: 'Avg. routine completion' },
    { value: `🔥 ${stats.streakDays}`, label: 'Day streak' },
    { value: stats.diaryEntries, label: 'Diary entries written' },
    { value: `${stats.timetableCompletion}%`, label: 'Timetable events completed' },
  ];

  row.innerHTML = cards
    .map(
      (card) => `
      <div class="stat-card">
        <p class="stat-value">${card.value}</p>
        <p class="stat-label">${card.label}</p>
      </div>
    `
    )
    .join('');
}

// ----- Weekly bars -----
function renderWeekBars(week) {
  const container = document.getElementById('weekBarsLarge');
  container.innerHTML = week
    .map(
      (entry) => `
      <div class="week-bar-col-lg">
        <span class="week-bar-lg-percent">${entry.percent}%</span>
        <div class="week-bar-lg">
          <div class="week-bar-lg-fill" style="height: ${entry.percent}%;"></div>
        </div>
        <span class="week-bar-lg-day">${entry.day}</span>
      </div>
    `
    )
    .join('');
}

// ----- Donut chart (pure CSS conic-gradient) -----
function renderDonut(breakdown) {
  const total = Object.values(breakdown).reduce((sum, v) => sum + v, 0);
  const donut = document.getElementById('categoryDonut');
  const legend = document.getElementById('donutLegend');

  if (total === 0) {
    donut.style.background = 'var(--color-line)';
    legend.innerHTML = `<p class="donut-legend-item">No timetable data yet.</p>`;
    return;
  }

  // Build a conic-gradient string like:
  // "color1 0% 40%, color2 40% 65%, color3 65% 90%, color4 90% 100%"
  // by walking through each category and tracking where the
  // previous slice ended.
  let cursor = 0;
  const slices = [];
  const legendItems = [];

  Object.entries(breakdown).forEach(([category, minutes]) => {
    const percent = (minutes / total) * 100;
    const start = cursor;
    const end = cursor + percent;
    const color = CATEGORY_COLORS[category] || '#999';

    slices.push(`${color} ${start}% ${end}%`);
    legendItems.push(`
      <div class="donut-legend-item">
        <span class="donut-legend-dot" style="background: ${color};"></span>
        ${category[0].toUpperCase() + category.slice(1)} — ${Math.round(percent)}%
      </div>
    `);

    cursor = end;
  });

  donut.style.background = `conic-gradient(${slices.join(', ')})`;
  legend.innerHTML = legendItems.join('');
}

// ----- Ink consistency grid -----
function renderInkGrid(monthGrid) {
  const grid = document.getElementById('inkGrid');
  grid.innerHTML = monthGrid
    .map((level) => `<div class="ink-cell ${level > 0 ? `level-${level}` : ''}"></div>`)
    .join('');
}

loadProgress();
