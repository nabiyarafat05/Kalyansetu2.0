import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  Filter,
  ShieldCheck,
  CheckCircle2,
  Landmark,
  FileText,
  AlertCircle,
  HelpCircle,
  PhoneCall,
  Clock,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { OfflineBanner } from './components/OfflineBanner';
import { DropoutRiskWidget } from './components/DropoutRiskWidget';
import { SchemeCard } from './components/SchemeCard';
import { DisbursementTimeline } from './components/DisbursementTimeline';
import { DigiLockerModal } from './components/DigiLockerModal';
import { BankVerificationModal } from './components/BankVerificationModal';
import { ApplicationWizardModal } from './components/ApplicationWizardModal';
import { JagoAssistantDrawer } from './components/JagoAssistantDrawer';
import { AdminPortal } from './components/AdminPortal';
import { AuthModal } from './components/AuthModal';
import { DocumentAuditTrail } from './components/DocumentAuditTrail';
import { NotificationSettingsModal } from './components/NotificationSettingsModal';
import { AccountSlideOver } from './components/AccountSlideOver';
import { SchemeCategory } from './types';

function MainContent() {
  const {
    currentStudent,
    schemes,
    applications,
    isAdminView,
    setDigiLockerModalOpen,
    setBankModalOpen,
    setAssistantOpen,
    openWizardWithScheme,
    notification,
    t,
    language,
  } = useApp();

  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [selectedCategory, setSelectedCategory] = useState<SchemeCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Categories for filter tabs
  const categories: { id: SchemeCategory; label: string; labelHi: string }[] = [
    { id: 'all', label: t('allSchemes'), labelHi: 'सभी योजनाएं' },
    { id: 'post-matric', label: t('postMatric'), labelHi: 'पोस्ट-मैट्रिक' },
    { id: 'pre-matric', label: t('preMatric'), labelHi: 'प्री-मैट्रिक' },
    { id: 'overseas', label: t('overseas'), labelHi: 'विदेश अध्ययन (NOS)' },
    { id: 'fellowship', label: t('fellowship'), labelHi: 'फैलोशिप' },
    { id: 'skill', label: t('skillVocational'), labelHi: 'कौशल एवं PVTG' },
    { id: 'higher-education', label: t('higherEd'), labelHi: 'शीर्ष संस्थान' },
  ];

  // Filtering schemes
  const filteredSchemes = schemes.filter((s) => {
    if (selectedCategory !== 'all' && s.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.nameHi.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Proactive match schemes for tribal students
  const proactiveMatchScheme = schemes.find((s) => s.id === 'scheme-post-matric') || schemes[0];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-amber-100 selection:text-amber-900">
      {/* Toast Notification Banner */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl text-xs font-bold backdrop-blur-xl border animate-in slide-in-from-top-3 ${
            notification.type === 'success'
              ? 'bg-emerald-600/95 text-white border-emerald-400/40 shadow-emerald-600/20'
              : notification.type === 'error'
              ? 'bg-rose-600/95 text-white border-rose-400/40 shadow-rose-600/20'
              : 'bg-slate-900/95 text-white border-slate-700/50 shadow-slate-950/20'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-200" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-200" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Persistent Offline Banner */}
      <OfflineBanner />

      {/* Navigation */}
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {isAdminView ? (
          <AdminPortal />
        ) : currentTab === 'documents' ? (
          <DocumentAuditTrail />
        ) : currentTab === 'schemes' ? (
          /* Full Schemes Catalog Tab */
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  {language === 'hi' ? 'जनजातीय छात्रवृत्ति योजनाएं' : 'Tribal Scholarship Schemes'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  {language === 'hi'
                    ? 'सभी केंद्रीय एवं राज्य स्तरीय छात्रवृत्तियां — 100% डीबीटी गारंटी'
                    : 'All central and state tribal scholarships with guaranteed Aadhaar DBT'}
                </p>
              </div>

              {/* Search */}
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('searchPlaceholder')}
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200/90 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 shadow-2xs transition-all"
                />
              </div>
            </div>

            {/* Filter Tabs (Zero-pill compliant segmented control) */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none bg-slate-100/70 p-1.5 rounded-2xl border border-slate-200/60">
              {categories.map((cat) => {
                const active = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`whitespace-nowrap px-4 py-1.5 text-xs font-semibold rounded-xl transition-all duration-200 cursor-pointer ${
                      active
                        ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                    }`}
                  >
                    {language === 'hi' ? cat.labelHi : cat.label}
                  </button>
                );
              })}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {filteredSchemes.map((scheme) => (
                <SchemeCard key={scheme.id} scheme={scheme} />
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Student Hero & Stately Credential Banner */}
            {currentStudent && (
              <div className="glass-panel rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-slate-200/80 bg-gradient-to-br from-white via-amber-50/25 to-white shadow-xs relative overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] uppercase font-bold tracking-wider text-amber-800">
                        {t('welcomeBack')}
                      </span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="text-xs font-medium text-slate-500">
                        {currentStudent.subTribe} {currentStudent.category} ({currentStudent.district}, {currentStudent.state})
                      </span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="text-xs text-slate-400 font-medium">
                        {currentStudent.institution}
                      </span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                      {language === 'hi' && currentStudent.nameHi ? currentStudent.nameHi : currentStudent.name}
                    </h1>

                    <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                      {t('tribalEmpowerment')}
                    </p>
                  </div>

                  {/* Verification Status Badges */}
                  <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                    <button
                      onClick={() => setDigiLockerModalOpen(true)}
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-blue-900 bg-blue-50/90 border border-blue-200 hover:bg-blue-100/80 transition active:scale-95 shadow-2xs cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4 text-blue-600" />
                      <span>{t('verifiedBadge')}</span>
                    </button>

                    <button
                      onClick={() => setBankModalOpen(true)}
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-900 bg-emerald-50/90 border border-emerald-200 hover:bg-emerald-100/80 transition active:scale-95 shadow-2xs cursor-pointer"
                    >
                      <Landmark className="w-4 h-4 text-emerald-600" />
                      <span>{t('aadhaarSeededBadge')}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* AI Dropout Risk Predictor Widget (Flagship Component 1) */}
            <DropoutRiskWidget />

            {/* Proactive Scheme Matching Banner */}
            {proactiveMatchScheme && (
              <div className="glass-panel rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-emerald-200 bg-gradient-to-r from-emerald-50/60 via-white to-amber-50/40 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="p-1 rounded-lg bg-emerald-100 text-emerald-700">
                        <Sparkles className="w-4 h-4" />
                      </span>
                      <h3 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
                        {t('proactiveMatchTitle')}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-600">
                      {t('proactiveMatchSub')}
                    </p>
                    <div className="text-xs font-semibold text-emerald-800 pt-1 flex items-center gap-1.5">
                      <span>👉</span>
                      <span>{language === 'hi' && proactiveMatchScheme.nameHi ? proactiveMatchScheme.nameHi : proactiveMatchScheme.name}</span>
                      <span aria-hidden="true" className="text-emerald-400">·</span>
                      <span className="font-mono tabular-nums font-bold text-emerald-900">{proactiveMatchScheme.amount}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => openWizardWithScheme(proactiveMatchScheme)}
                    className="btn-elite-primary px-4 py-2.5 text-xs font-bold rounded-xl flex items-center gap-2 shrink-0 self-start sm:self-center cursor-pointer"
                  >
                    <span>{t('oneTapApply')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Active Applications Section */}
            {applications.length > 0 && (
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                    {t('myApplications')}
                  </h3>
                  <span className="text-xs text-slate-500 font-mono font-semibold">
                    {applications.length} Active {applications.length === 1 ? 'Grant' : 'Grants'}
                  </span>
                </div>

                <div className="space-y-3">
                  {applications.map((app) => (
                    <DisbursementTimeline key={app.id} application={app} />
                  ))}
                </div>
              </div>
            )}

            {/* Explore Schemes Catalog Section */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                    {language === 'hi' ? 'जनजातीय छात्रवृत्ति योजनाएं' : 'Tribal Scholarship Schemes'}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {language === 'hi'
                      ? 'प्री-मैट्रिक, पोस्ट-मैट्रिक, राष्ट्रीय ओवरसीज एवं उच्च शिक्षा हेतु केंद्रीय अनुदान'
                      : 'Centrally sponsored schemes with 100% DBT Aadhaar payment guarantee'}
                  </p>
                </div>

                {/* Live Search */}
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('searchPlaceholder')}
                    className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 shadow-2xs"
                  />
                </div>
              </div>

              {/* Functional Category Filter Tabs (Zero-pill compliant segmented control) */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none bg-slate-100/70 p-1.5 rounded-2xl border border-slate-200/60">
                {categories.map((cat) => {
                  const active = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`whitespace-nowrap px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all duration-200 cursor-pointer ${
                        active
                          ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                      }`}
                    >
                      {language === 'hi' ? cat.labelHi : cat.label}
                    </button>
                  );
                })}
              </div>

              {/* Responsive Grid of Schemes */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {filteredSchemes.map((scheme) => (
                  <SchemeCard key={scheme.id} scheme={scheme} />
                ))}
              </div>

              {filteredSchemes.length === 0 && (
                <div className="py-12 text-center glass-panel rounded-2xl p-8 border border-slate-200">
                  <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-700">
                    {language === 'hi' ? 'कोई योजना नहीं मिली।' : 'No scholarships match your search query.'}
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setSearchQuery('');
                    }}
                    className="mt-3 px-4 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50 rounded-lg hover:bg-amber-100"
                  >
                    {language === 'hi' ? 'सभी योजनाएं देखें' : 'View All Schemes'}
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Floating Jago Assistant Voice Button for Quick Access on Mobile */}
      <button
        onClick={() => setAssistantOpen(true)}
        className="fixed bottom-6 right-6 z-30 p-4 rounded-full bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 hover:scale-105 transition-all duration-200 active:scale-95 flex items-center justify-center cursor-pointer group"
        aria-label="Open Jago Assistant"
      >
        <Sparkles className="w-6 h-6 animate-pulse" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 text-xs font-bold pl-0 group-hover:pl-2.5">
          {language === 'hi' ? 'जागो सहायक' : 'Jago AI Assistant'}
        </span>
      </button>

      {/* Global Modals & Drawers */}
      <DigiLockerModal />
      <BankVerificationModal />
      <ApplicationWizardModal />
      <JagoAssistantDrawer />
      <AuthModal />
      <NotificationSettingsModal />
      <AccountSlideOver />

      {/* Footer */}
      <footer className="mt-12 bg-white border-t border-slate-200 text-xs text-slate-500 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="font-bold text-slate-800">{t('appName')}</span>
              <span>·</span>
              <span>{t('sihTag')}</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Ministry of Tribal Affairs · National Scholarship Portal (NSP) · Public Financial Management System (PFMS)
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-slate-600">
              <PhoneCall className="w-3.5 h-3.5 text-amber-600" />
              Toll-Free Helpline: 1800-11-7777
            </span>
            <span>·</span>
            <span className="text-emerald-700 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              API Setu & NPCI Certified
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
