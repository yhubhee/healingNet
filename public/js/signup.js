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

showpass.addEventListener("click", () => {
    if ((password.type === "password") && (confirmPassword.type === "password")) {
        password.type = 'text';
        confirmPassword.type = 'text';
        showpass.classList.replace("fa-eye-slash", "fa-eye");
    }
    else {
        password.type = 'password';
        confirmPassword.type = 'password';
        showpass.classList.replace("fa-eye", "fa-eye-slash");

    }
})

// Specialties categorized by department
const specialties = {
    "Primary Care & General Medicine": ["Preventive Medicine", "Occupational Medicine", "Public Health", "General Surgery", "Emergency Medicine"],

    "Internal Medicine & Subspecialties": ["Cardiology", "Endocrinology", "Gastroenterology", "Hematology", "Infectious Diseases", "Nephrology", "Neurology", "Pulmonology", "Rheumatology"],

    "Surgical Specialties": ["Cardiothoracic Surgery", "Neurosurgery", "Orthopedic Surgery", "Otolaryngology (ENT)", "Pediatric Surgery", "Plastic Surgery", "Urogynecology", "Urology", "Vascular Surgery"],

    "Women’s Health": ["Obstetrics and Gynecology", "Maternal-Fetal Medicine", "Gynecologic Oncology", "Reproductive Endocrinology"],

    "Pediatric Specialties": ["Pediatric Cardiology", "Pediatric Neurology", "Pediatric Oncology", "Pediatric Surgery"],
    "Mental Health": ["Addiction Medicine", "Psychiatry", "Psychology", "Psychiatric Nursing", "Social Work"],

    "Oncology & Cancer Care": ["Oncology", "Gynecologic Oncology", "Pediatric Oncology"],
    "Diagnostic & Laboratory Medicine": ["Laboratory", "Microbiology", "Nuclear Medicine", "Pathology", "Radiology", "Virology"],

    "Rehabilitation & Allied Health": ["Audiology", "Chiropractic Care", "Dietetics and Nutrition", "Occupational Therapy", "Physical Therapy", "Speech Therapy"],
    
    "Pain & Specialized Care": ["Anesthesiology", "Pain Management", "Intensive Care Unit (ICU)"]
};

function updateSpecialties() {
    let department = document.getElementById("department").value;
    let specialtySelect = document.getElementById("specialty");
    
    // Clear existing options
    specialtySelect.innerHTML = '<option selected>Select Specialty</option>';

    if (department in specialties) {
        specialties[department].forEach(specialty => {
            let option = document.createElement("option");
            option.value = specialty;
            option.textContent = specialty;
            specialtySelect.appendChild(option);
        });
    }
}
