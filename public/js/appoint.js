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
    const departmentSelect = document.getElementById("departmentSelect");
    const specialtySelect = document.getElementById("specialtySelect");
    const selectedDepartment = departmentSelect.value;

    // Clear previous specialty options
    specialtySelect.innerHTML = '<option value="" disabled selected>Select Specialty</option>';

    if (selectedDepartment && specialties[selectedDepartment]) {
        specialties[selectedDepartment].forEach(specialty => {
            const option = document.createElement("option");
            option.value = specialty;
            option.textContent = specialty;
            specialtySelect.appendChild(option);
        });
    }
}

function updateDoctors() {
    const specialtySelect = document.getElementById("specialtySelect");
    const doctorSelect = document.getElementById("doctorSelect");
    const selectedSpecialty = specialtySelect.value;

    // Clear previous doctor options
    doctorSelect.innerHTML = '<option value="" disabled selected>Select Doctor</option>';

    if (selectedSpecialty) {
        fetch(`/getDoctors?specialty=${selectedSpecialty}`)
            .then(response => response.json())
            .then(data => {
                data.doctors.forEach(doctor => {
                    const option = document.createElement("option");
                    // option.value = doctor.doctor_id;
                    option.textContent = `${doctor.firstname} ${doctor.lastname}`;
                    doctorSelect.appendChild(option);
                });
            })
            .catch(error => console.error('Error fetching doctors:', error));
    }
}

// Add event listener for specialty change
document.getElementById("specialtySelect").addEventListener("change", updateDoctors);