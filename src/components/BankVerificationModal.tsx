import React, { useState } from 'react';
import { X, Landmark, CheckCircle2, AlertTriangle, ShieldCheck, ArrowRight, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BankVerificationModal: React.FC = () => {
  const { isBankModalOpen, setBankModalOpen, currentStudent, verifyBank, isOnline, t, language } = useApp();

  const [accountNumber, setAccountNumber] = useState('329481024821');
  const [ifscCode, setIfscCode] = useState('SBIN0001234');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  if (!isBankModalOpen) return null;

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOnline) {
      setErrorMsg(
        language === 'hi'
          ? 'बैंक पेनी-ड्रॉप सत्यापन हेतु इंटरनेट कनेक्शन अनिवार्य है।'
          : 'Bank Penny-Drop verification requires an active internet connection.'
      );
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      await verifyBank(accountNumber, ifscCode);
      setVerificationSuccess(true);
    } catch (err: unknown) {
      setErrorMsg((err as Error).message || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <Landmark className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base">{t('bankVerificationTitle')}</h3>
                <span className="text-[10px] font-semibold bg-emerald-500/80 px-2 py-0.5 rounded-full border border-emerald-300/40">
                  {t('sandboxBankBadge')}
                </span>
              </div>
              <p className="text-xs text-emerald-100">{t('bankVerificationSub')}</p>
            </div>
          </div>

          <button onClick={() => setBankModalOpen(false)} className="p-1 text-white/80 hover:text-white rounded-md">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs text-rose-800">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {verificationSuccess || currentStudent?.isBankVerified ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-emerald-950">{t('accountVerified')}</h4>
                <p className="text-xs text-emerald-800 mt-1">
                  {t('beneficiaryNameMatch')} ({currentStudent?.name || 'Ramesh Soren'})
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">{t('accountNumber')}</span>
                  <span className="font-mono font-semibold text-slate-900">
                    {currentStudent?.bankAccountMasked || '••••4821'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Bank & Branch</span>
                  <span className="font-semibold text-slate-900">State Bank of India (Dumka Branch)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">IFSC Code</span>
                  <span className="font-mono font-semibold text-slate-900">SBIN0001234</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">NPCI Aadhaar Seeding</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {t('aadhaarSeededActive')}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setBankModalOpen(false)}
                className="w-full py-2.5 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition"
              >
                {t('close')}
              </button>
            </div>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
                {language === 'hi'
                  ? 'छात्रवृत्ति राशि सीधे छात्र के आधार-सीडेड बैंक खाते में डीबीटी (PFMS) द्वारा अंतरित की जाती है। सत्यापन हेतु ₹1 पेनी-ड्रॉप एपीआई का उपयोग किया जाएगा।'
                  : 'Scholarship grant is credited directly to Aadhaar-seeded accounts via NPCI APBS. A ₹1 sandbox penny-drop test verifies account holder name.'}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">{t('accountNumber')}</label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder={t('accountNumberPlaceholder')}
                  required
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">{t('ifscCode')}</label>
                <input
                  type="text"
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                  placeholder={t('ifscPlaceholder')}
                  required
                  className="w-full px-3 py-2 text-xs sm:text-sm uppercase font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setBankModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition active:scale-95 flex items-center gap-1.5"
                >
                  {isLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{t('verifyAccountBtn')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
