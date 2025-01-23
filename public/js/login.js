
  // Toggle Password Visibility
  function togglePasswordVisibility() {
    const passwordField = document.getElementById('password');
    const icon = document.getElementById('togglePasswordIcon');
    if (passwordField.type === 'password') {
      passwordField.type = 'text';
      icon.classList.replace('bi-eye-slash', 'bi-eye');
    } else {
      passwordField.type = 'password';
      icon.classList.replace('bi-eye', 'bi-eye-slash');
    }
  }