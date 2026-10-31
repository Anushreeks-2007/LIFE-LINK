#!/usr/bin/env node
/**
 * LIFE-LINK page i18n codemod
 *
 * Usage (from your project root):
 *   node apply-i18n.mjs src/pages src/i18n/pageTranslations.js
 *
 * What it does
 *  1. Replaces every hard-coded English label in the 14 pages with t('key').
 *  2. Adds `import { useLanguage }` and `const { t } = useLanguage();` where missing.
 *  3. Writes src/i18n/pageTranslations.js with English, Kannada and Hindi text.
 *  4. Saves a backup of every page as <file>.orig before touching it.
 *
 * Anything it could not find is printed as a WARNING so nothing fails silently.
 */
import fs from 'fs';
import path from 'path';

const pagesDir = process.argv[2] || 'src/pages';
const outFile = process.argv[3] || 'src/i18n/pageTranslations.js';

// ---------- patch helpers ----------
// T: JSX text node      -> {t('key')}
// A: JSX attribute      -> attr={t('key')}
// J: quoted JS string   -> t('key')
// R: exact raw snippet  -> custom replacement (for interpolated text)
const T = (en, key, kn, hi) => ({ k: 'T', en, key, kn, hi });
const A = (attr, en, key, kn, hi) => ({ k: 'A', attr, en, key, kn, hi });
const J = (en, key, kn, hi) => ({ k: 'J', en, key, kn, hi });
const R = (old, neu, key, en, kn, hi) => ({ k: 'R', old, neu, key, en, kn, hi });

// ---------- shared strings ----------
const BACK_ADMIN = ['Back to Admin Overview', 'adm_back', 'ನಿರ್ವಾಹಕ ಅವಲೋಕನಕ್ಕೆ ಹಿಂತಿರುಗಿ', 'एडमिन अवलोकन पर वापस जाएँ'];
const STATUS = ['Status', 'common_status', 'ಸ್ಥಿತಿ', 'स्थिति'];
const ONLINE = ['Broadcasting Online', 'common_broadcastOnline', 'ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ಪ್ರಸಾರವಾಗುತ್ತಿದೆ', 'ऑनलाइन प्रसारित हो रहा है'];
const OFFLINE = ['Queuing Offline', 'common_queueOffline', 'ಆಫ್‌ಲೈನ್‌ನಲ್ಲಿ ಸರದಿಯಲ್ಲಿದೆ', 'ऑफ़लाइन कतार में है'];
const BACK_REC = ['Back to Patient Record', 'pat_backRecord', 'ರೋಗಿಯ ದಾಖಲೆಗೆ ಹಿಂತಿರುಗಿ', 'मरीज़ के रिकॉर्ड पर वापस जाएँ'];
const PAT_NF = ['Patient not found.', 'pat_notFoundShort', 'ರೋಗಿ ಕಂಡುಬಂದಿಲ್ಲ.', 'मरीज़ नहीं मिला।'];
const RETURN = ['Return', 'common_return', 'ಹಿಂತಿರುಗಿ', 'वापस जाएँ'];
const PATIENT = ['Patient', 'pat_label', 'ರೋಗಿ', 'मरीज़'];
const LAST_REP = ['Last reported:', 'common_lastReported', 'ಕೊನೆಯ ವರದಿ:', 'अंतिम रिपोर्ट:'];
const TIMESTAMP = ['Timestamp', 'common_timestamp', 'ಸಮಯಮುದ್ರೆ', 'टाइमस्टैम्प'];

