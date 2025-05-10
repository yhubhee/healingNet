// Toggle Password Visibility
document.getElementById('password-icon').addEventListener('click', function () {
  const passwordField = document.getElementById('password');
  const icon = this;

  if (passwordField.type === 'password') {
    passwordField.type = 'text';
    icon.classList.remove('fa-eye-slash');
    icon.classList.add('fa-eye');
  } else {
    passwordField.type = 'password';
    icon.classList.remove('fa-eye');
    icon.classList.add('fa-eye-slash');
  }
});
