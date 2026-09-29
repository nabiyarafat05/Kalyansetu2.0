import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  ShieldCheck,
  Landmark,
  FileText,
  Phone,
  Mail,
  GraduationCap,
  Calendar,
  CheckCircle2,
  Copy,
  Check,
  LogOut,
  RefreshCw,
  Bell,
  Sliders,
  Globe,
  Database,
  ArrowRight,
  ExternalLink,
  Save,
  Users,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StudentProfile } from '../types';

// Pre-seeded tribal scholar profiles for Smart India Hackathon demo switching
const DEMO_TRIBAL_STUDENTS: StudentProfile[] = [
  {
    id: 'stu-santhal-01',
    name: 'Ramesh Soren',
    nameHi: 'रमेश सोरेन',
    mobile: '9876543210',
    email: 'ramesh.soren@dumka.ac.in',
    category: 'ST',
    subTribe: 'Santhal',
    state: 'Jharkhand',
    district: 'Dumka',
    institution: 'Sido Kanhu Murmu University, Dumka',
    course: 'B.Sc. Computer Science (2nd Year)',
    academicYear: '2025-2026',
    attendancePercentage: 68,
    familyAnnualIncome: 120000,
    academicScorePercentage: 78.4,
    isDigiLockerLinked: true,
    isBankVerified: true,
    bankAccountMasked: '••••4821',
    bankName: 'State Bank of India',
    ifscCode: 'SBIN0001234',
    aadhaarSeeded: true,
  },
  {
    id: 'stu-pvtg-02',
    name: 'Sunita Birhor',
    nameHi: 'सुनीता बिरहोर',
    mobile: '9812345678',
    email: 'sunita.birhor@ranchiuniv.ac.in',
    category: 'PVTG (Birhor)',
    subTribe: 'Birhor',
    state: 'Jharkhand',
    district: 'Ranchi',
    institution: 'Ranchi University, Ranchi',
    course: 'M.A. Tribal Studies & Linguistics',
    academicYear: '2025-2026',
    attendancePercentage: 92,
    familyAnnualIncome: 65000,
    academicScorePercentage: 86.2,
    isDigiLockerLinked: true,
    isBankVerified: true,
    bankAccountMasked: '••••9124',
    bankName: 'Bank of India',
    ifscCode: 'BKID0004521',
    aadhaarSeeded: true,
  },
  {
    id: 'stu-munda-03',
    name: 'Amit Munda',
    nameHi: 'अमित मुंडा',
    mobile: '9765432190',
    email: 'amit.munda@khuntischool.edu.in',
    category: 'ST',
    subTribe: 'Munda',
    state: 'Jharkhand',
    district: 'Khunti',
    institution: 'Birsa Munda Model High School, Khunti',
    course: 'Class 10 (Secondary Board)',
    academicYear: '2025-2026',
    attendancePercentage: 81,
    familyAnnualIncome: 95000,
    academicScorePercentage: 82.5,
    isDigiLockerLinked: true,
    isBankVerified: true,
    bankAccountMasked: '••••3319',
    bankName: 'Jharkhand Rajya Gramin Bank',
    ifscCode: 'JRGB0001102',
    aadhaarSeeded: true,
  },
];

