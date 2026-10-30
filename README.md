# LIFE-LINK — Offline-First Emergency Healthcare Platform

> **Connecting Lives, Saving Time.**

LIFE-LINK is a multilingual, offline-first emergency healthcare coordination platform engineered to connect patients, emergency medical services (EMS), and hospital trauma centers during critical life-threatening moments—even in zero-connectivity environments, rural sectors, or disaster zones.

---

## 🌟 Key Capabilities & Clinical Workflows

1. **Multilingual Voice-Assisted Hospital Discovery**
   - Hands-free voice commands in **English**, **Kannada (ಕನ್ನಡ)**, and **Hindi (हिन्दी)** using the Web Speech API.
   - Deterministic intent parser resolves queries like *"ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆ"* or *"Find emergency hospital with ICU bed"* into structured criteria.
   - Text fallback and toggleable voice readout for accessible emergency navigation.

2. **Live Hospital Directory & Bed Telemetry**
   - Instant search and multi-criteria filtering: 24/7 Emergency Casualty, Available ICU beds, Oxygen beds, and Blood Banks.
   - Distance calculation (Haversine formula from GPS coordinates) and estimated emergency vehicle transit time.
   - Configurable **freshness threshold**: automatically flags reported availability older than 6 hours as outdated.

3. **Essential Emergency Medicine Inventory**
   - Real-time stock tracking for life-saving supplies: Polyvalent Snake Anti-venom, O-Negative blood units, Epinephrine, Atropine, and Albumin infusions.

4. **Interactive Leaflet & OpenStreetMap Navigation**
   - Interactive maps with custom pins for 24/7 Trauma Centers vs. Day Clinics.
   - Dynamic route generation via OSRM with geometric offline fallback when disconnected.

5. **Emergency Patient Identification System**
   - **Case A: Registered QR Emergency Profile**: Voluntary medical profile generation. The QR code encodes **only a secure, non-sensitive cryptographic token**, protecting sensitive PII and contact numbers from bystander scraping. Tokens can be revoked instantly if a card is lost.
   - **Case B: Unidentified / Unconscious Patient Intake**: Fast-track intake form generating unique unpredictable identifiers (e.g., `LL-EMG-1042`), recording discovery site, GCS/triage severity, and clinical observations.
   - **Identity Verification & Record Linking**: Authorized healthcare personnel can search verified candidate profiles, review clinical evidence, and formally link records while preserving complete intake and transfer logs.

6. **Inter-Hospital Medical Record Continuity (Transfers)**
   - Structured transfer workflow recording source facility, destination facility, transport unit, and clinical handover notes (vitals, GCS, ventilator settings, IV infusions).

7. **Family Contact & Emergency Notification**
   - Automated alerts to designated family members regarding patient admission and current facility.
   - Realistic demonstration simulation with verifiable delivery timestamps and audit trails.

8. **Hospital Administration Dashboard**
   - Restricted portal for hospital administrators to update reported bed availability and drug stock.
   - Strict validation preventing negative numbers or available counts exceeding total capacity.

9. **Offline-First Resilience (PWA + IndexedDB)**
   - W3C compliant Progressive Web App with custom Service Worker caching core application shell.
   - Full IndexedDB storage (`idb`) preserving hospital directories, emergency profiles, first aid guides, and pending changes.
   - Two-way synchronization queue: actions taken offline are queued in IndexedDB and automatically replayed when connectivity restores.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | React 19, Vite 6, JavaScript |
| **Styling & Design System** | Tailwind CSS v4, Lucide React Icons |
| **Routing** | React Router v6 |
| **Maps & Routing** | Leaflet.js, OpenStreetMap, OSRM Routing Engine |
| **Offline Storage** | Service Workers, Cache API, IndexedDB (`idb`) |
| **Voice & Speech** | Web Speech API (`SpeechRecognition` & `SpeechSynthesis`) |
| **QR Code Engine** | `qrcode.react`, SVG Token Generator |
| **Backend & Database** | Supabase, PostgreSQL, Row Level Security (RLS) |

---

## 📂 Project Directory Structure

