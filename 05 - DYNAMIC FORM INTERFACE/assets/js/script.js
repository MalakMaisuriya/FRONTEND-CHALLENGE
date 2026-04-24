document.getElementById("registerForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const form = e.target;
  let isValid = true;

  const username = document.getElementById("username");
  const age = document.getElementById("age");
  const email = document.getElementById("email");
  const course = document.getElementById("course");
  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirmPassword");

  form.classList.remove("was-validated");

if (!username.value.trim()) isValid = false;
if (!age.value || age.value <= 0) isValid = false;

if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) isValid = false;

if (!course.value) isValid = false;
if (!password.value.trim()) isValid = false;
if (password.value !== confirmPassword.value) isValid = false;

  if (!isValid) {
    form.classList.add("was-validated");
    return;
  }

  alert(`🎉 Registration Successful!\nWelcome, ${username.value}!`);
  form.reset();
});

