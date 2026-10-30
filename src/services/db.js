import { openDB } from 'idb';
import {
  SYNTHETIC_HOSPITALS,
  SYNTHETIC_REGISTERED_PROFILE,
  SYNTHETIC_UNIDENTIFIED_PATIENT
} from '../utils/syntheticData';

const DB_NAME = 'lifelink_offline_db';
const DB_VERSION = 1;

/**
 * Initializes and upgrades the IndexedDB storage
 */
export async function getDb() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('hospitals')) {
        const hospitalStore = db.createObjectStore('hospitals', { keyPath: 'id' });
        hospitalStore.createIndex('name', 'name', { unique: false });
        hospitalStore.createIndex('emergency', 'emergency_services_available', { unique: false });
      }

      if (!db.objectStoreNames.contains('emergency_profiles')) {
        const profileStore = db.createObjectStore('emergency_profiles', { keyPath: 'id' });
        profileStore.createIndex('qr_token', 'qr_token', { unique: true });
        profileStore.createIndex('owner', 'owner_user_id', { unique: false });
      }

      if (!db.objectStoreNames.contains('emergency_patients')) {
        const patientStore = db.createObjectStore('emergency_patients', { keyPath: 'id' });
        patientStore.createIndex('temporary_id', 'temporary_patient_id', { unique: true });
        patientStore.createIndex('status', 'identification_status', { unique: false });
        patientStore.createIndex('hospital', 'current_hospital_id', { unique: false });
      }

      if (!db.objectStoreNames.contains('sync_queue')) {
        const queueStore = db.createObjectStore('sync_queue', { keyPath: 'queue_id', autoIncrement: true });
        queueStore.createIndex('created_at', 'created_at', { unique: false });
      }

      if (!db.objectStoreNames.contains('app_meta')) {
        db.createObjectStore('app_meta', { keyPath: 'key' });
      }
    },
  });
}

/**
 * Pre-seeds the IndexedDB database with synthetic demonstration data if empty
 */
export async function ensureSeedData() {
  const db = await getDb();
  const tx = db.transaction(['hospitals', 'emergency_profiles', 'emergency_patients', 'app_meta'], 'readwrite');
  const metaStore = tx.objectStore('app_meta');
  const isSeeded = await metaStore.get('has_seeded_v1');

  if (!isSeeded) {
    const hospStore = tx.objectStore('hospitals');
    for (const hosp of SYNTHETIC_HOSPITALS) {
      await hospStore.put(hosp);
    }

    const profStore = tx.objectStore('emergency_profiles');
    await profStore.put(SYNTHETIC_REGISTERED_PROFILE);

    const patStore = tx.objectStore('emergency_patients');
    await patStore.put(SYNTHETIC_UNIDENTIFIED_PATIENT);

    await metaStore.put({ key: 'has_seeded_v1', seeded_at: new Date().toISOString() });
    await tx.done;
    console.log('[LIFE-LINK IndexedDB] Pre-seeded demo healthcare records successfully.');
  }
}

// ---------------- Hospital Storage Helpers ----------------
export async function dbGetHospitals() {
  const db = await getDb();
  return db.getAll('hospitals');
}

export async function dbGetHospitalById(id) {
  const db = await getDb();
  return db.get('hospitals', id);
}

export async function dbSaveHospital(hospital) {
  const db = await getDb();
  hospital.last_updated = new Date().toISOString();
  return db.put('hospitals', hospital);
}

// ---------------- Emergency Profile Helpers ----------------
export async function dbGetProfileById(id) {
  const db = await getDb();
  return db.get('emergency_profiles', id);
}

export async function dbGetProfileByQRToken(token) {
  const db = await getDb();
  const tx = db.transaction('emergency_profiles', 'readonly');
  const index = tx.store.index('qr_token');
  return index.get(token);
}

export async function dbSaveProfile(profile) {
  const db = await getDb();
  profile.updated_at = new Date().toISOString();
  return db.put('emergency_profiles', profile);
}

// ---------------- Emergency Patient Intake Helpers ----------------
export async function dbGetEmergencyPatients() {
  const db = await getDb();
  return db.getAll('emergency_patients');
}

export async function dbGetEmergencyPatientById(id) {
  const db = await getDb();
  return db.get('emergency_patients', id);
}

export async function dbSaveEmergencyPatient(patient) {
  const db = await getDb();
  patient.updated_at = new Date().toISOString();
  return db.put('emergency_patients', patient);
}

// ---------------- Sync Queue Helpers ----------------
export async function dbEnqueueSyncAction(actionType, payload) {
  const db = await getDb();
  const entry = {
    actionType,
    payload,
    created_at: new Date().toISOString(),
    retry_count: 0
  };
  return db.add('sync_queue', entry);
}

export async function dbGetSyncQueue() {
  const db = await getDb();
  return db.getAll('sync_queue');
}

export async function dbRemoveSyncAction(queueId) {
  const db = await getDb();
  return db.delete('sync_queue', queueId);
}

export async function dbClearSyncQueue() {
  const db = await getDb();
  return db.clear('sync_queue');
}

/**
 * Resets local database back to fresh synthetic demo data
 */
export async function dbResetToDefaults() {
  const db = await getDb();
  const tx = db.transaction(['hospitals', 'emergency_profiles', 'emergency_patients', 'sync_queue', 'app_meta'], 'readwrite');
  await tx.objectStore('hospitals').clear();
  await tx.objectStore('emergency_profiles').clear();
  await tx.objectStore('emergency_patients').clear();
  await tx.objectStore('sync_queue').clear();
  await tx.objectStore('app_meta').clear();
  await tx.done;
  await ensureSeedData();
}
