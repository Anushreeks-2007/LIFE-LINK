import {
  dbGetEmergencyPatients,
  dbGetEmergencyPatientById,
  dbSaveEmergencyPatient,
  dbGetProfileById,
  dbGetProfileByQRToken,
  dbSaveProfile,
  dbEnqueueSyncAction,
  ensureSeedData
} from './db';
import * as sbModule from './supabaseClient';

const cloud = sbModule.supabase || sbModule.default || null;
const cloudOn = !!(
  import.meta.env.VITE_SUPABASE_URL &&
  import.meta.env.VITE_SUPABASE_ANON_KEY &&
  cloud &&
  cloud.rpc
);
/**
 * Generates an unpredictable, unique temporary patient identifier
 */
export function generateTemporaryPatientId() {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `LL-EMG-${randomSuffix}`;
}

/**
 * Registers a new unidentified or unconscious patient
 */
export async function registerUnidentifiedPatient({
  foundLocation,
  estimatedAge = '',
  apparentGender = 'Unknown',
  emergencyObservations,
  currentHospitalId,
  reportedBy = 'Authorized Emergency Staff',
  triageColor = 'RED (Immediate / Critical)',
  isOffline = false,
}) {
  await ensureSeedData();
  const id = `pat-emg-${Date.now().toString(36)}`;
  const temporaryPatientId = generateTemporaryPatientId();
  const now = new Date().toISOString();

  const newPatient = {
    id,
    temporary_patient_id: temporaryPatientId,
    identification_status: 'unidentified',
    linked_profile_id: null,
    current_hospital_id: currentHospitalId,
    found_location: foundLocation,
    estimated_age: estimatedAge,
    apparent_gender: apparentGender,
    triage_color: triageColor,
    emergency_observations: emergencyObservations,
    reported_by: reportedBy,
    registration_time: now,
    created_at: now,
    updated_at: now,
    transfers: [],
    events: [
      {
        id: `ev-${Date.now().toString(36)}`,
        event_type: 'PATIENT_INTAKE',
        event_summary: `Intake registered at scene. Temporary identifier ${temporaryPatientId} assigned.`,
        created_by: reportedBy,
        created_at: now,
      },
    ],
    notification_logs: [],
  };

  await dbSaveEmergencyPatient(newPatient);

  if (isOffline) {
    await dbEnqueueSyncAction('CREATE_PATIENT', {
      patient: newPatient,
    });
  }

  return newPatient;
}

/**
 * Retrieves all registered emergency patients
 */
export async function getEmergencyPatients() {
  await ensureSeedData();
  return dbGetEmergencyPatients();
}

/**
 * Retrieves an emergency patient by ID or temporary ID
 */
export async function getEmergencyPatient(id) {
  await ensureSeedData();
  const patients = await dbGetEmergencyPatients();
  return patients.find(
    (p) => p.id === id || p.temporary_patient_id === id
  ) || null;
}

/**
 * Records an inter-hospital transfer with clinical handover notes
 */
export async function recordPatientTransfer({
  patientId,
  sourceHospitalId,
  destinationHospitalId,
  reason,
  handoverNotes,
  transportUnit = 'Emergency ALS Transport',
  authorizedOfficer,
  isOffline = false,
}) {
  const patient = await getEmergencyPatient(patientId);
  if (!patient) throw new Error('Emergency patient record not found');

  const now = new Date().toISOString();
  const transferEntry = {
    id: `tr-${Date.now().toString(36)}`,
    emergency_patient_id: patient.id,
    source_hospital_id: sourceHospitalId,
    destination_hospital_id: destinationHospitalId,
    transfer_time: now,
    reason,
    handover_notes: handoverNotes,
    transport_unit: transportUnit,
    authorized_officer: authorizedOfficer,
  };

  patient.current_hospital_id = destinationHospitalId;
  patient.transfers = [transferEntry, ...(patient.transfers || [])];
  patient.events = [
    {
      id: `ev-${Date.now().toString(36)}`,
      event_type: 'TRANSFER_DISPATCHED',
      event_summary: `Transferred to hospital ${destinationHospitalId}. Reason: ${reason}`,
      created_by: authorizedOfficer,
      created_at: now,
    },
    ...(patient.events || []),
  ];

  await dbSaveEmergencyPatient(patient);

  if (isOffline) {
    await dbEnqueueSyncAction('RECORD_TRANSFER', {
      patient,
      transfer: transferEntry,
    });
  }

  return patient;
}

