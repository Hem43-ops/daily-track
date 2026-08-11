// main.js
// Phase 1 responsibility: just the mobile navbar toggle.
// As we add pages, shared behavior (like this) belongs here;
// page-specific logic goes in its own file (daily.js, diary.js, etc.)

const navToggle = document.getElementById('navToggle');
const primaryNav = document.getElementById('primaryNav');

navToggle.addEventListener('click', () => {
  const isOpen = primaryNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
});
