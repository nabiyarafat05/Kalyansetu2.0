import React, { useState, useEffect } from 'react';
import { X, Phone, Lock, ArrowRight, RefreshCw, Shield, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setAuthModalOpen, setCurrentStudent, setUserRole, t, language, showNotification } = useApp();

  const [authMode, setAuthMode] = useState<'student' | 'admin'>('student');
  const [mobile, setMobile] = useState('9876543210');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [demoOtp, setDemoOtp] = useState<string | null>(null);
  const [timer, setTimer] = useState(300);

  // Admin state
  const [adminEmail, setAdminEmail] = useState('admin@tribal.gov.in');
  const [adminPassword, setAdminPassword] = useState('KalyanSetu@2026');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (otpSent && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [otpSent, timer]);

  if (!isAuthModalOpen) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await api.sendOtp(mobile);
      setOtpSent(true);
      setDemoOtp(res.demoOtp);
      setTimer(300);
      showNotification(
        language === 'hi' ? 'ओटीपी सफलतापूर्वक भेजा गया' : 'OTP dispatched to registered mobile',
        'success'
      );
    } catch (err: unknown) {
      setErrorMsg((err as Error).message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await api.verifyOtp(mobile, otp || '684201');
      setCurrentStudent(res.student);
      setUserRole('student');
      setAuthModalOpen(false);
      showNotification(
        language === 'hi'
          ? `जोहार ${res.student.name}! स्वागत है।`
          : `Johar ${res.student.name}! Logged in successfully.`,
        'success'
      );
    } catch (err: unknown) {
      setErrorMsg((err as Error).message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await api.adminLogin(adminEmail, adminPassword);
      setUserRole('admin');
      setAuthModalOpen(false);
      showNotification(
        language === 'hi' ? 'मंत्रालय नोडल अधिकारी के रूप में लॉगिन संपन्न!' : 'Logged in as Ministry Nodal Officer!',
        'success'
      );
    } catch (err: unknown) {
      setErrorMsg((err as Error).message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold">
          <button
            onClick={() => {
              setAuthMode('student');
              setErrorMsg('');
            }}
            className={`flex-1 py-3 text-center transition ${
              authMode === 'student'
                ? 'bg-white text-amber-700 border-b-2 border-amber-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('studentLogin')}
          </button>
          <button
            onClick={() => {
              setAuthMode('admin');
              setErrorMsg('');
            }}
            className={`flex-1 py-3 text-center transition ${
              authMode === 'admin'
                ? 'bg-white text-indigo-700 border-b-2 border-indigo-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('adminLogin')}
          </button>
          <button
            onClick={() => setAuthModalOpen(false)}
            className="px-3 text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 sm:p-6">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {authMode === 'student' ? (
            !otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {language === 'hi' ? 'मोबाइल नंबर द्वारा लॉगिन' : 'Login with Mobile Number'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {language === 'hi'
                      ? 'अपने 10-अंकीय आधार से जुड़े मोबाइल नंबर पर ओटीपी प्राप्त करें'
                      : 'Enter your 10-digit Aadhaar-linked mobile for one-time code'}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {language === 'hi' ? 'मोबाइल नंबर' : 'Mobile Number'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
                      +91
                    </span>
                    <input
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      maxLength={10}
                      required
                      placeholder="98765 43210"
                      className="w-full pl-12 pr-3 py-2.5 text-sm font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-900">
                  {language === 'hi'
                    ? '💡 डेमो हेतु: "9876543210" (रमेश सोरेन - संताल एसटी) पूर्व-भरा है।'
                    : '💡 For Demo: "9876543210" (Ramesh Soren, Santhal ST) is pre-filled.'}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-xs transition active:scale-95 flex items-center justify-center gap-1.5"
                >
                  {loading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{language === 'hi' ? 'ओटीपी प्राप्त करें' : 'Get Verification Code'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {language === 'hi' ? 'ओटीपी सत्यापित करें' : 'Verify One-Time Password'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {language === 'hi'
                      ? `+91 ${mobile} पर 6-अंकीय कोड भेजा गया है`
                      : `Enter the 6-digit code sent to +91 ${mobile}`}
                  </p>
                </div>

                {demoOtp && (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
                    <span>Demo OTP Code:</span>
                    <span className="font-mono font-bold text-sm text-emerald-800">{demoOtp}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {language === 'hi' ? '6-अंकीय ओटीपी दर्ज करें' : 'Enter 6-Digit OTP'}
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    placeholder="684201"
                    required
                    className="w-full text-center tracking-[0.5em] font-mono text-lg py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>
                    Valid for: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
                  </span>
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="text-amber-700 font-semibold hover:underline"
                  >
                    Change Number
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition active:scale-95 flex items-center justify-center gap-1.5"
                >
                  {loading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{language === 'hi' ? 'पुष्टि करें एवं प्रवेश करें' : 'Verify & Enter Portal'}</span>
                </button>
              </form>
            )
          ) : (
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {language === 'hi' ? 'मंत्रालय अधिकारी पोर्टल' : 'Ministry Official Portal'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {language === 'hi'
                    ? 'जनजातीय कार्य मंत्रालय के नोडल अधिकारी क्रेडेंशियल्स'
                    : 'Nodal Officer / State DBT Commissioner credentials'}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Official Email ID</label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-200 text-[11px] text-indigo-900">
                Demo Official: <span className="font-mono font-semibold">admin@tribal.gov.in</span> /{' '}
                <span className="font-mono font-semibold">KalyanSetu@2026</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs transition active:scale-95 flex items-center justify-center gap-1.5"
              >
                {loading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>Login to Official Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
