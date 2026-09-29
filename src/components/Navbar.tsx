import React, { useState } from 'react';
import {
  Menu,
  X,
  Globe,
  Wifi,
  WifiOff,
  Sparkles,
  Shield,
  FileText,
  FileCheck,
  Landmark,
  User,
  LogOut,
  Sliders,
  CheckCircle2,
  Bell,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PWAInstallButton } from './PWAInstallButton';
import { UserAvatar } from './UserAvatar';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab }) => {
  const {
    language,
    toggleLanguage,
    t,
    userRole,
    currentStudent,
    setDigiLockerModalOpen,
    setBankModalOpen,
    setAssistantOpen,
    setAuthModalOpen,
    setAccountSlideOverOpen,
    setNotificationPanelOpen,
    unreadNotificationsCount,
    isAdminView,
    setIsAdminView,
    isOnline,
    toggleSimulatedOffline,
    logout,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: t('navHome'), icon: Shield },
    { id: 'schemes', label: t('navSchemes'), icon: FileText },
    { id: 'documents', label: t('navDocuments'), icon: FileCheck },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/70 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.03)] backdrop-blur-xl">
      {/* Top Official National Ministry Ribbon with Tri-color hairline */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-slate-900 text-white text-[11px] sm:text-xs py-1.5 px-4 relative overflow-hidden">
        {/* Subtle Ashoka / Saffron ambient glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/20 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2.5">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold tracking-wide text-white/95">{t('ministryHeader')}</span>
            <span className="text-white/30 hidden md:inline">|</span>
            <span className="text-amber-200/90 font-medium hidden md:inline tracking-wider uppercase text-[10px]">
              {t('sihTag')}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Quick Offline Tester Toggle */}
            <button
              onClick={toggleSimulatedOffline}
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold transition-all cursor-pointer ${
                isOnline
                  ? 'bg-white/10 hover:bg-white/20 text-emerald-200 border border-emerald-400/30 shadow-xs'
                  : 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow-xs'
              }`}
              title="Click to toggle offline mode simulation for testing"
            >
              {isOnline ? <Wifi className="w-3 h-3 text-emerald-400" /> : <WifiOff className="w-3 h-3 text-slate-950" />}
              <span>{isOnline ? t('testOfflineToggle') : t('testOnlineToggle')}</span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 hover:bg-white/25 text-white font-medium text-[11px] transition-all active:scale-95 border border-white/20 shadow-xs"
              aria-label="Switch Language"
            >
              <Globe className="w-3 h-3 text-amber-300" />
              <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between gap-4">
        {/* Brand Logo & Stately Identity */}
        <div
          onClick={() => {
            setCurrentTab('dashboard');
            setIsAdminView(false);
          }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-600 to-amber-700 p-0.5 shadow-md shadow-amber-500/20 group-hover:shadow-amber-500/30 group-hover:scale-105 transition-all duration-200">
            <img src="/icon.svg" alt="Kalyan Setu Logo" className="w-full h-full object-contain rounded-[14px]" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight leading-none">
                {t('appName')}
              </span>
              <span className="text-xs font-bold text-amber-600 tracking-tight hidden sm:inline">
                {t('appNameHindiSub')}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium leading-tight mt-1 hidden xs:block">
              {t('portalSub')}
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1.5 bg-slate-100/60 p-1 rounded-xl border border-slate-200/60">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = currentTab === item.id && !isAdminView;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setIsAdminView(false);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  active
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-amber-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="w-[1px] h-4 bg-slate-200 mx-1" />

          {/* Quick Direct Integrations Buttons */}
          <button
            onClick={() => setDigiLockerModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-blue-700 hover:bg-white/60 transition cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5 text-blue-600" />
            <span>{t('navDigiLocker')}</span>
          </button>

          <button
            onClick={() => setBankModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-emerald-700 hover:bg-white/60 transition cursor-pointer"
          >
            <Landmark className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t('navBank')}</span>
          </button>

          {/* Admin Switcher */}
          <button
            onClick={() => setIsAdminView(!isAdminView)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              isAdminView
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-indigo-700 hover:bg-white/60'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{t('navAdmin')}</span>
          </button>
        </nav>

        {/* Right Action Icons: PWA Install + Notifications + Jago Assistant + User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          <PWAInstallButton compact />

          {/* Notification Alerts & Preferences Bell */}
          <button
            onClick={() => setNotificationPanelOpen(true)}
            className="relative p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition-all active:scale-95 cursor-pointer border border-transparent hover:border-slate-200/80"
            title={t('notificationPanelTitle')}
            aria-label="Notification Settings"
          >
            <Bell className="w-4 h-4 text-slate-700" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
            )}
          </button>

          {/* Jago Chatbot Trigger */}
          <button
            onClick={() => setAssistantOpen(true)}
            className="btn-elite-primary inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">{t('navAssistant')}</span>
          </button>

          {/* User Avatar Component displaying Student Initials & Opening Account Management Drawer */}
          {currentStudent ? (
            <div className="pl-1 sm:pl-2 border-l border-slate-200">
              <UserAvatar showName />
            </div>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
            >
              <User className="w-3.5 h-3.5" />
              <span>{t('login')}</span>
            </button>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-2 shadow-lg animate-in slide-in-from-top-2">
          {/* Quick Account Management Access on Mobile */}
          {currentStudent && (
            <button
              onClick={() => {
                setAccountSlideOverOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-left transition active:scale-95"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-amber-600 text-white flex items-center justify-center font-extrabold text-xs shadow-xs">
                  {currentStudent.name.charAt(0)}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 leading-tight">
                    {language === 'hi' && currentStudent.nameHi ? currentStudent.nameHi : currentStudent.name}
                  </div>
                  <div className="text-[10px] text-amber-900 font-semibold leading-tight">
                    {language === 'hi' ? 'खाता प्रबंधन (Account Management)' : 'Manage Account & Credentials'}
                  </div>
                </div>
              </div>
              <span className="text-xs font-bold text-amber-700">Open →</span>
            </button>
          )}
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = currentTab === item.id && !isAdminView;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setIsAdminView(false);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-left ${
                  active ? 'bg-amber-50 text-amber-900 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4 text-amber-600" />
                <span>{item.label}</span>
              </button>
            );
          })}

          <button
            onClick={() => {
              setDigiLockerModalOpen(true);
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            <Shield className="w-4 h-4 text-blue-600" />
            <span>{t('navDigiLocker')}</span>
          </button>

          <button
            onClick={() => {
              setBankModalOpen(true);
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            <Landmark className="w-4 h-4 text-emerald-600" />
            <span>{t('navBank')}</span>
          </button>

          <button
            onClick={() => {
              setIsAdminView(!isAdminView);
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-indigo-800 bg-indigo-50/70"
          >
            <Sliders className="w-4 h-4 text-indigo-600" />
            <span>{t('navAdmin')}</span>
          </button>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              {currentStudent?.subTribe} ST · {currentStudent?.state}
            </span>
            <button onClick={toggleLanguage} className="font-semibold text-amber-600">
              {language === 'en' ? 'हिन्दी में बदलें' : 'Switch to English'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
