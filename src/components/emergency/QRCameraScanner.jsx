import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { useLanguage } from '../../contexts/LanguageContext';

export function QRCameraScanner({ onScan }) {
  const { t } = useLanguage();
  const onScanRef = useRef(onScan);
  onScanRef.current = onScan;
  const handledRef = useRef(false);
  const [error, setError] = useState(null);
  const [active, setActive] = useState(false);
  // Keep the latest fallback text without restarting the camera when the language changes.
  const startFailRef = useRef(t('qrcStartFail'));
  startFailRef.current = t('qrcStartFail');

  useEffect(() => {
    const scanner = new Html5Qrcode('qr-camera-region', {
      formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
      experimentalFeatures: { useBarCodeDetectorIfSupported: true },
      verbose: false,
    });
    let started = false;
    let cancelled = false;

    const stopScanner = () =>
      scanner.stop().then(() => scanner.clear()).catch(() => {});

    const timer = setTimeout(() => {
      scanner
        .start(
          { facingMode: 'environment' },
          { fps: 15 }, // no qrbox: scans the full camera frame
          (decodedText) => {
            if (handledRef.current) return;
            handledRef.current = true;
            onScanRef.current(decodedText);
          },
          () => {} // ignore frames with no QR code
        )
        .then(() => {
          started = true;
          setActive(true);
          if (cancelled) stopScanner();
        })
        .catch((err) => {
          setError(typeof err === 'string' ? err : err?.message || startFailRef.current);
        });
    }, 100);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      if (started) stopScanner();
    };
  }, []);

  return (
    <div className="w-full flex flex-col items-center">
      <style>{`#qr-camera-region video { transform: scaleX(-1); }`}</style>
      <div id="qr-camera-region" style={{ width: '100%', maxWidth: 480 }} />
      {active && !error && (
        <p className="text-emerald-300 text-xs mt-2 px-4 text-center">{t('qrcScanning')}</p>
      )}
      {error && (
        <p className="text-rose-400 text-xs mt-2 px-4 text-center">
          {t('qrcErrorPrefix')}: {error}. {t('qrcErrorHelp')}
        </p>
      )}
    </div>
  );
}