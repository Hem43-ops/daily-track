// auth.js
// Phase 2 responsibility: client-side form validation only.
// There is NO real authentication yet — no server call, no
// password hashing, nothing saved. That's Phase 4/5, once
// Express + MongoDB exist. This just prevents obviously-bad
// input and gives the user immediate feedback.

function showError(fieldEl, isValid) {
  fieldEl.classList.toggle('invalid', !isValid);
}

// ----- Login form -----
const loginForm = document.getElementById('loginForm');

if (loginForm) {
  loginForm.addEventListener('submit', (event) => {
    event.preventDefault(); // stop the browser's default page reload

    const email = document.getElementById('loginEmail');
    const password = document.getElementById('loginPassword');

    const emailValid = email.value.includes('@');
    const passwordValid = password.value.length > 0;

    showError(document.getElementById('loginEmailField'), emailValid);
    showError(document.getElementById('loginPasswordField'), passwordValid);

    if (emailValid && passwordValid) {
      // Phase 4/5 will replace this with a real fetch() call to
      // POST /api/auth/login
      console.log('Login form valid. Ready to connect to backend.');
      //Returning users already completed onboarding, os they skip
      //straight to dashboard
      window.location.href='dashboard.html';
    }
  });
}

// ----- Signup form -----
const signupForm = document.getElementById('signupForm');

if (signupForm) {
  signupForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.getElementById('signupName');
    const email = document.getElementById('signupEmail');
    const password = document.getElementById('signupPassword');
    const confirm = document.getElementById('signupConfirm');

    const nameValid = name.value.trim().length > 0;
    const emailValid = email.value.includes('@');
    const passwordValid = password.value.length >= 8;
    const confirmValid = confirm.value === password.value && confirm.value.length > 0;

    showError(document.getElementById('signupNameField'), nameValid);
    showError(document.getElementById('signupEmailField'), emailValid);
    showError(document.getElementById('signupPasswordField'), passwordValid);
    showError(document.getElementById('signupConfirmField'), confirmValid);

    if (nameValid && emailValid && passwordValid && confirmValid) {
      // Phase 4/5 will replace this with a real fetch() call to
      // POST /api/auth/signup, then redirect to the onboarding form
      console.log('Signup form valid. Ready to connect to backend.');

      //New users haven't set preferences yet,so they go onbpardign 
      //first-never straight to dashboard
      window.location.href='onboarding.html';
    }
  });
}
