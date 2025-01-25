document.addEventListener('DOMContentLoaded', function () {
  const alerts = document.querySelectorAll('.alert');
  if (alerts) {
      setTimeout(() => {
          alerts.forEach(alert => {
              alert.style.display = 'none';
          });
      }, 5000); // Hide after 5 seconds
  }
});

 // Toggle Password Visibility
 const password = document.getElementById('password');
 const confirmPassword = document.getElementById('confirmpassword');
 
  // Toggle Password Visibility
  const showpass = document.querySelector(".showpass");
 
  showpass.addEventListener("click",()=>{
      if ((password.type === "password") && (confirmPassword.type === "password")){
          password.type = 'text';
          confirmPassword.type = 'text';
          showpass.classList.replace("fa-eye-slash", "fa-eye");
      }
      else{
          password.type = 'password';
          confirmPassword.type = 'password';
          showpass.classList.replace("fa-eye", "fa-eye-slash");
  
      }
  })
