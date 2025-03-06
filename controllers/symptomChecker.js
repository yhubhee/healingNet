const symptoms = {
    "Primary Care": {
        "Hypertension": {
            common: [
                "Often asymptomatic (known as the 'silent killer')",
                "Headaches (especially morning headaches)",
                "Dizziness",
                "Blurred vision"
            ],
            less_common: [
                "Nosebleeds (rare)",
                "Shortness of breath",
                "Chest pain",
                "Anxiety or nervousness"
            ],
            telemedicine_context: "Patients can report symptoms like headaches or dizziness via virtual consultation. Blood pressure monitoring devices (if available) can be used at home, with results shared remotely."
        },
        "flu": {
            common: [
                "High fever (often sudden onset)",
                "Chills",
                "Body aches and muscle pain",
                "Fatigue and weakness",
                "Headache",
                "Dry cough",
                "Sore throat",
                "Runny or stuffy nose"
            ],
            less_common: [
                "Nausea or vomiting (more common in children)",
                "Diarrhea (more common in children)",
                "Loss of taste or smell (seen in some viral infections)"
            ],
            telemedicine_context: "Symptoms like fever, cough, and fatigue can be assessed via patient-reported data. Doctors can prescribe antivirals or recommend rest and fluids."
        },
        "diabetes": {
            common: [
                "Increased thirst",
                "Frequent urination",
                "Fatigue",
                "Blurred vision",
                "Slow-healing sores or frequent infections",
                "Unexplained weight loss"
            ],
            less_common: [
                "Tingling or numbness in hands/feet (neuropathy)",
                "Dry mouth",
                "Increased hunger"
            ],
            telemedicine_context: "Patients can report symptoms like thirst and fatigue. A GP can order a blood glucose test if diabetes is suspected, addressing the need for a blood test."
        },
        "asthma": {
            common: [
                "Shortness of breath",
                "Wheezing",
                "Chest tightness or pain",
                "Coughing, especially at night or early morning"
            ],
            less_common: [
                "Difficulty sleeping due to breathing issues",
                "Fatigue from poor oxygenation",
                "Rapid breathing"
            ],
            telemedicine_context: "Patients can describe wheezing or shortness of breath. Doctors can adjust inhaler prescriptions or recommend a peak flow meter for home use."
        },
        "minor injuries": {
            common: [
                "Pain in the affected area",
                "Swelling",
                "Bruising",
                "Limited range of motion"
            ],
            less_common: [
                "Stiffness",
                "Warmth or redness (if infected)",
                "Numbness or tingling (if nerve-related)"
            ],
            telemedicine_context: "Patients can show swelling or bruising via video call. Doctors can recommend RICE (rest, ice, compression, elevation) or refer for in-person care if severe."
        },
        "malaria": {
            common: [
                "High fever (often cyclical)",
                "Chills and shivering",
                "Sweating",
                "Headache",
                "Muscle aches and fatigue",
                "Nausea and vomiting"
            ],
            less_common: [
                "Diarrhea",
                "Abdominal pain",
                "Confusion or seizures (in severe cases)",
                "Jaundice (yellowing of skin/eyes)"
            ],
            telemedicine_context: "Fever and chills can be reported, but malaria requires a blood test for confirmation. A GP can order this test and prescribe antimalarials if confirmed."
        },
        "diarrheal diseases": {
            common: [
                "Frequent loose or watery stools",
                "Abdominal cramps or pain",
                "Nausea and vomiting",
                "Dehydration (dry mouth, thirst, fatigue)"
            ],
            less_common: [
                "Fever",
                "Blood or mucus in stool (indicating infection)",
                "Dizziness (from dehydration)"
            ],
            telemedicine_context: "Patients can report stool frequency and dehydration symptoms. Doctors can recommend oral rehydration solutions and order stool tests if severe."
        },
        "measles": {
            common: [
                "High fever",
                "Cough",
                "Runny nose",
                "Red, watery eyes (conjunctivitis)",
                "Rash (starts on face, spreads to body)"
            ],
            less_common: [
                "Koplik spots (white spots inside the mouth)",
                "Fatigue",
                "Sore throat",
                "Sensitivity to light"
            ],
            telemedicine_context: "Patients can describe fever and rash progression via video call. Measles is contagious, so doctors may recommend isolation and supportive care, with testing if needed."
        },
        "typhoid fever": {
            common: [
                "Prolonged fever (rising over days)",
                "Fatigue and weakness",
                "Headache",
                "Abdominal pain or discomfort",
                "Loss of appetite",
                "Constipation or diarrhea"
            ],
            less_common: [
                "Rash (rose spots on chest/abdomen)",
                "Confusion or delirium",
                "Nausea and vomiting"
            ],
            telemedicine_context: "Fever and abdominal pain can be reported, but typhoid requires a blood or stool test for confirmation. A GP can order this test and prescribe antibiotics if confirmed."
        }
    },
  
    "Internal Medicine and Subspecialties": {
        "coronary artery disease": {
            common: [
                "Chest pain or discomfort (angina)",
                "Shortness of breath",
                "Fatigue",
                "Palpitations (irregular heartbeat)"
            ],
            less_common: [
                "Pain in the neck, jaw, throat, upper abdomen, or back",
                "Swelling in legs, ankles, or feet (edema)",
                "Nausea or indigestion-like symptoms"
            ],
            telemedicine_context: "Patients can report chest pain and shortness of breath. Doctors can recommend ECG or stress testing, which may require in-person follow-up."
        },
        "heart failure": {
            common: [
                "Shortness of breath (especially when lying down)",
                "Fatigue and weakness",
                "Swelling in legs, ankles, or feet (edema)",
                "Rapid or irregular heartbeat"
            ],
            less_common: [
                "Persistent cough or wheezing",
                "Weight gain from fluid retention",
                "Confusion or impaired thinking"
            ],
            telemedicine_context: "Edema and shortness of breath can be assessed via video. Doctors can adjust diuretics and recommend in-person tests like an echocardiogram."
        },
        "diabetes": { // Same as Primary Care
            common: [
                "Increased thirst",
                "Frequent urination",
                "Fatigue",
                "Blurred vision",
                "Slow-healing sores or frequent infections",
                "Unexplained weight loss"
            ],
            less_common: [
                "Tingling or numbness in hands/feet (neuropathy)",
                "Dry mouth",
                "Increased hunger"
            ],
            telemedicine_context: "Patients can report symptoms like thirst and fatigue. A GP can order a blood glucose test if diabetes is suspected."
        },
        "thyroid disorders": {
            "Hypothyroidism": {
                common: [
                    "Fatigue and lethargy",
                    "Weight gain",
                    "Cold intolerance",
                    "Dry skin and hair",
                    "Constipation",
                    "Depression",
                    "Slow heart rate"
                ],
                less_common: [],
                telemedicine_context: "Symptoms like fatigue or weight changes can be reported. A blood test (TSH levels) is needed for diagnosis, which a GP can order."
            },
            "Hyperthyroidism": {
                common: [
                    "Weight loss despite increased appetite",
                    "Heat intolerance",
                    "Sweating",
                    "Nervousness or irritability",
                    "Rapid heartbeat or palpitations",
                    "Tremors",
                    "Diarrhea"
                ],
                less_common: [],
                telemedicine_context: "Symptoms like weight loss and palpitations can be reported. A blood test (TSH levels) is needed for diagnosis."
            }
        },
        "peptic ulcers": {
            common: [
                "Burning stomach pain (worse when stomach is empty)",
                "Feeling of fullness, bloating, or belching",
                "Heartburn",
                "Nausea"
            ],
            less_common: [
                "Vomiting (sometimes with blood)",
                "Loss of appetite",
                "Unexplained weight loss",
                "Dark, tarry stools (indicating bleeding)"
            ],
            telemedicine_context: "Patients can report burning pain and nausea. Doctors can prescribe proton pump inhibitors and recommend a stool test for H. pylori if bleeding is suspected."
        },
        "inflammatory bowel disease": {
            common: [
                "Diarrhea (often bloody in ulcerative colitis)",
                "Abdominal pain and cramping",
                "Fatigue",
                "Unintended weight loss"
            ],
            less_common: [
                "Fever",
                "Joint pain",
                "Skin rashes",
                "Mouth sores"
            ],
            telemedicine_context: "Diarrhea and abdominal pain can be reported. Doctors can initiate dietary advice and order stool tests or refer for colonoscopy if needed."
        },
        "anemia": {
            common: [
                "Fatigue and weakness",
                "Pale skin",
                "Shortness of breath",
                "Dizziness or lightheadedness",
                "Cold hands and feet"
            ],
            less_common: [
                "Irregular heartbeat",
                "Chest pain",
                "Brittle nails",
                "Craving non-food items (pica, e.g., ice or dirt)"
            ],
            telemedicine_context: "Fatigue and pallor can be reported (pallor may be visible on video). A blood test (CBC) is required for diagnosis, which a GP can order."
        },
        "leukemia": {
            common: [
                "Fatigue and weakness",
                "Frequent infections",
                "Fever or night sweats",
                "Easy bruising or bleeding (e.g., nosebleeds, gum bleeding)",
                "Unexplained weight loss"
            ],
            less_common: [
                "Bone or joint pain",
                "Swollen lymph nodes",
                "Abdominal discomfort (from enlarged spleen/liver)",
                "Petechiae (small red spots under the skin)"
            ],
            telemedicine_context: "Symptoms like fatigue and bruising can be reported, but leukemia requires a blood test (CBC, bone marrow biopsy) for confirmation. A GP can order tests and refer to a hematologist."
        },
        "pneumonia": {
            common: [
                "High fever and chills",
                "Cough (often with phlegm)",
                "Shortness of breath",
                "Chest pain (worse with breathing)",
                "Fatigue"
            ],
            less_common: [
                "Confusion (especially in older adults)",
                "Nausea or vomiting",
                "Diarrhea",
                "Sweating"
            ],
            telemedicine_context: "Cough and shortness of breath can be reported. Doctors can prescribe antibiotics and recommend a chest X-ray for confirmation."
        },
        "tuberculosis": {
            common: [
                "Persistent cough (often with blood)",
                "Chest pain",
                "Fatigue and weakness",
                "Weight loss",
                "Night sweats",
                "Fever"
            ],
            less_common: [
                "Loss of appetite",
                "Swollen lymph nodes",
                "Cough lasting more than 3 weeks"
            ],
            telemedicine_context: "Cough and night sweats can be reported. TB requires a sputum test or chest X-ray for diagnosis, which a GP can order."
        },
        "chronic kidney disease": {
            common: [
                "Fatigue and weakness",
                "Swelling in legs, ankles, or feet (edema)",
                "Frequent urination (especially at night)",
                "Itching",
                "Loss of appetite"
            ],
            less_common: [
                "High blood pressure",
                "Nausea or vomiting",
                "Shortness of breath",
                "Muscle cramps"
            ],
            telemedicine_context: "Edema and fatigue can be reported. A blood test (creatinine, GFR) is needed for diagnosis, which a GP can order."
        },
        "stroke": {
            common: [
                "Sudden numbness or weakness (especially on one side of the body)",
                "Sudden confusion or trouble speaking",
                "Sudden vision problems (in one or both eyes)",
                "Sudden trouble walking, dizziness, or loss of balance",
                "Sudden severe headache"
            ],
            less_common: [
                "Nausea or vomiting",
                "Seizures",
                "Loss of consciousness"
            ],
            telemedicine_context: "Stroke symptoms require immediate in-person care. Telemedicine can be used for post-stroke follow-up, but initial symptoms necessitate emergency referral."
        },
        "epilepsy": {
            common: [
                "Seizures (e.g., convulsions, staring spells, muscle spasms)",
                "Temporary confusion",
                "Loss of consciousness or awareness",
                "Uncontrollable jerking movements"
            ],
            less_common: [
                "Deja vu or unusual sensations",
                "Anxiety or fear before a seizure",
                "Fatigue after a seizure"
            ],
            telemedicine_context: "Patients can report seizure frequency and triggers. Doctors can adjust medications and recommend EEG testing if needed."
        },
        "COPD": {
            common: [
                "Chronic cough",
                "Shortness of breath, especially during activity",
                "Wheezing",
                "Chest tightness"
            ],
            less_common: [
                "Frequent respiratory infections",
                "Fatigue",
                "Unintended weight loss",
                "Swelling in ankles (in severe cases)"
            ],
            telemedicine_context: "Shortness of breath and wheezing can be reported. Doctors can adjust inhalers and recommend spirometry for confirmation."
        },
        "asthma": { // Same as Primary Care
            common: [
                "Shortness of breath",
                "Wheezing",
                "Chest tightness or pain",
                "Coughing, especially at night or early morning"
            ],
            less_common: [
                "Difficulty sleeping due to breathing issues",
                "Fatigue from poor oxygenation",
                "Rapid breathing"
            ],
            telemedicine_context: "Patients can describe wheezing or shortness of breath. Doctors can adjust inhaler prescriptions."
        },
        "rheumatoid arthritis": {
            common: [
                "Joint pain and stiffness (especially in the morning)",
                "Joint swelling and redness",
                "Fatigue",
                "Low-grade fever"
            ],
            less_common: [
                "Joint deformity (in later stages)",
                "Numbness or tingling (if nerves are affected)",
                "Dry eyes and mouth (if associated with Sjogren’s syndrome)"
            ],
            telemedicine_context: "Joint pain and stiffness can be reported. Doctors can initiate anti-inflammatory treatment and order blood tests for confirmation."
        },
        "lupus": {
            common: [
                "Fatigue",
                "Joint pain and swelling",
                "Butterfly-shaped rash on face (across cheeks and nose)",
                "Fever",
                "Photosensitivity (rash worsens with sunlight)"
            ],
            less_common: [
                "Chest pain (from pleuritis)",
                "Hair loss",
                "Mouth sores",
                "Kidney problems (e.g., protein in urine)"
            ],
            telemedicine_context: "Rash and joint pain can be reported (rash visible via video). Blood tests (e.g., ANA test) are needed for diagnosis."
        },
        "HIV/AIDS": {
            "Early HIV": {
                common: [
                    "Fever",
                    "Fatigue",
                    "Sore throat",
                    "Swollen lymph nodes",
                    "Rash",
                    "Night sweats"
                ],
                less_common: [],
                telemedicine_context: "Fever and rash can be reported. HIV requires a blood test for diagnosis, which a GP can order."
            },
            "AIDS": {
                common: [
                    "Rapid weight loss",
                    "Recurring fever or night sweats",
                    "Chronic diarrhea",
                    "Persistent fatigue",
                    "Opportunistic infections (e.g., pneumonia, thrush)"
                ],
                less_common: [
                    "Memory loss or neurological issues",
                    "Skin lesions (e.g., Kaposi’s sarcoma)"
                ],
                telemedicine_context: "Telemedicine can manage ongoing treatment (e.g., ART monitoring) after diagnosis."
            }
        },
        "meningitis": {
            common: [
                "High fever",
                "Severe headache",
                "Stiff neck",
                "Sensitivity to light (photophobia)",
                "Confusion or difficulty concentrating",
                "Nausea and vomiting"
            ],
            less_common: [
                "Rash (in meningococcal meningitis)",
                "Seizures",
                "Irritability (especially in children)"
            ],
            telemedicine_context: "Symptoms like fever and neck stiffness can be reported, but meningitis requires urgent in-person care (e.g., lumbar puncture)."
        },
        "Lassa fever": {
            common: [
                "Fever",
                "Fatigue and weakness",
                "Headache",
                "Sore throat",
                "Muscle pain"
            ],
            less_common: [
                "Chest pain",
                "Cough",
                "Abdominal pain",
                "Bleeding (e.g., from gums, nose, or into skin)",
                "Hearing loss (in survivors)"
            ],
            telemedicine_context: "Fever and sore throat can be reported, but Lassa fever requires a blood test for diagnosis. A GP can order this and prescribe antivirals."
        },
        "hepatitis B": {
            common: [
                "Fatigue",
                "Jaundice (yellowing of skin/eyes)",
                "Dark urine",
                "Abdominal pain (upper right quadrant)",
                "Loss of appetite",
                "Nausea and vomiting"
            ],
            less_common: [
                "Fever",
                "Joint pain",
                "Clay-colored stools"
            ],
            telemedicine_context: "Jaundice and fatigue can be reported (jaundice visible via video). A blood test (HBsAg) is needed for diagnosis."
        },
        "hepatitis C": {
            common: [
                "Often asymptomatic (chronic infection)",
                "Fatigue",
                "Jaundice",
                "Dark urine",
                "Abdominal pain"
            ],
            less_common: [
                "Nausea",
                "Loss of appetite",
                "Joint pain",
                "Itching"
            ],
            telemedicine_context: "Similar to Hepatitis B, symptoms can be reported, but a blood test (HCV antibody test) is required for diagnosis."
        },
        "yellow fever": {
            common: [
                "Sudden fever",
                "Chills",
                "Severe headache",
                "Muscle pain (especially back)",
                "Nausea and vomiting",
                "Fatigue"
            ],
            less_common: [
                "Jaundice",
                "Bleeding (e.g., from nose, gums)",
                "Abdominal pain",
                "Confusion (in severe cases)"
            ],
            telemedicine_context: "Fever and headache can be reported, but yellow fever requires a blood test for confirmation. Vaccination history can be reviewed remotely."
        }
    },
  
    "Surgical Specialties": {
        "appendicitis": {
            common: [
                "Sudden pain starting near the navel, shifting to lower right abdomen",
                "Loss of appetite",
                "Nausea and vomiting",
                "Low-grade fever",
                "Abdominal swelling"
            ],
            less_common: [
                "Diarrhea or constipation",
                "Painful urination",
                "Rebound tenderness (pain when pressure is released)"
            ],
            telemedicine_context: "Abdominal pain can be reported, but appendicitis often requires in-person evaluation (e.g., ultrasound, CT scan). Telemedicine can facilitate urgent referral."
        },
        "hernias": {
            common: [
                "Bulge in the groin or abdomen (visible or palpable)",
                "Pain or discomfort, especially when bending, coughing, or lifting",
                "Feeling of heaviness in the groin"
            ],
            less_common: [
                "Nausea and vomiting (if hernia is strangulated)",
                "Redness or swelling around the bulge",
                "Inability to push the bulge back in"
            ],
            telemedicine_context: "Patients can describe the bulge and pain. Doctors can recommend surgical consultation, but physical examination is often needed."
        },
        "gallstones": {
            common: [
                "Sudden, intense pain in the upper right abdomen or center of abdomen",
                "Pain radiating to the right shoulder or back",
                "Nausea and vomiting",
                "Bloating or indigestion"
            ],
            less_common: [
                "Fever or chills (if infection occurs)",
                "Jaundice (if bile duct is blocked)",
                "Dark urine or clay-colored stools"
            ],
            telemedicine_context: "Abdominal pain can be reported, but gallstones require imaging (e.g., ultrasound) for diagnosis. A GP can refer for surgery if needed."
        },
        "coronary artery disease (for bypass)": { // Same as Internal Medicine
            common: [
                "Chest pain or discomfort (angina)",
                "Shortness of breath",
                "Fatigue",
                "Palpitations (irregular heartbeat)"
            ],
            less_common: [
                "Pain in the neck, jaw, throat, upper abdomen, or back",
                "Swelling in legs, ankles, or feet (edema)",
                "Nausea or indigestion-like symptoms"
            ],
            telemedicine_context: "Patients can report chest pain. Surgery (e.g., bypass) requires in-person care, but telemedicine can facilitate referral."
        },
        "brain tumors": {
            common: [
                "Persistent headaches (worse in the morning)",
                "Seizures",
                "Nausea and vomiting",
                "Vision or hearing problems",
                "Difficulty with balance or walking"
            ],
            less_common: [
                "Personality or behavior changes",
                "Memory loss",
                "Speech difficulties",
                "Weakness in limbs"
            ],
            telemedicine_context: "Headaches and seizures can be reported, but brain tumors require imaging (e.g., MRI) for diagnosis. Telemedicine can facilitate urgent referral."
        },
        "spinal disc herniation": {
            common: [
                "Back or neck pain",
                "Pain radiating to arms or legs (sciatica if in lower back)",
                "Numbness or tingling in extremities",
                "Muscle weakness"
            ],
            less_common: [
                "Loss of bladder or bowel control (emergency symptom)",
                "Burning sensation in affected area"
            ],
            telemedicine_context: "Pain and numbness can be reported. Doctors can recommend physical therapy or refer for MRI if severe."
        },
        "fractures": {
            common: [
                "Severe pain at the site",
                "Swelling and bruising",
                "Deformity or abnormal shape",
                "Inability to move the affected area"
            ],
            less_common: [
                "Numbness or tingling",
                "Warmth or redness (if infected)"
            ],
            telemedicine_context: "Pain and deformity can be reported, but fractures require X-rays for diagnosis. Telemedicine can facilitate referral for imaging and orthopedic care."
        },
        "joint replacements": {
            common: [
                "Chronic joint pain (e.g., knee, hip)",
                "Stiffness, especially after rest",
                "Swelling around the joint",
                "Reduced range of motion"
            ],
            less_common: [
                "Grinding sensation in the joint",
                "Joint deformity",
                "Warmth around the joint"
            ],
            telemedicine_context: "Joint pain and stiffness can be reported. Doctors can recommend physical therapy or refer for surgical evaluation if severe."
        },
        "tonsillitis": {
            common: [
                "Sore throat",
                "Difficulty swallowing",
                "Red, swollen tonsils",
                "White patches or pus on tonsils",
                "Fever"
            ],
            less_common: [
                "Bad breath",
                "Ear pain",
                "Swollen lymph nodes in neck",
                "Voice changes (e.g., muffled voice)"
            ],
            telemedicine_context: "Sore throat and fever can be reported. Doctors can prescribe antibiotics or recommend tonsillectomy if recurrent."
        },
        "sinusitis": {
            common: [
                "Nasal congestion",
                "Facial pain or pressure (around eyes, cheeks, forehead)",
                "Headache",
                "Thick yellow or green nasal discharge",
                "Reduced sense of smell or taste"
            ],
            less_common: [
                "Cough (worse at night)",
                "Fatigue",
                "Bad breath",
                "Ear pain"
            ],
            telemedicine_context: "Facial pain and nasal discharge can be reported. Doctors can prescribe decongestants or antibiotics if bacterial."
        },
        "congenital anomalies": {
            common: [
                "Visible gap in the lip or palate",
                "Difficulty feeding (in infants)",
                "Speech difficulties (as child grows)"
            ],
            less_common: [
                "Ear infections (due to palate issues)",
                "Dental problems",
                "Hearing difficulties"
            ],
            telemedicine_context: "Visible anomalies can be assessed via video, but surgical correction requires in-person care. Telemedicine can coordinate with specialists."
        },
        "burns": {
            common: [
                "Red, blistered, or charred skin",
                "Pain (severity depends on burn degree)",
                "Swelling",
                "Peeling skin"
            ],
            less_common: [
                "Fever (if infected)",
                "Shock (in severe burns)",
                "Difficulty breathing (if airway affected)"
            ],
            telemedicine_context: "Minor burns can be assessed via video (e.g., recommending cooling and dressings). Severe burns require in-person care."
        },
        "pelvic organ prolapse": {
            common: [
                "Feeling of pressure or fullness in the pelvis",
                "Bulge in the vagina or feeling something 'coming out'",
                "Urinary incontinence or difficulty urinating",
                "Difficulty with bowel movements"
            ],
            less_common: [
                "Lower back pain",
                "Pain during intercourse",
                "Vaginal bleeding or discharge"
            ],
            telemedicine_context: "Pressure and incontinence can be reported. Doctors can recommend pelvic floor exercises or refer for surgical evaluation."
        },
        "kidney stones": {
            common: [
                "Severe pain in the side, back, or lower abdomen",
                "Pain radiating to the groin",
                "Blood in urine (hematuria)",
                "Nausea and vomiting",
                "Frequent urge to urinate"
            ],
            less_common: [
                "Fever and chills (if infection present)",
                "Cloudy or foul-smelling urine"
            ],
            telemedicine_context: "Pain and hematuria can be reported. Doctors can recommend hydration and pain relief, but imaging (e.g., CT scan) is needed for confirmation."
        },
        "prostate cancer": {
            common: [
                "Often asymptomatic in early stages",
                "Difficulty urinating (weak stream, hesitation)",
                "Frequent urination (especially at night)",
                "Blood in urine or semen"
            ],
            less_common: [
                "Painful ejaculation",
                "Pelvic pain",
                "Bone pain (if cancer spreads)",
                "Weight loss"
            ],
            telemedicine_context: "Urinary symptoms can be reported. A PSA blood test and digital rectal exam are needed for diagnosis, which a GP can order."
        },
        "aneurysms": {
            common: [
                "Often asymptomatic until rupture",
                "Pulsating feeling in the abdomen (abdominal aortic aneurysm)",
                "Back or abdominal pain"
            ],
            less_common: [
                "Sudden, severe chest pain (thoracic aneurysm or rupture)",
                "Difficulty swallowing",
                "Hoarseness",
                "Shock (if ruptured)"
            ],
            telemedicine_context: "Pain can be reported, but aneurysms require imaging (e.g., ultrasound, CT) for diagnosis. Telemedicine can facilitate urgent referral."
        }
    },
  
    "Women’s Health": {
        "gestational diabetes": {
            common: [
                "Often asymptomatic",
                "Increased thirst",
                "Frequent urination",
                "Fatigue"
            ],
            less_common: [
                "Blurred vision",
                "Increased hunger",
                "Weight gain (beyond normal pregnancy)"
            ],
            telemedicine_context: "Thirst and fatigue can be reported. A glucose tolerance test is needed for diagnosis, which a GP can order."
        },
        "preeclampsia": {
            common: [
                "High blood pressure (often detected by monitoring)",
                "Swelling in hands, feet, or face",
                "Severe headaches",
                "Vision changes (blurred vision, flashing lights)",
                "Upper abdominal pain (right side)"
            ],
            less_common: [
                "Nausea or vomiting",
                "Decreased urine output",
                "Shortness of breath"
            ],
            telemedicine_context: "Swelling and headaches can be reported. Blood pressure monitoring at home can help, but lab tests (e.g., urine protein) are needed for confirmation."
        },
        "menstrual disorders": {
            "Dysmenorrhea (Painful Periods)": {
                common: [
                    "Severe menstrual cramps",
                    "Lower abdominal pain",
                    "Nausea or vomiting",
                    "Fatigue",
                    "Headache"
                ],
                less_common: [],
                telemedicine_context: "Pain can be reported. Doctors can prescribe pain relief."
            },
            "Amenorrhea (Absent Periods)": {
                common: [
                    "No menstrual periods",
                    "Weight gain or loss",
                    "Acne or excess hair growth (if PCOS-related)"
                ],
                less_common: [],
                telemedicine_context: "Menstrual history can be reported. Doctors can order hormone tests if needed."
            }
        },
        "fibroids": {
            common: [
                "Heavy menstrual bleeding",
                "Pelvic pain or pressure",
                "Frequent urination (if pressing on bladder)",
                "Constipation (if pressing on rectum)"
            ],
            less_common: [
                "Lower back pain",
                "Pain during intercourse",
                "Infertility issues"
            ],
            telemedicine_context: "Heavy bleeding and pelvic pain can be reported. Ultrasound is needed for diagnosis, which a GP can order."
        },
        "endometriosis": {
            common: [
                "Painful periods",
                "Pelvic pain (chronic or during intercourse)",
                "Heavy menstrual bleeding",
                "Infertility"
            ],
            less_common: [
                "Fatigue",
                "Diarrhea or constipation during periods",
                "Painful bowel movements"
            ],
            telemedicine_context: "Pelvic pain can be reported. Diagnosis often requires laparoscopy, but telemedicine can initiate pain management and referral."
        },
        "ovarian cancer": {
            common: [
                "Bloating or feeling full quickly",
                "Pelvic or abdominal pain",
                "Difficulty eating or loss of appetite",
                "Frequent urination"
            ],
            less_common: [
                "Unexplained weight loss",
                "Fatigue",
                "Back pain",
                "Changes in bowel habits"
            ],
            telemedicine_context: "Bloating and pain can be reported, but ovarian cancer requires imaging (e.g., ultrasound) and blood tests (CA-125) for diagnosis."
        },
        "cervical cancer": {
            common: [
                "Often asymptomatic in early stages",
                "Abnormal vaginal bleeding (e.g., between periods, after intercourse)",
                "Pelvic pain",
                "Pain during intercourse"
            ],
            less_common: [
                "Unusual vaginal discharge (watery, bloody)",
                "Fatigue",
                "Leg pain or swelling (if advanced)"
            ],
            telemedicine_context: "Bleeding can be reported. A Pap smear or HPV test is needed for diagnosis, which a GP can order."
        },
        "infertility": {
            common: [
                "Inability to conceive after 1 year of trying (or 6 months if over 35)",
                "Irregular or absent menstrual periods (in women)",
                "Painful periods (if endometriosis-related)"
            ],
            less_common: [
                "Hormonal symptoms (e.g., acne, hair growth in women)",
                "Low sperm count symptoms in men (e.g., sexual dysfunction)"
            ],
            telemedicine_context: "Menstrual history can be reported. Doctors can order hormone tests or semen analysis to investigate causes."
        },
        "polycystic ovary syndrome": {
            common: [
                "Irregular periods",
                "Excess hair growth (hirsutism)",
                "Acne or oily skin",
                "Weight gain",
                "Infertility"
            ],
            less_common: [
                "Hair loss (male-pattern baldness)",
                "Dark patches on skin (acanthosis nigricans)",
                "Mood swings"
            ],
            telemedicine_context: "Irregular periods and hair growth can be reported. Blood tests (e.g., testosterone, insulin) and ultrasound are needed for diagnosis."
        }
    },
  
    "Pediatric Specialties": {
        "congenital heart defects": {
            common: [
                "Cyanosis (bluish skin, lips, or nails)",
                "Rapid breathing or shortness of breath",
                "Fatigue during feeding (in infants)",
                "Poor growth or weight gain"
            ],
            less_common: [
                "Heart murmurs (detected by stethoscope)",
                "Swelling in legs or abdomen",
                "Frequent respiratory infections"
            ],
            telemedicine_context: "Cyanosis and fatigue can be reported (visible via video). An echocardiogram is needed for diagnosis, requiring in-person care."
        },
        "Kawasaki disease": {
            common: [
                "High fever lasting more than 5 days",
                "Rash (often on trunk and genitals)",
                "Red, bloodshot eyes (conjunctivitis)",
                "Strawberry tongue (red, swollen tongue)",
                "Swollen, peeling hands and feet"
            ],
            less_common: [
                "Irritability",
                "Swollen lymph nodes in neck",
                "Joint pain"
            ],
            telemedicine_context: "Fever and rash can be reported (rash visible via video). Blood tests and echocardiogram are needed for diagnosis."
        },
        "cerebral palsy": {
            common: [
                "Delayed developmental milestones (e.g., sitting, walking)",
                "Muscle stiffness or floppiness",
                "Abnormal posture or movements",
                "Difficulty with fine motor skills (e.g., grasping)"
            ],
            less_common: [
                "Seizures",
                "Speech delays",
                "Vision or hearing problems"
            ],
            telemedicine_context: "Developmental delays can be reported. Telemedicine can coordinate with specialists for physical therapy, but diagnosis requires in-person exams."
        },
        "epilepsy": { // Same as Internal Medicine
            common: [
                "Seizures (e.g., convulsions, staring spells, muscle spasms)",
                "Temporary confusion",
                "Loss of consciousness or awareness",
                "Uncontrollable jerking movements"
            ],
            less_common: [
                "Deja vu or unusual sensations",
                "Anxiety or fear before a seizure",
                "Fatigue after a seizure"
            ],
            telemedicine_context: "Seizure frequency can be reported. Doctors can adjust medications and recommend EEG testing."
        },
        "leukemia": { // Same as Internal Medicine
            common: [
                "Fatigue and weakness",
                "Frequent infections",
                "Fever or night sweats",
                "Easy bruising or bleeding (e.g., nosebleeds, gum bleeding)",
                "Unexplained weight loss"
            ],
            less_common: [
                "Bone or joint pain",
                "Swollen lymph nodes",
                "Abdominal discomfort (from enlarged spleen/liver)",
                "Petechiae (small red spots under the skin)"
            ],
            telemedicine_context: "Fatigue and bruising can be reported. A blood test (CBC, bone marrow biopsy) is needed for diagnosis."
        },
        "neuroblastoma": {
            common: [
                "Abdominal mass or swelling",
                "Fatigue",
                "Fever",
                "Weight loss",
                "Bone pain (if spread)"
            ],
            less_common: [
                "Dark circles around eyes (if spread to eye area)",
                "Diarrhea (if tumor produces hormones)",
                "Difficulty breathing (if chest mass)"
            ],
            telemedicine_context: "Abdominal swelling and fatigue can be reported. Imaging (e.g., ultrasound, MRI) and biopsy are needed for diagnosis, requiring in-person care."
        },
        "appendicitis": { // Same as Surgical Specialties
            common: [
                "Sudden pain starting near the navel, shifting to lower right abdomen",
                "Loss of appetite",
                "Nausea and vomiting",
                "Low-grade fever",
                "Abdominal swelling"
            ],
            less_common: [
                "Diarrhea or constipation",
                "Painful urination",
                "Rebound tenderness (pain when pressure is released)"
            ],
            telemedicine_context: "Abdominal pain can be reported, but appendicitis requires in-person evaluation (e.g., ultrasound, CT scan). Telemedicine can facilitate urgent referral."
        },
        "hernias": { // Same as Surgical Specialties
            common: [
                "Bulge in the groin or abdomen (visible or palpable)",
                "Pain or discomfort, especially when bending, coughing, or lifting",
                "Feeling of heaviness in the groin"
            ],
            less_common: [
                "Nausea and vomiting (if hernia is strangulated)",
                "Redness or swelling around the bulge",
                "Inability to push the bulge back in"
            ],
            telemedicine_context: "Patients can describe the bulge and pain. Doctors can recommend surgical consultation."
        },
        "measles": { // Same as Primary Care
            common: [
                "High fever",
                "Cough",
                "Runny nose",
                "Red, watery eyes (conjunctivitis)",
                "Rash (starts on face, spreads to body)"
            ],
            less_common: [
                "Koplik spots (white spots inside the mouth)",
                "Fatigue",
                "Sore throat",
                "Sensitivity to light"
            ],
            telemedicine_context: "Fever and rash can be reported. Doctors may recommend isolation and supportive care."
        },
        "malaria": { // Same as Primary Care
            common: [
                "High fever (often cyclical)",
                "Chills and shivering",
                "Sweating",
                "Headache",
                "Muscle aches and fatigue",
                "Nausea and vomiting"
            ],
            less_common: [
                "Diarrhea",
                "Abdominal pain",
                "Confusion or seizures (in severe cases)",
                "Jaundice (yellowing of skin/eyes)"
            ],
            telemedicine_context: "Fever and chills can be reported. A blood test is needed for confirmation."
        },
        "pneumonia": { // Same as Internal Medicine
            common: [
                "High fever and chills",
                "Cough (often with phlegm)",
                "Shortness of breath",
                "Chest pain (worse with breathing)",
                "Fatigue"
            ],
            less_common: [
                "Confusion (especially in older adults)",
                "Nausea or vomiting",
                "Diarrhea",
                "Sweating"
            ],
            telemedicine_context: "Cough and shortness of breath can be reported. Doctors can prescribe antibiotics and recommend a chest X-ray."
        },
        "diarrheal diseases": { // Same as Primary Care
            common: [
                "Frequent loose or watery stools",
                "Abdominal cramps or pain",
                "Nausea and vomiting",
                "Dehydration (dry mouth, thirst, fatigue)"
            ],
            less_common: [
                "Fever",
                "Blood or mucus in stool (indicating infection)",
                "Dizziness (from dehydration)"
            ],
            telemedicine_context: "Stool frequency and dehydration symptoms can be reported. Doctors can recommend oral rehydration solutions."
        }
    },
  
    "Mental Health": {
        "depression": {
            common: [
                "Persistent sadness or emptiness",
                "Loss of interest in activities",
                "Fatigue or low energy",
                "Difficulty concentrating",
                "Feelings of worthlessness or guilt"
            ],
            less_common: [
                "Changes in appetite or weight",
                "Sleep disturbances (insomnia or oversleeping)",
                "Thoughts of death or suicide"
            ],
            telemedicine_context: "Sadness and fatigue can be reported. Telemedicine can offer therapy and medications."
        },
        "schizophrenia": {
            common: [
                "Hallucinations (e.g., hearing voices)",
                "Delusions (false beliefs)",
                "Disorganized thinking or speech",
                "Lack of motivation"
            ],
            less_common: [
                "Social withdrawal",
                "Flat affect (reduced emotional expression)",
                "Difficulty concentrating"
            ],
            telemedicine_context: "Hallucinations and delusions can be reported. Doctors can initiate antipsychotic treatment and refer for psychiatric care."
        },
        "bipolar disorder": {
            "Mania": {
                common: [
                    "Elevated mood or irritability",
                    "Increased energy or activity",
                    "Reduced need for sleep",
                    "Racing thoughts",
                    "Impulsive behavior"
                ],
                less_common: [],
                telemedicine_context: "Mood swings can be reported. Telemedicine can manage mood stabilizers."
            },
            "Depression": {
                common: [
                    "Persistent sadness or emptiness",
                    "Loss of interest in activities",
                    "Fatigue or low energy",
                    "Difficulty concentrating",
                    "Feelings of worthlessness or guilt"
                ],
                less_common: [],
                telemedicine_context: "Same as depression above."
            },
            less_common: [
                "Psychosis during mania",
                "Mixed episodes (mania and depression together)"
            ],
            telemedicine_context: "Mood swings can be reported. Telemedicine can manage mood stabilizers and therapy."
        },
        "anxiety disorders": {
            common: [
                "Excessive worrying or fear",
                "Restlessness",
                "Fatigue",
                "Difficulty concentrating",
                "Irritability",
                "Muscle tension",
                "Sleep disturbances"
            ],
            less_common: [
                "Panic attacks",
                "Rapid heartbeat",
                "Sweating or trembling"
            ],
            telemedicine_context: "Worrying and fatigue can be reported. Telemedicine can offer therapy and prescribe anti-anxiety medications."
        },
        "personality disorders": {
            common: [
                "Unstable relationships",
                "Intense fear of abandonment",
                "Rapid mood swings",
                "Impulsive behavior",
                "Chronic feelings of emptiness"
            ],
            less_common: [
                "Self-harm or suicidal behavior",
                "Dissociation (feeling disconnected)",
                "Paranoid thoughts"
            ],
            telemedicine_context: "Mood swings and relationship issues can be reported. Telemedicine can provide therapy and coordinate with psychiatrists."
        },
        "substance use disorders": {
            common: [
                "Cravings for the substance",
                "Tolerance (needing more for the same effect)",
                "Withdrawal symptoms (e.g., shaking, sweating)",
                "Neglecting responsibilities",
                "Continued use despite harm"
            ],
            less_common: [
                "Mood swings",
                "Weight loss",
                "Poor hygiene"
            ],
            telemedicine_context: "Cravings and withdrawal can be reported. Telemedicine can offer counseling and refer to rehab programs."
        }
    },
  
    "Oncology and Cancer Care": {
        "breast cancer": {
            common: [
                "Lump or thickening in the breast or armpit",
                "Change in breast size or shape",
                "Nipple discharge (especially bloody)",
                "Breast pain"
            ],
            less_common: [
                "Skin changes (e.g., dimpling, redness)",
                "Nipple inversion",
                "Swollen lymph nodes"
            ],
            telemedicine_context: "Lumps can be reported, but diagnosis requires a mammogram or biopsy. Telemedicine can facilitate referral to an oncologist."
        },
        "lung cancer": {
            common: [
                "Persistent cough",
                "Coughing up blood",
                "Chest pain",
                "Shortness of breath",
                "Fatigue",
                "Unexplained weight loss"
            ],
            less_common: [
                "Hoarseness",
                "Bone pain (if spread)",
                "Headache (if spread to brain)"
            ],
            telemedicine_context: "Cough and shortness of breath can be reported. A chest X-ray or CT scan is needed for diagnosis, which a GP can order."
        },
        "colorectal cancer": {
            common: [
                "Change in bowel habits (diarrhea, constipation)",
                "Blood in stool",
                "Abdominal pain or cramping",
                "Unexplained weight loss",
                "Fatigue"
            ],
            less_common: [
                "Feeling of incomplete evacuation",
                "Anemia (leading to fatigue, pallor)"
            ],
            telemedicine_context: "Bowel changes can be reported. A colonoscopy or stool test is needed for diagnosis, which a GP can order."
        },
        "prostate cancer": { // Same as Surgical Specialties
            common: [
                "Often asymptomatic in early stages",
                "Difficulty urinating (weak stream, hesitation)",
                "Frequent urination (especially at night)",
                "Blood in urine or semen"
            ],
            less_common: [
                "Painful ejaculation",
                "Pelvic pain",
                "Bone pain (if cancer spreads)",
                "Weight loss"
            ],
            telemedicine_context: "Urinary symptoms can be reported. A PSA blood test is needed for diagnosis."
        },
        "leukemia": { // Same as Internal Medicine
            common: [
                "Fatigue and weakness",
                "Frequent infections",
                "Fever or night sweats",
                "Easy bruising or bleeding (e.g., nosebleeds, gum bleeding)",
                "Unexplained weight loss"
            ],
            less_common: [
                "Bone or joint pain",
                "Swollen lymph nodes",
                "Abdominal discomfort (from enlarged spleen/liver)",
                "Petechiae (small red spots under the skin)"
            ],
            telemedicine_context: "Fatigue and bruising can be reported. A blood test is needed for diagnosis."
        },
        "lymphoma": {
            common: [
                "Swollen lymph nodes (neck, armpit, groin)",
                "Fever",
                "Night sweats",
                "Unexplained weight loss",
                "Fatigue"
            ],
            less_common: [
                "Itching",
                "Shortness of breath",
                "Abdominal pain (if spleen/liver involved)"
            ],
            telemedicine_context: "Swollen nodes and fever can be reported. A biopsy or blood test is needed for diagnosis, which a GP can order."
        },
        "ovarian cancer": { // Same as Women’s Health
            common: [
                "Bloating or feeling full quickly",
                "Pelvic or abdominal pain",
                "Difficulty eating or loss of appetite",
                "Frequent urination"
            ],
            less_common: [
                "Unexplained weight loss",
                "Fatigue",
                "Back pain",
                "Changes in bowel habits"
            ],
            telemedicine_context: "Bloating and pain can be reported. Imaging and blood tests (CA-125) are needed for diagnosis."
        },
        "cervical cancer": { // Same as Women’s Health
            common: [
                "Often asymptomatic in early stages",
                "Abnormal vaginal bleeding (e.g., between periods, after intercourse)",
                "Pelvic pain",
                "Pain during intercourse"
            ],
            less_common: [
                "Unusual vaginal discharge (watery, bloody)",
                "Fatigue",
                "Leg pain or swelling (if advanced)"
            ],
            telemedicine_context: "Bleeding can be reported. A Pap smear or HPV test is needed for diagnosis."
        }
    },
  
    "Rehabilitation and Allied Health": {
        "stroke recovery": {
            common: [
                "Weakness or paralysis on one side",
                "Difficulty speaking or swallowing",
                "Vision problems",
                "Balance issues",
                "Fatigue"
            ],
            less_common: [
                "Memory loss",
                "Emotional changes (e.g., depression)",
                "Spasticity (muscle stiffness)"
            ],
            telemedicine_context: "Weakness and speech issues can be assessed via video. Telemedicine can coordinate physical therapy and monitor recovery."
        },
        "spinal cord injuries": {
            common: [
                "Loss of movement or sensation below injury",
                "Pain or stinging sensation",
                "Difficulty breathing (if high spinal injury)",
                "Loss of bladder or bowel control"
            ],
            less_common: [
                "Muscle spasms",
                "Sexual dysfunction",
                "Chronic pain"
            ],
            telemedicine_context: "Loss of sensation can be reported. Telemedicine can manage rehabilitation and refer to specialists for long-term care."
        },
        "amputations": {
            common: [
                "Phantom limb pain (sensation of pain in missing limb)",
                "Stump pain",
                "Difficulty with mobility",
                "Swelling at the stump site"
            ],
            less_common: [
                "Infection at the stump",
                "Depression or anxiety",
                "Skin irritation"
            ],
            telemedicine_context: "Phantom pain can be reported. Telemedicine can coordinate pain management and physical therapy for prosthetics."
        },
        "hearing loss": {
            common: [
                "Difficulty hearing conversations",
                "Muffled sounds",
                "Tinnitus (ringing in ears)",
                "Feeling of ear fullness"
            ],
            less_common: [
                "Dizziness or vertigo",
                "Ear pain",
                "Discharge from ear (if infection-related)"
            ],
            telemedicine_context: "Hearing difficulties can be reported. Doctors can recommend audiometry testing and refer to an ENT specialist."
        },
        "speech disorders": {
            common: [
                "Difficulty speaking clearly",
                "Stuttering or stammering",
                "Hoarseness",
                "Slurred speech"
            ],
            less_common: [
                "Voice changes (e.g., pitch, volume)",
                "Difficulty swallowing",
                "Frustration or social withdrawal"
            ],
            telemedicine_context: "Speech issues can be assessed via video. Telemedicine can coordinate with speech therapists for rehabilitation."
        },
        "nutritional deficiencies": {
            "Vitamin D Deficiency": {
                common: [
                    "Fatigue",
                    "Bone pain",
                    "Muscle weakness",
                    "Depression"
                ],
                less_common: [],
                telemedicine_context: "Fatigue and bone pain can be reported. Blood tests are needed for diagnosis."
            },
            "Iron Deficiency": {
                common: [
                    "Fatigue",
                    "Pale skin",
                    "Shortness of breath",
                    "Dizziness"
                ],
                less_common: [
                    "Hair loss",
                    "Brittle nails",
                    "Mouth sores"
                ],
                telemedicine_context: "Fatigue and pallor can be reported. A blood test is needed for diagnosis."
            }
        },
        "trachoma": {
            common: [
                "Itchy, irritated eyes",
                "Redness and swelling of eyes",
                "Discharge from eyes (mucus or pus)",
                "Sensitivity to light"
            ],
            less_common: [
                "Blurred vision",
                "Trichiasis (eyelashes turning inward)",
                "Corneal scarring (in later stages)"
            ],
            telemedicine_context: "Eye irritation can be reported (redness visible via video). Doctors can prescribe antibiotics and refer to an ophthalmologist if severe."
        }
    },
  
    "Pain and Specialized Care": {
        "schistosomiasis": {
            common: [
                "Rash or itchy skin (after exposure to water)",
                "Fever",
                "Chills",
                "Cough",
                "Muscle aches"
            ],
            less_common: [
                "Abdominal pain",
                "Blood in urine (urinary schistosomiasis)",
                "Diarrhea or blood in stool (intestinal schistosomiasis)",
                "Fatigue"
            ],
            telemedicine_context: "Rash and fever can be reported. A urine or stool test is needed for diagnosis, which a GP can order."
        },
        "lymphatic filariasis": {
            common: [
                "Swelling in limbs (lymphedema)",
                "Swelling in genitals (hydrocele in men)",
                "Pain or discomfort in affected areas",
                "Recurrent infections in affected limbs"
            ],
            less_common: [
                "Fever",
                "Chyluria (milky urine)",
                "Fatigue"
            ],
            telemedicine_context: "Swelling can be reported (visible via video). A blood test (for microfilariae) is needed for diagnosis."
        },
        "soil-transmitted helminth infections": {
            common: [
                "Abdominal pain",
                "Diarrhea",
                "Fatigue",
                "Anemia (especially with hookworm)",
                "Weight loss"
            ],
            less_common: [
                "Cough (during larval migration)",
                "Itchy rash at entry site",
                "Malnutrition (in children)"
            ],
            telemedicine_context: "Abdominal pain and fatigue can be reported. A stool test is needed for diagnosis, which a GP can order."
        }
    }
};

