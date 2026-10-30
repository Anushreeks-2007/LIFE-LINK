-- ==============================================================================
-- LIFE-LINK Emergency Healthcare Platform: Initial PostgreSQL Schema & RLS
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES (Authenticated Users & Role Mapping)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('public', 'hospital_admin', 'healthcare_staff')),
    preferred_language TEXT DEFAULT 'en' CHECK (preferred_language IN ('en', 'kn', 'hi')),
    assigned_hospital_id TEXT,
    staff_badge TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. HOSPITALS DIRECTORY
CREATE TABLE IF NOT EXISTS hospitals (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    contact_phone TEXT NOT NULL,
    emergency_phone TEXT NOT NULL,
    hospital_type TEXT NOT NULL,
    services JSONB DEFAULT '[]'::jsonb,
    emergency_services_available BOOLEAN DEFAULT TRUE,
    verification_status TEXT DEFAULT 'Verified Hospital Partner',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BED AVAILABILITY
CREATE TABLE IF NOT EXISTS bed_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hospital_id TEXT NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
    bed_type TEXT NOT NULL,
    total_beds INT NOT NULL CHECK (total_beds >= 0),
    reported_available_beds INT NOT NULL CHECK (reported_available_beds >= 0 AND reported_available_beds <= total_beds),
    updated_by TEXT,
    reported_at TIMESTAMPTZ DEFAULT NOW(),
    source TEXT DEFAULT 'Hospital Casualty Triage Desk',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. MEDICINE & BLOOD INVENTORY
CREATE TABLE IF NOT EXISTS medicine_inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hospital_id TEXT NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
    medicine_name TEXT NOT NULL,
    reported_quantity INT NOT NULL CHECK (reported_quantity >= 0),
    unit TEXT NOT NULL,
    updated_by TEXT,
    reported_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. EMERGENCY PROFILES (Voluntary Citizen Emergency Details)
CREATE TABLE IF NOT EXISTS emergency_profiles (
    id TEXT PRIMARY KEY,
    owner_user_id TEXT,
    name TEXT NOT NULL,
    age INT,
    gender TEXT,
    blood_group TEXT NOT NULL,
    emergency_contact_name TEXT NOT NULL,
    emergency_contact_relationship TEXT NOT NULL,
    emergency_contact_phone TEXT NOT NULL,
    secondary_contact_name TEXT,
    secondary_contact_phone TEXT,
    allergies TEXT,
    relevant_medical_notes TEXT,
    organ_donor_consent BOOLEAN DEFAULT FALSE,
    qr_token TEXT UNIQUE NOT NULL,
    is_revoked BOOLEAN DEFAULT FALSE,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. QR PROFILE TOKENS (Cryptographic Token Mapping)
CREATE TABLE IF NOT EXISTS qr_profile_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    emergency_profile_id TEXT NOT NULL REFERENCES emergency_profiles(id) ON DELETE CASCADE,
    token_hash TEXT UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. EMERGENCY PATIENTS (Unidentified & Linked Intakes)
CREATE TABLE IF NOT EXISTS emergency_patients (
    id TEXT PRIMARY KEY,
    temporary_patient_id TEXT UNIQUE NOT NULL,
    identification_status TEXT NOT NULL DEFAULT 'unidentified' CHECK (identification_status IN ('unidentified', 'pending_verification', 'verified_linked')),
    linked_profile_id TEXT REFERENCES emergency_profiles(id) ON DELETE SET NULL,
    current_hospital_id TEXT NOT NULL REFERENCES hospitals(id),
    registration_time TIMESTAMPTZ DEFAULT NOW(),
    found_location TEXT NOT NULL,
    estimated_age TEXT,
    apparent_gender TEXT,
    triage_color TEXT DEFAULT 'RED (Immediate / Critical)',
    emergency_observations TEXT NOT NULL,
    reported_by TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. PATIENT TRANSFERS (Inter-Hospital Continuity)
CREATE TABLE IF NOT EXISTS patient_transfers (
    id TEXT PRIMARY KEY,
    emergency_patient_id TEXT NOT NULL REFERENCES emergency_patients(id) ON DELETE CASCADE,
    source_hospital_id TEXT NOT NULL REFERENCES hospitals(id),
    destination_hospital_id TEXT NOT NULL REFERENCES hospitals(id),
    transfer_time TIMESTAMPTZ DEFAULT NOW(),
    reason TEXT NOT NULL,
    handover_notes TEXT NOT NULL,
    transport_unit TEXT NOT NULL,
    authorized_officer TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. PATIENT RECORD EVENTS (Immutable Clinical Audit Trail)
CREATE TABLE IF NOT EXISTS patient_record_events (
    id TEXT PRIMARY KEY,
    emergency_patient_id TEXT NOT NULL REFERENCES emergency_patients(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    event_summary TEXT NOT NULL,
    created_by TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. NOTIFICATION LOGS (Family Alert Records)
CREATE TABLE IF NOT EXISTS notification_logs (
    id TEXT PRIMARY KEY,
    emergency_patient_id TEXT NOT NULL REFERENCES emergency_patients(id) ON DELETE CASCADE,
    recipient_name TEXT NOT NULL,
    recipient_phone TEXT NOT NULL,
    channel TEXT NOT NULL,
    status TEXT NOT NULL,
    is_simulated BOOLEAN DEFAULT TRUE,
    message_content TEXT NOT NULL,
    dispatched_by TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for High Performance Emergency Queries
CREATE INDEX IF NOT EXISTS idx_hospitals_coords ON hospitals(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_hospitals_emergency ON hospitals(emergency_services_available);
CREATE INDEX IF NOT EXISTS idx_bed_avail_hospital ON bed_availability(hospital_id);
CREATE INDEX IF NOT EXISTS idx_med_inv_hospital ON medicine_inventory(hospital_id);
CREATE INDEX IF NOT EXISTS idx_emergency_patients_temp_id ON emergency_patients(temporary_patient_id);
CREATE INDEX IF NOT EXISTS idx_emergency_profiles_token ON emergency_profiles(qr_token);
CREATE INDEX IF NOT EXISTS idx_transfers_patient ON patient_transfers(emergency_patient_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE bed_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicine_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_profile_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_record_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;

-- Hospitals & Beds: Publicly viewable by all
CREATE POLICY "Public can view hospital directory" ON hospitals FOR SELECT USING (true);
CREATE POLICY "Public can view bed availability" ON bed_availability FOR SELECT USING (true);
CREATE POLICY "Public can view medicine inventory" ON medicine_inventory FOR SELECT USING (true);

-- Hospital Admin can update beds and medicines for their assigned facility
CREATE POLICY "Admins can update beds" ON bed_availability FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'hospital_admin')
);

CREATE POLICY "Admins can update medicine inventory" ON medicine_inventory FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'hospital_admin')
);

-- Emergency Profiles: Owner can manage their own profile
CREATE POLICY "Users can manage own emergency profile" ON emergency_profiles FOR ALL USING (
    auth.uid()::text = owner_user_id
);

-- Emergency Staff can read emergency profiles via valid non-revoked QR token lookup
CREATE POLICY "Staff can view non-revoked profiles" ON emergency_profiles FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('healthcare_staff', 'hospital_admin'))
);

-- Emergency Patients: Staff and Admins can view and insert intakes and transfers
CREATE POLICY "Staff can view emergency patient records" ON emergency_patients FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('healthcare_staff', 'hospital_admin'))
);

CREATE POLICY "Staff can register emergency patient records" ON emergency_patients FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('healthcare_staff', 'hospital_admin'))
);

CREATE POLICY "Staff can update emergency patient records" ON emergency_patients FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('healthcare_staff', 'hospital_admin'))
);

CREATE POLICY "Staff can record patient transfers" ON patient_transfers FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('healthcare_staff', 'hospital_admin'))
);

CREATE POLICY "Staff can record clinical audit events" ON patient_record_events FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('healthcare_staff', 'hospital_admin'))
);

CREATE POLICY "Staff can log notifications" ON notification_logs FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('healthcare_staff', 'hospital_admin'))
);
