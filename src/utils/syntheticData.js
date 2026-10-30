// Synthetic demonstration data for LIFE-LINK
// Clearly marked as simulated and fictional for healthcare prototype testing

export const SYNTHETIC_HOSPITALS = [
  {
    id: "hosp-001",
    name: "Apex Trauma & Emergency Institute",
    address: "142 Victoria Road, Ashok Nagar, Bengaluru 560025",
    latitude: 12.9667,
    longitude: 77.6083,
    contact_phone: "+91 80 2234 5000",
    emergency_phone: "108 / +91 80 2234 5099",
    hospital_type: "Tertiary Care & Level 1 Trauma",
    emergency_services_available: true,
    services: [
      "Level 1 Trauma Center",
      "24/7 Neurosurgery",
      "Adult ICU",
      "Cardiac Catheterization",
      "Blood Bank",
      "Burn Unit",
      "Emergency Radiology"
    ],
    beds: [
      { id: "b1", bed_type: "ICU Beds", total_beds: 30, reported_available_beds: 4, reported_at: new Date(Date.now() - 25 * 60000).toISOString() },
      { id: "b2", bed_type: "Emergency Resuscitation", total_beds: 12, reported_available_beds: 3, reported_at: new Date(Date.now() - 25 * 60000).toISOString() },
      { id: "b3", bed_type: "Oxygen General Beds", total_beds: 80, reported_available_beds: 18, reported_at: new Date(Date.now() - 25 * 60000).toISOString() },
      { id: "b4", bed_type: "Pediatric ICU (PICU)", total_beds: 10, reported_available_beds: 2, reported_at: new Date(Date.now() - 25 * 60000).toISOString() }
    ],
    medicines: [
      { id: "m1", medicine_name: "Polyvalent Snake Anti-venom", reported_quantity: 45, unit: "Vials", reported_at: new Date(Date.now() - 40 * 60000).toISOString() },
      { id: "m2", medicine_name: "O-Negative Emergency Packed Red Blood", reported_quantity: 12, unit: "Units", reported_at: new Date(Date.now() - 40 * 60000).toISOString() },
      { id: "m3", medicine_name: "Epinephrine 1mg/ml (Auto-injectors)", reported_quantity: 80, unit: "Ampoules", reported_at: new Date(Date.now() - 40 * 60000).toISOString() },
      { id: "m4", medicine_name: "Atropine Sulfate 0.6mg/ml", reported_quantity: 120, unit: "Ampoules", reported_at: new Date(Date.now() - 40 * 60000).toISOString() },
      { id: "m5", medicine_name: "Intravenous Normal Saline (0.9%)", reported_quantity: 450, unit: "Bags", reported_at: new Date(Date.now() - 40 * 60000).toISOString() }
    ],
    last_updated: new Date(Date.now() - 25 * 60000).toISOString(),
    verification_status: "Verified Hospital Partner"
  },
  {
    id: "hosp-002",
    name: "City General Hospital & Medical College",
    address: "88 Fort Road, Kalasipalya, Bengaluru 560002",
    latitude: 12.9592,
    longitude: 77.5753,
    contact_phone: "+91 80 2670 1155",
    emergency_phone: "+91 80 2670 9999",
    hospital_type: "Public District Hospital",
    emergency_services_available: true,
    services: [
      "24/7 Emergency Casualty",
      "General Surgery",
      "Orthopedics",
      "Blood Bank",
      "Dialysis Center",
      "Obstetrics & Neonatal"
    ],
    beds: [
      { id: "b5", bed_type: "ICU Beds", total_beds: 20, reported_available_beds: 1, reported_at: new Date(Date.now() - 45 * 60000).toISOString() },
      { id: "b6", bed_type: "Emergency Resuscitation", total_beds: 10, reported_available_beds: 0, reported_at: new Date(Date.now() - 45 * 60000).toISOString() },
      { id: "b7", bed_type: "Oxygen General Beds", total_beds: 120, reported_available_beds: 8, reported_at: new Date(Date.now() - 45 * 60000).toISOString() }
    ],
    medicines: [
      { id: "m6", medicine_name: "Polyvalent Snake Anti-venom", reported_quantity: 18, unit: "Vials", reported_at: new Date(Date.now() - 90 * 60000).toISOString() },
      { id: "m7", medicine_name: "O-Negative Emergency Packed Red Blood", reported_quantity: 2, unit: "Units", reported_at: new Date(Date.now() - 90 * 60000).toISOString() },
      { id: "m8", medicine_name: "Rabies Immunoglobulin (HRIG)", reported_quantity: 24, unit: "Vials", reported_at: new Date(Date.now() - 90 * 60000).toISOString() }
    ],
    last_updated: new Date(Date.now() - 45 * 60000).toISOString(),
    verification_status: "Verified Hospital Partner"
  },
  {
    id: "hosp-003",
    name: "St. Jude Healthcare & Cardiac Center",
    address: "24 Richmond Road, Shanthala Nagar, Bengaluru 560025",
    latitude: 12.9644,
    longitude: 77.5998,
    contact_phone: "+91 80 2221 4433",
    emergency_phone: "+91 80 2221 9111",
    hospital_type: "Cardiac & Multispecialty Hospital",
    emergency_services_available: true,
    services: [
      "24/7 Cardiac Emergency (STEMI Care)",
      "Coronary Care Unit (CCU)",
      "Emergency Angioplasty",
      "Vascular Surgery",
      "Advanced Life Support Ambulance"
    ],
    beds: [
      { id: "b8", bed_type: "Cardiac CCU", total_beds: 18, reported_available_beds: 5, reported_at: new Date(Date.now() - 15 * 60000).toISOString() },
      { id: "b9", bed_type: "Adult ICU", total_beds: 15, reported_available_beds: 3, reported_at: new Date(Date.now() - 15 * 60000).toISOString() },
      { id: "b10", bed_type: "Emergency Observation", total_beds: 8, reported_available_beds: 4, reported_at: new Date(Date.now() - 15 * 60000).toISOString() }
    ],
    medicines: [
      { id: "m9", medicine_name: "Alteplase (Tissue Plasminogen Activator)", reported_quantity: 14, unit: "Vials", reported_at: new Date(Date.now() - 30 * 60000).toISOString() },
      { id: "m10", medicine_name: "Heparin Sodium 5000 IU/ml", reported_quantity: 90, unit: "Vials", reported_at: new Date(Date.now() - 30 * 60000).toISOString() }
    ],
    last_updated: new Date(Date.now() - 15 * 60000).toISOString(),
    verification_status: "Verified Hospital Partner"
  },
  {
    id: "hosp-004",
    name: "Metro West Children & Maternity Hospital",
    address: "55 Chord Road, Rajajinagar, Bengaluru 560010",
    latitude: 12.9892,
    longitude: 77.5539,
    contact_phone: "+91 80 2315 7800",
    emergency_phone: "+91 80 2315 9911",
    hospital_type: "Pediatric & Maternal Specialized",
    emergency_services_available: true,
    services: [
      "Pediatric Emergency Care",
      "Neonatal Intensive Care (NICU Level 3)",
      "Pediatric Surgery",
      "High Risk Obstetric Emergency"
    ],
    beds: [
      { id: "b11", bed_type: "NICU (Neonatal)", total_beds: 25, reported_available_beds: 6, reported_at: new Date(Date.now() - 50 * 60000).toISOString() },
      { id: "b12", bed_type: "PICU (Pediatric)", total_beds: 15, reported_available_beds: 3, reported_at: new Date(Date.now() - 50 * 60000).toISOString() }
    ],
    medicines: [
      { id: "m11", medicine_name: "Surfactant Suspension (Pediatric)", reported_quantity: 15, unit: "Vials", reported_at: new Date(Date.now() - 50 * 60000).toISOString() }
    ],
    last_updated: new Date(Date.now() - 50 * 60000).toISOString(),
    verification_status: "Verified Hospital Partner"
  },
  {
    id: "hosp-005",
    name: "Suburban Community Clinic & Day Care",
    address: "12 Old Airport Road, Domlur, Bengaluru 560071",
    latitude: 12.9601,
    longitude: 77.6387,
    contact_phone: "+91 80 2526 3311",
    emergency_phone: "+91 80 2526 3311",
    hospital_type: "Primary Health Center",
    emergency_services_available: false, // Non-emergency day clinic
    services: [
      "Outpatient Consultation",
      "Minor Wound Suturing",
      "Diagnostic Lab",
      "Pharmacy"
    ],
    beds: [
      { id: "b13", bed_type: "Observation Beds", total_beds: 6, reported_available_beds: 2, reported_at: new Date(Date.now() - 8 * 3600000).toISOString() } // Outdated! 8 hours ago
    ],
    medicines: [
      { id: "m12", medicine_name: "Oral Rehydration Salts & Paracetamol", reported_quantity: 200, unit: "Packs", reported_at: new Date(Date.now() - 8 * 3600000).toISOString() }
    ],
    last_updated: new Date(Date.now() - 8 * 3600000).toISOString(), // > 6 hours outdated
    verification_status: "Community Submitted (Unverified)"
  },
  {
    id: "hosp-006",
    name: "Greenfield Emergency & Burn Specialty",
    address: "303 Hosur Main Road, Koramangala 1st Block, Bengaluru 560034",
    latitude: 12.9279,
    longitude: 77.6271,
    contact_phone: "+91 80 4111 8822",
    emergency_phone: "+91 80 4111 9900",
    hospital_type: "Specialized Emergency & Burn Center",
    emergency_services_available: true,
    services: [
      "24/7 Severe Burn ICU",
      "Hyperbaric Oxygen Therapy",
      "Toxicology & Poison Control",
      "Emergency Trauma Triage"
    ],
    beds: [
      { id: "b14", bed_type: "Burn ICU Beds", total_beds: 12, reported_available_beds: 2, reported_at: new Date(Date.now() - 10 * 60000).toISOString() },
      { id: "b15", bed_type: "Emergency Resuscitation", total_beds: 8, reported_available_beds: 2, reported_at: new Date(Date.now() - 10 * 60000).toISOString() }
    ],
    medicines: [
      { id: "m13", medicine_name: "Silver Sulfadiazine Burn Ointment", reported_quantity: 80, unit: "Tubes", reported_at: new Date(Date.now() - 10 * 60000).toISOString() },
      { id: "m14", medicine_name: "Albumin 20% Infusion", reported_quantity: 35, unit: "Bottles", reported_at: new Date(Date.now() - 10 * 60000).toISOString() }
    ],
    last_updated: new Date(Date.now() - 10 * 60000).toISOString(),
    verification_status: "Verified Hospital Partner"
  }
];

