import React, { useState } from 'react';
import { Download, Check, Share2, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useApp } from '../context/AppContext';

export const PWAInstallButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const { t, language } = useApp();

  if (isInstalled) {
    if (compact) return null;
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-lg border border-emerald-200">
        <Check className="w-3.5 h-3.5 text-emerald-600" />
        <span>{t('installed')}</span>
      </div>
    );
  }

  if (isInstallable) {
    return (
      <button
        onClick={install}
        className={`inline-flex items-center gap-2 font-medium text-white transition-all shadow-sm rounded-lg active:scale-95 ${
          compact
            ? 'px-2.5 py-1.5 text-xs bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700'
            : 'px-3.5 py-2 text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700'
        }`}
        title={t('installApp')}
      >
        <Download className="w-4 h-4" />
        <span>{t('installApp')}</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-amber-900 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200 transition"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'iOS पर इंस्टॉल' : 'Install on iOS'}</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="w-full max-w-sm p-6 bg-white shadow-2xl rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-semibold text-slate-900">
                  {language === 'hi' ? 'iPhone / iPad पर इंस्टॉल करें' : 'Install on iPhone / iPad'}
                </h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <div className="flex items-start gap-2.5">
                  <span className="flex items-center justify-center w-6 h-6 text-xs font-bold text-amber-700 bg-amber-100 rounded-full shrink-0">
                    1
                  </span>
                  <p>
                    {language === 'hi'
                      ? 'Safari ब्राउज़र के नीचे शेयर (Share) बटन दबाएं।'
                      : 'Tap the Share button in Safari navigation bar.'}
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="flex items-center justify-center w-6 h-6 text-xs font-bold text-amber-700 bg-amber-100 rounded-full shrink-0">
                    2
                  </span>
                  <p>
                    {language === 'hi'
                      ? 'सूची में नीचे स्क्रॉल करें और "Add to Home Screen" चुनें।'
                      : 'Scroll down and tap "Add to Home Screen".'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full mt-5 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
              >
                {t('close')}
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback direct button for browsers that support install or manual prompt
  return (
    <button
      onClick={() => {
        alert(
          language === 'hi'
            ? 'कल्याणसेतु PWA: ब्राउज़र के 3-डॉट मेनू में "Install App" या "Add to Home Screen" चुनें।'
            : 'To install Kalyan Setu: Open your browser menu (⋮) and select "Install App" or "Add to Home screen".'
        );
      }}
      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
    >
      <Download className="w-3.5 h-3.5 text-amber-600" />
      <span>{t('installApp')}</span>
    </button>
  );
};
