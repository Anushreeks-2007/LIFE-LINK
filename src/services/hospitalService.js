import {
  dbGetHospitals,
  dbGetHospitalById,
  dbSaveHospital,
  dbEnqueueSyncAction,
  ensureSeedData
} from './db';
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { calculateDistanceKm } from '../utils/geoUtils';

/**
 * Retrieves all hospitals with distance calculation and filtering
 */
export async function getHospitals({
  searchQuery = '',
  emergencyOnly = false,
  hasIcu = false,
  hasOxygen = false,
  hasBlood = false,
  sortBy = 'distance', // 'distance' | 'availability' | 'name'
  userLocation = null,
} = {}) {
  await ensureSeedData();

  let hospitals = [];

  if (isSupabaseConfigured && supabase && navigator.onLine) {
    try {
      const { data, error } = await supabase.from('hospitals').select('*');
      if (error) throw error;
      hospitals = data || [];
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to local IndexedDB:', err);
      hospitals = await dbGetHospitals();
    }
  } else {
    hospitals = await dbGetHospitals();
  }

  // Calculate distance for each hospital if userLocation is available
  hospitals = hospitals.map((hosp) => {
    let distanceKm = null;
    if (userLocation && userLocation.latitude && userLocation.longitude) {
      distanceKm = calculateDistanceKm(
        userLocation.latitude,
        userLocation.longitude,
        hosp.latitude,
        hosp.longitude
      );
    }
    
    // Total available beds across all reported bed types
    const totalAvailableBeds = (hosp.beds || []).reduce(
      (sum, b) => sum + (Number(b.reported_available_beds) || 0),
      0
    );

    return {
      ...hosp,
      distanceKm,
      totalAvailableBeds,
    };
  });

  // Apply Search Query filter
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    hospitals = hospitals.filter(
      (h) =>
        h.name.toLowerCase().includes(q) ||
        h.address.toLowerCase().includes(q) ||
        h.hospital_type.toLowerCase().includes(q) ||
        (h.services || []).some((s) => s.toLowerCase().includes(q))
    );
  }

  // Apply Emergency Services filter
  if (emergencyOnly) {
    hospitals = hospitals.filter((h) => h.emergency_services_available);
  }

  // Apply ICU Beds filter
  if (hasIcu) {
    hospitals = hospitals.filter((h) =>
      (h.beds || []).some(
        (b) => b.bed_type.toLowerCase().includes('icu') && Number(b.reported_available_beds) > 0
      )
    );
  }

  // Apply Oxygen Beds filter
  if (hasOxygen) {
    hospitals = hospitals.filter((h) =>
      (h.beds || []).some(
        (b) => b.bed_type.toLowerCase().includes('oxygen') && Number(b.reported_available_beds) > 0
      )
    );
  }

  // Apply Blood Bank filter
  if (hasBlood) {
    hospitals = hospitals.filter((h) =>
      (h.services || []).some((s) => s.toLowerCase().includes('blood bank'))
    );
  }

  // Sorting
  hospitals.sort((a, b) => {
    if (sortBy === 'distance') {
      if (a.distanceKm == null) return 1;
      if (b.distanceKm == null) return -1;
      return a.distanceKm - b.distanceKm;
    }
    if (sortBy === 'availability') {
      return b.totalAvailableBeds - a.totalAvailableBeds;
    }
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });

  return hospitals;
}

/**
 * Retrieves a single hospital by ID
 */
export async function getHospitalById(id) {
  await ensureSeedData();
  const hospital = await dbGetHospitalById(id);
  return hospital;
}

/**
 * Updates reported bed counts for a hospital
 */
export async function updateHospitalBeds(hospitalId, newBeds, isOffline = false) {
  const hospital = await getHospitalById(hospitalId);
  if (!hospital) throw new Error('Hospital not found');

  hospital.beds = newBeds;
  hospital.last_updated = new Date().toISOString();

  await dbSaveHospital(hospital);

  if (isOffline || !isSupabaseConfigured) {
    await dbEnqueueSyncAction('UPDATE_BEDS', {
      hospitalId,
      hospital,
      beds: newBeds,
    });
  }

  return hospital;
}

/**
 * Updates reported medicine stock for a hospital
 */
export async function updateHospitalMedicines(hospitalId, newMedicines, isOffline = false) {
  const hospital = await getHospitalById(hospitalId);
  if (!hospital) throw new Error('Hospital not found');

  hospital.medicines = newMedicines;
  hospital.last_updated = new Date().toISOString();

  await dbSaveHospital(hospital);

  if (isOffline || !isSupabaseConfigured) {
    await dbEnqueueSyncAction('UPDATE_MEDICINES', {
      hospitalId,
      hospital,
      medicines: newMedicines,
    });
  }

  return hospital;
}