export const SYNTHETIC_REGISTERED_PROFILE = {
  id: "prof-demo-001",
  owner_user_id: "user-public-001",
  name: "Rahul Sharma",
  age: 32,
  gender: "Male",
  blood_group: "O+",
  emergency_contact_name: "Anjali Sharma",
  emergency_contact_relationship: "Sister",
  emergency_contact_phone: "+91 98765 43210",
  secondary_contact_name: "Dr. Arvind Rao",
  secondary_contact_phone: "+91 94480 11223",
  allergies: "Severe Penicillin Allergy (Anaphylaxis risk), Shellfish",
  relevant_medical_notes: "Type 1 Diabetes Mellitus (Uses Insulin glargine 20u daily). Carries asthma inhaler.",
  organ_donor_consent: true,
  qr_token: "LL-TOKEN-8F492E-SECURE", // Non-sensitive token reference
  is_revoked: false,
  created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
  updated_at: new Date(Date.now() - 5 * 86400000).toISOString()
};

export const SYNTHETIC_UNIDENTIFIED_PATIENT = {
  id: "pat-emg-1042",
  temporary_patient_id: "LL-EMG-1042",
  identification_status: "unidentified", // 'unidentified' | 'pending_verification' | 'verified_linked'
  linked_profile_id: null,
  current_hospital_id: "hosp-001", // Apex Trauma Institute
  found_location: "Near MG Road Metro Station, Pillar 140 (Traffic Accident)",
  registration_time: new Date(Date.now() - 130 * 60000).toISOString(),
  estimated_age: "30-35 years",
  apparent_gender: "Male",
  triage_color: "RED (Immediate / Critical)",
  emergency_observations: "Unconscious adult male. Severe right temporal laceration. GCS 8 (E2V2M4). Bilateral breath sounds present. Suspected closed traumatic brain injury. Blood sample drawn for typing. No wallet or identification card recovered at scene.",
  reported_by: "Paramedic S. Patil (EMS Unit 4)",
  created_at: new Date(Date.now() - 130 * 60000).toISOString(),
  transfers: [
    {
      id: "tr-001",
      emergency_patient_id: "pat-emg-1042",
      source_hospital_id: "hosp-002", // Started at City General
      destination_hospital_id: "hosp-001", // Transferred to Apex Trauma
      transfer_time: new Date(Date.now() - 75 * 60000).toISOString(),
      reason: "Urgent neurosurgical craniotomy and Level 1 trauma care not available at primary casualty.",
      handover_notes: "Intubated on mechanical transport ventilator. IV access secured with 18G cannula. Vitals stable during transit: BP 118/76, HR 88 bpm. 500ml Normal Saline infused.",
      transport_unit: "Apex ALS Ambulance Unit 02",
      authorized_officer: "Dr. Ramesh K. (Emergency CMO)"
    }
  ],
  events: [
    {
      id: "ev-001",
      event_type: "PATIENT_INTAKE",
      event_summary: "Intake registered at scene by Paramedic Unit 4. Temporary ID LL-EMG-1042 assigned.",
      created_by: "EMS Unit 4",
      created_at: new Date(Date.now() - 130 * 60000).toISOString()
    },
    {
      id: "ev-002",
      event_type: "TRANSFER_DISPATCHED",
      event_summary: "Emergency inter-hospital transfer initiated to Apex Trauma Institute for Level 1 care.",
      created_by: "City General Casualty",
      created_at: new Date(Date.now() - 85 * 60000).toISOString()
    },
    {
      id: "ev-003",
      event_type: "TRANSFER_RECEIVED",
      event_summary: "Patient received at Apex Trauma Resuscitation Bay 1. Handover acknowledged.",
      created_by: "Apex Triage Staff",
      created_at: new Date(Date.now() - 60 * 60000).toISOString()
    }
  ],
  notification_logs: []
};

