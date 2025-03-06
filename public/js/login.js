  // Toggle Password Visibility
  const showpass = document.querySelector(".showpass");

  showpass.addEventListener("click",()=>{
      if ((password.type === "password")){
          password.type = 'text';
          showpass.classList.replace("fa-eye-slash", "fa-eye");
      }
      else{
          password.type = 'password';
          showpass.classList.replace("fa-eye", "fa-eye-slash");
  
      }
  })

  document.addEventListener('DOMContentLoaded', function () {
    const message = document.querySelectorAll('.show');
    if (message) {
        setTimeout(() => {
            message.forEach(message => {
                message.style.display = 'none';
            });
        }, 5000); // Hide after 5 seconds
    }
});