function symptomChecker(userSymptoms) {
    // Validate that userSymptoms is an array
    if (!Array.isArray(userSymptoms)) {
        console.error('userSymptoms is not an array:', userSymptoms);
        return []; // Return empty array to avoid crashing
    }

    const results = [];
    // Normalize user symptoms to lowercase for case-insensitive matching
    userSymptoms = userSymptoms.map(symptom => symptom.toLowerCase());

    // Iterate over departments in the symptoms object
    Object.keys(symptoms).forEach(department => {
        const departmentData = symptoms[department];
        Object.keys(departmentData).forEach(diseaseOrCategory => {
            const data = departmentData[diseaseOrCategory];

            // Case 1: Direct disease with common and less_common symptoms
            if (data.common && data.less_common) {
                let score = 0;
                const matchedSymptoms = [];

                // Process common symptoms (weight: 2)
                if (Array.isArray(data.common)) {
                    data.common.forEach(symptom => {
                        if (userSymptoms.includes(symptom.toLowerCase())) {
                            score += 2;
                            matchedSymptoms.push(symptom);
                        }
                    });
                }

                // Process less common symptoms (weight: 1)
                if (Array.isArray(data.less_common)) {
                    data.less_common.forEach(symptom => {
                        if (userSymptoms.includes(symptom.toLowerCase())) {
                            score += 1;
                            matchedSymptoms.push(symptom);
                        }
                    });
                }

                // Calculate match percentage
                const totalPossibleScore = (data.common.length * 2) + data.less_common.length;
                const matchPercentage = totalPossibleScore > 0 ? (score / totalPossibleScore) * 100 : 0;

                // Add to results if there’s a match
                if (score > 0) {
                    results.push({
                        department,
                        disease: diseaseOrCategory,
                        score,
                        matchPercentage: matchPercentage.toFixed(2),
                        matchedSymptoms,
                        telemedicine_context: data.telemedicine_context 
                    });
                }
            } else {
                // Case 2: Category with sub-diseases
                Object.keys(data).forEach(subDisease => {
                    const subData = data[subDisease];
                    if (subData.common && subData.less_common) {
                        let score = 0;
                        const matchedSymptoms = [];

                        // Process common symptoms (weight: 2)
                        if (Array.isArray(subData.common)) {
                            subData.common.forEach(symptom => {
                                if (userSymptoms.includes(symptom.toLowerCase())) {
                                    score += 2;
                                    matchedSymptoms.push(symptom);
                                }
                            });
                        }

                        // Process less common symptoms (weight: 1)
                        if (Array.isArray(subData.less_common)) {
                            subData.less_common.forEach(symptom => {
                                if (userSymptoms.includes(symptom.toLowerCase())) {
                                    score += 1;
                                    matchedSymptoms.push(symptom);
                                }
                            });
                        }

                        // Calculate match percentage
                        const totalPossibleScore = (subData.common.length * 2) + subData.less_common.length;
                        const matchPercentage = totalPossibleScore > 0 ? (score / totalPossibleScore) * 100 : 0;

                        // Add to results if there’s a match
                        if (score > 0) {
                            results.push({
                                department,
                                disease: `${diseaseOrCategory} (${subDisease})`,
                                score,
                                matchPercentage: matchPercentage.toFixed(2),
                                matchedSymptoms,
                                telemedicine_context: subData.telemedicine_context 
                            });
                        }
                    }
                });
            }
        });
    });

    // Sort results by score (descending) and return top 5
    results.sort((a, b) => b.score - a.score);
    return results.slice(0, 5);
}

module.exports = { symptoms, symptomChecker };