// ---------- patches per page (keyed by exported component name) ----------
const PATCHES = {
  BedAvailabilityManagementPage: [
    T('Loading Bed Inventory...', 'bed_loading', 'ಹಾಸಿಗೆ ದಾಸ್ತಾನು ಲೋಡ್ ಆಗುತ್ತಿದೆ...', 'बेड इन्वेंटरी लोड हो रही है...'),
    T(...BACK_ADMIN),
    T('Live Bed Reporting', 'bed_badge', 'ನೇರ ಹಾಸಿಗೆ ವರದಿ', 'लाइव बेड रिपोर्टिंग'),
    T('Update Bed Availability', 'bed_title', 'ಹಾಸಿಗೆ ಲಭ್ಯತೆ ನವೀಕರಿಸಿ', 'बेड उपलब्धता अपडेट करें'),
    T('• Accurate counts prevent emergency diversions and save lives.', 'bed_sub', '• ನಿಖರವಾದ ಸಂಖ್ಯೆಗಳು ತುರ್ತು ಮಾರ್ಗ ಬದಲಾವಣೆಗಳನ್ನು ತಡೆದು ಜೀವ ಉಳಿಸುತ್ತವೆ.', '• सटीक संख्याएँ आपातकालीन डायवर्जन रोकती हैं और जान बचाती हैं।'),
    T(...STATUS),
    J(...ONLINE),
    J(...OFFLINE),
    R(
      '`Invalid bed count for "${b.bed_type}": Available beds (${b.reported_available_beds}) cannot exceed total capacity (${b.total_beds}).`',
      "t('bed_invalid').replace('{type}', b.bed_type).replace('{avail}', b.reported_available_beds).replace('{total}', b.total_beds)",
      'bed_invalid',
      'Invalid bed count for "{type}": Available beds ({avail}) cannot exceed total capacity ({total}).',
      '"{type}" ಗಾಗಿ ಅಮಾನ್ಯ ಹಾಸಿಗೆ ಸಂಖ್ಯೆ: ಲಭ್ಯ ಹಾಸಿಗೆಗಳು ({avail}) ಒಟ್ಟು ಸಾಮರ್ಥ್ಯವನ್ನು ({total}) ಮೀರಬಾರದು.',
      '"{type}" के लिए अमान्य बेड संख्या: उपलब्ध बेड ({avail}) कुल क्षमता ({total}) से अधिक नहीं हो सकते।'
    ),
    T('Bed availability broadcasted successfully!', 'bed_success', 'ಹಾಸಿಗೆ ಲಭ್ಯತೆಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಪ್ರಸಾರ ಮಾಡಲಾಗಿದೆ!', 'बेड उपलब्धता सफलतापूर्वक प्रसारित की गई!'),
    T(...LAST_REP),
    T('Total Licensed', 'bed_totalLic', 'ಒಟ್ಟು ಪರವಾನಗಿ ಪಡೆದ', 'कुल लाइसेंस प्राप्त'),
    T('Available Now', 'bed_availNow', 'ಈಗ ಲಭ್ಯ', 'अभी उपलब्ध'),
    T('Updating resets the freshness timestamp to', 'bed_fresh', 'ನವೀಕರಿಸುವುದರಿಂದ ತಾಜಾತನದ ಸಮಯಮುದ್ರೆ ಇದಕ್ಕೆ ಮರುಹೊಂದುತ್ತದೆ', 'अपडेट करने पर ताज़गी का टाइमस्टैम्प इस पर रीसेट हो जाता है'),
    J('Broadcasting...', 'bed_broadcasting', 'ಪ್ರಸಾರವಾಗುತ್ತಿದೆ...', 'प्रसारित हो रहा है...'),
    J('Save & Broadcast Availability', 'bed_saveBtn', 'ಉಳಿಸಿ ಮತ್ತು ಲಭ್ಯತೆ ಪ್ರಸಾರ ಮಾಡಿ', 'सहेजें और उपलब्धता प्रसारित करें'),
    J('Failed to update bed counts: ', 'bed_failed', 'ಹಾಸಿಗೆ ಸಂಖ್ಯೆಗಳನ್ನು ನವೀಕರಿಸಲು ವಿಫಲವಾಗಿದೆ: ', 'बेड संख्या अपडेट करने में विफल: '),
  ],

  EmergencyAssistancePage: [
    T('Immediate Emergency Response', 'emg_badge', 'ತಕ್ಷಣದ ತುರ್ತು ಪ್ರತಿಕ್ರಿಯೆ', 'तत्काल आपातकालीन प्रतिक्रिया'),
    T('Facing a Critical Medical Emergency?', 'emg_title', 'ಗಂಭೀರ ವೈದ್ಯಕೀಯ ತುರ್ತು ಪರಿಸ್ಥಿತಿ ಎದುರಾಗಿದೆಯೇ?', 'क्या आप गंभीर चिकित्सा आपातस्थिति का सामना कर रहे हैं?'),
    T('Ambulance', 'emg_ambulance', 'ಆಂಬ್ಯುಲೆನ್ಸ್', 'एम्बुलेंस'),
    T('Dial 108', 'emg_dial108', '108 ಗೆ ಕರೆ ಮಾಡಿ', '108 डायल करें'),
    T('All Emergencies', 'emg_all', 'ಎಲ್ಲಾ ತುರ್ತು ಸ್ಥಿತಿಗಳು', 'सभी आपातस्थितियाँ'),
    T('Dial 112', 'emg_dial112', '112 ಗೆ ಕರೆ ಮಾಡಿ', '112 डायल करें'),
    T('Disaster Relief', 'emg_disaster', 'ವಿಪತ್ತು ನಿರ್ವಹಣೆ', 'आपदा राहत'),
    T('Dial 1077', 'emg_dial1077', '1077 ಗೆ ಕರೆ ಮಾಡಿ', '1077 डायल करें'),
    T('Offline Mode Active', 'emg_offline', 'ಆಫ್‌ಲೈನ್ ಮೋಡ್ ಸಕ್ರಿಯವಾಗಿದೆ', 'ऑफ़लाइन मोड सक्रिय है'),
    T('Nearest 24/7 Emergency Casualty Facilities', 'emg_nearest', 'ಹತ್ತಿರದ 24/7 ತುರ್ತು ಅಪಘಾತ ಸೌಲಭ್ಯಗಳು', 'निकटतम 24/7 आपातकालीन कैज़ुअल्टी सुविधाएँ'),
    T('View All Emergency Facilities →', 'emg_viewAll', 'ಎಲ್ಲಾ ತುರ್ತು ಸೌಲಭ್ಯಗಳನ್ನು ವೀಕ್ಷಿಸಿ →', 'सभी आपातकालीन सुविधाएँ देखें →'),
  ],

  EmergencyPatientDetailsPage: [
    T('Retrieving Clinical Emergency Record...', 'pat_loading', 'ಕ್ಲಿನಿಕಲ್ ತುರ್ತು ದಾಖಲೆ ಪಡೆಯಲಾಗುತ್ತಿದೆ...', 'क्लिनिकल आपातकालीन रिकॉर्ड प्राप्त किया जा रहा है...'),
    T('Patient Record Not Found', 'pat_nf', 'ರೋಗಿಯ ದಾಖಲೆ ಕಂಡುಬಂದಿಲ್ಲ', 'मरीज़ का रिकॉर्ड नहीं मिला'),
    T('No emergency intake matches ID:', 'pat_noMatch', 'ಈ ಐಡಿಗೆ ಹೊಂದುವ ತುರ್ತು ದಾಖಲಾತಿ ಇಲ್ಲ:', 'इस आईडी से मेल खाने वाला कोई आपातकालीन इनटेक नहीं:'),
    T('Return to Scanner Terminal', 'pat_retScan', 'ಸ್ಕ್ಯಾನರ್ ಟರ್ಮಿನಲ್‌ಗೆ ಹಿಂತಿರುಗಿ', 'स्कैनर टर्मिनल पर लौटें'),
    T('Back', 'back'), // re-uses your existing t('back') key
    T('Record ID:', 'pat_recId', 'ದಾಖಲೆ ಐಡಿ:', 'रिकॉर्ड आईडी:'),
    T('Verified Identity:', 'pat_verified', 'ಪರಿಶೀಲಿತ ಗುರುತು:', 'सत्यापित पहचान:'),
    T('Identity Unidentified', 'pat_unident', 'ಗುರುತು ಅಪರಿಚಿತ', 'पहचान अज्ञात'),
    T('Intake Registered:', 'pat_intakeReg', 'ದಾಖಲಾತಿ ನೋಂದಣಿ:', 'इनटेक पंजीकृत:'),
    T('Initiate Hospital Transfer', 'pat_initTransfer', 'ಆಸ್ಪತ್ರೆ ವರ್ಗಾವಣೆ ಪ್ರಾರಂಭಿಸಿ', 'अस्पताल स्थानांतरण शुरू करें'),
    T('Family Notification', 'pat_famNotif', 'ಕುಟುಂಬಕ್ಕೆ ಸೂಚನೆ', 'परिवार को सूचना'),
    T('Verify & Link Identity', 'pat_verifyLink', 'ಗುರುತನ್ನು ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಲಿಂಕ್ ಮಾಡಿ', 'पहचान सत्यापित करें और लिंक करें'),
    T('Current Facility', 'pat_curFac', 'ಪ್ರಸ್ತುತ ಸೌಲಭ್ಯ', 'वर्तमान सुविधा'),
    T('Discovery Site', 'pat_discSite', 'ಪತ್ತೆಯಾದ ಸ್ಥಳ', 'खोज स्थल'),
    T('Intake Officer', 'pat_intakeOff', 'ದಾಖಲಾತಿ ಅಧಿಕಾರಿ', 'इनटेक अधिकारी'),
    T('Emergency Staff', 'pat_emgStaff', 'ತುರ್ತು ಸಿಬ್ಬಂದಿ', 'आपातकालीन स्टाफ'),
    J('Not specified', 'pat_notSpec', 'ನಿರ್ದಿಷ್ಟಪಡಿಸಿಲ್ಲ', 'निर्दिष्ट नहीं'),
    J('Paramedic Unit', 'pat_paramedic', 'ಪ್ಯಾರಾಮೆಡಿಕ್ ಘಟಕ', 'पैरामेडिक यूनिट'),
    T('Clinical Observations & Triage Summary', 'pat_obsTitle', 'ಕ್ಲಿನಿಕಲ್ ಅವಲೋಕನಗಳು ಮತ್ತು ಟ್ರಯೇಜ್ ಸಾರಾಂಶ', 'क्लिनिकल अवलोकन और ट्राइएज सारांश'),
    J('No additional initial observations documented.', 'pat_noObs', 'ಯಾವುದೇ ಹೆಚ್ಚುವರಿ ಆರಂಭಿಕ ಅವಲೋಕನಗಳನ್ನು ದಾಖಲಿಸಿಲ್ಲ.', 'कोई अतिरिक्त प्रारंभिक अवलोकन दर्ज नहीं है।'),
    T('Inter-Hospital Transfer History & Handover Continuity', 'pat_xferTitle', 'ಆಸ್ಪತ್ರೆಗಳ ನಡುವಿನ ವರ್ಗಾವಣೆ ಇತಿಹಾಸ ಮತ್ತು ಹಸ್ತಾಂತರ ನಿರಂತರತೆ', 'अस्पतालों के बीच स्थानांतरण इतिहास और हैंडओवर निरंतरता'),
    T('Transfers Recorded', 'pat_xferCount', 'ವರ್ಗಾವಣೆಗಳು ದಾಖಲಾಗಿವೆ', 'स्थानांतरण दर्ज'),
    T('Transfer Reason:', 'pat_reason', 'ವರ್ಗಾವಣೆ ಕಾರಣ:', 'स्थानांतरण का कारण:'),
    T('Handover Notes:', 'pat_handover', 'ಹಸ್ತಾಂತರ ಟಿಪ್ಪಣಿಗಳು:', 'हैंडओवर नोट्स:'),
    T('Transport Unit:', 'pat_unit', 'ಸಾರಿಗೆ ಘಟಕ:', 'परिवहन यूनिट:'),
    T('Authorized By:', 'pat_authBy', 'ಅಧಿಕೃತಗೊಳಿಸಿದವರು:', 'अधिकृत करने वाला:'),
    T('No transfer entries yet. Patient remains at initial receiving facility.', 'pat_noXfer', 'ಇನ್ನೂ ಯಾವುದೇ ವರ್ಗಾವಣೆ ನಮೂದುಗಳಿಲ್ಲ. ರೋಗಿ ಆರಂಭಿಕ ಸ್ವೀಕರಿಸುವ ಸೌಲಭ್ಯದಲ್ಲಿಯೇ ಇದ್ದಾರೆ.', 'अभी तक कोई स्थानांतरण प्रविष्टि नहीं। मरीज़ प्रारंभिक प्राप्तकर्ता सुविधा में ही है।'),
    T('Clinical Audit & Event Trail', 'pat_audit', 'ಕ್ಲಿನಿಕಲ್ ಲೆಕ್ಕಪರಿಶೋಧನೆ ಮತ್ತು ಘಟನಾ ಜಾಡು', 'क्लिनिकल ऑडिट और इवेंट ट्रेल'),
    T('Event Type', 'pat_thEvent', 'ಘಟನೆಯ ವಿಧ', 'इवेंट प्रकार'),
    T('Summary', 'pat_thSummary', 'ಸಾರಾಂಶ', 'सारांश'),
    T('Authorized Staff', 'pat_thStaff', 'ಅಧಿಕೃತ ಸಿಬ್ಬಂದಿ', 'अधिकृत स्टाफ'),
    T(...TIMESTAMP),
    T('Identity Linking Procedure', 'pat_linkBadge', 'ಗುರುತು ಲಿಂಕ್ ಮಾಡುವ ಪ್ರಕ್ರಿಯೆ', 'पहचान लिंकिंग प्रक्रिया'),
    T('Link Record to Verified Profile', 'pat_linkTitle', 'ದಾಖಲೆಯನ್ನು ಪರಿಶೀಲಿತ ಪ್ರೊಫೈಲ್‌ಗೆ ಲಿಂಕ್ ಮಾಡಿ', 'रिकॉर्ड को सत्यापित प्रोफ़ाइल से लिंक करें'),
    R(
      'Authorized healthcare personnel verification. The temporary emergency record ({patient.temporary_patient_id}) will be formally linked to the patient profile.',
      "{t('pat_linkIntro').replace('{id}', patient.temporary_patient_id)}",
      'pat_linkIntro',
      'Authorized healthcare personnel verification. The temporary emergency record ({id}) will be formally linked to the patient profile.',
      'ಅಧಿಕೃತ ಆರೋಗ್ಯ ಸಿಬ್ಬಂದಿಯ ಪರಿಶೀಲನೆ. ತಾತ್ಕಾಲಿಕ ತುರ್ತು ದಾಖಲೆಯನ್ನು ({id}) ರೋಗಿಯ ಪ್ರೊಫೈಲ್‌ಗೆ ಅಧಿಕೃತವಾಗಿ ಲಿಂಕ್ ಮಾಡಲಾಗುತ್ತದೆ.',
      'अधिकृत स्वास्थ्यकर्मियों द्वारा सत्यापन। अस्थायी आपातकालीन रिकॉर्ड ({id}) को मरीज़ की प्रोफ़ाइल से औपचारिक रूप से लिंक किया जाएगा।'
    ),
    T('Candidate Profile:', 'pat_cand', 'ಅಭ್ಯರ್ಥಿ ಪ್ರೊಫೈಲ್:', 'संभावित प्रोफ़ाइल:'),
    T('Blood Group:', 'pat_blood', 'ರಕ್ತ ಗುಂಪು:', 'रक्त समूह:'),
    T('Age/Gender:', 'pat_ageGender', 'ವಯಸ್ಸು/ಲಿಂಗ:', 'आयु/लिंग:'),
    R('{availableProfile.age} Yrs ({availableProfile.gender})', "{availableProfile.age} {t('pat_yrs')} ({availableProfile.gender})", 'pat_yrs', 'Yrs', 'ವರ್ಷ', 'वर्ष'),
    T('Emergency Contact:', 'pat_emgContact', 'ತುರ್ತು ಸಂಪರ್ಕ:', 'आपातकालीन संपर्क:'),
    T('Allergies:', 'pat_allergies', 'ಅಲರ್ಜಿಗಳು:', 'एलर्जी:'),
    T('No registered candidate profile found to match.', 'pat_noCand', 'ಹೊಂದಿಸಲು ನೋಂದಾಯಿತ ಅಭ್ಯರ್ಥಿ ಪ್ರೊಫೈಲ್ ಕಂಡುಬಂದಿಲ್ಲ.', 'मिलान के लिए कोई पंजीकृत प्रोफ़ाइल नहीं मिली।'),
    T('Clinical Verification Notes (Mandatory)', 'pat_verNotes', 'ಕ್ಲಿನಿಕಲ್ ಪರಿಶೀಲನಾ ಟಿಪ್ಪಣಿಗಳು (ಕಡ್ಡಾಯ)', 'क्लिनिकल सत्यापन नोट्स (अनिवार्य)'),
    A('placeholder', 'Detail verification method (e.g. Identity documents verified with attending relative, biometric or facial confirmation).', 'pat_verPh', 'ಪರಿಶೀಲನಾ ವಿಧಾನವನ್ನು ವಿವರಿಸಿ (ಉದಾ. ಹಾಜರಿರುವ ಸಂಬಂಧಿಯೊಂದಿಗೆ ಗುರುತಿನ ದಾಖಲೆಗಳ ಪರಿಶೀಲನೆ, ಬಯೋಮೆಟ್ರಿಕ್ ಅಥವಾ ಮುಖ ದೃಢೀಕರಣ).', 'सत्यापन विधि का विवरण दें (जैसे उपस्थित रिश्तेदार के साथ पहचान दस्तावेज़ों का सत्यापन, बायोमेट्रिक या चेहरे की पुष्टि)।'),
    T('Identity linked successfully! Transfer and audit history preserved.', 'pat_linkOk', 'ಗುರುತನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಲಿಂಕ್ ಮಾಡಲಾಗಿದೆ! ವರ್ಗಾವಣೆ ಮತ್ತು ಲೆಕ್ಕಪರಿಶೋಧನಾ ಇತಿಹಾಸ ಸಂರಕ್ಷಿಸಲಾಗಿದೆ.', 'पहचान सफलतापूर्वक लिंक हो गई! स्थानांतरण और ऑडिट इतिहास सुरक्षित है।'),
    T('Cancel', 'common_cancel', 'ರದ್ದುಮಾಡಿ', 'रद्द करें'),
    T('Confirm & Link Record', 'pat_confirmLink', 'ದೃಢೀಕರಿಸಿ ಮತ್ತು ದಾಖಲೆ ಲಿಂಕ್ ಮಾಡಿ', 'पुष्टि करें और रिकॉर्ड लिंक करें'),
    J('Linking failed: ', 'pat_linkFail', 'ಲಿಂಕ್ ಮಾಡುವಿಕೆ ವಿಫಲವಾಗಿದೆ: ', 'लिंक करना विफल रहा: '),
  ],

  EmergencyProfilePage: [
    T('Emergency Preparedness', 'prof_badge', 'ತುರ್ತು ಸಿದ್ಧತೆ', 'आपातकालीन तैयारी'),
    T('Personal Emergency Medical Profile', 'prof_title', 'ವೈಯಕ್ತಿಕ ತುರ್ತು ವೈದ್ಯಕೀಯ ಪ್ರೊಫೈಲ್', 'व्यक्तिगत आपातकालीन चिकित्सा प्रोफ़ाइल'),
    T('Information stored here is linked to your secure emergency QR card to protect you in an unconscious emergency.', 'prof_sub', 'ಇಲ್ಲಿ ಸಂಗ್ರಹಿಸಲಾದ ಮಾಹಿತಿಯು ನೀವು ಪ್ರಜ್ಞಾಹೀನರಾದ ತುರ್ತು ಸಂದರ್ಭದಲ್ಲಿ ನಿಮ್ಮನ್ನು ರಕ್ಷಿಸಲು ನಿಮ್ಮ ಸುರಕ್ಷಿತ ತುರ್ತು QR ಕಾರ್ಡ್‌ಗೆ ಲಿಂಕ್ ಆಗಿದೆ.', 'यहाँ संग्रहीत जानकारी आपके सुरक्षित आपातकालीन QR कार्ड से जुड़ी है, ताकि बेहोशी की आपात स्थिति में आपकी सुरक्षा हो सके।'),
    T('View My QR Card', 'prof_viewQr', 'ನನ್ನ QR ಕಾರ್ಡ್ ವೀಕ್ಷಿಸಿ', 'मेरा QR कार्ड देखें'),
    T('Privacy & Access Protection', 'prof_privTitle', 'ಗೌಪ್ಯತೆ ಮತ್ತು ಪ್ರವೇಶ ರಕ್ಷಣೆ', 'गोपनीयता और एक्सेस सुरक्षा'),
    T('Your full phone number and home address are NEVER stored openly inside the QR code. Only an unpredictable, revocable reference token is encoded. Authorized healthcare personnel can only retrieve critical triage notes after scanning.', 'prof_privText', 'ನಿಮ್ಮ ಪೂರ್ಣ ಫೋನ್ ಸಂಖ್ಯೆ ಮತ್ತು ಮನೆ ವಿಳಾಸವನ್ನು QR ಕೋಡ್‌ನಲ್ಲಿ ಎಂದಿಗೂ ಬಹಿರಂಗವಾಗಿ ಸಂಗ್ರಹಿಸಲಾಗುವುದಿಲ್ಲ. ಊಹಿಸಲಾಗದ, ರದ್ದುಪಡಿಸಬಹುದಾದ ಉಲ್ಲೇಖ ಟೋಕನ್ ಮಾತ್ರ ಎನ್‌ಕೋಡ್ ಆಗಿರುತ್ತದೆ. ಅಧಿಕೃತ ಆರೋಗ್ಯ ಸಿಬ್ಬಂದಿ ಸ್ಕ್ಯಾನ್ ಮಾಡಿದ ನಂತರ ಮಾತ್ರ ನಿರ್ಣಾಯಕ ಟ್ರಯೇಜ್ ಟಿಪ್ಪಣಿಗಳನ್ನು ಪಡೆಯಬಹುದು.', 'आपका पूरा फ़ोन नंबर और घर का पता QR कोड में कभी खुले रूप में संग्रहीत नहीं होता। केवल एक अनुमान-रहित, रद्द किया जा सकने वाला संदर्भ टोकन एन्कोड किया जाता है। अधिकृत स्वास्थ्यकर्मी स्कैन के बाद ही महत्वपूर्ण ट्राइएज नोट्स प्राप्त कर सकते हैं।'),
    T('1. Personal Demographics', 'prof_s1', '1. ವೈಯಕ್ತಿಕ ವಿವರಗಳು', '1. व्यक्तिगत विवरण'),
    T('Full Legal Name', 'prof_name', 'ಕಾನೂನುಬದ್ಧ ಪೂರ್ಣ ಹೆಸರು', 'पूरा कानूनी नाम'),
    T('Blood Group', 'prof_blood', 'ರಕ್ತ ಗುಂಪು', 'रक्त समूह'),
    T('O- (Universal Red Cells)', 'prof_oneg', 'O- (ಸಾರ್ವತ್ರಿಕ ಕೆಂಪು ರಕ್ತಕಣಗಳು)', 'O- (सार्वभौमिक लाल रक्त कोशिकाएँ)'),
    T('2. Primary Emergency Family Contact', 'prof_s2', '2. ಪ್ರಾಥಮಿಕ ತುರ್ತು ಕುಟುಂಬ ಸಂಪರ್ಕ', '2. प्राथमिक आपातकालीन पारिवारिक संपर्क'),
    T('Contact Name', 'prof_cName', 'ಸಂಪರ್ಕದ ಹೆಸರು', 'संपर्क का नाम'),
    T('Relationship', 'prof_rel', 'ಸಂಬಂಧ', 'संबंध'),
    T('Mobile Phone (With Country Code)', 'prof_phone', 'ಮೊಬೈಲ್ ಫೋನ್ (ದೇಶ ಕೋಡ್‌ನೊಂದಿಗೆ)', 'मोबाइल फ़ोन (देश कोड सहित)'),
    A('placeholder', 'e.g. Anjali Sharma', 'prof_phName', 'ಉದಾ. ಅಂಜಲಿ ಶರ್ಮಾ', 'जैसे अंजलि शर्मा'),
    A('placeholder', 'Sister, Spouse, Parent', 'prof_phRel', 'ಸಹೋದರಿ, ಸಂಗಾತಿ, ಪೋಷಕರು', 'बहन, जीवनसाथी, माता-पिता'),
    T('3. Critical Medical Alert & Allergies', 'prof_s3', '3. ನಿರ್ಣಾಯಕ ವೈದ್ಯಕೀಯ ಎಚ್ಚರಿಕೆ ಮತ್ತು ಅಲರ್ಜಿಗಳು', '3. गंभीर चिकित्सा चेतावनी और एलर्जी'),
    T('Known Severe Drug or Food Allergies', 'prof_allergy', 'ತಿಳಿದಿರುವ ತೀವ್ರ ಔಷಧ ಅಥವಾ ಆಹಾರ ಅಲರ್ಜಿಗಳು', 'ज्ञात गंभीर दवा या खाद्य एलर्जी'),
    A('placeholder', 'e.g. Severe Penicillin anaphylaxis, Sulfa drugs, Peanuts', 'prof_phAllergy', 'ಉದಾ. ತೀವ್ರ ಪೆನ್ಸಿಲಿನ್ ಅನಾಫಿಲಾಕ್ಸಿಸ್, ಸಲ್ಫಾ ಔಷಧಗಳು, ಕಡಲೆಕಾಯಿ', 'जैसे गंभीर पेनिसिलिन एनाफिलेक्सिस, सल्फा दवाएँ, मूंगफली'),
    T('Relevant Medical History / Chronic Conditions', 'prof_history', 'ಸಂಬಂಧಿತ ವೈದ್ಯಕೀಯ ಇತಿಹಾಸ / ದೀರ್ಘಕಾಲೀನ ಕಾಯಿಲೆಗಳು', 'संबंधित चिकित्सा इतिहास / दीर्घकालिक बीमारियाँ'),
    A('placeholder', 'e.g. Type 1 Diabetes on daily insulin, Asthma, Epilepsy, Pacemaker implant', 'prof_phHistory', 'ಉದಾ. ಪ್ರತಿದಿನ ಇನ್ಸುಲಿನ್‌ನೊಂದಿಗೆ ಟೈಪ್ 1 ಮಧುಮೇಹ, ಆಸ್ತಮಾ, ಅಪಸ್ಮಾರ, ಪೇಸ್‌ಮೇಕರ್ ಅಳವಡಿಕೆ', 'जैसे रोज़ाना इंसुलिन पर टाइप 1 मधुमेह, अस्थमा, मिर्गी, पेसमेकर'),
    T('I voluntarily declare my pledge as an Organ & Tissue Donor in emergency scenarios.', 'prof_donor', 'ತುರ್ತು ಸಂದರ್ಭಗಳಲ್ಲಿ ಅಂಗ ಮತ್ತು ಅಂಗಾಂಶ ದಾನಿಯಾಗುವ ನನ್ನ ಪ್ರತಿಜ್ಞೆಯನ್ನು ನಾನು ಸ್ವಯಂಪ್ರೇರಣೆಯಿಂದ ಘೋಷಿಸುತ್ತೇನೆ.', 'मैं स्वेच्छा से आपात स्थितियों में अंग और ऊतक दाता बनने का संकल्प घोषित करता/करती हूँ।'),
    T('Emergency Profile and QR token updated successfully.', 'prof_saved', 'ತುರ್ತು ಪ್ರೊಫೈಲ್ ಮತ್ತು QR ಟೋಕನ್ ಯಶಸ್ವಿಯಾಗಿ ನವೀಕರಿಸಲಾಗಿದೆ.', 'आपातकालीन प्रोफ़ाइल और QR टोकन सफलतापूर्वक अपडेट हुए।'),
    T('Save Profile', 'prof_save', 'ಪ್ರೊಫೈಲ್ ಉಳಿಸಿ', 'प्रोफ़ाइल सहेजें'),
    T('Proceed to QR Code Card', 'prof_goQr', 'QR ಕೋಡ್ ಕಾರ್ಡ್‌ಗೆ ಮುಂದುವರಿಯಿರಿ', 'QR कोड कार्ड पर जाएँ'),
  ],

  FamilyNotificationPage: [
    T('Loading Family Notification Portal...', 'fam_loading', 'ಕುಟುಂಬ ಸೂಚನಾ ಪೋರ್ಟಲ್ ಲೋಡ್ ಆಗುತ್ತಿದೆ...', 'परिवार सूचना पोर्टल लोड हो रहा है...'),
    T(...PAT_NF),
    T(...RETURN),
    T(...BACK_REC),
    T('Emergency Communications', 'fam_badge', 'ತುರ್ತು ಸಂವಹನ', 'आपातकालीन संचार'),
    T('Family Emergency Notification', 'fam_title', 'ಕುಟುಂಬ ತುರ್ತು ಸೂಚನೆ', 'परिवार आपातकालीन सूचना'),
    T('Dispatch urgent SMS alerts to designated family members regarding hospital admission.', 'fam_sub', 'ಆಸ್ಪತ್ರೆ ದಾಖಲಾತಿಯ ಬಗ್ಗೆ ನಿಗದಿತ ಕುಟುಂಬ ಸದಸ್ಯರಿಗೆ ತುರ್ತು SMS ಎಚ್ಚರಿಕೆಗಳನ್ನು ಕಳುಹಿಸಿ.', 'अस्पताल में भर्ती के बारे में नामित परिवार के सदस्यों को आपातकालीन SMS अलर्ट भेजें।'),
    T(...PATIENT),
    T('Demonstration Notification Workflow', 'fam_demoTitle', 'ಪ್ರದರ್ಶನ ಸೂಚನಾ ಕಾರ್ಯಪ್ರವಾಹ', 'डेमो अधिसूचना वर्कफ़्लो'),
    T('In demonstration mode, alerts simulate gateway transmission and record verifiable delivery timestamps in the clinical log. Production deployments can connect to SMS/WhatsApp webhooks via Supabase Edge Functions.', 'fam_demoText', 'ಪ್ರದರ್ಶನ ಮೋಡ್‌ನಲ್ಲಿ, ಎಚ್ಚರಿಕೆಗಳು ಗೇಟ್‌ವೇ ಪ್ರಸರಣವನ್ನು ಅನುಕರಿಸುತ್ತವೆ ಮತ್ತು ಕ್ಲಿನಿಕಲ್ ಲಾಗ್‌ನಲ್ಲಿ ಪರಿಶೀಲಿಸಬಹುದಾದ ವಿತರಣಾ ಸಮಯಮುದ್ರೆಗಳನ್ನು ದಾಖಲಿಸುತ್ತವೆ. ಉತ್ಪಾದನಾ ನಿಯೋಜನೆಗಳು Supabase Edge Functions ಮೂಲಕ SMS/WhatsApp ವೆಬ್‌ಹೂಕ್‌ಗಳಿಗೆ ಸಂಪರ್ಕಿಸಬಹುದು.', 'डेमो मोड में अलर्ट गेटवे ट्रांसमिशन का अनुकरण करते हैं और क्लिनिकल लॉग में सत्यापन-योग्य डिलीवरी टाइमस्टैम्प दर्ज करते हैं। प्रोडक्शन डिप्लॉयमेंट Supabase Edge Functions के ज़रिए SMS/WhatsApp वेबहुक से जुड़ सकते हैं।'),
    T('Emergency Contact Details', 'fam_cDetails', 'ತುರ್ತು ಸಂಪರ್ಕ ವಿವರಗಳು', 'आपातकालीन संपर्क विवरण'),
    T('Recipient Name / Relationship', 'fam_rName', 'ಸ್ವೀಕರಿಸುವವರ ಹೆಸರು / ಸಂಬಂಧ', 'प्राप्तकर्ता का नाम / संबंध'),
    T('Mobile Phone Number', 'fam_rPhone', 'ಮೊಬೈಲ್ ಫೋನ್ ಸಂಖ್ಯೆ', 'मोबाइल फ़ोन नंबर'),
    A('placeholder', 'e.g. Anjali Sharma (Sister)', 'fam_phName', 'ಉದಾ. ಅಂಜಲಿ ಶರ್ಮಾ (ಸಹೋದರಿ)', 'जैसे अंजलि शर्मा (बहन)'),
    T('Message Preview', 'fam_preview', 'ಸಂದೇಶದ ಪೂರ್ವವೀಕ್ಷಣೆ', 'संदेश पूर्वावलोकन'),
    T('Emergency family notification dispatched and logged to patient record!', 'fam_sent', 'ತುರ್ತು ಕುಟುಂಬ ಸೂಚನೆ ಕಳುಹಿಸಲಾಗಿದೆ ಮತ್ತು ರೋಗಿಯ ದಾಖಲೆಯಲ್ಲಿ ಲಾಗ್ ಮಾಡಲಾಗಿದೆ!', 'आपातकालीन पारिवारिक सूचना भेज दी गई और मरीज़ के रिकॉर्ड में दर्ज की गई!'),
    J('Direct cellular transmission.', 'fam_direct', 'ನೇರ ಸೆಲ್ಯುಲಾರ್ ಪ್ರಸರಣ.', 'सीधा सेल्युलर प्रसारण।'),
    J('Queued for dispatch once back online.', 'fam_queued', 'ಮತ್ತೆ ಆನ್‌ಲೈನ್ ಆದ ತಕ್ಷಣ ಕಳುಹಿಸಲು ಸರದಿಯಲ್ಲಿದೆ.', 'ऑनलाइन होते ही भेजने के लिए कतार में।'),
    J('Sending Alert...', 'fam_sending', 'ಎಚ್ಚರಿಕೆ ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ...', 'अलर्ट भेजा जा रहा है...'),
    J('Dispatch Emergency Alert', 'fam_dispatch', 'ತುರ್ತು ಎಚ್ಚರಿಕೆ ಕಳುಹಿಸಿ', 'आपातकालीन अलर्ट भेजें'),
    T('Notification Transmission History', 'fam_history', 'ಸೂಚನಾ ಪ್ರಸರಣ ಇತಿಹಾಸ', 'अधिसूचना प्रसारण इतिहास'),
    T('Recipient', 'fam_thRec', 'ಸ್ವೀಕರಿಸುವವರು', 'प्राप्तकर्ता'),
    T('Channel', 'fam_thChan', 'ಚಾನಲ್', 'चैनल'),
    T(...STATUS),
    T('Sender', 'fam_thSender', 'ಕಳುಹಿಸಿದವರು', 'भेजने वाला'),
    T('Time', 'fam_thTime', 'ಸಮಯ', 'समय'),
    T('No notifications dispatched for this intake yet.', 'fam_none', 'ಈ ದಾಖಲಾತಿಗೆ ಇನ್ನೂ ಯಾವುದೇ ಸೂಚನೆ ಕಳುಹಿಸಿಲ್ಲ.', 'इस इनटेक के लिए अभी तक कोई सूचना नहीं भेजी गई।'),
    J('Notification dispatch failed: ', 'fam_fail', 'ಸೂಚನೆ ಕಳುಹಿಸುವಿಕೆ ವಿಫಲವಾಗಿದೆ: ', 'सूचना भेजना विफल रहा: '),
  ],

  HospitalAdminDashboard: [
    T('Loading Hospital Administration Portal...', 'adm_loading', 'ಆಸ್ಪತ್ರೆ ಆಡಳಿತ ಪೋರ್ಟಲ್ ಲೋಡ್ ಆಗುತ್ತಿದೆ...', 'अस्पताल प्रशासन पोर्टल लोड हो रहा है...'),
    T('Administrative Control Panel', 'adm_badge', 'ಆಡಳಿತ ನಿಯಂತ್ರಣ ಫಲಕ', 'प्रशासनिक नियंत्रण पैनल'),
    J('Hospital Administration', 'adm_defaultTitle', 'ಆಸ್ಪತ್ರೆ ಆಡಳಿತ', 'अस्पताल प्रशासन'),
    T('Authorized portal for live bed availability broadcasts and emergency medicine inventory management.', 'adm_sub', 'ನೇರ ಹಾಸಿಗೆ ಲಭ್ಯತೆ ಪ್ರಸಾರ ಮತ್ತು ತುರ್ತು ಔಷಧ ದಾಸ್ತಾನು ನಿರ್ವಹಣೆಗಾಗಿ ಅಧಿಕೃತ ಪೋರ್ಟಲ್.', 'लाइव बेड उपलब्धता प्रसारण और आपातकालीन दवा इन्वेंटरी प्रबंधन के लिए अधिकृत पोर्टल।'),
    T('Update Beds', 'adm_updBeds', 'ಹಾಸಿಗೆ ನವೀಕರಿಸಿ', 'बेड अपडेट करें'),
    T('Update Medicines', 'adm_updMeds', 'ಔಷಧ ನವೀಕರಿಸಿ', 'दवाएँ अपडेट करें'),
    J('Hospital Capacity Notice Outdated (>6h)', 'adm_outdated', 'ಆಸ್ಪತ್ರೆ ಸಾಮರ್ಥ್ಯ ಸೂಚನೆ ಹಳೆಯದು (>6 ಗಂ)', 'अस्पताल क्षमता सूचना पुरानी है (>6 घंटे)'),
    J('Capacity Broadcast Verified Current', 'adm_current', 'ಸಾಮರ್ಥ್ಯ ಪ್ರಸಾರ ಪರಿಶೀಲಿತ ಮತ್ತು ಪ್ರಸ್ತುತ', 'क्षमता प्रसारण सत्यापित और वर्तमान'),
    T('Last capacity transmission recorded:', 'adm_lastTx', 'ಕೊನೆಯ ಸಾಮರ್ಥ್ಯ ಪ್ರಸರಣ ದಾಖಲಾಗಿದೆ:', 'अंतिम क्षमता प्रसारण दर्ज:'),
    T('Transmit Fresh Numbers →', 'adm_transmit', 'ಹೊಸ ಸಂಖ್ಯೆಗಳನ್ನು ಕಳುಹಿಸಿ →', 'नई संख्याएँ भेजें →'),
    T('Total Bed Capacity', 'adm_totCap', 'ಒಟ್ಟು ಹಾಸಿಗೆ ಸಾಮರ್ಥ್ಯ', 'कुल बेड क्षमता'),
    T('Licensed facility beds', 'adm_licensed', 'ಪರವಾನಗಿ ಪಡೆದ ಸೌಲಭ್ಯದ ಹಾಸಿಗೆಗಳು', 'लाइसेंस प्राप्त सुविधा के बेड'),
    T('Available Beds', 'adm_availBeds', 'ಲಭ್ಯ ಹಾಸಿಗೆಗಳು', 'उपलब्ध बेड'),
    T('Open for emergency intake', 'adm_openIntake', 'ತುರ್ತು ದಾಖಲಾತಿಗೆ ಮುಕ್ತ', 'आपातकालीन इनटेक के लिए खुले'),
    T('Occupied Beds', 'adm_occ', 'ಆಕ್ರಮಿತ ಹಾಸಿಗೆಗಳು', 'भरे हुए बेड'),
    T('Inpatient occupancy', 'adm_inpat', 'ಒಳರೋಗಿ ಭರ್ತಿ', 'भर्ती मरीज़ अधिभोग'),
    T('Critical Drugs Tracked', 'adm_drugs', 'ಟ್ರ್ಯಾಕ್ ಮಾಡಿದ ಅಗತ್ಯ ಔಷಧಗಳು', 'ट्रैक की गई महत्वपूर्ण दवाएँ'),
    T('Anti-venom, O- blood, etc.', 'adm_drugsSub', 'ವಿಷ ನಿರೋಧಕ, O- ರಕ್ತ ಇತ್ಯಾದಿ', 'एंटी-वेनम, O- रक्त आदि'),
    T('Current Bed Type Capacities', 'adm_typeCap', 'ಪ್ರಸ್ತುತ ಹಾಸಿಗೆ ವಿಧದ ಸಾಮರ್ಥ್ಯಗಳು', 'वर्तमान बेड प्रकार की क्षमताएँ'),
    T('Edit Numbers →', 'adm_edit', 'ಸಂಖ್ಯೆಗಳನ್ನು ಸಂಪಾದಿಸಿ →', 'संख्याएँ संपादित करें →'),
    R('Total: {bed.total_beds} beds', "{t('adm_totalBeds').replace('{n}', bed.total_beds)}", 'adm_totalBeds', 'Total: {n} beds', 'ಒಟ್ಟು: {n} ಹಾಸಿಗೆಗಳು', 'कुल: {n} बेड'),
    R('{bed.reported_available_beds} Available', "{bed.reported_available_beds} {t('adm_available')}", 'adm_available', 'Available', 'ಲಭ್ಯ', 'उपलब्ध'),
  ],

  HospitalDetailsPage: [
    T('Hospital Not Found', 'hd_nf', 'ಆಸ್ಪತ್ರೆ ಕಂಡುಬಂದಿಲ್ಲ', 'अस्पताल नहीं मिला'),
    T('The requested facility could not be located in local or remote records.', 'hd_nfText', 'ವಿನಂತಿಸಿದ ಸೌಲಭ್ಯವು ಸ್ಥಳೀಯ ಅಥವಾ ದೂರಸ್ಥ ದಾಖಲೆಗಳಲ್ಲಿ ಕಂಡುಬಂದಿಲ್ಲ.', 'अनुरोधित सुविधा स्थानीय या दूरस्थ रिकॉर्ड में नहीं मिली।'),
    T('Return to Hospital Discovery', 'hd_ret', 'ಆಸ್ಪತ್ರೆ ಹುಡುಕಾಟಕ್ಕೆ ಹಿಂತಿರುಗಿ', 'अस्पताल खोज पर लौटें'),
    T('Information Freshness Warning', 'hd_staleTitle', 'ಮಾಹಿತಿ ತಾಜಾತನ ಎಚ್ಚರಿಕೆ', 'जानकारी ताज़गी चेतावनी'),
    R(
      'The bed and medicine counts for this facility were reported over 6 hours ago ({formatRelativeTime(hospital.last_updated)}). Because emergency capacity changes rapidly, we recommend verifying critical needs by calling the casualty desk directly.',
      "{t('hd_staleText').replace('{time}', formatRelativeTime(hospital.last_updated))}",
      'hd_staleText',
      'The bed and medicine counts for this facility were reported over 6 hours ago ({time}). Because emergency capacity changes rapidly, we recommend verifying critical needs by calling the casualty desk directly.',
      'ಈ ಸೌಲಭ್ಯದ ಹಾಸಿಗೆ ಮತ್ತು ಔಷಧ ಸಂಖ್ಯೆಗಳನ್ನು 6 ಗಂಟೆಗಳಿಗೂ ಹೆಚ್ಚು ಹಿಂದೆ ವರದಿ ಮಾಡಲಾಗಿದೆ ({time}). ತುರ್ತು ಸಾಮರ್ಥ್ಯ ವೇಗವಾಗಿ ಬದಲಾಗುವುದರಿಂದ, ಅಗತ್ಯಗಳನ್ನು ಅಪಘಾತ ವಿಭಾಗಕ್ಕೆ ನೇರವಾಗಿ ಕರೆ ಮಾಡಿ ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಲು ನಾವು ಶಿಫಾರಸು ಮಾಡುತ್ತೇವೆ.',
      'इस सुविधा के बेड और दवा के आँकड़े 6 घंटे से अधिक पहले रिपोर्ट किए गए थे ({time})। आपातकालीन क्षमता तेज़ी से बदलती है, इसलिए हम सलाह देते हैं कि ज़रूरी बातों की पुष्टि सीधे कैज़ुअल्टी डेस्क को कॉल करके करें।'
    ),
    T('24/7 Emergency Casualty', 'hd_emgBadge', '24/7 ತುರ್ತು ಅಪಘಾತ ವಿಭಾಗ', '24/7 आपातकालीन कैज़ुअल्टी'),
    T('Day Facility', 'hd_day', 'ಹಗಲಿನ ಸೌಲಭ್ಯ', 'दिन की सुविधा'),
    J('Verified Partner', 'hd_verified', 'ಪರಿಶೀಲಿತ ಪಾಲುದಾರ', 'सत्यापित भागीदार'),
    T('Emergency Desk:', 'hd_desk', 'ತುರ್ತು ಡೆಸ್ಕ್:', 'आपातकालीन डेस्क:'),
    T(...LAST_REP),
    T('Reported Bed Availability', 'hd_bedTitle', 'ವರದಿ ಮಾಡಿದ ಹಾಸಿಗೆ ಲಭ್ಯತೆ', 'रिपोर्ट की गई बेड उपलब्धता'),
    T('Source: Hospital Triage Desk', 'hd_src', 'ಮೂಲ: ಆಸ್ಪತ್ರೆ ಟ್ರಯೇಜ್ ಡೆಸ್ಕ್', 'स्रोत: अस्पताल ट्राइएज डेस्क'),
    T('Bed Classification', 'hd_thClass', 'ಹಾಸಿಗೆ ವರ್ಗೀಕರಣ', 'बेड वर्गीकरण'),
    T('Total Capacity', 'hd_thTot', 'ಒಟ್ಟು ಸಾಮರ್ಥ್ಯ', 'कुल क्षमता'),
    T('Reported Available', 'hd_thAvail', 'ವರದಿ ಮಾಡಿದ ಲಭ್ಯ', 'रिपोर्ट किए गए उपलब्ध'),
    T(...STATUS),
    T(...TIMESTAMP),
    T('Update these bed numbers in Administrator Panel →', 'hd_updLink', 'ನಿರ್ವಾಹಕ ಫಲಕದಲ್ಲಿ ಈ ಹಾಸಿಗೆ ಸಂಖ್ಯೆಗಳನ್ನು ನವೀಕರಿಸಿ →', 'एडमिन पैनल में ये बेड संख्याएँ अपडेट करें →'),
    T('Essential Medicine & Blood Inventory', 'hd_medTitle', 'ಅಗತ್ಯ ಔಷಧ ಮತ್ತು ರಕ್ತ ದಾಸ್ತಾನು', 'आवश्यक दवा और रक्त इन्वेंटरी'),
    T('Emergency Supplies', 'hd_supplies', 'ತುರ್ತು ಸರಬರಾಜುಗಳು', 'आपातकालीन आपूर्ति'),
    T('Essential Drug / Blood Supply', 'hd_thDrug', 'ಅಗತ್ಯ ಔಷಧ / ರಕ್ತ ಪೂರೈಕೆ', 'आवश्यक दवा / रक्त आपूर्ति'),
    T('Reported Stock', 'hd_thStock', 'ವರದಿ ಮಾಡಿದ ದಾಸ್ತಾನು', 'रिपोर्ट किया गया स्टॉक'),
    T('Unit', 'hd_thUnit', 'ಘಟಕ', 'इकाई'),
    T('Reported At', 'hd_thAt', 'ವರದಿ ಸಮಯ', 'रिपोर्ट का समय'),
    T('Manage Medicine Stock in Administrator Panel →', 'hd_manage', 'ನಿರ್ವಾಹಕ ಫಲಕದಲ್ಲಿ ಔಷಧ ದಾಸ್ತಾನು ನಿರ್ವಹಿಸಿ →', 'एडमिन पैनल में दवा स्टॉक प्रबंधित करें →'),
    T('Services & Specialized Capabilities', 'hd_services', 'ಸೇವೆಗಳು ಮತ್ತು ವಿಶೇಷ ಸಾಮರ್ಥ್ಯಗಳು', 'सेवाएँ और विशेष क्षमताएँ'),
  ],

  HospitalDiscoveryPage: [
    T('Live Hospital Directory', 'hdisc_badge', 'ನೇರ ಆಸ್ಪತ್ರೆ ಡೈರೆಕ್ಟರಿ', 'लाइव अस्पताल निर्देशिका'),
    T('Cached Local Data', 'hdisc_cached', 'ಸ್ಥಳೀಯವಾಗಿ ಸಂಗ್ರಹಿಸಿದ ಡೇಟಾ', 'कैश्ड स्थानीय डेटा'),
    T('Find nearby emergency centers, verified ICU beds, and essential medicine stocks.', 'hdisc_sub', 'ಹತ್ತಿರದ ತುರ್ತು ಕೇಂದ್ರಗಳು, ಪರಿಶೀಲಿತ ICU ಹಾಸಿಗೆಗಳು ಮತ್ತು ಅಗತ್ಯ ಔಷಧ ದಾಸ್ತಾನು ಹುಡುಕಿ.', 'पास के आपातकालीन केंद्र, सत्यापित ICU बेड और आवश्यक दवा स्टॉक खोजें।'),
    T('Voice Search', 'hdisc_voice', 'ಧ್ವನಿ ಹುಡುಕಾಟ', 'वॉइस सर्च'),
    J('Could not obtain current GPS position. Using Bangalore city center default.', 'hdisc_gps', 'ಪ್ರಸ್ತುತ GPS ಸ್ಥಾನ ಪಡೆಯಲಾಗಲಿಲ್ಲ. ಬೆಂಗಳೂರು ನಗರ ಕೇಂದ್ರದ ಡೀಫಾಲ್ಟ್ ಬಳಸಲಾಗುತ್ತಿದೆ.', 'वर्तमान GPS स्थिति प्राप्त नहीं हो सकी। बेंगलुरु शहर केंद्र का डिफ़ॉल्ट उपयोग किया जा रहा है।'),
    T('Showing', 'hdisc_showing', 'ತೋರಿಸಲಾಗುತ್ತಿದೆ', 'दिखाए जा रहे हैं'),
    T('medical facilities matching criteria', 'hdisc_matching', 'ಮಾನದಂಡಗಳಿಗೆ ಹೊಂದುವ ವೈದ್ಯಕೀಯ ಸೌಲಭ್ಯಗಳು', 'मानदंडों से मेल खाती चिकित्सा सुविधाएँ'),
    T('Refresh', 'hdisc_refresh', 'ರಿಫ್ರೆಶ್', 'रीफ़्रेश'),
    T('Try broadening your search query or unchecking one of the availability filters.', 'hdisc_try', 'ನಿಮ್ಮ ಹುಡುಕಾಟವನ್ನು ವಿಸ್ತರಿಸಿ ಅಥವಾ ಲಭ್ಯತೆ ಫಿಲ್ಟರ್‌ಗಳಲ್ಲಿ ಒಂದನ್ನು ತೆಗೆದುಹಾಕಿ.', 'अपनी खोज को व्यापक करें या किसी उपलब्धता फ़िल्टर को हटाएँ।'),
    T('Reset All Filters', 'hdisc_reset', 'ಎಲ್ಲಾ ಫಿಲ್ಟರ್‌ಗಳನ್ನು ಮರುಹೊಂದಿಸಿ', 'सभी फ़िल्टर रीसेट करें'),
  ],

  InteractiveHospitalMapPage: [
    T('Interactive Route Navigation', 'map_badge', 'ಸಂವಾದಾತ್ಮಕ ಮಾರ್ಗ ನ್ಯಾವಿಗೇಷನ್', 'इंटरैक्टिव रूट नेविगेशन'),
    T('Offline Coordinates Loaded', 'map_offline', 'ಆಫ್‌ಲೈನ್ ನಿರ್ದೇಶಾಂಕಗಳು ಲೋಡ್ ಆಗಿವೆ', 'ऑफ़लाइन निर्देशांक लोड हुए'),
    T('Locate nearest facilities and generate estimated emergency transit lines.', 'map_sub', 'ಹತ್ತಿರದ ಸೌಲಭ್ಯಗಳನ್ನು ಹುಡುಕಿ ಮತ್ತು ಅಂದಾಜು ತುರ್ತು ಸಾರಿಗೆ ಮಾರ್ಗಗಳನ್ನು ರಚಿಸಿ.', 'निकटतम सुविधाएँ खोजें और अनुमानित आपातकालीन मार्ग बनाएँ।'),
    J('Updating GPS...', 'map_updGps', 'GPS ನವೀಕರಿಸಲಾಗುತ್ತಿದೆ...', 'GPS अपडेट हो रहा है...'),
    J('Locate My Position', 'map_locate', 'ನನ್ನ ಸ್ಥಾನ ಹುಡುಕಿ', 'मेरी स्थिति खोजें'),
    R('Facilities ({hospitals.length})', "{t('map_facilities')} ({hospitals.length})", 'map_facilities', 'Facilities', 'ಸೌಲಭ್ಯಗಳು', 'सुविधाएँ'),
    T('24/7 Only', 'map_247', 'ಕೇವಲ 24/7', 'केवल 24/7'),
    R('{hosp.distanceKm} km', "{hosp.distanceKm} {t('map_km')}", 'map_km', 'km', 'ಕಿಮೀ', 'किमी'),
    R('{hosp.totalAvailableBeds || 0} Beds reported', "{t('map_beds').replace('{n}', hosp.totalAvailableBeds || 0)}", 'map_beds', '{n} Beds reported', '{n} ಹಾಸಿಗೆಗಳು ವರದಿಯಾಗಿವೆ', '{n} बेड रिपोर्ट किए गए'),
    T('Details →', 'map_details', 'ವಿವರಗಳು →', 'विवरण →'),
  ],

  LandingPage: [
    J('Try Voice Search', 'land_c1', 'ಧ್ವನಿ ಹುಡುಕಾಟ ಪ್ರಯತ್ನಿಸಿ', 'वॉइस सर्च आज़माएँ'),
    J('Search Facilities', 'land_c2', 'ಸೌಲಭ್ಯಗಳನ್ನು ಹುಡುಕಿ', 'सुविधाएँ खोजें'),
    J('Check Live Beds', 'land_c3', 'ನೇರ ಹಾಸಿಗೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ', 'लाइव बेड देखें'),
    J('View Medicine Stock', 'land_c4', 'ಔಷಧ ದಾಸ್ತಾನು ವೀಕ್ಷಿಸಿ', 'दवा स्टॉक देखें'),
    J('Open Live Map', 'land_c5', 'ನೇರ ನಕ್ಷೆ ತೆರೆಯಿರಿ', 'लाइव मैप खोलें'),
    J('Generate QR Profile', 'land_c6', 'QR ಪ್ರೊಫೈಲ್ ರಚಿಸಿ', 'QR प्रोफ़ाइल बनाएँ'),
    J('Test Family Alert', 'land_c7', 'ಕುಟುಂಬ ಎಚ್ಚರಿಕೆ ಪರೀಕ್ಷಿಸಿ', 'परिवार अलर्ट टेस्ट करें'),
    J('View Patient Intake', 'land_c8', 'ರೋಗಿ ದಾಖಲಾತಿ ವೀಕ್ಷಿಸಿ', 'मरीज़ इनटेक देखें'),
    J('Inspect Offline Store', 'land_c9', 'ಆಫ್‌ಲೈನ್ ಸಂಗ್ರಹ ಪರಿಶೀಲಿಸಿ', 'ऑफ़लाइन स्टोर जाँचें'),
    T('Offline IndexedDB Caching', 'land_t1', 'ಆಫ್‌ಲೈನ್ IndexedDB ಕ್ಯಾಶಿಂಗ್', 'ऑफ़लाइन IndexedDB कैशिंग'),
    T('Zero PII on Public QR', 'land_t2', 'ಸಾರ್ವಜನಿಕ QR ನಲ್ಲಿ ಯಾವುದೇ ವೈಯಕ್ತಿಕ ಮಾಹಿತಿ ಇಲ್ಲ', 'सार्वजनिक QR पर कोई व्यक्तिगत जानकारी नहीं'),
    T('Complete Healthcare Suite', 'land_f0', 'ಸಂಪೂರ್ಣ ಆರೋಗ್ಯ ಸೇವಾ ಸೂಟ್', 'संपूर्ण स्वास्थ्य सेवा सूट'),
    T('Integrated Emergency Response Features', 'land_f1', 'ಸಂಯೋಜಿತ ತುರ್ತು ಪ್ರತಿಕ್ರಿಯೆ ವೈಶಿಷ್ಟ್ಯಗಳು', 'एकीकृत आपातकालीन प्रतिक्रिया सुविधाएँ'),
    T('Every feature connects directly to a live functional workflow tested in both online and zero-connectivity modes.', 'land_f2', 'ಪ್ರತಿಯೊಂದು ವೈಶಿಷ್ಟ್ಯವೂ ಆನ್‌ಲೈನ್ ಮತ್ತು ಸಂಪರ್ಕವಿಲ್ಲದ ಎರಡೂ ಮೋಡ್‌ಗಳಲ್ಲಿ ಪರೀಕ್ಷಿಸಲಾದ ನೇರ ಕಾರ್ಯಪ್ರವಾಹಕ್ಕೆ ನೇರವಾಗಿ ಸಂಪರ್ಕಗೊಂಡಿದೆ.', 'हर सुविधा सीधे एक लाइव वर्कफ़्लो से जुड़ी है, जिसे ऑनलाइन और बिना कनेक्टिविटी दोनों मोड में परखा गया है।'),
    T('Clinical Workflow', 'land_w', 'ಕ್ಲಿನಿಕಲ್ ಕಾರ್ಯಪ್ರವಾಹ', 'क्लिनिकल वर्कफ़्लो'),
    T('Emergency Healthcare Realities', 'land_r1', 'ತುರ್ತು ಆರೋಗ್ಯ ಸೇವೆಯ ವಾಸ್ತವಗಳು', 'आपातकालीन स्वास्थ्य सेवा की वास्तविकताएँ'),
    T('Why Seconds Matter in Trauma and Acute Care', 'land_r2', 'ಆಘಾತ ಮತ್ತು ತೀವ್ರ ಆರೈಕೆಯಲ್ಲಿ ಸೆಕೆಂಡುಗಳು ಏಕೆ ಮುಖ್ಯ', 'ट्रॉमा और गंभीर देखभाल में सेकंड क्यों मायने रखते हैं'),
    T('In trauma medicine, the first 60 minutes after severe injury are known as the Golden Hour. Arriving at a facility that has no ICU bed or lacks critical anti-venom costs precious survival time. LIFE-LINK surfaces reported bed counts, timestamps, and medicine inventories beforehand.', 'land_r3', 'ಆಘಾತ ವೈದ್ಯಕೀಯದಲ್ಲಿ, ತೀವ್ರ ಗಾಯದ ನಂತರದ ಮೊದಲ 60 ನಿಮಿಷಗಳನ್ನು ಗೋಲ್ಡನ್ ಅವರ್ ಎಂದು ಕರೆಯಲಾಗುತ್ತದೆ. ICU ಹಾಸಿಗೆ ಇಲ್ಲದ ಅಥವಾ ಅಗತ್ಯ ವಿಷ ನಿರೋಧಕ ಇಲ್ಲದ ಸೌಲಭ್ಯಕ್ಕೆ ತಲುಪುವುದು ಅಮೂಲ್ಯ ಬದುಕುಳಿಯುವ ಸಮಯವನ್ನು ಕಳೆಯುತ್ತದೆ. LIFE-LINK ವರದಿಯಾದ ಹಾಸಿಗೆ ಸಂಖ್ಯೆಗಳು, ಸಮಯಮುದ್ರೆಗಳು ಮತ್ತು ಔಷಧ ದಾಸ್ತಾನನ್ನು ಮುಂಚಿತವಾಗಿ ತೋರಿಸುತ್ತದೆ.', 'ट्रॉमा चिकित्सा में गंभीर चोट के बाद के पहले 60 मिनट को गोल्डन आवर कहा जाता है। ऐसी सुविधा पर पहुँचना जहाँ ICU बेड न हो या ज़रूरी एंटी-वेनम उपलब्ध न हो, कीमती जीवन-रक्षक समय गँवा देता है। LIFE-LINK रिपोर्ट किए गए बेड, टाइमस्टैम्प और दवा इन्वेंटरी पहले ही दिखा देता है।'),
    T('Prevents emergency ambulances from arriving at saturated casualties', 'land_b1', 'ತುಂಬಿದ ಅಪಘಾತ ವಿಭಾಗಗಳಿಗೆ ತುರ್ತು ಆಂಬ್ಯುಲೆನ್ಸ್‌ಗಳು ತಲುಪುವುದನ್ನು ತಡೆಯುತ್ತದೆ', 'भरे हुए कैज़ुअल्टी विभागों में आपातकालीन एम्बुलेंस के पहुँचने को रोकता है'),
    T('Enables rapid identification of unconscious victims via non-sensitive QR tokens', 'land_b2', 'ಸೂಕ್ಷ್ಮವಲ್ಲದ QR ಟೋಕನ್‌ಗಳ ಮೂಲಕ ಪ್ರಜ್ಞಾಹೀನ ಸಂತ್ರಸ್ತರ ತ್ವರಿತ ಗುರುತಿಸುವಿಕೆ ಸಾಧ್ಯವಾಗಿಸುತ್ತದೆ', 'गैर-संवेदनशील QR टोकन के ज़रिए बेहोश पीड़ितों की त्वरित पहचान संभव बनाता है'),
    T('Maintains clinical record continuity and handover notes during transfers', 'land_b3', 'ವರ್ಗಾವಣೆಯ ಸಮಯದಲ್ಲಿ ಕ್ಲಿನಿಕಲ್ ದಾಖಲೆ ನಿರಂತರತೆ ಮತ್ತು ಹಸ್ತಾಂತರ ಟಿಪ್ಪಣಿಗಳನ್ನು ಕಾಪಾಡುತ್ತದೆ', 'स्थानांतरण के दौरान क्लिनिकल रिकॉर्ड की निरंतरता और हैंडओवर नोट्स बनाए रखता है'),
    T('Offline-First Architecture', 'land_o1', 'ಆಫ್‌ಲೈನ್-ಮೊದಲ ಆರ್ಕಿಟೆಕ್ಚರ್', 'ऑफ़लाइन-फ़र्स्ट आर्किटेक्चर'),
    T('How Zero-Connectivity Resilience Works', 'land_o2', 'ಸಂಪರ್ಕರಹಿತ ಸ್ಥಿತಿಯಲ್ಲಿ ಸ್ಥಿತಿಸ್ಥಾಪಕತ್ವ ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ', 'बिना कनेक्टिविटी में मज़बूती कैसे काम करती है'),
    T('When network signals drop in rural sectors or disaster zones, LIFE-LINK seamlessly switches to its local Progressive Web App cache and IndexedDB storage layer:', 'land_o3', 'ಗ್ರಾಮೀಣ ಪ್ರದೇಶಗಳಲ್ಲಿ ಅಥವಾ ವಿಪತ್ತು ವಲಯಗಳಲ್ಲಿ ನೆಟ್‌ವರ್ಕ್ ಸಿಗ್ನಲ್ ಕಳೆದುಹೋದಾಗ, LIFE-LINK ತನ್ನ ಸ್ಥಳೀಯ ಪ್ರೊಗ್ರೆಸಿವ್ ವೆಬ್ ಆ್ಯಪ್ ಕ್ಯಾಶ್ ಮತ್ತು IndexedDB ಸಂಗ್ರಹ ಪದರಕ್ಕೆ ಸುಗಮವಾಗಿ ಬದಲಾಗುತ್ತದೆ:', 'जब ग्रामीण क्षेत्रों या आपदा क्षेत्रों में नेटवर्क सिग्नल चला जाता है, तो LIFE-LINK अपने स्थानीय प्रोग्रेसिव वेब ऐप कैश और IndexedDB स्टोरेज लेयर पर सहजता से स्विच हो जाता है:'),
    T('1. Service Worker & Shell Caching', 'land_s1t', '1. ಸರ್ವಿಸ್ ವರ್ಕರ್ ಮತ್ತು ಶೆಲ್ ಕ್ಯಾಶಿಂಗ್', '1. सर्विस वर्कर और शेल कैशिंग'),
    T('Core UI components, routing, and first aid guides load instantly from browser Cache API without an internet handshake.', 'land_s1', 'ಮುಖ್ಯ UI ಘಟಕಗಳು, ರೂಟಿಂಗ್ ಮತ್ತು ಪ್ರಥಮ ಚಿಕಿತ್ಸಾ ಮಾರ್ಗದರ್ಶಿಗಳು ಇಂಟರ್ನೆಟ್ ಸಂಪರ್ಕವಿಲ್ಲದೆ ಬ್ರೌಸರ್ ಕ್ಯಾಶ್‌ನಿಂದ ತಕ್ಷಣ ಲೋಡ್ ಆಗುತ್ತವೆ.', 'मुख्य UI घटक, रूटिंग और प्राथमिक चिकित्सा गाइड इंटरनेट कनेक्शन के बिना ब्राउज़र कैश से तुरंत लोड होते हैं।'),
    T('2. IndexedDB Local Storage', 'land_s2t', '2. IndexedDB ಸ್ಥಳೀಯ ಸಂಗ್ರಹ', '2. IndexedDB लोकल स्टोरेज'),
    T('Hospitals, emergency contacts, and active intake records are stored locally with clear last-updated timestamps.', 'land_s2', 'ಆಸ್ಪತ್ರೆಗಳು, ತುರ್ತು ಸಂಪರ್ಕಗಳು ಮತ್ತು ಸಕ್ರಿಯ ದಾಖಲಾತಿ ದಾಖಲೆಗಳನ್ನು ಸ್ಪಷ್ಟ ಕೊನೆಯ ನವೀಕರಣ ಸಮಯಮುದ್ರೆಗಳೊಂದಿಗೆ ಸ್ಥಳೀಯವಾಗಿ ಸಂಗ್ರಹಿಸಲಾಗುತ್ತದೆ.', 'अस्पताल, आपातकालीन संपर्क और सक्रिय इनटेक रिकॉर्ड स्पष्ट अंतिम-अपडेट टाइमस्टैम्प के साथ स्थानीय रूप से संग्रहीत होते हैं।'),
    T('3. Offline Queue & Conflict-Free Sync', 'land_s3t', '3. ಆಫ್‌ಲೈನ್ ಸರದಿ ಮತ್ತು ಸಂಘರ್ಷ-ರಹಿತ ಸಿಂಕ್', '3. ऑफ़लाइन कतार और कॉन्फ़्लिक्ट-फ़्री सिंक'),
    T('Staff actions taken offline are queued in IndexedDB and replayed to remote backends as soon as connectivity restores.', 'land_s3', 'ಆಫ್‌ಲೈನ್‌ನಲ್ಲಿ ಸಿಬ್ಬಂದಿ ಮಾಡಿದ ಕ್ರಿಯೆಗಳನ್ನು IndexedDB ನಲ್ಲಿ ಸರದಿಯಲ್ಲಿ ಇಡಲಾಗುತ್ತದೆ ಮತ್ತು ಸಂಪರ್ಕ ಮರಳಿದ ತಕ್ಷಣ ರಿಮೋಟ್ ಬ್ಯಾಕೆಂಡ್‌ಗಳಿಗೆ ಮರುಕಳುಹಿಸಲಾಗುತ್ತದೆ.', 'ऑफ़लाइन किए गए स्टाफ कार्य IndexedDB में कतारबद्ध होते हैं और कनेक्टिविटी लौटते ही रिमोट बैकएंड पर दोबारा भेजे जाते हैं।'),
    T('Official Emergency Advisory', 'land_adv', 'ಅಧಿಕೃತ ತುರ್ತು ಸಲಹೆ', 'आधिकारिक आपातकालीन सलाह'),
    T('Open Emergency Dialer (112 / 108) →', 'land_dial', 'ತುರ್ತು ಡಯಲರ್ ತೆರೆಯಿರಿ (112 / 108) →', 'आपातकालीन डायलर खोलें (112 / 108) →'),
  ],

  MedicineInventoryManagementPage: [
    T('Loading Medicine Inventory...', 'med_loading', 'ಔಷಧ ದಾಸ್ತಾನು ಲೋಡ್ ಆಗುತ್ತಿದೆ...', 'दवा इन्वेंटरी लोड हो रही है...'),
    T(...BACK_ADMIN),
    T('Emergency Supply Chain', 'med_badge', 'ತುರ್ತು ಪೂರೈಕೆ ಸರಪಳಿ', 'आपातकालीन आपूर्ति श्रृंखला'),
    T('Essential Medicine & Blood Stock', 'med_title', 'ಅಗತ್ಯ ಔಷಧ ಮತ್ತು ರಕ್ತ ದಾಸ್ತಾನು', 'आवश्यक दवा और रक्त स्टॉक'),
    T('• Keep life-saving anti-venom, O- blood, and critical meds updated.', 'med_sub', '• ಜೀವ ಉಳಿಸುವ ವಿಷ ನಿರೋಧಕ, O- ರಕ್ತ ಮತ್ತು ಅಗತ್ಯ ಔಷಧಗಳನ್ನು ನವೀಕರಿಸಿ.', '• जीवन रक्षक एंटी-वेनम, O- रक्त और ज़रूरी दवाएँ अपडेट रखें।'),
    T(...STATUS),
    J(...ONLINE),
    J(...OFFLINE),
    T('Medicine inventory updated and broadcasted!', 'med_ok', 'ಔಷಧ ದಾಸ್ತಾನು ನವೀಕರಿಸಿ ಪ್ರಸಾರ ಮಾಡಲಾಗಿದೆ!', 'दवा इन्वेंटरी अपडेट और प्रसारित हो गई!'),
    T('Low Stock Alert', 'med_low', 'ಕಡಿಮೆ ದಾಸ್ತಾನು ಎಚ್ಚರಿಕೆ', 'कम स्टॉक चेतावनी'),
    T('Unit:', 'med_unit', 'ಘಟಕ:', 'इकाई:'),
    T('• Last updated:', 'med_lastUpd', '• ಕೊನೆಯ ನವೀಕರಣ:', '• अंतिम अपडेट:'),
    R('Available Stock ({m.unit}):', "{t('med_stock').replace('{unit}', m.unit)}", 'med_stock', 'Available Stock ({unit}):', 'ಲಭ್ಯ ದಾಸ್ತಾನು ({unit}):', 'उपलब्ध स्टॉक ({unit}):'),
    T('Enables emergency ambulances to route patients requiring rare treatments.', 'med_foot', 'ಅಪರೂಪದ ಚಿಕಿತ್ಸೆ ಅಗತ್ಯವಿರುವ ರೋಗಿಗಳನ್ನು ತುರ್ತು ಆಂಬ್ಯುಲೆನ್ಸ್‌ಗಳು ಸೂಕ್ತ ಸ್ಥಳಕ್ಕೆ ಕೊಂಡೊಯ್ಯಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ.', 'दुर्लभ उपचार की ज़रूरत वाले मरीज़ों को एम्बुलेंस सही जगह पहुँचा सकें, इसमें मदद करता है।'),
    J('Updating...', 'med_updating', 'ನವೀಕರಿಸಲಾಗುತ್ತಿದೆ...', 'अपडेट हो रहा है...'),
    J('Save & Publish Inventory', 'med_save', 'ದಾಸ್ತಾನು ಉಳಿಸಿ ಮತ್ತು ಪ್ರಕಟಿಸಿ', 'इन्वेंटरी सहेजें और प्रकाशित करें'),
    J('Failed to update medicines: ', 'med_fail', 'ಔಷಧಗಳನ್ನು ನವೀಕರಿಸಲು ವಿಫಲವಾಗಿದೆ: ', 'दवाएँ अपडेट करने में विफल: '),
  ],

  PatientTransferPage: [
    T('Loading Transfer Dispatch Form...', 'xfer_loading', 'ವರ್ಗಾವಣೆ ರವಾನೆ ಫಾರ್ಮ್ ಲೋಡ್ ಆಗುತ್ತಿದೆ...', 'स्थानांतरण डिस्पैच फ़ॉर्म लोड हो रहा है...'),
    T(...PAT_NF),
    T(...RETURN),
    T(...BACK_REC),
    T('Medical Record Continuity', 'xfer_badge', 'ವೈದ್ಯಕೀಯ ದಾಖಲೆ ನಿರಂತರತೆ', 'चिकित्सा रिकॉर्ड निरंतरता'),
    T('Initiate Inter-Hospital Patient Transfer', 'xfer_title', 'ಆಸ್ಪತ್ರೆಗಳ ನಡುವೆ ರೋಗಿ ವರ್ಗಾವಣೆ ಪ್ರಾರಂಭಿಸಿ', 'अस्पतालों के बीच मरीज़ स्थानांतरण शुरू करें'),
    T('Dispatches patient transfer and maintains continuous clinical handover notes across facilities.', 'xfer_sub', 'ರೋಗಿ ವರ್ಗಾವಣೆಯನ್ನು ರವಾನಿಸುತ್ತದೆ ಮತ್ತು ಸೌಲಭ್ಯಗಳಾದ್ಯಂತ ನಿರಂತರ ಕ್ಲಿನಿಕಲ್ ಹಸ್ತಾಂತರ ಟಿಪ್ಪಣಿಗಳನ್ನು ಕಾಪಾಡುತ್ತದೆ.', 'मरीज़ का स्थानांतरण भेजता है और सुविधाओं के बीच क्लिनिकल हैंडओवर नोट्स की निरंतरता बनाए रखता है।'),
    T(...PATIENT),
    T('Offline Transfer Dispatch', 'xfer_offTitle', 'ಆಫ್‌ಲೈನ್ ವರ್ಗಾವಣೆ ರವಾನೆ', 'ऑफ़लाइन स्थानांतरण डिस्पैच'),
    T('The transfer entry and handover observations will be stored locally and synced when connection returns.', 'xfer_offText', 'ವರ್ಗಾವಣೆ ನಮೂದು ಮತ್ತು ಹಸ್ತಾಂತರ ಅವಲೋಕನಗಳನ್ನು ಸ್ಥಳೀಯವಾಗಿ ಸಂಗ್ರಹಿಸಲಾಗುತ್ತದೆ ಮತ್ತು ಸಂಪರ್ಕ ಮರಳಿದಾಗ ಸಿಂಕ್ ಮಾಡಲಾಗುತ್ತದೆ.', 'स्थानांतरण प्रविष्टि और हैंडओवर अवलोकन स्थानीय रूप से सहेजे जाएँगे और कनेक्शन लौटने पर सिंक होंगे।'),
    T('1. Source and Destination Facilities', 'xfer_s1', '1. ಮೂಲ ಮತ್ತು ಗಮ್ಯಸ್ಥಾನ ಸೌಲಭ್ಯಗಳು', '1. स्रोत और गंतव्य सुविधाएँ'),
    T('Transfer Origin (Source)', 'xfer_origin', 'ವರ್ಗಾವಣೆ ಮೂಲ (ಮೂಲ ಸ್ಥಳ)', 'स्थानांतरण मूल (स्रोत)'),
    J('Current Hospital', 'xfer_curHosp', 'ಪ್ರಸ್ತುತ ಆಸ್ಪತ್ರೆ', 'वर्तमान अस्पताल'),
    T('Receiving Destination Hospital', 'xfer_dest', 'ಸ್ವೀಕರಿಸುವ ಗಮ್ಯಸ್ಥಾನ ಆಸ್ಪತ್ರೆ', 'प्राप्तकर्ता गंतव्य अस्पताल'),
    J('(Current Facility)', 'xfer_curFac', '(ಪ್ರಸ್ತುತ ಸೌಲಭ್ಯ)', '(वर्तमान सुविधा)'),
    R(
      'Reported Availability: {targetHospital.totalAvailableBeds || 0} Beds • Emergency 24/7 Active',
      "{t('xfer_reportedAvail').replace('{n}', targetHospital.totalAvailableBeds || 0)}",
      'xfer_reportedAvail',
      'Reported Availability: {n} Beds • Emergency 24/7 Active',
      'ವರದಿ ಮಾಡಿದ ಲಭ್ಯತೆ: {n} ಹಾಸಿಗೆಗಳು • ತುರ್ತು 24/7 ಸಕ್ರಿಯ',
      'रिपोर्ट की गई उपलब्धता: {n} बेड • आपातकालीन 24/7 सक्रिय'
    ),
    T('2. Transfer Reason & Transport Handover Notes', 'xfer_s2', '2. ವರ್ಗಾವಣೆ ಕಾರಣ ಮತ್ತು ಸಾರಿಗೆ ಹಸ್ತಾಂತರ ಟಿಪ್ಪಣಿಗಳು', '2. स्थानांतरण का कारण और परिवहन हैंडओवर नोट्स'),
    T('Clinical Reason for Inter-Hospital Transfer', 'xfer_reason', 'ಆಸ್ಪತ್ರೆಗಳ ನಡುವೆ ವರ್ಗಾವಣೆಯ ಕ್ಲಿನಿಕಲ್ ಕಾರಣ', 'अस्पतालों के बीच स्थानांतरण का क्लिनिकल कारण'),
    A('placeholder', 'e.g. Higher-level neurosurgical care required', 'xfer_phReason', 'ಉದಾ. ಉನ್ನತ ಮಟ್ಟದ ನರಶಸ್ತ್ರಚಿಕಿತ್ಸಾ ಆರೈಕೆ ಅಗತ್ಯ', 'जैसे उच्च स्तरीय न्यूरोसर्जिकल देखभाल आवश्यक'),
    T('Clinical Handover Notes & Transit Vitals', 'xfer_notes', 'ಕ್ಲಿನಿಕಲ್ ಹಸ್ತಾಂತರ ಟಿಪ್ಪಣಿಗಳು ಮತ್ತು ಸಾಗಣೆ ಜೀವಾಂಕಗಳು', 'क्लिनिकल हैंडओवर नोट्स और ट्रांज़िट वाइटल्स'),
    A('placeholder', 'Detail vitals, active infusions, airway management, and doctor recommendations.', 'xfer_phNotes', 'ಜೀವಾಂಕಗಳು, ನಡೆಯುತ್ತಿರುವ ಇನ್ಫ್ಯೂಷನ್‌ಗಳು, ವಾಯುಮಾರ್ಗ ನಿರ್ವಹಣೆ ಮತ್ತು ವೈದ್ಯರ ಶಿಫಾರಸುಗಳನ್ನು ವಿವರಿಸಿ.', 'वाइटल्स, चल रहे इन्फ्यूज़न, वायुमार्ग प्रबंधन और डॉक्टर की सिफ़ारिशों का विवरण दें।'),
    T('Ambulance / Transport Unit', 'xfer_amb', 'ಆಂಬ್ಯುಲೆನ್ಸ್ / ಸಾರಿಗೆ ಘಟಕ', 'एम्बुलेंस / परिवहन यूनिट'),
    T('Authorizing Officer / Attending CMO', 'xfer_auth', 'ಅಧಿಕೃತಗೊಳಿಸುವ ಅಧಿಕಾರಿ / ಹಾಜರಿರುವ CMO', 'अधिकृत करने वाले अधिकारी / उपस्थित CMO'),
    T('Records transfer into clinical audit history and updates facility assignment.', 'xfer_foot', 'ವರ್ಗಾವಣೆಯನ್ನು ಕ್ಲಿನಿಕಲ್ ಲೆಕ್ಕಪರಿಶೋಧನಾ ಇತಿಹಾಸದಲ್ಲಿ ದಾಖಲಿಸುತ್ತದೆ ಮತ್ತು ಸೌಲಭ್ಯ ನಿಯೋಜನೆಯನ್ನು ನವೀಕರಿಸುತ್ತದೆ.', 'स्थानांतरण को क्लिनिकल ऑडिट इतिहास में दर्ज करता है और सुविधा असाइनमेंट अपडेट करता है।'),
    J('Recording Transfer...', 'xfer_recording', 'ವರ್ಗಾವಣೆ ದಾಖಲಿಸಲಾಗುತ್ತಿದೆ...', 'स्थानांतरण दर्ज हो रहा है...'),
    J('Confirm Hospital Transfer', 'xfer_confirm', 'ಆಸ್ಪತ್ರೆ ವರ್ಗಾವಣೆ ದೃಢೀಕರಿಸಿ', 'अस्पताल स्थानांतरण की पुष्टि करें'),
    J('Transfer record failed: ', 'xfer_fail', 'ವರ್ಗಾವಣೆ ದಾಖಲೆ ವಿಫಲವಾಗಿದೆ: ', 'स्थानांतरण रिकॉर्ड विफल रहा: '),
  ],

  UnidentifiedPatientPage: [
    T('Back to Scanner Terminal', 'unid_back', 'ಸ್ಕ್ಯಾನರ್ ಟರ್ಮಿನಲ್‌ಗೆ ಹಿಂತಿರುಗಿ', 'स्कैनर टर्मिनल पर वापस जाएँ'),
    T('Emergency Casualty Intake', 'unid_badge', 'ತುರ್ತು ಅಪಘಾತ ದಾಖಲಾತಿ', 'आपातकालीन कैज़ुअल्टी इनटेक'),
    T('Register Unidentified / Unconscious Patient', 'unid_title', 'ಗುರುತಿಲ್ಲದ / ಪ್ರಜ್ಞಾಹೀನ ರೋಗಿಯನ್ನು ನೋಂದಾಯಿಸಿ', 'अज्ञात / बेहोश मरीज़ का पंजीकरण करें'),
    T('Fast-track clinical record creation when patient identity or consciousness is unknown.', 'unid_sub', 'ರೋಗಿಯ ಗುರುತು ಅಥವಾ ಪ್ರಜ್ಞೆ ತಿಳಿದಿಲ್ಲದಿದ್ದಾಗ ತ್ವರಿತವಾಗಿ ಕ್ಲಿನಿಕಲ್ ದಾಖಲೆ ರಚಿಸಿ.', 'जब मरीज़ की पहचान या होश की स्थिति अज्ञात हो, तब क्लिनिकल रिकॉर्ड तुरंत बनाएँ।'),
    T('Assigned Temporary ID', 'unid_tempId', 'ನಿಯೋಜಿತ ತಾತ್ಕಾಲಿಕ ಐಡಿ', 'आवंटित अस्थायी आईडी'),
    T('Offline Registration Active', 'unid_offTitle', 'ಆಫ್‌ಲೈನ್ ನೋಂದಣಿ ಸಕ್ರಿಯ', 'ऑफ़लाइन पंजीकरण सक्रिय'),
    T('This intake record will be created locally in IndexedDB with temporary ID', 'unid_off1', 'ಈ ದಾಖಲಾತಿ ದಾಖಲೆಯನ್ನು ತಾತ್ಕಾಲಿಕ ಐಡಿಯೊಂದಿಗೆ IndexedDB ನಲ್ಲಿ ಸ್ಥಳೀಯವಾಗಿ ರಚಿಸಲಾಗುತ್ತದೆ', 'यह इनटेक रिकॉर्ड अस्थायी आईडी के साथ IndexedDB में स्थानीय रूप से बनाया जाएगा'),
    T('and queued for cloud synchronization as soon as cellular data connects.', 'unid_off2', 'ಮತ್ತು ಸೆಲ್ಯುಲಾರ್ ಡೇಟಾ ಸಂಪರ್ಕವಾದ ತಕ್ಷಣ ಕ್ಲೌಡ್ ಸಿಂಕ್ರೊನೈಸೇಶನ್‌ಗೆ ಸರದಿಯಲ್ಲಿಡಲಾಗುತ್ತದೆ.', 'और सेल्युलर डेटा जुड़ते ही क्लाउड सिंक के लिए कतार में रखा जाएगा।'),
    T('1. Triage Priority & Discovery Site', 'unid_s1', '1. ಟ್ರಯೇಜ್ ಆದ್ಯತೆ ಮತ್ತು ಪತ್ತೆಯಾದ ಸ್ಥಳ', '1. ट्राइएज प्राथमिकता और खोज स्थल'),
    T('Triage Urgency Category', 'unid_urg', 'ಟ್ರಯೇಜ್ ತುರ್ತು ವರ್ಗ', 'ट्राइएज तात्कालिकता श्रेणी'),
    T('RED (Immediate / Critical / Resuscitation)', 'unid_red', 'ಕೆಂಪು (ತಕ್ಷಣ / ಗಂಭೀರ / ಪುನರುಜ್ಜೀವನ)', 'लाल (तत्काल / गंभीर / पुनर्जीवन)'),
    T('YELLOW (Urgent / High Priority)', 'unid_yel', 'ಹಳದಿ (ತುರ್ತು / ಹೆಚ್ಚಿನ ಆದ್ಯತೆ)', 'पीला (तत्काल / उच्च प्राथमिकता)'),
    T('GREEN (Delayed / Non-life threatening)', 'unid_grn', 'ಹಸಿರು (ವಿಳಂಬ / ಪ್ರಾಣಾಪಾಯವಿಲ್ಲದ)', 'हरा (विलंबित / जानलेवा नहीं)'),
    T('Incident Location / Found At', 'unid_loc', 'ಘಟನೆಯ ಸ್ಥಳ / ಪತ್ತೆಯಾದ ಸ್ಥಳ', 'घटना स्थल / जहाँ मिला'),
    A('placeholder', 'e.g. Outer Ring Road, near Kadubeesanahalli flyover', 'unid_phLoc', 'ಉದಾ. ಔಟರ್ ರಿಂಗ್ ರೋಡ್, ಕಾಡುಬೀಸನಹಳ್ಳಿ ಫ್ಲೈಓವರ್ ಹತ್ತಿರ', 'जैसे आउटर रिंग रोड, कडूबीसनहल्ली फ्लाईओवर के पास'),
    T('2. Apparent Characteristics (Unverified)', 'unid_s2', '2. ಸ್ಪಷ್ಟ ಲಕ್ಷಣಗಳು (ಪರಿಶೀಲಿಸಲಾಗಿಲ್ಲ)', '2. स्पष्ट विशेषताएँ (असत्यापित)'),
    T('Estimated Age', 'unid_age', 'ಅಂದಾಜು ವಯಸ್ಸು', 'अनुमानित आयु'),
    A('placeholder', 'e.g. 25-30 years', 'unid_phAge', 'ಉದಾ. 25-30 ವರ್ಷ', 'जैसे 25-30 वर्ष'),
    T('Apparent Gender', 'unid_gender', 'ಸ್ಪಷ್ಟವಾಗಿ ಕಾಣುವ ಲಿಂಗ', 'प्रतीत होने वाला लिंग'),
    T('Male', 'unid_male', 'ಪುರುಷ', 'पुरुष'),
    T('Female', 'unid_female', 'ಮಹಿಳೆ', 'महिला'),
    T('Other / Cannot Determine', 'unid_other', 'ಇತರೆ / ನಿರ್ಧರಿಸಲಾಗದು', 'अन्य / निर्धारित नहीं'),
    T('3. Emergency Clinical Observations & Trauma Notes', 'unid_s3', '3. ತುರ್ತು ಕ್ಲಿನಿಕಲ್ ಅವಲೋಕನಗಳು ಮತ್ತು ಆಘಾತ ಟಿಪ್ಪಣಿಗಳು', '3. आपातकालीन क्लिनिकल अवलोकन और ट्रॉमा नोट्स'),
    T('Triage Observations, GCS, & Presenting Symptoms', 'unid_obs', 'ಟ್ರಯೇಜ್ ಅವಲೋಕನಗಳು, GCS ಮತ್ತು ಪ್ರಸ್ತುತ ಲಕ್ಷಣಗಳು', 'ट्राइएज अवलोकन, GCS और प्रस्तुत लक्षण'),
    A('placeholder', 'e.g. Unconscious male. GCS 7 (E1V2M4). Right pupil sluggish. Severe blunt chest trauma and compound fracture of left femur. Intubated on field.', 'unid_phObs', 'ಉದಾ. ಪ್ರಜ್ಞಾಹೀನ ಪುರುಷ. GCS 7 (E1V2M4). ಬಲ ಕಣ್ಣಿನ ಪಾಪೆ ನಿಧಾನ. ತೀವ್ರ ಎದೆಗೆ ಮೊಂಡು ಆಘಾತ ಮತ್ತು ಎಡ ತೊಡೆಯ ಮೂಳೆ ಸಂಯುಕ್ತ ಮುರಿತ. ಸ್ಥಳದಲ್ಲೇ ಇಂಟ್ಯೂಬೇಷನ್.', 'जैसे बेहोश पुरुष। GCS 7 (E1V2M4)। दायीं पुतली सुस्त। छाती पर गंभीर कुंद चोट और बाएँ फीमर का कंपाउंड फ्रैक्चर। मौके पर इंटुबेशन।'),
    T('Receiving Hospital', 'unid_recv', 'ಸ್ವೀಕರಿಸುವ ಆಸ್ಪತ್ರೆ', 'प्राप्तकर्ता अस्पताल'),
    T('Reporting Officer / Paramedic', 'unid_officer', 'ವರದಿ ಮಾಡುವ ಅಧಿಕಾರಿ / ಪ್ಯಾರಾಮೆಡಿಕ್', 'रिपोर्ट करने वाला अधिकारी / पैरामेडिक'),
    T('Assigns stable emergency ID and opens clinical record.', 'unid_foot', 'ಸ್ಥಿರ ತುರ್ತು ಐಡಿ ನಿಯೋಜಿಸಿ ಕ್ಲಿನಿಕಲ್ ದಾಖಲೆ ತೆರೆಯುತ್ತದೆ.', 'स्थिर आपातकालीन आईडी आवंटित करता है और क्लिनिकल रिकॉर्ड खोलता है।'),
    J('Registering Intake...', 'unid_registering', 'ದಾಖಲಾತಿ ನೋಂದಣಿಯಾಗುತ್ತಿದೆ...', 'इनटेक पंजीकृत हो रहा है...'),
    J('Create Emergency Patient Record', 'unid_create', 'ತುರ್ತು ರೋಗಿ ದಾಖಲೆ ರಚಿಸಿ', 'आपातकालीन मरीज़ रिकॉर्ड बनाएँ'),
    J('Registration failed: ', 'unid_fail', 'ನೋಂದಣಿ ವಿಫಲವಾಗಿದೆ: ', 'पंजीकरण विफल रहा: '),
  ],

  PrivacyHelpPage: [
    T('Governance & Security', 'priv_badge', 'ಆಡಳಿತ ಮತ್ತು ಭದ್ರತೆ', 'गवर्नेंस और सुरक्षा'),
    T('Architecture principles, clinical privacy safeguards, and emergency regulatory guidelines.', 'priv_sub', 'ವಾಸ್ತುಶಿಲ್ಪ ತತ್ವಗಳು, ಕ್ಲಿನಿಕಲ್ ಗೌಪ್ಯತೆ ರಕ್ಷಣೆಗಳು ಮತ್ತು ತುರ್ತು ನಿಯಂತ್ರಣ ಮಾರ್ಗಸೂಚಿಗಳು.', 'आर्किटेक्चर सिद्धांत, क्लिनिकल गोपनीयता सुरक्षा उपाय और आपातकालीन नियामक दिशानिर्देश।'),
    T('Official Emergency Legal Disclaimer', 'priv_discTitle', 'ಅಧಿಕೃತ ತುರ್ತು ಕಾನೂನು ಹಕ್ಕು ನಿರಾಕರಣೆ', 'आधिकारिक आपातकालीन कानूनी अस्वीकरण'),
    T('LIFE-LINK is a clinical navigation and medical record continuity tool. It complements rather than replaces official emergency services (112, 108) or direct physician consultation. Bed availability and medicine inventories are reported by hospital administrators and are subject to immediate clinical priority surges. If someone is experiencing a life-threatening crisis, call emergency ambulance services without delay.', 'priv_disc', 'LIFE-LINK ಒಂದು ಕ್ಲಿನಿಕಲ್ ನ್ಯಾವಿಗೇಷನ್ ಮತ್ತು ವೈದ್ಯಕೀಯ ದಾಖಲೆ ನಿರಂತರತೆಯ ಸಾಧನ. ಇದು ಅಧಿಕೃತ ತುರ್ತು ಸೇವೆಗಳನ್ನು (112, 108) ಅಥವಾ ವೈದ್ಯರ ನೇರ ಸಮಾಲೋಚನೆಯನ್ನು ಬದಲಾಯಿಸುವುದಿಲ್ಲ, ಬದಲಿಗೆ ಅವುಗಳಿಗೆ ಪೂರಕವಾಗಿದೆ. ಹಾಸಿಗೆ ಲಭ್ಯತೆ ಮತ್ತು ಔಷಧ ದಾಸ್ತಾನನ್ನು ಆಸ್ಪತ್ರೆ ನಿರ್ವಾಹಕರು ವರದಿ ಮಾಡುತ್ತಾರೆ ಮತ್ತು ಅದು ತಕ್ಷಣದ ಕ್ಲಿನಿಕಲ್ ಆದ್ಯತೆಯ ಏರಿಕೆಗಳಿಗೆ ಒಳಪಟ್ಟಿರುತ್ತದೆ. ಯಾರಾದರೂ ಪ್ರಾಣಾಪಾಯದ ಬಿಕ್ಕಟ್ಟಿನಲ್ಲಿದ್ದರೆ, ತಡಮಾಡದೆ ತುರ್ತು ಆಂಬ್ಯುಲೆನ್ಸ್ ಸೇವೆಗೆ ಕರೆ ಮಾಡಿ.', 'LIFE-LINK एक क्लिनिकल नेविगेशन और चिकित्सा रिकॉर्ड निरंतरता उपकरण है। यह आधिकारिक आपातकालीन सेवाओं (112, 108) या डॉक्टर के सीधे परामर्श का विकल्प नहीं, बल्कि उनका पूरक है। बेड उपलब्धता और दवा इन्वेंटरी अस्पताल प्रशासकों द्वारा रिपोर्ट की जाती है और तत्काल क्लिनिकल प्राथमिकता के उतार-चढ़ाव के अधीन है। यदि कोई जानलेवा संकट में है, तो बिना देरी आपातकालीन एम्बुलेंस सेवा को कॉल करें।'),
    T('Healthcare Data Privacy Architecture', 'priv_arch', 'ಆರೋಗ್ಯ ಡೇಟಾ ಗೌಪ್ಯತೆ ವಾಸ್ತುಶಿಲ್ಪ', 'स्वास्थ्य डेटा गोपनीयता आर्किटेक्चर'),
    T('1. Non-Sensitive QR Tokens', 'priv_1t', '1. ಸೂಕ್ಷ್ಮವಲ್ಲದ QR ಟೋಕನ್‌ಗಳು', '1. गैर-संवेदनशील QR टोकन'),
    T('Public QR codes never contain plain-text medical histories, full national IDs, or raw contact numbers. The code stores an unguessable token hash that only authenticated medical staff can resolve during clinical intake.', 'priv_1', 'ಸಾರ್ವಜನಿಕ QR ಕೋಡ್‌ಗಳಲ್ಲಿ ಸರಳ ಪಠ್ಯದ ವೈದ್ಯಕೀಯ ಇತಿಹಾಸ, ಪೂರ್ಣ ರಾಷ್ಟ್ರೀಯ ಗುರುತಿನ ಸಂಖ್ಯೆಗಳು ಅಥವಾ ನೇರ ಸಂಪರ್ಕ ಸಂಖ್ಯೆಗಳು ಎಂದಿಗೂ ಇರುವುದಿಲ್ಲ. ಕೋಡ್ ಊಹಿಸಲಾಗದ ಟೋಕನ್ ಹ್ಯಾಶ್ ಅನ್ನು ಸಂಗ್ರಹಿಸುತ್ತದೆ, ಇದನ್ನು ಕ್ಲಿನಿಕಲ್ ದಾಖಲಾತಿಯ ಸಮಯದಲ್ಲಿ ದೃಢೀಕೃತ ವೈದ್ಯಕೀಯ ಸಿಬ್ಬಂದಿ ಮಾತ್ರ ಪರಿಹರಿಸಬಹುದು.', 'सार्वजनिक QR कोड में सादे पाठ में चिकित्सा इतिहास, पूरी राष्ट्रीय आईडी या सीधे संपर्क नंबर कभी नहीं होते। कोड एक अनुमान-रहित टोकन हैश संग्रहीत करता है, जिसे क्लिनिकल इनटेक के दौरान केवल प्रमाणित चिकित्सा स्टाफ ही हल कर सकता है।'),
    T('2. Revocable Profile Access', 'priv_2t', '2. ರದ್ದುಪಡಿಸಬಹುದಾದ ಪ್ರೊಫೈಲ್ ಪ್ರವೇಶ', '2. रद्द किया जा सकने वाला प्रोफ़ाइल एक्सेस'),
    T('If a wallet card or printed sticker is lost or compromised, patients can revoke the active token with one click from their profile settings, rendering physical cards completely inert.', 'priv_2', 'ವ್ಯಾಲೆಟ್ ಕಾರ್ಡ್ ಅಥವಾ ಮುದ್ರಿತ ಸ್ಟಿಕ್ಕರ್ ಕಳೆದುಹೋದರೆ ಅಥವಾ ಅಪಾಯಕ್ಕೊಳಗಾದರೆ, ರೋಗಿಗಳು ತಮ್ಮ ಪ್ರೊಫೈಲ್ ಸೆಟ್ಟಿಂಗ್‌ಗಳಿಂದ ಒಂದೇ ಕ್ಲಿಕ್‌ನಲ್ಲಿ ಸಕ್ರಿಯ ಟೋಕನ್ ಅನ್ನು ರದ್ದುಪಡಿಸಬಹುದು, ಇದರಿಂದ ಭೌತಿಕ ಕಾರ್ಡ್‌ಗಳು ಸಂಪೂರ್ಣ ನಿಷ್ಕ್ರಿಯವಾಗುತ್ತವೆ.', 'यदि वॉलेट कार्ड या प्रिंटेड स्टिकर खो जाए या असुरक्षित हो जाए, तो मरीज़ अपनी प्रोफ़ाइल सेटिंग्स से एक क्लिक में सक्रिय टोकन रद्द कर सकते हैं, जिससे भौतिक कार्ड पूरी तरह निष्क्रिय हो जाते हैं।'),
    T('3. Immutable Clinical Audit Trails', 'priv_3t', '3. ಬದಲಾಯಿಸಲಾಗದ ಕ್ಲಿನಿಕಲ್ ಲೆಕ್ಕಪರಿಶೋಧನಾ ಜಾಡುಗಳು', '3. अपरिवर्तनीय क्लिनिकल ऑडिट ट्रेल'),
    T("All transfers, unidentified patient admissions, and identity linking actions log the operator's badge ID, hospital location, and verifiable timestamp to maintain clinical accountability.", 'priv_3', 'ಎಲ್ಲಾ ವರ್ಗಾವಣೆಗಳು, ಗುರುತಿಲ್ಲದ ರೋಗಿಗಳ ದಾಖಲಾತಿಗಳು ಮತ್ತು ಗುರುತು ಲಿಂಕ್ ಕ್ರಿಯೆಗಳು ಕ್ಲಿನಿಕಲ್ ಹೊಣೆಗಾರಿಕೆ ಕಾಪಾಡಲು ಆಪರೇಟರ್‌ನ ಬ್ಯಾಡ್ಜ್ ಐಡಿ, ಆಸ್ಪತ್ರೆ ಸ್ಥಳ ಮತ್ತು ಪರಿಶೀಲಿಸಬಹುದಾದ ಸಮಯಮುದ್ರೆಯನ್ನು ದಾಖಲಿಸುತ್ತವೆ.', 'सभी स्थानांतरण, अज्ञात मरीज़ों की भर्तियाँ और पहचान लिंकिंग कार्रवाइयाँ क्लिनिकल जवाबदेही बनाए रखने के लिए ऑपरेटर की बैज आईडी, अस्पताल का स्थान और सत्यापन-योग्य टाइमस्टैम्प दर्ज करती हैं।'),
    T('4. Least-Privilege Role Authorization', 'priv_4t', '4. ಕನಿಷ್ಠ-ಸೌಲಭ್ಯ ಪಾತ್ರ ಅಧಿಕಾರ', '4. न्यूनतम-विशेषाधिकार भूमिका प्राधिकरण'),
    T('Public citizens can only modify their own emergency profile. Only verified healthcare staff can register unidentified patients or dispatch transfers. Hospital admins are restricted to their assigned facility.', 'priv_4', 'ಸಾರ್ವಜನಿಕರು ತಮ್ಮ ಸ್ವಂತ ತುರ್ತು ಪ್ರೊಫೈಲ್ ಅನ್ನು ಮಾತ್ರ ಮಾರ್ಪಡಿಸಬಹುದು. ಪರಿಶೀಲಿತ ಆರೋಗ್ಯ ಸಿಬ್ಬಂದಿ ಮಾತ್ರ ಗುರುತಿಲ್ಲದ ರೋಗಿಗಳನ್ನು ನೋಂದಾಯಿಸಬಹುದು ಅಥವಾ ವರ್ಗಾವಣೆಗಳನ್ನು ರವಾನಿಸಬಹುದು. ಆಸ್ಪತ್ರೆ ನಿರ್ವಾಹಕರು ತಮಗೆ ನಿಯೋಜಿಸಲಾದ ಸೌಲಭ್ಯಕ್ಕೆ ಸೀಮಿತರಾಗಿರುತ್ತಾರೆ.', 'आम नागरिक केवल अपनी आपातकालीन प्रोफ़ाइल बदल सकते हैं। केवल सत्यापित स्वास्थ्यकर्मी ही अज्ञात मरीज़ों को पंजीकृत कर सकते हैं या स्थानांतरण भेज सकते हैं। अस्पताल प्रशासक अपनी नियत सुविधा तक सीमित हैं।'),
  ],
};

