import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { OfflineProvider } from './contexts/OfflineContext';

// Common Components
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { DemoBanner } from './components/common/DemoBanner';
import { OfflineBanner } from './components/common/OfflineBanner';

// 20 Required Pages
import { LandingPage } from './pages/LandingPage';
import { HospitalDiscoveryPage } from './pages/HospitalDiscoveryPage';
import { HospitalDetailsPage } from './pages/HospitalDetailsPage';
import { InteractiveHospitalMapPage } from './pages/InteractiveHospitalMapPage';
import { VoiceAssistantPage } from './pages/VoiceAssistantPage';
import { EmergencyAssistancePage } from './pages/EmergencyAssistancePage';
import { AuthPage } from './pages/AuthPage';
import { EmergencyProfilePage } from './pages/EmergencyProfilePage';
import { QRCodeGenerationPage } from './pages/QRCodeGenerationPage';
import { QRScanningPage } from './pages/QRScanningPage';
import { UnidentifiedPatientPage } from './pages/UnidentifiedPatientPage';
import { EmergencyPatientDetailsPage } from './pages/EmergencyPatientDetailsPage';
import { PatientTransferPage } from './pages/PatientTransferPage';
import { FamilyNotificationPage } from './pages/FamilyNotificationPage';
import { HospitalAdminDashboard } from './pages/HospitalAdminDashboard';
import { BedAvailabilityManagementPage } from './pages/BedAvailabilityManagementPage';
import { MedicineInventoryManagementPage } from './pages/MedicineInventoryManagementPage';
import { OfflineStatusPage } from './pages/OfflineStatusPage';
import { SettingsPage } from './pages/SettingsPage';
import { PrivacyHelpPage } from './pages/PrivacyHelpPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';

export function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <OfflineProvider>
          <BrowserRouter>
            <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-teal-500 selection:text-white">
              {/* Demonstration Top Banner */}
              <DemoBanner />

              {/* Dynamic Offline / Cached Data Banner */}
              <OfflineBanner />

              {/* Responsive Header Navigation */}
              <Navbar />

              {/* Main Content Viewport */}
              <main className="flex-1">
                <Routes>
                  {/* Public & Discovery */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/hospitals" element={<HospitalDiscoveryPage />} />
                  <Route path="/hospitals/:id" element={<HospitalDetailsPage />} />
                  <Route path="/map" element={<InteractiveHospitalMapPage />} />
                  <Route path="/voice-assistant" element={<VoiceAssistantPage />} />
                  <Route path="/emergency" element={<EmergencyAssistancePage />} />
                  
                  {/* Authentication & User Profile */}
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/profile" element={<EmergencyProfilePage />} />
                  <Route path="/profile/qr" element={<QRCodeGenerationPage />} />

                  {/* Clinical Emergency Staff Workflows */}
                  <Route path="/staff/scan" element={<QRScanningPage />} />
                  <Route path="/staff/unidentified-patient" element={<UnidentifiedPatientPage />} />
                  <Route path="/patients/:id" element={<EmergencyPatientDetailsPage />} />
                  <Route path="/patients/:id/transfer" element={<PatientTransferPage />} />
                  <Route path="/patients/:id/family-contact" element={<FamilyNotificationPage />} />

                  {/* Hospital Administration */}
                  <Route path="/admin" element={<HospitalAdminDashboard />} />
                  <Route path="/admin/beds" element={<BedAvailabilityManagementPage />} />
                  <Route path="/admin/medicines" element={<MedicineInventoryManagementPage />} />

                  {/* Offline, Preferences & Privacy */}
                  <Route path="/offline-status" element={<OfflineStatusPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/privacy-help" element={<PrivacyHelpPage />} />

                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />

                  {/* Fallback to Home */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>

              {/* Global Footer */}
              <Footer />
            </div>
          </BrowserRouter>
        </OfflineProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
