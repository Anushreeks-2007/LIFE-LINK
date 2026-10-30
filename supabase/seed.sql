-- ==============================================================================
-- LIFE-LINK Emergency Healthcare Platform: Synthetic Demonstration Seed Data
-- ==============================================================================

-- Seed Hospitals
INSERT INTO hospitals (id, name, address, latitude, longitude, contact_phone, emergency_phone, hospital_type, emergency_services_available, services, verification_status)
VALUES
('hosp-001', 'Apex Trauma & Emergency Institute', '142 Victoria Road, Ashok Nagar, Bengaluru 560025', 12.9667, 77.6083, '+91 80 2234 5000', '108 / +91 80 2234 5099', 'Tertiary Care & Level 1 Trauma', TRUE, '["Level 1 Trauma Center", "24/7 Neurosurgery", "Adult ICU", "Blood Bank", "Burn Unit"]'::jsonb, 'Verified Hospital Partner'),
('hosp-002', 'City General Hospital & Medical College', '88 Fort Road, Kalasipalya, Bengaluru 560002', 12.9592, 77.5753, '+91 80 2670 1155', '+91 80 2670 9999', 'Public District Hospital', TRUE, '["24/7 Emergency Casualty", "General Surgery", "Orthopedics", "Blood Bank", "Dialysis Center"]'::jsonb, 'Verified Hospital Partner'),
('hosp-003', 'St. Jude Healthcare & Cardiac Center', '24 Richmond Road, Shanthala Nagar, Bengaluru 560025', 12.9644, 77.5998, '+91 80 2221 4433', '+91 80 2221 9111', 'Cardiac & Multispecialty Hospital', TRUE, '["24/7 Cardiac Emergency", "Coronary Care Unit", "Emergency Angioplasty", "Vascular Surgery"]'::jsonb, 'Verified Hospital Partner'),
('hosp-004', 'Metro West Children & Maternity Hospital', '55 Chord Road, Rajajinagar, Bengaluru 560010', 12.9892, 77.5539, '+91 80 2315 7800', '+91 80 2315 9911', 'Pediatric & Maternal Specialized', TRUE, '["Pediatric Emergency Care", "Neonatal Intensive Care (NICU Level 3)", "Pediatric Surgery"]'::jsonb, 'Verified Hospital Partner'),
('hosp-005', 'Suburban Community Clinic & Day Care', '12 Old Airport Road, Domlur, Bengaluru 560071', 12.9601, 77.6387, '+91 80 2526 3311', '+91 80 2526 3311', 'Primary Health Center', FALSE, '["Outpatient Consultation", "Minor Wound Suturing", "Diagnostic Lab"]'::jsonb, 'Community Submitted (Unverified)'),
('hosp-006', 'Greenfield Emergency & Burn Specialty', '303 Hosur Main Road, Koramangala 1st Block, Bengaluru 560034', 12.9279, 77.6271, '+91 80 4111 8822', '+91 80 4111 9900', 'Specialized Emergency & Burn Center', TRUE, '["24/7 Severe Burn ICU", "Hyperbaric Oxygen Therapy", "Toxicology & Poison Control"]'::jsonb, 'Verified Hospital Partner')
ON CONFLICT (id) DO NOTHING;

-- Seed Beds for Apex Trauma
INSERT INTO bed_availability (hospital_id, bed_type, total_beds, reported_available_beds, reported_at)
VALUES
('hosp-001', 'ICU Beds', 30, 4, NOW() - INTERVAL '25 minutes'),
('hosp-001', 'Emergency Resuscitation', 12, 3, NOW() - INTERVAL '25 minutes'),
('hosp-001', 'Oxygen General Beds', 80, 18, NOW() - INTERVAL '25 minutes'),
('hosp-001', 'Pediatric ICU (PICU)', 10, 2, NOW() - INTERVAL '25 minutes')
ON CONFLICT DO NOTHING;