// ---------- engine ----------
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const countOf = (src, s) => (s ? src.split(s).length - 1 : 0);

function applyPatches(src, patches, warnings, name) {
  let out = src;
  const raws = patches.filter((p) => p.k === 'R');
  const rest = patches.filter((p) => p.k !== 'R').sort((a, b) => b.en.length - a.en.length);

  for (const p of raws) {
    const n = countOf(out, p.old);
    if (!n) { warnings.push(`${name}: raw snippet not found -> ${p.old.slice(0, 70)}…`); continue; }
    out = out.split(p.old).join(p.neu);
  }

  for (const p of rest) {
    let re, rep, n = 0;
    if (p.k === 'T') {
      re = new RegExp('(?<=[>}]\\s*)' + esc(p.en) + '(?=\\s*[<{])', 'g');
      rep = `{t('${p.key}')}`;
    } else if (p.k === 'A') {
      re = new RegExp(esc(`${p.attr}="${p.en}"`), 'g');
      rep = `${p.attr}={t('${p.key}')}`;
    } else {
      re = new RegExp(esc(`'${p.en}'`), 'g');
      rep = `t('${p.key}')`;
    }
    out = out.replace(re, () => { n++; return rep; });
    if (!n) warnings.push(`${name}: text not found -> "${p.en.slice(0, 70)}"`);
  }

  if (!/useLanguage\s*\(\s*\)/.test(out)) {
    out = out.replace(/(export function \w+\s*\([^)]*\)\s*\{\n)/, (m) => `${m}  const { t } = useLanguage();\n`);
  }
  if (!/import\s*\{[^}]*useLanguage[^}]*\}/.test(out)) {
    out = out.replace(/^(import React[^\n]*\n)/, (m) => `${m}import { useLanguage } from '../contexts/LanguageContext';\n`);
  }
  return out;
}

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) return d.name === 'node_modules' ? [] : walk(p);
    return /\.(jsx?|tsx?)$/.test(d.name) ? [p] : [];
  });
}

