import React, { useState } from 'react';
import {
  X,
  Bell,
  Check,
  ShieldCheck,
  IndianRupee,
  AlertTriangle,
  MessageSquare,
  Volume2,
  Smartphone,
  Send,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const NotificationSettingsModal: React.FC = () => {
  const {
    isNotificationPanelOpen,
    setNotificationPanelOpen,
    notificationSettings,
    updateNotificationSettings,
    notificationsList,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    sendTestNotificationAlert,
    t,
    language,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'settings' | 'alerts'>('settings');

  if (!isNotificationPanelOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-white border border-white/30">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base leading-tight">
                {t('notificationPanelTitle')}
              </h3>
              <p className="text-[11px] text-amber-100 leading-tight">
                {t('notificationPanelSub')}
              </p>
            </div>
          </div>

          <button
            onClick={() => setNotificationPanelOpen(false)}
            className="p-1.5 text-white/80 hover:text-white rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold shrink-0">
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-3 text-center transition ${
              activeTab === 'settings'
                ? 'bg-white text-amber-800 border-b-2 border-amber-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('notificationsTab')}
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={`flex-1 py-3 text-center transition flex items-center justify-center gap-1.5 ${
              activeTab === 'alerts'
                ? 'bg-white text-amber-800 border-b-2 border-amber-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>{t('recentAlertsTab')}</span>
            {unreadNotificationsCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                {unreadNotificationsCount}
              </span>
            )}
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'settings' ? (
            <div className="space-y-4">
              {/* Master Push Notification Switch */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/90 flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs sm:text-sm">
                    <Smartphone className="w-4 h-4 text-amber-600" />
                    <span>{t('enablePushAlerts')}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{t('enablePushDesc')}</p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    checked={notificationSettings.pushEnabled}
                    onChange={(e) => updateNotificationSettings({ pushEnabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                </label>
              </div>

              {/* Event Specific Notification Switches */}
              <div className="space-y-2">
                {/* 1. DigiLocker Document Updates (Requested) */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-900 text-xs">
                      <ShieldCheck className="w-4 h-4 text-blue-600" />
                      <span>{t('docAlertsToggle')}</span>
                    </div>
                    <p className="text-[11px] text-slate-500">{t('docAlertsDesc')}</p>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                    <input
                      type="checkbox"
                      checked={notificationSettings.documentUpdates}
                      onChange={(e) => updateNotificationSettings({ documentUpdates: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {/* 2. PFMS Payment & DBT Updates (Requested) */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-900 text-xs">
                      <IndianRupee className="w-4 h-4 text-emerald-600" />
                      <span>{t('paymentAlertsToggle')}</span>
                    </div>
                    <p className="text-[11px] text-slate-500">{t('paymentAlertsDesc')}</p>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                    <input
                      type="checkbox"
                      checked={notificationSettings.paymentDisbursement}
                      onChange={(e) => updateNotificationSettings({ paymentDisbursement: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                {/* 3. Dropout Risk Interventions */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-900 text-xs">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>{t('riskAlertsToggle')}</span>
                    </div>
                    <p className="text-[11px] text-slate-500">{t('riskAlertsDesc')}</p>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                    <input
                      type="checkbox"
                      checked={notificationSettings.dropoutInterventions}
                      onChange={(e) => updateNotificationSettings({ dropoutInterventions: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
                  </label>
                </div>

                {/* 4. SMS & WhatsApp Fallback */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-900 text-xs">
                      <MessageSquare className="w-4 h-4 text-teal-600" />
                      <span>{t('smsFallbackToggle')}</span>
                    </div>
                    <p className="text-[11px] text-slate-500">{t('smsFallbackDesc')}</p>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                    <input
                      type="checkbox"
                      checked={notificationSettings.smsFallback}
                      onChange={(e) => updateNotificationSettings({ smsFallback: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-600"></div>
                  </label>
                </div>
              </div>

              {/* Action Buttons: Test Notification Alert */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-slate-100">
                <button
                  onClick={sendTestNotificationAlert}
                  className="w-full sm:w-auto px-4 py-2 text-xs font-semibold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl shadow-xs transition active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{t('sendTestNotification')}</span>
                </button>

                <button
                  onClick={() => setNotificationPanelOpen(false)}
                  className="w-full sm:w-auto px-4 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
                >
                  {t('close')}
                </button>
              </div>
            </div>
          ) : (
            /* Recent Alerts List Tab */
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs text-slate-500 font-medium">
                  {notificationsList.length} Alerts Logged
                </span>
                {unreadNotificationsCount > 0 && (
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="text-xs font-semibold text-amber-700 hover:underline"
                  >
                    {t('markAllRead')}
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {notificationsList.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => markNotificationAsRead(item.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      item.isRead
                        ? 'bg-white border-slate-200 text-slate-700 opacity-90'
                        : 'bg-amber-50/50 border-amber-200 text-slate-900 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2">
                        <span
                          className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                            item.type === 'document'
                              ? 'bg-blue-100 text-blue-700'
                              : item.type === 'payment'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {item.type === 'document' ? (
                            <ShieldCheck className="w-4 h-4" />
                          ) : item.type === 'payment' ? (
                            <IndianRupee className="w-4 h-4" />
                          ) : (
                            <AlertTriangle className="w-4 h-4" />
                          )}
                        </span>
                        <div>
                          <div className="font-bold text-xs sm:text-sm">
                            {language === 'hi' ? item.titleHi : item.title}
                          </div>
                          <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                            {language === 'hi' ? item.messageHi : item.message}
                          </p>
                        </div>
                      </div>

                      {!item.isRead && (
                        <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-1" />
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-100">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="capitalize font-mono">{item.type} Notification</span>
                    </div>
                  </div>
                ))}

                {notificationsList.length === 0 && (
                  <div className="py-8 text-center text-xs text-slate-500">
                    {t('noNotifications')}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
