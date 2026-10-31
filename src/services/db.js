/**
 * Seeds hospitals and the demo unidentified patient only.
 * No demo emergency profile is created, and any previously seeded one is removed once.
 */
export async function ensureSeedData() {
  const db = await getDb();
  const tx = db.transaction(
    ['hospitals', 'emergency_profiles', 'emergency_patients', 'app_meta'],
    'readwrite'
  );
  const metaStore = tx.objectStore('app_meta');

  // 1. First-time seed (without the demo profile)
  const isSeeded = await metaStore.get('has_seeded_v1');
  if (!isSeeded) {
    const hospStore = tx.objectStore('hospitals');
    for (const hosp of SYNTHETIC_HOSPITALS) {
      await hospStore.put(hosp);
    }

    const patStore = tx.objectStore('emergency_patients');
    await patStore.put(SYNTHETIC_UNIDENTIFIED_PATIENT);

    await metaStore.put({ key: 'has_seeded_v1', seeded_at: new Date().toISOString() });
    console.log('[LIFE-LINK IndexedDB] Seeded hospitals and demo patient.');
  }

  // 2. One-time cleanup: remove the old demo profile from browsers that already have it
  const cleaned = await metaStore.get('removed_demo_profile_v1');
  if (!cleaned) {
    await tx.objectStore('emergency_profiles').delete(SYNTHETIC_REGISTERED_PROFILE.id);
    await metaStore.put({ key: 'removed_demo_profile_v1', at: new Date().toISOString() });
  }

  await tx.done;
}