export const AccountSlideOver: React.FC = () => {
  const {
    currentStudent,
    isAccountSlideOverOpen,
    setAccountSlideOverOpen,
    updateStudentProfile,
    switchStudentProfile,
    setDigiLockerModalOpen,
    setBankModalOpen,
    setNotificationPanelOpen,
    setIsAdminView,
    toggleLanguage,
    syncPendingData,
    logout,
    digiLockerDocs,
    schemes,
    applications,
    language,
    isOnline,
    t,
  } = useApp();

  // Form states for editing contact info
  const [isEditing, setIsEditing] = useState(false);
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [copiedId, setCopiedId] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    if (currentStudent) {
      setMobile(currentStudent.mobile);
      setEmail(currentStudent.email);
    }
  }, [currentStudent]);

  // Handle ESC key to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAccountSlideOverOpen) {
        setAccountSlideOverOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAccountSlideOverOpen, setAccountSlideOverOpen]);

  if (!isAccountSlideOverOpen || !currentStudent) return null;

  const getInitials = (name: string): string => {
    if (!name) return 'ST';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const handleCopyId = () => {
    const idToCopy = `MOTA-ST-${currentStudent.district.toUpperCase()}-${currentStudent.mobile.slice(-4)}`;
    navigator.clipboard?.writeText(idToCopy);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudentProfile({
      mobile,
      email,
    });
    setIsEditing(false);
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      await syncPendingData();
    } finally {
      setIsSyncing(false);
    }
  };

  const beneficiaryId = `MOTA-ST-${currentStudent.district.toUpperCase()}-${currentStudent.mobile.slice(-4)}`;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop with subtle blur */}
      <div
        onClick={() => setAccountSlideOverOpen(false)}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        aria-hidden="true"
      />

      {/* Slide-over Drawer Container */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-slate-200/80 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="px-6 py-5 bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white flex items-center justify-between shrink-0 shadow-xs relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-400/20 via-transparent to-transparent pointer-events-none" />

            <div className="relative z-10 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white border border-white/30 shadow-xs">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base sm:text-lg leading-tight tracking-tight">
                  {language === 'hi' ? 'लाभार्थी खाता प्रबंधन' : 'Beneficiary Account'}
                </h3>
                <p className="text-[11px] text-amber-200/90 font-medium leading-tight">
                  Ministry of Tribal Affairs · Verified Citizen Profile
                </p>
              </div>
            </div>

            <button
              onClick={() => setAccountSlideOverOpen(false)}
              className="relative z-10 p-2 text-white/80 hover:text-white rounded-xl hover:bg-white/10 transition active:scale-95 cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="p-6 space-y-6 flex-1">
            {/* Beneficiary Identity Hero Card */}
            <div className="p-5 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-amber-50/50 via-white to-amber-50/30 border border-amber-200/80 shadow-xs space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  {/* Large Avatar Initials */}
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-600 to-amber-700 text-white flex items-center justify-center font-extrabold text-xl shadow-md shadow-amber-500/20 border-2 border-white">
                    {getInitials(currentStudent.name)}
                  </div>

                  <div>
                    <h4 className="font-extrabold text-lg text-slate-900 tracking-tight leading-tight">
                      {language === 'hi' && currentStudent.nameHi ? currentStudent.nameHi : currentStudent.name}
                    </h4>
                    <p className="text-xs text-amber-900 font-bold mt-0.5">
                      {currentStudent.subTribe} {currentStudent.category}
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {currentStudent.district}, {currentStudent.state}
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg shadow-2xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verified</span>
                </span>
              </div>

              {/* Beneficiary ID Strip with 1-Click Copy */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">
                    Scholar Beneficiary ID
                  </span>
                  <span className="font-mono font-bold text-slate-800 text-xs">
                    {beneficiaryId}
                  </span>
                </div>

                <button
                  onClick={handleCopyId}
                  className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition active:scale-95 cursor-pointer border border-slate-200/60"
                  title="Copy Beneficiary ID"
                >
                  {copiedId ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-slate-500" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Institution & Course */}
              <div className="pt-2 text-xs text-slate-600 space-y-1">
                <div className="flex items-center gap-1.5 font-medium text-slate-700">
                  <GraduationCap className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span className="truncate">{currentStudent.institution}</span>
                </div>
                <div className="flex items-center gap-2 pl-5 text-[11px] text-slate-500">
                  <span>{currentStudent.course}</span>
                  <span>·</span>
                  <span className="font-mono">{currentStudent.academicYear}</span>
                </div>
              </div>
            </div>

            {/* National Vault Credentials Overview */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                {language === 'hi' ? 'सत्यापित राष्ट्रीय पहचान एवं डीबीटी' : 'Verified Credentials & DBT Vault'}
              </span>

              <div className="grid grid-cols-2 gap-2.5">
                {/* DigiLocker Vault */}
                <div
                  onClick={() => {
                    setAccountSlideOverOpen(false);
                    setDigiLockerModalOpen(true);
                  }}
                  className="p-3 rounded-2xl bg-blue-50/70 border border-blue-200/80 hover:bg-blue-100/70 transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <ExternalLink className="w-3 h-3 text-blue-400 group-hover:text-blue-600" />
                  </div>
                  <div className="font-bold text-xs text-blue-950 mt-1.5">DigiLocker Vault</div>
                  <div className="text-[11px] text-blue-700 font-medium">
                    {digiLockerDocs.length} Certificates Verified
                  </div>
                </div>

                {/* PFMS Bank Account */}
                <div
                  onClick={() => {
                    setAccountSlideOverOpen(false);
                    setBankModalOpen(true);
                  }}
                  className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 hover:bg-emerald-100/70 transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <Landmark className="w-4 h-4 text-emerald-600" />
                    <ExternalLink className="w-3 h-3 text-emerald-400 group-hover:text-emerald-600" />
                  </div>
                  <div className="font-bold text-xs text-emerald-950 mt-1.5">PFMS Bank DBT</div>
                  <div className="text-[11px] text-emerald-700 font-medium font-mono">
                    SBI {currentStudent.bankAccountMasked || '••••4821'}
                  </div>
                </div>
              </div>
            </div>

            {/* Editable Contact Info */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">
                  {language === 'hi' ? 'संपर्क विवरण' : 'Contact Information'}
                </span>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-xs font-bold text-amber-700 hover:text-amber-800 cursor-pointer"
                  >
                    {language === 'hi' ? 'संपादित करें' : 'Edit'}
                  </button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleSaveContact} className="space-y-3 text-xs">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      {language === 'hi' ? 'मोबाइल नंबर (SMS अलर्ट हेतु)' : 'Mobile (SMS Alerts)'}
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="tel"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-xs font-mono font-semibold"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      {language === 'hi' ? 'ईमेल पता' : 'Email Address'}
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-xs font-semibold"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="submit"
                      className="btn-elite-primary px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{language === 'hi' ? 'सहेजें' : 'Save'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-200 hover:bg-slate-300 text-slate-700 transition cursor-pointer"
                    >
                      {language === 'hi' ? 'रद्द करें' : 'Cancel'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>Mobile</span>
                    </span>
                    <span className="font-mono font-bold text-slate-800">+91 {currentStudent.mobile}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>Email</span>
                    </span>
                    <span className="font-semibold text-slate-800 truncate max-w-[200px]">{currentStudent.email}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Demo Switcher (SIH Evaluator Advantage) */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <Users className="w-3.5 h-3.5 text-amber-600" />
                <span>{language === 'hi' ? 'डेमो छात्र प्रोफ़ाइल बदलें' : 'Switch Scholar Profile (Demo)'}</span>
              </div>

              <div className="space-y-1.5">
                {DEMO_TRIBAL_STUDENTS.map((demo) => {
                  const isCurrent = currentStudent.id === demo.id;
                  return (
                    <button
                      key={demo.id}
                      onClick={() => switchStudentProfile(demo)}
                      className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                        isCurrent
                          ? 'bg-amber-50/80 border-amber-300 shadow-2xs'
                          : 'bg-white border-slate-200/80 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-slate-900 leading-tight">
                          {language === 'hi' && demo.nameHi ? demo.nameHi : demo.name}
                        </div>
                        <div className="text-[10px] text-slate-500 font-medium">
                          {demo.subTribe} {demo.category} · {demo.district}
                        </div>
                      </div>

                      {isCurrent ? (
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                          Active
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-slate-400">Switch</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* System Preferences & Actions */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
              <span className="text-xs font-bold text-slate-800 block">
                {language === 'hi' ? 'सिस्टम प्राथमिकताएं' : 'System Preferences'}
              </span>

              {/* Language Switch */}
              <button
                onClick={toggleLanguage}
                className="w-full flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-amber-600" />
                  <span>{language === 'hi' ? 'भाषा बदलें (Language)' : 'App Language'}</span>
                </div>
                <span className="text-amber-800 font-bold">{language === 'en' ? 'हिन्दी' : 'English'}</span>
              </button>

              {/* Notification Settings */}
              <button
                onClick={() => {
                  setAccountSlideOverOpen(false);
                  setNotificationPanelOpen(true);
                }}
                className="w-full flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-slate-600" />
                  <span>{t('notificationPanelTitle')}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Offline Cache Sync */}
              <button
                onClick={handleManualSync}
                disabled={isSyncing}
                className="w-full flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <RefreshCw className={`w-4 h-4 text-teal-600 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{language === 'hi' ? 'ऑफलाइन डेटा सिंक करें' : 'Sync Offline Cache'}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  {isOnline ? 'Network Ready' : 'Local Only'}
                </span>
              </button>

              {/* Switch to Official Admin View */}
              <button
                onClick={() => {
                  setIsAdminView(true);
                  setAccountSlideOverOpen(false);
                }}
                className="w-full flex items-center justify-between p-2 rounded-xl bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-xs font-bold text-indigo-900 transition cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-indigo-600" />
                  <span>{t('navAdmin')}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
              </button>
            </div>
          </div>

          {/* Drawer Footer: Logout */}
          <div className="p-6 bg-slate-50 border-t border-slate-200 shrink-0">
            <button
              onClick={logout}
              className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-rose-50 text-rose-700 hover:text-rose-800 border border-rose-200 text-xs font-bold transition flex items-center justify-center gap-2 shadow-2xs active:scale-95 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>{t('logout')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
