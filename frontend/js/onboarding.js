// onboarding.js
// Phase 2 responsibility: make the chip selectors interactive
// and assemble the selections into one object. No backend call
// yet — that happens once /api routes exist (Phase 4/5), when
// this object gets sent as the user's onboardingPreferences.

const form = document.getElementById('onboardingForm');

// Update the "N selected" label whenever a chip in that group changes
function updateCounts() {
  document.querySelectorAll('.chip-group').forEach((group) => {
    const groupName = group.dataset.group;
    const checkedCount = group.querySelectorAll('input:checked').length;
    const counter = document.querySelector(`[data-count-for="${groupName}"]`);
    if (counter) {
      counter.textContent = `${checkedCount} selected`;
    }
  });
}

form.addEventListener('change', updateCounts);
updateCounts(); // run once on load in case the browser restores checked state

form.addEventListener('submit', (event) => {
  event.preventDefault();

  // FormData reads every named input inside the form automatically —
  // no need to manually query each checkbox one by one.
  const formData = new FormData(form);

  const preferences = {
    growth: formData.getAll('growth'),
    health: formData.getAll('health'),
    productivity: formData.getAll('productivity'),
  };

  // Phase 4/5: POST this object to something like
  // PATCH /api/users/onboarding, then redirect to dashboard.html
  console.log('Onboarding preferences ready to save:', preferences);

  window.location.href = 'dashboard.html';
});
