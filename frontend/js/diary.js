// diary.js
// Same pattern as daily.js: seed data loaded once via fetch(),
// then all CRUD happens on an in-memory array. Refreshing resets
// to data/diary.json — same reasoning as the routine page.

let entries = [];
let activeEntryId = null; // which entry is currently open in the editor

const fallbackEntries = [
  {
    id: 'd1',
    date: new Date().toISOString().slice(0, 10),
    title: 'First entry',
    content: 'Welcome to your diary.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

async function loadEntries() {
  try {
    const response = await fetch('data/diary.json');
    if (!response.ok) throw new Error('Could not load diary.json');
    const data = await response.json();
    entries = data.entries;
  } catch (error) {
    console.warn('Falling back to built-in data (are you opening this file directly instead of via Live Server?):', error);
    entries = fallbackEntries;
  }

  // open the most recent entry by default, if any exist
  if (entries.length > 0) {
    const mostRecent = [...entries].sort((a, b) => b.date.localeCompare(a.date))[0];
    openEntry(mostRecent.id);
  } else {
    renderList();
  }
}

// ----- List rendering -----
function renderList() {
  const list = document.getElementById('entryList');
  const searchTerm = document.getElementById('diarySearch').value.trim().toLowerCase();

  const filtered = entries.filter((entry) => {
    if (!searchTerm) return true;
    return (
      entry.title.toLowerCase().includes(searchTerm) ||
      entry.content.toLowerCase().includes(searchTerm)
    );
  });

  const sorted = [...filtered].sort((a, b) => b.date.localeCompare(a.date));

  list.innerHTML = '';

  if (sorted.length === 0) {
    list.innerHTML = `<li class="entry-list-empty">No entries found.</li>`;
    return;
  }

  sorted.forEach((entry) => {
    const li = document.createElement('li');
    li.className = `entry-list-item ${entry.id === activeEntryId ? 'active' : ''}`;
    li.dataset.id = entry.id;
    li.innerHTML = `
      <p class="entry-list-date">${formatDateDisplay(entry.date)}</p>
      <p class="entry-list-title">${escapeHtml(entry.title) || 'Untitled entry'}</p>
      <p class="entry-list-snippet">${escapeHtml(entry.content) || 'No content yet.'}</p>
    `;
    list.appendChild(li);
  });
}

function formatDateDisplay(isoDate) {
  const date = new Date(isoDate + 'T00:00:00');
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}

// ----- Editor -----
function openEntry(id) {
  const entry = entries.find((e) => e.id === id);
  if (!entry) return;

  activeEntryId = id;
  document.getElementById('editorDate').value = entry.date;
  document.getElementById('editorTitle').value = entry.title;
  document.getElementById('editorContent').value = entry.content;
  document.getElementById('editorStatus').textContent =
    `Last edited ${new Date(entry.updatedAt).toLocaleString()}`;

  renderList();
}

function clearEditor() {
  activeEntryId = null;
  document.getElementById('editorDate').value = new Date().toISOString().slice(0, 10);
  document.getElementById('editorTitle').value = '';
  document.getElementById('editorContent').value = '';
  document.getElementById('editorStatus').textContent = 'New entry — not saved yet';
  document.getElementById('editorTitle').focus();
  renderList();
}

function saveEntry() {
  const date = document.getElementById('editorDate').value;
  const title = document.getElementById('editorTitle').value.trim();
  const content = document.getElementById('editorContent').value.trim();

  if (!date) {
    alert('Please choose a date for this entry.');
    return;
  }

  const now = new Date().toISOString();

  if (activeEntryId) {
    // update an existing entry
    const entry = entries.find((e) => e.id === activeEntryId);
    entry.date = date;
    entry.title = title;
    entry.content = content;
    entry.updatedAt = now;
  } else {
    // create a new entry
    const newEntry = {
      id: 'd' + Date.now(),
      date,
      title,
      content,
      createdAt: now,
      updatedAt: now,
    };
    entries.push(newEntry);
    activeEntryId = newEntry.id;
  }

  document.getElementById('editorStatus').textContent = `Saved just now`;
  renderList();
}

function deleteEntry() {
  if (!activeEntryId) {
    clearEditor();
    return;
  }
  const confirmed = confirm('Delete this entry? This cannot be undone.');
  if (!confirmed) return;

  entries = entries.filter((e) => e.id !== activeEntryId);
  activeEntryId = null;

  if (entries.length > 0) {
    openEntry(entries[0].id);
  } else {
    clearEditor();
  }
}

// ----- Event listeners -----
document.getElementById('newEntryBtn').addEventListener('click', clearEditor);
document.getElementById('saveEntryBtn').addEventListener('click', saveEntry);
document.getElementById('deleteEntryBtn').addEventListener('click', deleteEntry);
document.getElementById('diarySearch').addEventListener('input', renderList);

// event delegation again, same reasoning as daily.js — the list
// is rebuilt on every render(), so one listener on the parent
// avoids re-attaching listeners to every item each time.
document.getElementById('entryList').addEventListener('click', (event) => {
  const item = event.target.closest('[data-id]');
  if (!item) return;
  openEntry(item.dataset.id);
});

loadEntries();