// Emergency First Aid Guides for Offline Reference
export const OFFLINE_FIRST_AID_GUIDES = [
  {
    id: "fa-1",
    condition: "Severe Bleeding & Hemorrhage",
    urgency: "CRITICAL",
    steps: [
      "Apply direct, firm, continuous pressure to the wound using a clean cloth or bandage.",
      "Do NOT remove embedded objects—pad around them to stabilize.",
      "If bleeding is arterial (pulsing) from an extremity and does not stop, apply a tourniquet 5cm above wound.",
      "Keep patient lying down, warm, and elevate legs slightly if signs of shock develop."
    ]
  },
  {
    id: "fa-2",
    condition: "Cardiac Arrest / Unresponsive & Not Breathing",
    urgency: "CRITICAL",
    steps: [
      "Check responsiveness: Shake gently and shout 'Are you okay?'.",
      "Call emergency ambulance (108 / 112) immediately or assign a bystander.",
      "Begin chest compressions immediately: Push hard and fast in center of chest (100-120 compressions/min, 5-6cm deep).",
      "Allow full chest recoil between compressions. If AED is available, turn it on and follow audio prompts."
    ]
  },
  {
    id: "fa-3",
    condition: "Snakebite Emergency Protocol",
    urgency: "HIGH",
    steps: [
      "Keep the patient calm, still, and completely immobilized to slow venom spread.",
      "Do NOT cut, suck venom, use electric shock, or apply ice.",
      "Remove tight rings, watches, or restrictive clothing near the bite site.",
      "Immobilize the affected limb with a splint at heart level and transport urgently to an anti-venom facility."
    ]
  },
  {
    id: "fa-4",
    condition: "Severe Burns & Scalds",
    urgency: "HIGH",
    steps: [
      "Cool the burn immediately under gentle, cool running water for at least 15-20 minutes.",
      "Do NOT use ice, toothpaste, butter, or grease on open burns.",
      "Cover loosely with a clean, non-adherent sterile dressing or clean plastic wrap.",
      "Protect from hypothermia and seek hospital burn care immediately."
    ]
  }
];
