// illness categorized by Department
const illness = {
   "Primary Care": [
      "Hypertension",
      "flu",
      "diabetes",
      "asthma",
      "minor injuries",
      "malaria",
      "diarrheal diseases",
      "measles",
      "typhoid fever"
    ],

    "Internal Medicine and Subspecialties": [
        "coronary artery disease",
        "heart failure",
        "diabetes",
        "thyroid disorders",
        "peptic ulcers",
        "inflammatory bowel disease",
        "anemia",
        "leukemia",
        "pneumonia",
        "tuberculosis",
        "chronic kidney disease",
        "stroke",
        "epilepsy",
        "COPD",
        "asthma",
        "rheumatoid arthritis",
        "lupus",
        "HIV/AIDS",
        "meningitis",
        "Lassa fever",
        "hepatitis B",
        "hepatitis C",
        "yellow fever"
    ],
    "Surgical Specialties": [
      "appendicitis",
      "hernias",
      "gallstones",
      "coronary artery disease (for bypass)",
      "brain tumors",
      "spinal disc herniation",
      "fractures",
      "joint replacements",
      "tonsillitis",
      "sinusitis",
      "congenital anomalies",
      "burns",
      "pelvic organ prolapse",
      "kidney stones",
      "prostate cancer",
      "aneurysms"
    ],

 "Women’s Health": [
      "gestational diabetes",
      "preeclampsia",
      "menstrual disorders",
      "fibroids",
      "endometriosis",
      "ovarian cancer",
      "cervical cancer",
      "infertility",
      "polycystic ovary syndrome"
    ],

   "Pediatric Specialties": [
      "congenital heart defects",
      "Kawasaki disease",
      "cerebral palsy",
      "epilepsy",
      "leukemia",
      "neuroblastoma",
      "appendicitis",
      "hernias",
      "measles",
      "malaria",
      "pneumonia",
      "diarrheal diseases"
    ],

    "Mental Health": [
        "depression",
        "schizophrenia",
        "bipolar disorder",
        "anxiety disorders",
        "personality disorders",
        "substance use disorders"
      ],
    "Oncology and Cancer Care": [
      "breast cancer",
      "lung cancer",
      "colorectal cancer",
      "prostate cancer",
      "leukemia",
      "lymphoma",
      "ovarian cancer",
      "cervical cancer"
    ], 

   "Rehabilitation and Allied Health": [
      "stroke recovery",
      "spinal cord injuries",
      "amputations",
      "hearing loss",
      "speech disorders",
      "nutritional deficiencies",
      "trachoma"
    ],

    "Pain and Specialized Care": [
      "schistosomiasis",
      "lymphatic filariasis",
      "soil-transmitted helminth infections"
    ]


};


function updateDoctors() {
    const illness_Select = document.getElementById("illness_Select");
    const doctorSelect = document.getElementById("doctorSelect");
    const selectedIllness = illness_Select.value;

    // Clear previous doctor options
    doctorSelect.innerHTML = '<option value="" disabled selected>Select Doctor</option>';

    let department = null;
    for (const dept in illness) {
        if (illness[dept].includes(selectedIllness)) {
            department = dept;
            break;
        }
        console.log(dept)
    }

    if (department) {
        fetch(`/getDoctors?department=${department}`)
            .then(response => response.json())
            .then(data => {
                data.doctors.forEach(doctor => {
                    const option = document.createElement("option");
                    option.textContent = `${doctor.firstname} ${doctor.lastname}`;
                    doctorSelect.appendChild(option);
                });
            })
            .catch(error => console.error('Error fetching doctors:', error));
    }
}

// Add event listener for specialty change
document.getElementById("specialtySelect").addEventListener("change", updateDoctors);



// function updateSpecialties() {
//     const departmentSelect = document.getElementById("departmentSelect");
//     const specialtySelect = document.getElementById("specialtySelect");
//     const selectedDepartment = departmentSelect.value;

//     Clear previous specialty options
//     specialtySelect.innerHTML = '<option value="" disabled selected>Select Specialty</option>';

//     if (selectedDepartment && specialties[selectedDepartment]) {
//         specialties[selectedDepartment].forEach(specialty => {
//             const option = document.createElement("option");
//             option.value = specialty;
//             option.textContent = specialty;
//             specialtySelect.appendChild(option);
//         });
//     }
// }

// function updateDoctors() {
//     const specialtySelect = document.getElementById("specialtySelect");
//     const doctorSelect = document.getElementById("doctorSelect");
//     const selectedSpecialty = specialtySelect.value;

//     // Clear previous doctor options
//     doctorSelect.innerHTML = '<option value="" disabled selected>Select Doctor</option>';

//     if (selectedSpecialty) {
//         fetch(`/getDoctors?specialty=${selectedSpecialty}`)
//             .then(response => response.json())
//             .then(data => {
//                 data.doctors.forEach(doctor => {
//                     const option = document.createElement("option");
//                     // option.value = doctor.doctor_id;
//                     option.textContent = `${doctor.firstname} ${doctor.lastname}`;
//                     doctorSelect.appendChild(option);
//                 });
//             })
//             .catch(error => console.error('Error fetching doctors:', error));
//     }
// }


// // Add event listener for specialty change
// document.getElementById("specialtySelect").addEventListener("change", updateDoctors);