/**
 * Links an unidentified patient record to a verified registered profile
 */
export async function linkPatientToVerifiedProfile({
  patientId,
  profileId,
  authorizedOfficer,
  verificationNotes,
  isOffline = false,
}) {
  const patient = await getEmergencyPatient(patientId);
  if (!patient) throw new Error('Emergency patient not found');

  const profile = await dbGetProfileById(profileId);
  if (!profile) throw new Error('Verified profile not found');

  const now = new Date().toISOString();
  patient.identification_status = 'verified_linked';
  patient.linked_profile_id = profile.id;
  patient.linked_profile_name = profile.name;
  patient.linked_profile = profile;

  patient.events = [
    {
      id: `ev-${Date.now().toString(36)}`,
      event_type: 'IDENTITY_VERIFIED_AND_LINKED',
      event_summary: `Identity verified as ${profile.name} by ${authorizedOfficer}. Notes: ${verificationNotes}`,
      created_by: authorizedOfficer,
      created_at: now,
    },
    ...(patient.events || []),
  ];

  await dbSaveEmergencyPatient(patient);

  if (isOffline) {
    await dbEnqueueSyncAction('LINK_PATIENT_IDENTITY', {
      patientId,
      profileId,
      authorizedOfficer,
    });
  }

  return patient;
}

function normalizeToken(raw) {
  let text = (raw || '').trim();
  try { text = decodeURIComponent(text); } catch (e) { /* ignore */ }
  const match = text.match(/LL-TOKEN-[A-Za-z0-9-]+/i);
  return (match ? match[0] : text).toUpperCase();
}

export async function syncProfileToCloud(profile) {
  if (!cloudOn || !profile || !profile.qr_token) return;
  const { error } = await cloud.rpc('upsert_shared_profile', { p_profile: profile });
  if (error) console.warn('Cloud profile sync failed:', error.message);
}

export async function resolveQRProfileToken(rawToken) {
  await ensureSeedData();
  const token = normalizeToken(rawToken);
  let profile = null;

  if (cloudOn) {
    const { data, error } = await cloud.rpc('get_shared_profile', { p_token: token });
    if (error) console.warn('Cloud lookup error:', error.message);
    if (data) profile = data;
  }

  if (!profile) {
    profile = await dbGetProfileByQRToken(token);
  }

  if (!profile) {
    throw new Error('Invalid or unrecognized emergency QR token.');
  }
  if (profile.is_revoked) {
    throw new Error('This emergency QR token has been revoked by the patient.');
  }
  return profile;
}

/**
 * Generates or updates personal emergency profile
 */
export async function saveEmergencyProfile(profileData) {
  await ensureSeedData();
  const now = new Date().toISOString();
  const id = profileData.id || `prof-${Date.now().toString(36)}`;
  const qr_token = profileData.qr_token || `LL-TOKEN-${Math.random().toString(36).substring(2, 8).toUpperCase()}-SECURE`;

  const updatedProfile = {
    ...profileData,
    id,
    qr_token,
    is_revoked: false,
    updated_at: now,
  };

  await dbSaveProfile(updatedProfile);
  await syncProfileToCloud(updatedProfile);
  return updatedProfile;
}

/**
 * Revokes a user's QR profile token
 */
export async function revokeEmergencyQRToken(profileId) {
  const profile = await dbGetProfileById(profileId);
  if (!profile) throw new Error('Profile not found');
  profile.is_revoked = true;
  profile.revoked_at = new Date().toISOString();
  await dbSaveProfile(profile);
  await syncProfileToCloud(profile);
  return profile;
}
