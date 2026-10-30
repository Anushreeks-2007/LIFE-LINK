import { dbGetEmergencyPatientById, dbSaveEmergencyPatient } from './db';
import { isSupabaseConfigured, supabase } from './supabaseClient';

/**
 * Dispatches an emergency family notification
 */
export async function sendEmergencyFamilyNotification({
  patientId,
  recipientName,
  recipientPhone,
  hospitalName,
  hospitalPhone,
  staffName,
  patientIdentifier,
  isOffline = false,
}) {
  const patient = await dbGetEmergencyPatientById(patientId);
  if (!patient) throw new Error('Patient record not found');

  const now = new Date().toISOString();
  const alertText = `[LIFE-LINK EMERGENCY ALERT] Medical emergency notification regarding patient (${patientIdentifier}). Currently admitted at ${hospitalName}. Handled by: ${staffName}. Immediate assistance contact: ${hospitalPhone}.`;

  // Simulated delivery delay
  await new Promise((res) => setTimeout(res, 800));

  const logEntry = {
    id: `notif-${Date.now().toString(36)}`,
    emergency_patient_id: patient.id,
    recipient_name: recipientName,
    recipient_phone: recipientPhone,
    channel: 'SMS / Instant Dispatch',
    status: isOffline ? 'QUEUED_OFFLINE' : 'DELIVERED (SIMULATED)',
    is_simulated: !isSupabaseConfigured,
    message_content: alertText,
    dispatched_by: staffName,
    created_at: now,
  };

  patient.notification_logs = [logEntry, ...(patient.notification_logs || [])];
  patient.events = [
    {
      id: `ev-${Date.now().toString(36)}`,
      event_type: 'FAMILY_NOTIFICATION_DISPATCHED',
      event_summary: `Emergency alert dispatched to ${recipientName} (${recipientPhone}). Status: ${logEntry.status}`,
      created_by: staffName,
      created_at: now,
    },
    ...(patient.events || []),
  ];

  await dbSaveEmergencyPatient(patient);

  return logEntry;
}
