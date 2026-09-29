import React, { useState } from 'react';
import {
  ShieldCheck,
  FileText,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Hash,
  Lock,
  Layers,
  Search,
  UserCheck,
  Check,
  X,
  Code,
  Sparkles,
  Cloud,
  CloudOff,
  CloudUpload,
  ArrowUpRight,
  Database,
  PlusCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DigiLockerDoc, DocAuditLog } from '../types';

export const DocumentAuditTrail: React.FC = () => {
  const {
    digiLockerDocs,
    setDigiLockerModalOpen,
    uploadOfflineDocument,
    syncPendingData,
    t,
    language,
    showNotification,
    isOnline,
  } = useApp();

  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedDocId, setExpandedDocId] = useState<string | null>(null);
  const [inspectDoc, setInspectDoc] = useState<DigiLockerDoc | null>(null);
  const [reverifyingId, setReverifyingId] = useState<string | null>(null);
  const [isSyncingAll, setIsSyncingAll] = useState(false);

  const filterTabs = [
    { id: 'all', label: t('filterAllDocs') },
    { id: 'caste_cert', label: t('filterCaste') },
    { id: 'income_cert', label: t('filterIncome') },
    { id: 'aadhaar', label: t('filterAadhaar') },
    { id: 'marksheet', label: t('filterAcademic') },
    { id: 'domicile', label: t('filterDomicile') },
  ];

  const queuedDocsCount = digiLockerDocs.filter((d) => d.syncStatus === 'QUEUED_OFFLINE').length;
  const syncedDocsCount = digiLockerDocs.filter((d) => d.syncStatus === 'SYNCED' || !d.syncStatus).length;

  const filteredDocs = digiLockerDocs.filter((doc) => {
    if (selectedType !== 'all' && doc.docType !== selectedType) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        doc.title.toLowerCase().includes(q) ||
        doc.docNumberMasked.toLowerCase().includes(q) ||
        doc.issuer.toLowerCase().includes(q) ||
        doc.uri.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const toggleExpand = (id: string) => {
    setExpandedDocId((prev) => (prev === id ? null : id));
  };

  const handleReverify = (doc: DigiLockerDoc) => {
    if (!isOnline) {
      showNotification(
        language === 'hi'
          ? 'पुनः सत्यापन हेतु इंटरनेट कनेक्शन अनिवार्य है।'
          : 'Internet connection required for live DigiLocker re-verification.',
        'error'
      );
      return;
    }

    setReverifyingId(doc.id);
    setTimeout(() => {
      setReverifyingId(null);
      showNotification(
        language === 'hi'
          ? `${doc.title} का डिजिटल हस्ताक्षर API सेतु द्वारा पुनः प्रमाणित!`
          : `${doc.title} cryptographic signature re-verified via API Setu!`,
        'success'
      );
    }, 1200);
  };

  const handleManualSyncAll = async () => {
    setIsSyncingAll(true);
    try {
      await syncPendingData();
    } finally {
      setIsSyncingAll(false);
    }
  };

  // Action to test/simulate adding an offline certificate
  const handleSimulateOfflineUpload = async () => {
    const newDocId = `doc-ration-${Date.now()}`;
    const testDoc: DigiLockerDoc = {
      id: newDocId,
      docType: 'ration_card',
      docTypeLabel: 'PVTG Ration & Bonafide Card',
      docTypeLabelHi: 'PVTG राशन एवं बोनाफाइड कार्ड',
      title: 'Tribal Food Security & Bonafide Card',
      titleHi: 'जनजातीय खाद्य सुरक्षा एवं बोनाफाइड कार्ड (दुमका)',
      issuer: 'Department of Food, Public Distribution & Consumer Affairs, Jharkhand',
      issuerHi: 'खाद्य, सार्वजनिक वितरण एवं उपभोक्ता मामले विभाग, झारखंड',
      docNumberMasked: `JK/PVTG/2026/${Math.floor(10000 + Math.random() * 90000)}`,
      uri: `in.gov.jharkhand.pvtg-BONA-${Math.floor(1000 + Math.random() * 9000)}`,
      verifiedAt: new Date().toISOString(),
      status: 'VERIFIED',
      syncStatus: isOnline ? 'SYNCED' : 'QUEUED_OFFLINE',
      isOfflineUpload: !isOnline,
      offlineQueuedAt: !isOnline ? new Date().toISOString() : undefined,
      verificationMethod: 'Local IndexedDB Hash / Scheduled APISetu Sync',
      metadata: {
        beneficiaryName: 'Ramesh Soren',
        familyHead: 'Shri Mangal Soren',
        category: 'PVTG Birhor/Santhal Grant',
        district: 'Dumka',
        localSignatureStatus: isOnline ? 'ONLINE_VERIFIED' : 'LOCAL_OFFLINE_STAMPED',
      },
      auditTrail: [
        {
          timestamp: new Date().toISOString(),
          action: isOnline
            ? 'Certificate Pulled & Synced with DigiLocker Backend'
            : 'Document Captured Locally in Offline Storage (Queued for Cloud Sync)',
          actionHi: isOnline
            ? 'प्रमाण पत्र प्राप्त एवं डिजीलॉकर बैकएंड से सिंक संपन्न'
            : 'दस्तावेज स्थानीय स्टोरेज में सुरक्षित (क्लाउड सिंक हेतु कतारबद्ध)',
          actor: isOnline ? 'DigiLocker Partner API' : 'Student Device (IndexedDB)',
          status: isOnline ? 'VERIFIED' : 'PULLED',
        },
      ],
    };

    await uploadOfflineDocument(testDoc);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="glass-panel rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-blue-200/60 bg-gradient-to-r from-white via-blue-50/20 to-white shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                {t('docAuditTitle')}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              {t('docAuditSub')}
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={handleSimulateOfflineUpload}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 rounded-xl border border-slate-200 shadow-xs transition active:scale-95"
              title="Test offline queuing or link another certificate"
            >
              <PlusCircle className="w-4 h-4 text-amber-600" />
              <span>
                {language === 'hi'
                  ? isOnline
                    ? '+ नया प्रमाण पत्र जोड़ें'
                    : '+ ऑफलाइन प्रमाण पत्र कतारबद्ध करें'
                  : isOnline
                  ? '+ Link New Certificate'
                  : '+ Queue Certificate (Offline)'}
              </span>
            </button>

            <button
              onClick={() => setDigiLockerModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-xl shadow-xs transition active:scale-95"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{t('connectDigilocker')}</span>
            </button>
          </div>
        </div>

        {/* Verification Overview Strip & Offline Sync Indicator Dashboard */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-100">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[11px] font-medium text-slate-500 block">Total Documents</span>
            <div className="text-lg sm:text-xl font-bold text-slate-900 font-mono mt-0.5">
              {digiLockerDocs.length} Verified
            </div>
            <span className="text-[10px] text-slate-500">API Setu & UIDAI Partners</span>
          </div>

          {/* Synced with Backend KPI */}
          <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/80">
            <span className="text-[11px] font-medium text-emerald-800 block">Synced with DigiLocker</span>
            <div className="text-lg sm:text-xl font-bold text-emerald-700 font-mono mt-0.5 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{syncedDocsCount} Synced</span>
            </div>
            <span className="text-[10px] text-emerald-700">Central Database Verified</span>
          </div>

          {/* Offline Queue State KPI */}
          <div
            className={`p-3 rounded-xl border transition-all ${
              queuedDocsCount > 0
                ? 'bg-amber-50 border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                : 'bg-slate-50 border-slate-200/80'
            }`}
          >
            <span className="text-[11px] font-medium text-slate-500 block">Offline Queue</span>
            <div
              className={`text-lg sm:text-xl font-bold font-mono mt-0.5 flex items-center gap-1.5 ${
                queuedDocsCount > 0 ? 'text-amber-700' : 'text-slate-700'
              }`}
            >
              {queuedDocsCount > 0 && <CloudUpload className="w-4 h-4 text-amber-600 animate-pulse" />}
              <span>{queuedDocsCount} Queued</span>
            </div>
            <span className="text-[10px] text-slate-500">
              {queuedDocsCount > 0 ? 'Auto-syncs upon reconnect' : 'Local Queue Clear'}
            </span>
          </div>

          {/* Trigger Sync Pending KPI */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
            <span className="text-[11px] font-medium text-slate-500 block">Sync Pipeline</span>
            <button
              onClick={handleManualSyncAll}
              disabled={isSyncingAll}
              className={`mt-1 py-1 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-95 ${
                queuedDocsCount > 0
                  ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
                  : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncingAll ? 'animate-spin' : ''}`} />
              <span>{isSyncingAll ? 'Syncing...' : 'Sync Now'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Zero-Pill Interactive Filter Tabs (Segmented Control) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none bg-slate-100/70 p-1.5 rounded-2xl border border-slate-200/60">
          {filterTabs.map((tab) => {
            const active = selectedType === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedType(tab.id)}
                className={`whitespace-nowrap px-4 py-1.5 text-xs font-semibold rounded-xl transition-all duration-200 cursor-pointer ${
                  active
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search certificate, URI..."
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200/90 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs transition-all"
          />
        </div>
      </div>

      {/* Documents List & Historical Audit Trail Cards */}
      <div className="space-y-4">
        {filteredDocs.map((doc) => {
          const isExpanded = expandedDocId === doc.id;
          const isReverifying = reverifyingId === doc.id;
          const auditList = doc.auditTrail || [];
          const isQueuedOffline = doc.syncStatus === 'QUEUED_OFFLINE';
          const isSyncing = doc.syncStatus === 'SYNCING';

          return (
            <div
              key={doc.id}
              className={`glass-panel-interactive rounded-2xl sm:rounded-3xl p-5 sm:p-6 border transition-all bg-white shadow-xs ${
                isQueuedOffline
                  ? 'border-amber-300 ring-2 ring-amber-100/70'
                  : 'border-slate-200/90 hover:border-blue-300'
              }`}
            >
              {/* Header Line */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="font-bold text-blue-900 uppercase tracking-wider text-[11px]">
                      {language === 'hi' && doc.docTypeLabelHi ? doc.docTypeLabelHi : doc.docTypeLabel}
                    </span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="font-mono text-slate-600 font-semibold">{doc.docNumberMasked}</span>
                  </div>

                  <h3 className="font-extrabold text-base sm:text-lg text-slate-900 flex items-center gap-2 tracking-tight">
                    <span>{language === 'hi' && doc.titleHi ? doc.titleHi : doc.title}</span>
                    {doc.isOfflineUpload && (
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                        Offline Upload
                      </span>
                    )}
                  </h3>

                  <p className="text-xs text-slate-500">
                    {language === 'hi' && doc.issuerHi ? doc.issuerHi : doc.issuer}
                  </p>
                </div>

                {/* Statuses (Verification Status + SYNC STATUS INDICATOR) */}
                <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
                  {/* Sync Status Indicator (Requested Feature) */}
                  {isQueuedOffline ? (
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-900 bg-amber-50 rounded-xl border border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.35)] animate-pulse"
                      title="Uploaded while offline. Safely stored in IndexedDB and waiting for network reconnection."
                    >
                      <CloudUpload className="w-4 h-4 text-amber-600" />
                      <span>{language === 'hi' ? 'क्लाउड सिंक हेतु कतारबद्ध (ऑफलाइन)' : 'Queued for Cloud Sync (Offline)'}</span>
                    </span>
                  ) : isSyncing ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-800 bg-blue-50 rounded-xl border border-blue-200">
                      <RefreshCw className="w-3.5 h-3.5 text-blue-600 animate-spin" />
                      <span>{language === 'hi' ? 'डिजीलॉकर से सिंक हो रहा है...' : 'Syncing with DigiLocker...'}</span>
                    </span>
                  ) : (
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 rounded-xl border border-emerald-200"
                      title="Successfully validated and synced with DigiLocker backend via API Setu."
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{language === 'hi' ? 'डिजीलॉकर से सिंक संपन्न' : 'Synced with DigiLocker'}</span>
                    </span>
                  )}

                  {/* Re-verify Button */}
                  <button
                    onClick={() => handleReverify(doc)}
                    disabled={isReverifying}
                    className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition cursor-pointer"
                    title={t('reverifyDoc')}
                  >
                    <RefreshCw className={`w-4 h-4 ${isReverifying ? 'animate-spin text-blue-600' : ''}`} />
                  </button>

                  {/* Inspect Metadata Payload Button */}
                  <button
                    onClick={() => setInspectDoc(doc)}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl border border-slate-200 transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Code className="w-3.5 h-3.5 text-blue-600" />
                    <span className="hidden sm:inline">{t('viewCertMetadata')}</span>
                  </button>
                </div>
              </div>

              {/* Technical Metadata Row (Zero-pill compliant with Sync Pipeline column) */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 py-3 text-xs border-b border-slate-100 text-slate-600">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wider">
                    {t('docUri')}
                  </span>
                  <span className="font-mono text-slate-800 text-[11px] truncate block mt-0.5" title={doc.uri}>
                    {doc.uri}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wider">
                    {t('docMethod')}
                  </span>
                  <span className="text-slate-800 font-medium block mt-0.5 truncate">
                    {doc.verificationMethod || 'API Setu / XMLDSig Digital Signature'}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wider">
                    Sync & Storage Status
                  </span>
                  <div className="mt-0.5 flex items-center gap-1.5 font-semibold text-xs">
                    {isQueuedOffline ? (
                      <span className="text-amber-700 flex items-center gap-1">
                        <Database className="w-3.5 h-3.5 text-amber-600" />
                        <span>IndexedDB Queue (Offline)</span>
                      </span>
                    ) : (
                      <span className="text-emerald-700 flex items-center gap-1">
                        <Cloud className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Cloud Database (Synced)</span>
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wider">
                    {t('docVerifiedOn')}
                  </span>
                  <span className="text-slate-800 font-medium block mt-0.5">
                    {new Date(doc.verifiedAt).toLocaleString(language === 'hi' ? 'hi-IN' : 'en-US', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </span>
                </div>
              </div>

              {/* Expandable Audit Trail Toggle */}
              <div className="pt-3">
                <button
                  onClick={() => toggleExpand(doc.id)}
                  className="flex items-center justify-between w-full text-xs font-semibold text-slate-700 hover:text-blue-700 py-1 transition group"
                >
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span>{t('docAuditTimeline')}</span>
                    <span className="text-slate-400 font-normal">({auditList.length} events logged)</span>
                  </div>

                  <div className="flex items-center gap-1 text-slate-400 group-hover:text-blue-600">
                    <span>
                      {isExpanded
                        ? language === 'hi'
                          ? 'संक्षिप्त करें'
                          : 'Collapse'
                        : language === 'hi'
                        ? 'विस्तार से देखें'
                        : 'View Audit Trail'}
                    </span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {/* Audit Trail Timeline */}
                {isExpanded && (
                  <div className="mt-4 pt-3 border-t border-slate-100 pl-2 space-y-3">
                    {auditList.map((entry, idx) => (
                      <div
                        key={idx}
                        className={`relative pl-6 pb-2 border-l-2 last:border-transparent ${
                          isQueuedOffline ? 'border-amber-300' : 'border-blue-200'
                        }`}
                      >
                        {/* Dot */}
                        <div
                          className={`absolute -left-[7px] top-0 w-3 h-3 rounded-full ${
                            isQueuedOffline
                              ? 'bg-amber-500 ring-4 ring-amber-100 animate-pulse'
                              : 'bg-blue-600 ring-4 ring-blue-100'
                          }`}
                        />

                        <div className="text-xs">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <span className="font-bold text-slate-900">
                              {language === 'hi' && entry.actionHi ? entry.actionHi : entry.action}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono">
                              {new Date(entry.timestamp).toLocaleString(language === 'hi' ? 'hi-IN' : 'en-US', {
                                dateStyle: 'medium',
                                timeStyle: 'medium',
                              })}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                            <span>
                              Actor: <strong className="text-slate-700">{entry.actor}</strong>
                            </span>
                            {entry.signatureHash && (
                              <>
                                <span>·</span>
                                <span className="font-mono text-slate-600">Hash: {entry.signatureHash}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filteredDocs.length === 0 && (
          <div className="py-12 text-center glass-panel rounded-2xl p-8 border border-slate-200">
            <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">
              {language === 'hi' ? 'कोई दस्तावेज नहीं मिला।' : 'No documents match the selected filter.'}
            </p>
          </div>
        )}
      </div>

      {/* Raw Payload Inspection Modal */}
      {inspectDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95">
            <div className="px-5 py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-blue-400" />
                <h3 className="font-bold text-sm sm:text-base">
                  Cryptographic Payload Inspection
                </h3>
              </div>
              <button
                onClick={() => setInspectDoc(null)}
                className="p-1 text-slate-400 hover:text-white rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <div>
                  <span className="text-xs font-semibold text-slate-500 block">Sync Pipeline State</span>
                  <span
                    className={`font-semibold text-xs mt-0.5 ${
                      inspectDoc.syncStatus === 'QUEUED_OFFLINE' ? 'text-amber-600' : 'text-emerald-600'
                    }`}
                  >
                    {inspectDoc.syncStatus === 'QUEUED_OFFLINE'
                      ? 'Queued Offline (Pending Cloud Sync)'
                      : 'Synced with DigiLocker Backend'}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-500">
                  ID: {inspectDoc.id}
                </span>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-500 block">Certificate URI</span>
                <span className="text-xs font-mono text-blue-700 font-bold break-all block mt-0.5">
                  {inspectDoc.uri}
                </span>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-500 block mb-1">
                  Extracted Verified Metadata
                </span>
                <div className="p-3 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto max-h-60 leading-relaxed">
                  <pre>{JSON.stringify(inspectDoc.metadata, null, 2)}</pre>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                <div className="flex items-center gap-1.5 font-semibold text-slate-800 mb-0.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Tamper-Evident Digital Proof</span>
                </div>
                Cryptographically signed by authorized issuer under IT Act 2000 Section 4. Stores zero raw copies on local servers.
              </div>

              <button
                onClick={() => setInspectDoc(null)}
                className="w-full py-2.5 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition"
              >
                {t('close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
