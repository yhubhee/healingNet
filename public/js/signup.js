// navbar.classList.add('fixed-top');

// window.addEventListener('scroll', function() {
//   const navbar = document.querySelector('.navbar');
//   if (window.scrollY > 50) {
//       navbar.classList.add('fixed-top');
//   } else {
//       navbar.classList.remove('fixed-top');
//   }
// });

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
  const pwShow = document.querySelector(".show");
  const pw = document.querySelector('#password');
  const conpw = document.querySelector('#confirmpassword');

  pwShow.addEventListener("click",()=>{
    if((pw.type === "password") && (conpw.type === "password")){
      pw.type = "text";
      conpw.type = "text";
      pwShow.classList.replace("fa-solid fa-eye-slash", "fa-solid fa-eye")
    }else{
      pw.type = "password";
      conpw.type = "password";
      pwShow.classList.replace("fa-solid fa-eye", "fa-solid fa-eye-slash")
    }
  });


  // Form Validation
  const form = document.getElementById('signupForm');
  form.addEventListener('submit', function (event) {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const feedback = document.getElementById('passwordFeedback');

    if (password !== confirmPassword) {
      event.preventDefault(); // Prevent form submission
      feedback.classList.remove('d-none'); // Show feedback
    } else {
      feedback.classList.add('d-none'); // Hide feedback
    }
  });