-- Seed Medicines for Apex Trauma
INSERT INTO medicine_inventory (hospital_id, medicine_name, reported_quantity, unit, reported_at)
VALUES
('hosp-001', 'Polyvalent Snake Anti-venom', 45, 'Vials', NOW() - INTERVAL '40 minutes'),
('hosp-001', 'O-Negative Emergency Packed Red Blood', 12, 'Units', NOW() - INTERVAL '40 minutes'),
('hosp-001', 'Epinephrine 1mg/ml (Auto-injectors)', 80, 'Ampoules', NOW() - INTERVAL '40 minutes'),
('hosp-001', 'Atropine Sulfate 0.6mg/ml', 120, 'Ampoules', NOW() - INTERVAL '40 minutes'),
('hosp-001', 'Intravenous Normal Saline (0.9%)', 450, 'Bags', NOW() - INTERVAL '40 minutes')
ON CONFLICT DO NOTHING;

-- Seed Synthetic Registered Emergency Profile
INSERT INTO emergency_profiles (id, owner_user_id, name, age, gender, blood_group, emergency_contact_name, emergency_contact_relationship, emergency_contact_phone, secondary_contact_name, secondary_contact_phone, allergies, relevant_medical_notes, organ_donor_consent, qr_token, is_revoked)
VALUES
('prof-demo-001', 'user-public-001', 'Rahul Sharma', 32, 'Male', 'O+', 'Anjali Sharma', 'Sister', '+91 98765 43210', 'Dr. Arvind Rao', '+91 94480 11223', 'Severe Penicillin Allergy (Anaphylaxis risk), Shellfish', 'Type 1 Diabetes Mellitus (Uses Insulin glargine 20u daily). Carries asthma inhaler.', TRUE, 'LL-TOKEN-8F492E-SECURE', FALSE)
ON CONFLICT (id) DO NOTHING;

-- Seed Synthetic Unidentified Emergency Patient
INSERT INTO emergency_patients (id, temporary_patient_id, identification_status, current_hospital_id, found_location, estimated_age, apparent_gender, triage_color, emergency_observations, reported_by, registration_time)
VALUES
('pat-emg-1042', 'LL-EMG-1042', 'unidentified', 'hosp-001', 'Near MG Road Metro Station, Pillar 140 (Traffic Accident)', '30-35 years', 'Male', 'RED (Immediate / Critical)', 'Unconscious adult male. Severe right temporal laceration. GCS 8. Bilateral breath sounds present. Closed traumatic brain injury suspected.', 'Paramedic S. Patil (EMS Unit 4)', NOW() - INTERVAL '130 minutes')
ON CONFLICT (id) DO NOTHING;

-- Seed Sample Transfer for Patient LL-EMG-1042
INSERT INTO patient_transfers (id, emergency_patient_id, source_hospital_id, destination_hospital_id, transfer_time, reason, handover_notes, transport_unit, authorized_officer)
VALUES
('tr-001', 'pat-emg-1042', 'hosp-002', 'hosp-001', NOW() - INTERVAL '75 minutes', 'Urgent neurosurgical craniotomy and Level 1 trauma care not available at primary casualty.', 'Intubated on mechanical transport ventilator. IV access secured with 18G cannula. Vitals stable during transit: BP 118/76, HR 88 bpm.', 'Apex ALS Ambulance Unit 02', 'Dr. Ramesh K. (Emergency CMO)')
ON CONFLICT (id) DO NOTHING;

-- Seed Clinical Event Audit
INSERT INTO patient_record_events (id, emergency_patient_id, event_type, event_summary, created_by, created_at)
VALUES
('ev-001', 'pat-emg-1042', 'PATIENT_INTAKE', 'Intake registered at scene by Paramedic Unit 4. Temporary ID LL-EMG-1042 assigned.', 'EMS Unit 4', NOW() - INTERVAL '130 minutes'),
('ev-002', 'pat-emg-1042', 'TRANSFER_DISPATCHED', 'Emergency inter-hospital transfer initiated to Apex Trauma Institute for Level 1 care.', 'City General Casualty', NOW() - INTERVAL '85 minutes'),
('ev-003', 'pat-emg-1042', 'TRANSFER_RECEIVED', 'Patient received at Apex Trauma Resuscitation Bay 1. Handover acknowledged.', 'Apex Triage Staff', NOW() - INTERVAL '60 minutes')
ON CONFLICT (id) DO NOTHING;
