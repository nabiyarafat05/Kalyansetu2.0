import React from 'react';
import { WifiOff, RefreshCw, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const OfflineBanner: React.FC = () => {
  const { isOnline, lastSyncTime, syncPendingData, t, language } = useApp();

  if (isOnline) return null;

  const formattedTime = new Date(lastSyncTime).toLocaleTimeString(language === 'hi' ? 'hi-IN' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 text-slate-950 px-4 py-2 text-xs sm:text-sm font-semibold shadow-md transition-all border-b border-amber-400/50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-900 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-slate-900"></span>
          </span>
          <WifiOff className="w-4 h-4 shrink-0 text-slate-950" />
          <span className="tracking-tight">{t('offlineNotice')}</span>
          <span className="hidden sm:inline-block opacity-40">·</span>
          <span className="hidden sm:inline-flex items-center gap-1.5 opacity-90 text-xs font-medium">
            <Clock className="w-3 h-3 text-slate-900" />
            <span>{t('lastSynced')}:</span>
            <span className="font-mono tabular-nums">{formattedTime}</span>
          </span>
        </div>

        <button
          onClick={syncPendingData}
          className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold bg-slate-950/15 hover:bg-slate-950/25 rounded-lg transition active:scale-95 cursor-pointer border border-slate-950/20 shadow-2xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{t('syncNow')}</span>
        </button>
      </div>
    </div>
  );
};