// ---------- 1. patch pages ----------
const warnings = [];
let patched = 0;
for (const file of walk(pagesDir)) {
  const src = fs.readFileSync(file, 'utf8');
  const m = src.match(/export function (\w+)\s*\(/);
  if (!m || !PATCHES[m[1]]) continue;
  if (!fs.existsSync(file + '.orig')) fs.writeFileSync(file + '.orig', src);
  fs.writeFileSync(file, applyPatches(src, PATCHES[m[1]], warnings, m[1]));
  patched++;
  console.log('patched', file);
}

// ---------- 2. build dictionary ----------
const dict = { en: {}, kn: {}, hi: {} };
for (const patches of Object.values(PATCHES)) {
  for (const p of patches) {
    if (!p.kn) continue; // re-uses an existing key
    const en = p.k === 'R' ? p.en : p.en;
    if (dict.en[p.key] && dict.en[p.key] !== en) throw new Error(`Key clash: ${p.key}`);
    dict.en[p.key] = en; dict.kn[p.key] = p.kn; dict.hi[p.key] = p.hi;
  }
}
fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(
  outFile,
  `// Generated by apply-i18n.mjs — page-level strings in English, Kannada and Hindi.\n` +
  `// Placeholders such as {n}, {id}, {time} are filled in by the pages with .replace().\n` +
  `export const pageTranslations = ${JSON.stringify(dict, null, 2)};\n`
);

console.log(`\n${patched} page(s) patched, ${Object.keys(dict.en).length} keys written to ${outFile}`);
if (warnings.length) {
  console.log('\nWARNINGS (strings not found — already translated, or your file differs from the one I saw):');
  warnings.forEach((w) => console.log('  - ' + w));
}
