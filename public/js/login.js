// Toggle Password Visibility
document.addEventListener('DOMContentLoaded', function () {
    const password = document.getElementById("password"); // Select the password input field
    const showpass = document.querySelector(".showpass"); // Select the eye icon

    if (showpass && password) {
        showpass.addEventListener("click", () => {
            if (password.type === "password") {
                password.type = 'text';
                showpass.classList.replace("fa-eye-slash", "fa-eye");
            } else {
                password.type = 'password';
                showpass.classList.replace("fa-eye", "fa-eye-slash");
            }
        });
    }

    // Hide messages after 5 seconds
    const messages = document.querySelectorAll('.show');
    if (messages) {
        setTimeout(() => {
            messages.forEach(message => {
                message.style.display = 'none';
            });
        }, 5000); // Hide after 5 seconds
    }
});