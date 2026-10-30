import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { OfflineProvider } from './contexts/OfflineContext';

// Common Components
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { OfflineBanner } from './components/common/OfflineBanner';
import { RequireAuth } from './components/common/RequireAuth';

// Pages
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
import ResetPasswordPage from './pages/ResetPasswordPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import { RoleSelectPage } from './pages/RoleSelectPage';
import { RoleLoginPage } from './pages/RoleLoginPage';


export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <OfflineProvider>
          <BrowserRouter>
            <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-teal-500 selection:text-white">
              {/* The old <DemoBanner /> role switcher is removed: roles now come from the sign-in page. */}
              <OfflineBanner />
              <Navbar />

              <main className="flex-1">
                <Routes>
                  {/* Public */}
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />
                  <Route path="/privacy-help" element={<PrivacyHelpPage />} />

                  {/* Any signed-in user */}
                  <Route element={<RequireAuth />}>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/select-role" element={<RoleSelectPage />} />
                    <Route path="/login/:role" element={<RoleLoginPage />} />
                    <Route path="/hospitals" element={<HospitalDiscoveryPage />} />
                    <Route path="/hospitals/:id" element={<HospitalDetailsPage />} />
                    <Route path="/map" element={<InteractiveHospitalMapPage />} />
                    <Route path="/voice-assistant" element={<VoiceAssistantPage />} />
                    <Route path="/emergency" element={<EmergencyAssistancePage />} />
                    <Route path="/offline-status" element={<OfflineStatusPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/change-password" element={<ChangePasswordPage />} />
                  </Route>

                  {/* Citizen only */}
                  <Route element={<RequireAuth roles={['citizen']} />}>
                    <Route path="/profile" element={<EmergencyProfilePage />} />
                    <Route path="/profile/qr" element={<QRCodeGenerationPage />} />
                  </Route>

                  {/* ER staff only */}
                  <Route element={<RequireAuth roles={['staff']} />}>
                    <Route path="/staff/scan" element={<QRScanningPage />} />
                    <Route path="/staff/unidentified-patient" element={<UnidentifiedPatientPage />} />
                    <Route path="/patients/:id" element={<EmergencyPatientDetailsPage />} />
                    <Route path="/patients/:id/transfer" element={<PatientTransferPage />} />
                    <Route path="/patients/:id/family-contact" element={<FamilyNotificationPage />} />
                  </Route>

                  {/* Hospital admin only */}
                  <Route element={<RequireAuth roles={['admin']} />}>
                    <Route path="/admin" element={<HospitalAdminDashboard />} />
                    <Route path="/admin/beds" element={<BedAvailabilityManagementPage />} />
                    <Route path="/admin/medicines" element={<MedicineInventoryManagementPage />} />
                  </Route>

                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>

              <Footer />
            </div>
          </BrowserRouter>
        </OfflineProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}