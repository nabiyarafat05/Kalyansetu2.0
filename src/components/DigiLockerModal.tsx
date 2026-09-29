import React, { useState } from 'react';
import { X, Shield, CheckCircle2, Lock, ArrowRight, ExternalLink, AlertCircle, RefreshCw, FileText } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';

export const DigiLockerModal: React.FC = () => {
  const { isDigiLockerModalOpen, setDigiLockerModalOpen, digiLockerDocs, linkDigiLocker, isOnline, t, language } = useApp();
  const [step, setStep] = useState<'consent' | 'authorizing' | 'success'>('consent');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isDigiLockerModalOpen) return null;

  const handleAuthorize = async () => {
    if (!isOnline) {
      setErrorMsg(
        language === 'hi'
          ? 'डिजीलॉकर से ई-दस्तावेज आयात करने हेतु इंटरनेट कनेक्शन आवश्यक है।'
          : 'DigiLocker OAuth gateway requires an active internet connection.'
      );
      return;
    }

    setErrorMsg('');
    setStep('authorizing');

    try {
      await linkDigiLocker();
      setStep('success');
    } catch (err: unknown) {
      setStep('consent');
      setErrorMsg((err as Error).message || 'DigiLocker sandbox authentication failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base">{t('digilockerTitle')}</h3>
                <span className="text-[10px] font-semibold bg-blue-500/80 px-2 py-0.5 rounded-full border border-blue-300/40">
                  {t('sandboxModeBadge')}
                </span>
              </div>
              <p className="text-xs text-blue-100">{t('digilockerSub')}</p>
            </div>
          </div>

          <button
            onClick={() => setDigiLockerModalOpen(false)}
            className="p-1 text-white/80 hover:text-white rounded-md transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {step === 'consent' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/80 text-xs text-blue-900 leading-relaxed">
                <div className="flex items-center gap-1.5 font-semibold text-blue-950 mb-1">
                  <Lock className="w-4 h-4 text-blue-700" />
                  <span>API Setu · National e-Governance Division (NeGD)</span>
                </div>
                {t('consentNotice')}
              </div>

              <div>
                <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  {language === 'hi' ? 'सत्यापित किए जाने वाले दस्तावेज' : 'Documents to be Verified'}
                </h4>
                <div className="space-y-2">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-600" />
                      <span className="font-medium text-slate-800">{t('docTypeAadhaar')}</span>
                    </div>
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      e-KYC
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-600" />
                      <span className="font-medium text-slate-800">{t('docTypeCaste')}</span>
                    </div>
                    <span className="text-slate-500">Jharkhand / State e-District</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-600" />
                      <span className="font-medium text-slate-800">{t('docTypeIncome')}</span>
                    </div>
                    <span className="text-slate-500">FY 2025-26</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  onClick={() => setDigiLockerModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition"
                >
                  {t('cancel')}
                </button>
                <button
                  onClick={handleAuthorize}
                  className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition active:scale-95 flex items-center gap-1.5"
                >
                  <span>{t('consentAuthorizeBtn')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {step === 'authorizing' && (
            <div className="py-8 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
              <h4 className="text-sm font-semibold text-slate-800">{t('fetchingFromDigilocker')}</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                {language === 'hi'
                  ? 'सुरक्षित OAuth 2.0 टोकन का आदान-प्रदान और डिजिटल हस्ताक्षर सत्यापन जारी है...'
                  : 'Securing OAuth 2.0 authorization code and fetching cryptographic metadata...'}
              </p>
            </div>
          )}

          {step === 'success' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-emerald-950">
                  {language === 'hi' ? 'डिजीलॉकर सत्यापन संपन्न!' : 'DigiLocker Verification Successful!'}
                </h4>
                <p className="text-xs text-emerald-800 mt-1">
                  {language === 'hi'
                    ? '4 डिजिटल दस्तावेज सफलतापूर्वक सत्यापित एवं छात्रवृत्ति प्रोफाइल से लिंक किए गए।'
                    : '4 digital certificates verified and linked directly to your scholarship profile.'}
                </p>
              </div>

              <div className="space-y-2">
                {digiLockerDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-slate-800">
                        {language === 'hi' && doc.titleHi ? doc.titleHi : doc.title}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {doc.docNumberMasked} · {language === 'hi' && doc.issuerHi ? doc.issuerHi : doc.issuer}
                      </div>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-100 rounded-md">
                      VERIFIED
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setDigiLockerModalOpen(false)}
                className="w-full py-2.5 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition"
              >
                {t('close')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
