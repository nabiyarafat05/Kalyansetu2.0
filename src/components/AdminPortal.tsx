import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Users,
  IndianRupee,
  Clock,
  Zap,
  Filter,
  Search,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { AdminMetrics, Application } from '../types';

export const AdminPortal: React.FC = () => {
  const { applications, updateAppStage, t, language, showNotification } = useApp();
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [filterStage, setFilterStage] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    api.getAdminMetrics().then(setMetrics).catch(console.warn);
  }, [applications]);

  const handleFastTrack = async (appId: string) => {
    setProcessingId(appId);
    try {
      await updateAppStage(appId, 'SANCTION_ORDER_GENERATED', 'Fast-Track Emergency Sanction via Official Portal');
      showNotification(
        language === 'hi'
          ? 'ड्रॉपआउट जोखिम रोकने हेतु फास्ट-ट्रैक स्वीकृति आदेश जारी!'
          : 'Emergency Sanction Order Fast-Tracked to prevent academic dropout!',
        'success'
      );
    } catch {
      showNotification('Fast-track action failed', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  const handlePushToPfms = async (appId: string) => {
    setProcessingId(appId);
    try {
      await updateAppStage(appId, 'PFMS_PAYMENT_INITIATED', 'Payment batch released to APBS NPCI gateway');
      showNotification(
        language === 'hi' ? 'PFMS भुगतान बैच बैंक को प्रेषित!' : 'Payment batch pushed to PFMS gateway!',
        'success'
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleMarkCredited = async (appId: string) => {
    setProcessingId(appId);
    try {
      await updateAppStage(appId, 'CREDITED_TO_BENEFICIARY', 'Direct Benefit Transfer credited successfully');
      showNotification(
        language === 'hi' ? 'राशि छात्र के खाते में अंतरित चिह्नित की गई!' : 'Marked as credited to student account!',
        'success'
      );
    } finally {
      setProcessingId(null);
    }
  };

  const filteredApps = applications.filter((app) => {
    if (filterStage === 'at-risk') {
      return app.dropoutRiskLevel === 'HIGH' || app.dropoutRiskLevel === 'MEDIUM';
    }
    if (filterStage !== 'all' && app.currentStage !== filterStage) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        app.studentName.toLowerCase().includes(q) ||
        app.applicationNumber.toLowerCase().includes(q) ||
        app.schemeName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Official Header */}
      <div className="glass-panel rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-indigo-200/60 bg-gradient-to-r from-white via-indigo-50/20 to-white shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 rounded-xl bg-indigo-100 text-indigo-700">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">{t('adminTitle')}</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">{t('adminSub')}</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 text-xs font-bold text-indigo-900 bg-indigo-50 border border-indigo-200 rounded-xl shadow-2xs">
              Live National DBT Node · MoTA
            </span>
          </div>
        </div>

        {/* Aggregated KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6">
          <div className="p-4 rounded-xl sm:rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">{t('totalDisbursed')}</span>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono tabular-nums mt-1">
              ₹{metrics ? metrics.totalDisbursedCrores : '48.72'} Cr
            </div>
            <span className="text-[10px] text-emerald-700 font-bold mt-1 block">+18.4% YoY DBT Growth</span>
          </div>

          <div className="p-4 rounded-xl sm:rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">{t('totalApplicationsAdmin')}</span>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono tabular-nums mt-1">
              {metrics ? metrics.totalApplications.toLocaleString() : '142,852'}
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block font-medium">Across 750 tribal blocks</span>
          </div>

          <div className="p-4 rounded-xl sm:rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-bold text-amber-800 block uppercase tracking-wider">{t('pendingVerification')}</span>
            <div className="text-xl sm:text-2xl font-extrabold text-amber-700 font-mono tabular-nums mt-1">
              {metrics ? metrics.pendingPfmsCount.toLocaleString() : '11,200'}
            </div>
            <span className="text-[10px] text-amber-700 font-medium mt-1 block">Pending Nodal / Sanction</span>
          </div>

          <div className="p-4 rounded-xl sm:rounded-2xl bg-rose-50/70 border border-rose-200/90 shadow-2xs">
            <span className="text-[11px] font-bold text-rose-800 block uppercase tracking-wider">{t('atRiskStudentsCount')}</span>
            <div className="text-xl sm:text-2xl font-extrabold text-rose-700 font-mono tabular-nums mt-1">
              {metrics ? metrics.atRiskCount.toLocaleString() : '2,252'}
            </div>
            <span className="text-[10px] text-rose-700 font-bold mt-1 block">Needs Fast-Track Sanction</span>
          </div>
        </div>
      </div>

      {/* Stage-wise Drop-off Funnel Visualizer */}
      {metrics?.dropoffRateByStage && (
        <div className="glass-panel rounded-2xl p-5 border border-slate-200 bg-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">{t('dropoffAnalytics')}</h3>
              <p className="text-xs text-slate-500">
                {language === 'hi'
                  ? 'छात्रवृत्ति आवेदन से बैंक खाते में राशि जमा होने तक की रूपांतरण दर'
                  : 'End-to-end conversion funnel from application draft to DBT credit'}
              </p>
            </div>
            <span className="text-xs font-mono font-semibold text-slate-600">Avg TAT: 14.2 Days</span>
          </div>

          <div className="space-y-3">
            {metrics.dropoffRateByStage.map((stg, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-800">
                    {language === 'hi' ? stg.stageHi : stg.stage}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-mono">{stg.count.toLocaleString()} students</span>
                    <span className="font-bold text-slate-900 font-mono">{stg.percentage}%</span>
                  </div>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${stg.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Applications Management & Risk Intervention Table */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-200 bg-white space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {language === 'hi' ? 'छात्र आवेदन एवं हस्तक्षेप कतार' : 'Scholarship Review & Risk Intervention Queue'}
            </h3>
            <p className="text-xs text-slate-500">
              {language === 'hi'
                ? 'उच्च जोखिम वाले विद्यार्थियों को सीधे यहां से फास्ट-ट्रैक स्वीकृति जारी करें'
                : 'Directly action high-risk dropout cases with 1-click sanction generation'}
            </p>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search student or ID..."
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-xl">
              <button
                onClick={() => setFilterStage('all')}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition ${
                  filterStage === 'all' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterStage('at-risk')}
                className={`px-2.5 py-1 text-xs rounded-lg font-bold transition flex items-center gap-1 ${
                  filterStage === 'at-risk' ? 'bg-rose-600 text-white shadow-xs' : 'text-rose-700'
                }`}
              >
                <AlertTriangle className="w-3 h-3" />
                <span>At-Risk</span>
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="py-2.5 px-3">Student & Scheme</th>
                <th className="py-2.5 px-3">Stage & Delay</th>
                <th className="py-2.5 px-3">Dropout Risk</th>
                <th className="py-2.5 px-3">Verified Credentials</th>
                <th className="py-2.5 px-3 text-right">Official Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApps.map((app) => {
                const isHigh = app.dropoutRiskLevel === 'HIGH';
                const isMed = app.dropoutRiskLevel === 'MEDIUM';
                const isProcessing = processingId === app.id;

                return (
                  <tr key={app.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900 text-sm">
                        {language === 'hi' && app.studentNameHi ? app.studentNameHi : app.studentName}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">{app.applicationNumber}</div>
                      <div className="text-[11px] text-amber-800 font-medium truncate max-w-xs">
                        {app.schemeName}
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-800">
                        {app.currentStage.replace(/_/g, ' ')}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-amber-600" />
                        <span>{app.daysStuck} days pending</span>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-mono font-bold text-sm ${
                            isHigh ? 'text-rose-600' : isMed ? 'text-amber-600' : 'text-emerald-600'
                          }`}
                        >
                          {app.dropoutRiskScore}/100
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            isHigh
                              ? 'bg-rose-100 text-rose-800'
                              : isMed
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {app.dropoutRiskLevel}
                        </span>
                      </div>
                      {app.notes && (
                        <div className="text-[10px] text-slate-500 mt-1 max-w-xs truncate">{app.notes}</div>
                      )}
                    </td>

                    <td className="py-3 px-3">
                      <div className="space-y-0.5 text-[11px]">
                        <span className="text-emerald-700 flex items-center gap-1 font-medium">
                          <CheckCircle2 className="w-3 h-3" />
                          DigiLocker Verified
                        </span>
                        <span className="text-slate-500 block">PFMS: {app.pfmsDetails?.accountMasked || '••••4821'}</span>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {app.currentStage !== 'SANCTION_ORDER_GENERATED' &&
                          app.currentStage !== 'PFMS_PAYMENT_INITIATED' &&
                          app.currentStage !== 'CREDITED_TO_BENEFICIARY' && (
                            <button
                              onClick={() => handleFastTrack(app.id)}
                              disabled={isProcessing}
                              className="px-2.5 py-1.5 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition shadow-xs flex items-center gap-1 active:scale-95"
                              title="Generate emergency sanction order to prevent dropout"
                            >
                              {isProcessing && <RefreshCw className="w-3 h-3 animate-spin" />}
                              <Zap className="w-3 h-3" />
                              <span>Fast-Track</span>
                            </button>
                          )}

                        {app.currentStage === 'SANCTION_ORDER_GENERATED' && (
                          <button
                            onClick={() => handlePushToPfms(app.id)}
                            disabled={isProcessing}
                            className="px-2.5 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition flex items-center gap-1 active:scale-95"
                          >
                            <span>Push PFMS</span>
                          </button>
                        )}

                        {app.currentStage === 'PFMS_PAYMENT_INITIATED' && (
                          <button
                            onClick={() => handleMarkCredited(app.id)}
                            disabled={isProcessing}
                            className="px-2.5 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition flex items-center gap-1 active:scale-95"
                          >
                            <span>Mark Credited</span>
                          </button>
                        )}

                        {app.currentStage === 'CREDITED_TO_BENEFICIARY' && (
                          <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Completed
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
