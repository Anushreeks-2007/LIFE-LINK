import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import {
  Activity,
  PhoneCall,
  Search,
  Mic,
  MapPin,
  Bed,
  Pill,
  QrCode,
  Users,
  FileText,
  WifiOff,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
  Clock,
  HeartPulse,
  ArrowRight
} from 'lucide-react';

export function LandingPage() {
  const { t } = useLanguage();

  const featureCards = [
    {
      icon: <Mic className="w-6 h-6 text-teal-600" />,
      title: t('featVoiceTitle'),
      desc: t('featVoiceDesc'),
      link: '/voice-assistant',
      cta: t('land_c1'),
    },
    {
      icon: <Search className="w-6 h-6 text-teal-600" />,
      title: t('featHospitalsTitle'),
      desc: t('featHospitalsDesc'),
      link: '/hospitals',
      cta: t('land_c2'),
    },
    {
      icon: <Bed className="w-6 h-6 text-teal-600" />,
      title: t('featBedsTitle'),
      desc: t('featBedsDesc'),
      link: '/hospitals',
      cta: t('land_c3'),
    },
    {
      icon: <Pill className="w-6 h-6 text-teal-600" />,
      title: t('featMedicinesTitle'),
      desc: t('featMedicinesDesc'),
      link: '/hospitals',
      cta: t('land_c4'),
    },
    {
      icon: <MapPin className="w-6 h-6 text-teal-600" />,
      title: t('featMapsTitle'),
      desc: t('featMapsDesc'),
      link: '/map',
      cta: t('land_c5'),
    },
    {
      icon: <QrCode className="w-6 h-6 text-teal-600" />,
      title: t('featPatientIdTitle'),
      desc: t('featPatientIdDesc'),
      link: '/profile/qr',
      cta: t('land_c6'),
    },
    {
      icon: <Users className="w-6 h-6 text-teal-600" />,
      title: t('featFamilyTitle'),
      desc: t('featFamilyDesc'),
      link: '/patients/pat-emg-1042/family-contact',
      cta: t('land_c7'),
    },
    {
      icon: <FileText className="w-6 h-6 text-teal-600" />,
      title: t('featTransferTitle'),
      desc: t('featTransferDesc'),
      link: '/patients/pat-emg-1042',
      cta: t('land_c8'),
    },
    {
      icon: <WifiOff className="w-6 h-6 text-teal-600" />,
      title: t('featOfflineTitle'),
      desc: t('featOfflineDesc'),
      link: '/offline-status',
      cta: t('land_c9'),
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-50/60 via-white to-slate-50 pt-12 pb-16 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 bg-teal-100/80 border border-teal-300 text-teal-900 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide">
              <Activity className="w-4 h-4 text-teal-700 stroke-[2.5]" />
              <span>LIFE-LINK — {t('tagline')}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              {t('heroTitle')}
            </h1>

            {/* Supporting Copy */}
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto">
              {t('heroSubtitle')}
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
              <Link
                to="/hospitals"
                className="inline-flex items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm px-6 py-3.5 rounded-2xl shadow-lg shadow-teal-700/20 hover:shadow-teal-700/30 transition transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Search className="w-4 h-4" />
                {t('btnFindHospital')}
              </Link>

              <Link
                to="/emergency"
                className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm px-6 py-3.5 rounded-2xl shadow-lg shadow-rose-600/20 hover:shadow-rose-600/30 emergency-pulse transition transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <PhoneCall className="w-4 h-4" />
                {t('btnEmergencyAssistance')}
              </Link>

              <a
                href="#features"
                className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm px-5 py-3.5 rounded-2xl border border-slate-300 shadow-sm transition"
              >
                {t('btnExploreFeatures')}
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>

            {/* Trust Highlights */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> English • ಕನ್ನಡ • हिन्दी
              </span>
              <span className="flex items-center gap-1.5">
                <WifiOff className="w-4 h-4 text-amber-600" /> {t('land_t1')}
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-600" /> {t('land_t2')}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-extrabold uppercase tracking-widest text-teal-700 block mb-2">
            {t('land_f0')}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t('land_f1')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            {t('land_f2')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureCards.map((feat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center mb-4 group-hover:scale-105 transition">
                  {feat.icon}
                </div>
                <h3 className="font-extrabold text-base text-slate-900 mb-2">
                  {feat.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal mb-6">
                  {feat.desc}
                </p>
              </div>

              <Link
                to={feat.link}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-900 group-hover:translate-x-1 transition"
              >
                <span>{feat.cta}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 4-Step Process Section */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-extrabold uppercase tracking-widest text-teal-400 block mb-2">
              {t('land_w')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {t('howItWorksTitle')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-slate-800/60 border border-slate-700/60 p-6 rounded-3xl relative">
              <span className="text-3xl font-black text-teal-400/30 absolute top-4 right-4">01</span>
              <h3 className="font-bold text-base text-white mb-2">{t('step1Title')}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{t('step1Desc')}</p>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 p-6 rounded-3xl relative">
              <span className="text-3xl font-black text-teal-400/30 absolute top-4 right-4">02</span>
              <h3 className="font-bold text-base text-white mb-2">{t('step2Title')}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{t('step2Desc')}</p>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 p-6 rounded-3xl relative">
              <span className="text-3xl font-black text-teal-400/30 absolute top-4 right-4">03</span>
              <h3 className="font-bold text-base text-white mb-2">{t('step3Title')}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{t('step3Desc')}</p>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 p-6 rounded-3xl relative">
              <span className="text-3xl font-black text-teal-400/30 absolute top-4 right-4">04</span>
              <h3 className="font-bold text-base text-white mb-2">{t('step4Title')}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{t('step4Desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why LIFE-LINK Matters & How Offline Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Why it matters */}
          <div className="bg-gradient-to-br from-teal-800 to-teal-950 text-white rounded-3xl p-8 sm:p-10 shadow-lg">
            <span className="text-xs font-extrabold uppercase tracking-widest text-teal-300 block mb-3">
              {t('land_r1')}
            </span>
            <h3 className="text-2xl font-black text-white mb-4 leading-tight">
              {t('land_r2')}
            </h3>
            <p className="text-xs sm:text-sm text-teal-100 leading-relaxed mb-6 font-normal">
              {t('land_r3')}
            </p>
            <div className="space-y-3 text-xs text-teal-50">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-300 shrink-0" />
                <span>{t('land_b1')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-300 shrink-0" />
                <span>{t('land_b2')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-300 shrink-0" />
                <span>{t('land_b3')}</span>
              </div>
            </div>
          </div>

          {/* How Offline Works */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-sm">
            <div className="flex items-center gap-2 text-teal-700 font-extrabold text-xs uppercase tracking-wider mb-3">
              <WifiOff className="w-4 h-4" />
              <span>{t('land_o1')}</span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-4 leading-tight">
              {t('land_o2')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
              {t('land_o3')}
            </p>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                <h4 className="font-bold text-slate-900 mb-1">{t('land_s1t')}</h4>
                <p className="text-slate-600">{t('land_s1')}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                <h4 className="font-bold text-slate-900 mb-1">{t('land_s2t')}</h4>
                <p className="text-slate-600">{t('land_s2')}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                <h4 className="font-bold text-slate-900 mb-1">{t('land_s3t')}</h4>
                <p className="text-slate-600">{t('land_s3')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Prominent Medical Disclaimer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-rose-700 font-black text-xs uppercase tracking-wider flex items-center gap-1.5">
              <HeartPulse className="w-4 h-4 text-rose-600" /> {t('land_adv')}
            </span>
            <p className="text-xs sm:text-sm text-rose-950 font-medium leading-relaxed max-w-2xl">
              {t('emergencyDisclaimer')}
            </p>
          </div>

          <Link
            to="/emergency"
            className="shrink-0 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs px-5 py-3 rounded-2xl transition shadow-md shadow-rose-600/30"
          >
            {t('land_dial')}
          </Link>
        </div>
      </section>
    </div>
  );
}