```
life-link/
├── public/
│   ├── icon.svg                     # High-contrast emergency healthcare brand mark
│   ├── manifest.json                # PWA manifest
│   └── sw.js                        # Service worker for shell and asset caching
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.jsx           # Global navigation with Emergency CTA
│   │   │   ├── Footer.jsx           # Disclaimers and quick links
│   │   │   ├── DemoBanner.jsx       # 1-click role switcher & simulated offline toggle
│   │   │   ├── OfflineBanner.jsx    # Persistent offline indicator
│   │   │   ├── LanguageSelector.jsx # English, Kannada, Hindi selector
│   │   │   └── StatusBadge.jsx      # Available, Limited, Outdated badges
│   │   ├── emergency/
│   │   │   └── FirstAidGuide.jsx    # Offline first aid CPR and trauma guides
│   │   ├── hospital/
│   │   │   ├── HospitalCard.jsx     # Facility card with distance and bed status
│   │   │   └── HospitalFilters.jsx  # Multi-criteria filter controls
│   │   ├── maps/
│   │   │   └── HospitalMap.jsx      # Interactive Leaflet map with routing
│   │   └── voice/
│   │       └── VoiceAssistantWidget.jsx # Microphone listener & intent parser
│   ├── contexts/
│   │   ├── AuthContext.jsx          # Role management (Public, Admin, Staff)
│   │   ├── LanguageContext.jsx      # Multilingual translation state
│   │   └── OfflineContext.jsx       # Network status, queue tracking & sync
│   ├── i18n/
│   │   └── translations.js          # Full English, Kannada, and Hindi strings
│   ├── pages/                       # 20 Dedicated Functional Pages
│   │   ├── LandingPage.jsx          # Hero, 9 feature cards, 4-step workflow
│   │   ├── HospitalDiscoveryPage.jsx
│   │   ├── HospitalDetailsPage.jsx
│   │   ├── InteractiveHospitalMapPage.jsx
│   │   ├── VoiceAssistantPage.jsx
│   │   ├── EmergencyAssistancePage.jsx
│   │   ├── AuthPage.jsx
│   │   ├── EmergencyProfilePage.jsx
│   │   ├── QRCodeGenerationPage.jsx
│   │   ├── QRScanningPage.jsx
│   │   ├── UnidentifiedPatientPage.jsx
│   │   ├── EmergencyPatientDetailsPage.jsx
│   │   ├── PatientTransferPage.jsx
│   │   ├── FamilyNotificationPage.jsx
│   │   ├── HospitalAdminDashboard.jsx
│   │   ├── BedAvailabilityManagementPage.jsx
│   │   ├── MedicineInventoryManagementPage.jsx
│   │   ├── OfflineStatusPage.jsx
│   │   ├── SettingsPage.jsx
│   │   └── PrivacyHelpPage.jsx
│   ├── services/
│   │   ├── db.js                    # IndexedDB engine using 'idb'
│   │   ├── hospitalService.js       # Hospital data queries and filters
│   │   ├── emergencyPatientService.js # Intakes, transfers, QR tokens
│   │   ├── notificationService.js   # Family alert dispatcher
│   │   ├── mapService.js            # OSRM and offline line estimation
│   │   ├── voiceService.js          # Web Speech recognition and synthesis
│   │   ├── syncService.js           # Replay offline queue to backend
│   │   └── supabaseClient.js        # Supabase client with demo detection
│   ├── utils/
│   │   ├── formatters.js            # Relative time & freshness calculations
│   │   ├── geoUtils.js              # Haversine distance & GPS helpers
│   │   └── syntheticData.js         # Realistic synthetic demo datasets
│   ├── App.jsx                      # App router and providers
│   ├── index.css                    # Tailwind CSS v4 styling rules
│   └── main.jsx                     # Root entrypoint & SW registration
├── supabase/
│   ├── migrations/
│   │   └── 20240101_initial_schema.sql # 11 tables, constraints, indexes & RLS
│   ├── functions/
│   │   ├── notify-family/index.ts   # Edge function for SMS dispatch
│   │   └── verify-qr/index.ts       # Edge function for QR token decryption
│   └── seed.sql                     # Synthetic seed data for PostgreSQL
├── .env.example
├── package.json
└── vite.config.js
```

---

## 🚀 Installation & Local Running

### Prerequisites
- Node.js version 18+ or 20+
- npm version 9+

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

### 3. Production Build
```bash
npm run build
npm run preview
```

---

## 🛡️ Demonstration Mode & Role Switcher

If Supabase environment variables are not configured in `.env`, LIFE-LINK automatically operates in **Active Demonstration Mode**:
- Backed by an in-browser IndexedDB database pre-seeded with realistic synthetic hospitals, bed counts, medicine inventories, and patient records.
- All 20 pages and workflows are fully interactive without requiring external credentials.
- The top header provides an instant **Role Switcher**:
  - `Citizen`: Test public discovery, personal emergency profile creation, and printable QR tokens.
  - `ER Staff`: Test QR camera scanning, unidentified unconscious patient intake (`LL-EMG-1042`), identity verification, and hospital transfers.
  - `Admin`: Test bed capacity reporting and essential medicine inventory updates for *Apex Trauma Institute*.
- **Simulated Data Notice**: All hospitals, contact numbers, and patients are synthetic. In real medical emergencies, always dial **112 / 108**.

---

## 📶 Testing Offline Capabilities

LIFE-LINK provides two easy ways to test offline resilience:

### Method 1: Built-in Software Simulation (No DevTools Required)
1. Click the **"Online"** button on the top demo banner or navigate to `/offline-status`.
2. Click **"Simulate Offline Mode"**.
3. Notice the amber **Offline Banner** appears.
4. Try searching hospitals, viewing hospital details, or reading first-aid guides—all continue to function from IndexedDB.
5. Create a new patient intake or update a bed count—the action is queued in IndexedDB.
6. Click **"Resume Online"**—the application automatically replays the pending queue.

### Method 2: Browser DevTools Simulation
1. Press `F12` in Chrome/Edge and open the **Network** tab.
2. Select **"Offline"** in the throttling dropdown.
3. Refresh the page (`F5`)—the application shell loads instantly from the Service Worker cache.

---

## 🗄️ Supabase Configuration & Production Deployment

To connect LIFE-LINK to a real hosted Supabase project:

1. Create a new project on [Supabase.com](https://supabase.com).
2. Open the Supabase **SQL Editor** and execute:
   - `supabase/migrations/20240101_initial_schema.sql`
   - `supabase/seed.sql`
3. Copy your project credentials into `.env`:
   ```bash
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```
4. Restart the development server (`npm run dev`). The application will now use real-time PostgreSQL database tables and Row Level Security.

### Deploying to Vercel
1. Push the code to GitHub.
2. Import the repository in [Vercel](https://vercel.com).
3. Set the build command to `npm run build` and output directory to `dist`.
4. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as environment variables.
5. Deploy.

---

## ⚖️ Legal & Medical Disclaimer

LIFE-LINK is a clinical navigation and medical record continuity tool. It complements rather than replaces professional emergency medical services, government ambulance dispatchers (112 / 108), or licensed medical practitioners. Data displayed reflects the latest reported availability from participating triage desks and is subject to clinical triage prioritization.
