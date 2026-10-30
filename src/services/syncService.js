import {
  dbGetSyncQueue,
  dbRemoveSyncAction,
  dbSaveHospital,
  dbSaveEmergencyPatient
} from './db';
import { supabase, isSupabaseConfigured } from './supabaseClient';

/**
 * Replays queued offline mutations to Supabase or simulates server synchronization
 */
export async function processSyncQueue() {
  const queue = await dbGetSyncQueue();
  if (!queue || queue.length === 0) {
    return { success: true, processed: 0, failed: 0 };
  }

  let processed = 0;
  let failed = 0;

  for (const item of queue) {
    try {
      if (isSupabaseConfigured && supabase) {
        // Send to remote Supabase tables
        if (item.actionType === 'UPDATE_BEDS') {
          await supabase
            .from('bed_availability')
            .upsert(item.payload.beds);
        } else if (item.actionType === 'UPDATE_MEDICINES') {
          await supabase
            .from('medicine_inventory')
            .upsert(item.payload.medicines);
        } else if (item.actionType === 'CREATE_PATIENT') {
          await supabase
            .from('emergency_patients')
            .insert(item.payload);
        } else if (item.actionType === 'RECORD_TRANSFER') {
          await supabase
            .from('patient_transfers')
            .insert(item.payload);
        }
      } else {
        // In Demonstration Mode: ensure local IndexedDB is up to date and mark synced
        if (item.actionType === 'UPDATE_BEDS' || item.actionType === 'UPDATE_MEDICINES') {
          await dbSaveHospital(item.payload.hospital);
        } else if (item.actionType === 'CREATE_PATIENT' || item.actionType === 'RECORD_TRANSFER') {
          await dbSaveEmergencyPatient(item.payload.patient);
        }
      }

      // Successfully processed: remove from queue
      await dbRemoveSyncAction(item.queue_id);
      processed++;
    } catch (err) {
      console.error('[LIFE-LINK Sync Engine] Error processing sync item:', item, err);
      failed++;
    }
  }

  return { success: failed === 0, processed, failed };
}
