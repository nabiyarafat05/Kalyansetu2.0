import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Language, StudentProfile, Scheme, Application, DigiLockerDoc, VoiceNoteRecord, NotificationSettings, AppNotification } from '../types';
import { useTranslation, TranslationKey } from '../i18n/translations';
import { api } from '../services/api';
import { offlineDb } from '../services/db';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey) => string;
  userRole: 'student' | 'admin' | null;
  setUserRole: (role: 'student' | 'admin' | null) => void;
  currentStudent: StudentProfile | null;
  setCurrentStudent: (stu: StudentProfile | null) => void;
  schemes: Scheme[];
  applications: Application[];
  digiLockerDocs: DigiLockerDoc[];
  voiceNotes: VoiceNoteRecord[];
  isDigiLockerModalOpen: boolean;
  setDigiLockerModalOpen: (open: boolean) => void;
  isBankModalOpen: boolean;
  setBankModalOpen: (open: boolean) => void;
  isWizardOpen: boolean;
  setWizardOpen: (open: boolean) => void;
  selectedSchemeForWizard: Scheme | null;
  openWizardWithScheme: (scheme: Scheme) => void;
  isAssistantOpen: boolean;
  setAssistantOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  isAccountSlideOverOpen: boolean;
  setAccountSlideOverOpen: (open: boolean) => void;
  updateStudentProfile: (updates: Partial<StudentProfile>) => void;
  switchStudentProfile: (student: StudentProfile) => void;
  isNotificationPanelOpen: boolean;
  setNotificationPanelOpen: (open: boolean) => void;
  notificationSettings: NotificationSettings;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => void;
  notificationsList: AppNotification[];
  unreadNotificationsCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  sendTestNotificationAlert: () => void;
  isAdminView: boolean;
  setIsAdminView: (admin: boolean) => void;
  isOnline: boolean;
  toggleSimulatedOffline: () => void;
  lastSyncTime: string;
  refreshApplications: () => Promise<void>;
  updateAppStage: (id: string, stage: string, notes?: string) => Promise<void>;
  submitNewApplication: (data: Partial<Application>) => Promise<Application>;
  linkDigiLocker: () => Promise<void>;
  verifyBank: (acc: string, ifsc: string) => Promise<void>;
  addVoiceNote: (note: VoiceNoteRecord) => Promise<void>;
  uploadOfflineDocument: (doc: DigiLockerDoc) => Promise<void>;
  syncPendingData: () => Promise<void>;
  notification: { type: 'success' | 'error' | 'info'; message: string } | null;
  showNotification: (message: string, type?: 'success' | 'error' | 'info') => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('kalyansetu_lang') as Language) || 'hi';
  });

  const { isOnline, toggleSimulateOffline } = useOnlineStatus();
  const { t } = useTranslation(language);

  const [userRole, setUserRole] = useState<'student' | 'admin' | null>('student');
  const [currentStudent, setCurrentStudent] = useState<StudentProfile | null>(null);
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [digiLockerDocs, setDigiLockerDocs] = useState<DigiLockerDoc[]>([]);
  const [voiceNotes, setVoiceNotes] = useState<VoiceNoteRecord[]>([]);

  // Modals & Panels
  const [isDigiLockerModalOpen, setDigiLockerModalOpen] = useState(false);
  const [isBankModalOpen, setBankModalOpen] = useState(false);
  const [isWizardOpen, setWizardOpen] = useState(false);
  const [selectedSchemeForWizard, setSelectedSchemeForWizard] = useState<Scheme | null>(null);
  const [isAssistantOpen, setAssistantOpen] = useState(false);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [isAccountSlideOverOpen, setAccountSlideOverOpen] = useState(false);
  const [isNotificationPanelOpen, setNotificationPanelOpen] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);

  // Notification settings stored in localStorage with default true
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(() => {
    try {
      const saved = localStorage.getItem('kalyansetu_notifications_config');
      return saved
        ? JSON.parse(saved)
        : {
            pushEnabled: true,
            documentUpdates: true,
            paymentDisbursement: true,
            dropoutInterventions: true,
            smsFallback: true,
            soundEnabled: true,
          };
    } catch {
      return {
        pushEnabled: true,
        documentUpdates: true,
        paymentDisbursement: true,
        dropoutInterventions: true,
        smsFallback: true,
        soundEnabled: true,
      };
    }
  });

  // Recent activity notifications list
  const [notificationsList, setNotificationsList] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      type: 'document',
      title: 'DigiLocker: Caste Certificate Verified',
      titleHi: 'डिजीलॉकर: एसटी जाति प्रमाण पत्र सत्यापित',
      message: 'Santhal ST Certificate #JK/ST/2024/991204 validated by Tehsildar Dumka via API Setu.',
      messageHi: 'संताल एसटी प्रमाण पत्र #JK/ST/2024/991204 अंचलाधिकारी दुमका द्वारा API सेतु से सत्यापित।',
      timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
      isRead: false,
    },
    {
      id: 'notif-2',
      type: 'payment',
      title: 'PFMS DBT Payment Initiated: ₹48,000',
      titleHi: 'PFMS भुगतान प्रारंभ: ₹48,000',
      message: 'Sanction Order #MOTA/JH/PMS/2026/08819 issued. File pushed to State Bank of India via APBS.',
      messageHi: 'स्वीकृति आदेश संख्या #MOTA/JH/PMS/2026/08819 जारी। APBS द्वारा बैंक को आदेश प्रेषित।',
      timestamp: new Date(Date.now() - 24 * 3600000).toISOString(),
      isRead: false,
    },
    {
      id: 'notif-3',
      type: 'risk',
      title: 'Dropout Prevention: Fast-Track Grant Recommended',
      titleHi: 'ड्रॉपआउट रोकथाम: फास्ट-ट्रैक अनुदान अनुशंसित',
      message: 'AI engine detected stage lag. Priority processing initiated to ensure academic continuity.',
      messageHi: 'एआई इंजन द्वारा विलंब की पहचान। पढ़ाई निरंतर रखने हेतु प्राथमिकता स्वीकृति प्रारंभ।',
      timestamp: new Date(Date.now() - 48 * 3600000).toISOString(),
      isRead: true,
    },
  ]);

  const unreadNotificationsCount = notificationsList.filter((n) => !n.isRead).length;

  const updateNotificationSettings = (newSettings: Partial<NotificationSettings>) => {
    setNotificationSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem('kalyansetu_notifications_config', JSON.stringify(updated));
      } catch (e) {
        console.warn('LocalStorage save failed:', e);
      }
      return updated;
    });

    // If pushEnabled turned on, request browser permission
    if (newSettings.pushEnabled && typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission();
      }
    }
  };

  const markNotificationAsRead = (id: string) => {
    setNotificationsList((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotificationsList((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const sendTestNotificationAlert = () => {
    const testNotif: AppNotification = {
      id: `test-notif-${Date.now()}`,
      type: 'payment',
      title: 'PFMS Test Push Alert: Payment Sanctioned',
      titleHi: 'PFMS टेस्ट पुश अलर्ट: छात्रवृत्ति राशि स्वीकृत',
      message: 'DigiLocker validated document moved to Sanction Order. ₹48,000 disbursement in progress.',
      messageHi: 'डिजीलॉकर सत्यापित दस्तावेज स्वीकृति आदेश में परिवर्तित। ₹48,000 का भुगतान प्रगति पर है।',
      timestamp: new Date().toISOString(),
      isRead: false,
    };

    setNotificationsList((prev) => [testNotif, ...prev]);

    // Native browser push notification if supported & permitted
    if (
      notificationSettings.pushEnabled &&
      typeof window !== 'undefined' &&
      'Notification' in window &&
      Notification.permission === 'granted'
    ) {
      try {
        new Notification(language === 'hi' ? testNotif.titleHi : testNotif.title, {
          body: language === 'hi' ? testNotif.messageHi : testNotif.message,
          icon: '/pwa-192x192.png',
        });
      } catch {
        // Fallback
      }
    }

    showNotification(
      language === 'hi'
        ? 'टेस्ट पुश अलर्ट प्रेषित! (डिजीलॉकर एवं PFMS स्थिति अपडेट)'
        : 'Test push alert dispatched! (DigiLocker & PFMS status update)',
      'success'
    );
  };

  const [lastSyncTime, setLastSyncTime] = useState<string>(new Date().toISOString());
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  const showNotification = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === message ? null : curr));
    }, 4000);
  }, []);

  const toggleLanguage = () => {
    const next = language === 'en' ? 'hi' : 'en';
    setLanguage(next);
    localStorage.setItem('kalyansetu_lang', next);
  };

  // Initial load & Hydration
  useEffect(() => {
    let isMounted = true;

    async function loadInitialData() {
      try {
        const [loadedSchemes, loadedApps, loadedDocs, cachedStudent, savedNotes, syncTime] = await Promise.all([
          api.getSchemes().catch(() => offlineDb.getCachedSchemes()),
          api.getApplications().catch(() => offlineDb.getCachedApplications()),
          api.getDigiLockerDocs().catch(() => offlineDb.getCachedDocuments()),
          offlineDb.getCachedStudent(),
          offlineDb.getVoiceNotes(),
          offlineDb.getLastSyncTime(),
        ]);

        if (!isMounted) return;

        setSchemes(loadedSchemes || []);
        setApplications(loadedApps || []);
        setDigiLockerDocs(loadedDocs || []);
        setVoiceNotes(savedNotes || []);
        setLastSyncTime(syncTime);

        // Check active session or set default demo tribal student
        const authData = await api.getCurrentUser().catch(() => null);
        if (authData?.profile) {
          setCurrentStudent(authData.profile);
          setUserRole(authData.role);
        } else if (cachedStudent) {
          setCurrentStudent(cachedStudent);
          setUserRole('student');
        } else {
          // Default authenticated student for quick demo
          const demoStudent: StudentProfile = {
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
          };
          setCurrentStudent(demoStudent);
          offlineDb.cacheStudent(demoStudent);
        }
      } catch (err) {
        console.warn('Initial load handled with offline fallback:', err);
      }
    }

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Real-time EventSource connection for live status changes
  useEffect(() => {
    if (!isOnline) return;

    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/events');

      eventSource.addEventListener('APPLICATION_UPDATED', (e: MessageEvent) => {
        try {
          const updatedApp: Application = JSON.parse(e.data);
          setApplications((prev) => {
            const next = prev.map((a) => (a.id === updatedApp.id ? updatedApp : a));
            offlineDb.cacheApplications(next);
            return next;
          });
          showNotification(
            language === 'hi'
              ? `आवेदन ${updatedApp.applicationNumber} की स्थिति अद्यतन हुई!`
              : `Application ${updatedApp.applicationNumber} status updated!`,
            'info'
          );
        } catch {
          // ignore
        }
      });

      eventSource.addEventListener('APPLICATION_CREATED', (e: MessageEvent) => {
        try {
          const newApp: Application = JSON.parse(e.data);
          setApplications((prev) => {
            if (prev.some((a) => a.id === newApp.id)) return prev;
            const next = [newApp, ...prev];
            offlineDb.cacheApplications(next);
            return next;
          });
        } catch {
          // ignore
        }
      });
    } catch {
      // EventSource fallback to interval polling
    }

    return () => {
      eventSource?.close();
    };
  }, [isOnline, language, showNotification]);

  // Auto-sync when transitioning from offline to online
  useEffect(() => {
    if (isOnline) {
      syncPendingData();
    }
  }, [isOnline]);

  const refreshApplications = async () => {
    const apps = await api.getApplications();
    setApplications(apps);
    await offlineDb.cacheApplications(apps);
    const now = new Date().toISOString();
    setLastSyncTime(now);
    await offlineDb.setLastSyncTime(now);
  };

  const updateAppStage = async (id: string, stage: string, notes?: string) => {
    const updated = await api.updateApplicationStage(id, stage, notes);
    setApplications((prev) => {
      const next = prev.map((a) => (a.id === id ? updated : a));
      offlineDb.cacheApplications(next);
      return next;
    });
    showNotification(
      language === 'hi' ? 'आवेदन स्थिति सफलतापूर्वक अद्यतन की गई' : 'Application status successfully updated',
      'success'
    );
  };

  const submitNewApplication = async (data: Partial<Application>): Promise<Application> => {
    const result = await api.submitApplication(data);
    setApplications((prev) => {
      const next = [result, ...prev.filter((a) => a.id !== result.id)];
      offlineDb.cacheApplications(next);
      return next;
    });
    showNotification(
      isOnline
        ? language === 'hi'
          ? 'छात्रवृत्ति आवेदन सफलतापूर्वक जमा हो गया!'
          : 'Scholarship application submitted successfully!'
        : language === 'hi'
        ? 'ऑफलाइन कतार में सुरक्षित! नेटवर्क आने पर स्वतः सिंक होगा।'
        : 'Queued offline! Will auto-sync when network is available.',
      'success'
    );
    return result;
  };

  const linkDigiLocker = async () => {
    const res = await api.linkDigiLockerSandbox();
    setDigiLockerDocs(res.documents);
    if (currentStudent) {
      const updated = { ...currentStudent, isDigiLockerLinked: true };
      setCurrentStudent(updated);
      offlineDb.cacheStudent(updated);
    }
    showNotification(
      language === 'hi'
        ? 'डिजीलॉकर से सभी प्रमाण पत्र सफलतापूर्वक आयात एवं सत्यापित हुए!'
        : 'DigiLocker certificates successfully imported and verified!',
      'success'
    );
  };

  const verifyBank = async (accountNumber: string, ifscCode: string) => {
    const res = await api.verifyBankPennyDrop(accountNumber, ifscCode);
    if (currentStudent) {
      const updated: StudentProfile = {
        ...currentStudent,
        isBankVerified: true,
        bankAccountMasked: res.accountNumberMasked,
        bankName: res.bankName,
        ifscCode: res.ifscCode,
        aadhaarSeeded: res.aadhaarSeeded,
      };
      setCurrentStudent(updated);
      offlineDb.cacheStudent(updated);
    }
    showNotification(
      language === 'hi'
        ? 'बैंक खाता एवं NPCI आधार पेमेंट ब्रिज सफलतापूर्वक सत्यापित!'
        : 'Bank account and NPCI Aadhaar Bridge successfully verified via Penny Drop!',
      'success'
    );
  };

  const addVoiceNote = async (note: VoiceNoteRecord) => {
    setVoiceNotes((prev) => [note, ...prev.filter((n) => n.id !== note.id)]);
    await offlineDb.saveVoiceNote(note);

    if (isOnline) {
      try {
        const synced = await api.syncVoiceNote(note);
        setVoiceNotes((prev) => [synced, ...prev.filter((n) => n.id !== synced.id)]);
        showNotification(
          language === 'hi' ? 'वॉइस नोट का विश्लेषण एवं सिंक संपन्न!' : 'Voice note transcribed & processed!',
          'success'
        );
      } catch {
        // remains queued offline
      }
    } else {
      showNotification(
        language === 'hi'
          ? 'वॉइस नोट ऑफलाइन कतारबद्ध किया गया (Queued for Cloud Sync)'
          : 'Voice note saved offline (Queued for Cloud Sync)',
        'info'
      );
    }
  };

  const uploadOfflineDocument = async (doc: DigiLockerDoc) => {
    if (!isOnline) {
      const offlineDoc: DigiLockerDoc = {
        ...doc,
        syncStatus: 'QUEUED_OFFLINE',
        isOfflineUpload: true,
        offlineQueuedAt: new Date().toISOString(),
      };
      setDigiLockerDocs((prev) => [offlineDoc, ...prev.filter((d) => d.id !== doc.id)]);
      await offlineDb.cacheDocuments([offlineDoc, ...digiLockerDocs.filter((d) => d.id !== doc.id)]);
      await offlineDb.enqueueOfflineAction({
        type: 'LINK_DIGILOCKER',
        payload: offlineDoc,
        timestamp: new Date().toISOString(),
      });
      showNotification(
        language === 'hi'
          ? 'दस्तावेज ऑफलाइन कतारबद्ध किया गया (Queued for Cloud Sync)'
          : 'Document queued for cloud sync (Offline mode)',
        'info'
      );
    } else {
      const syncedDoc: DigiLockerDoc = {
        ...doc,
        syncStatus: 'SYNCED',
        isOfflineUpload: false,
      };
      setDigiLockerDocs((prev) => [syncedDoc, ...prev.filter((d) => d.id !== doc.id)]);
      await offlineDb.cacheDocuments([syncedDoc, ...digiLockerDocs.filter((d) => d.id !== doc.id)]);
      showNotification(
        language === 'hi'
          ? 'दस्तावेज डिजीलॉकर बैकएंड से सफलतापूर्वक सिंक हुआ!'
          : 'Document successfully synced with DigiLocker backend!',
        'success'
      );
    }
  };

  const syncPendingData = async () => {
    const res = await api.syncOfflineQueue();
    // Also sync any queued voice notes
    const localNotes = await offlineDb.getVoiceNotes();
    const queuedNotes = localNotes.filter((n) => n.status === 'QUEUED_OFFLINE');

    for (const note of queuedNotes) {
      try {
        const synced = await api.syncVoiceNote(note);
        setVoiceNotes((prev) => [synced, ...prev.filter((n) => n.id !== synced.id)]);
      } catch {
        // retry next time
      }
    }

    // Sync any queued DigiLocker documents
    const cachedDocs = await offlineDb.getCachedDocuments();
    let docsUpdated = 0;
    const syncedDocs = cachedDocs.map((d) => {
      if (d.syncStatus === 'QUEUED_OFFLINE') {
        docsUpdated++;
        return {
          ...d,
          syncStatus: 'SYNCED' as const,
          status: 'VERIFIED' as const,
          auditTrail: [
            ...d.auditTrail,
            {
              timestamp: new Date().toISOString(),
              action: 'Offline Queued Document Successfully Synced to DigiLocker Backend',
              actionHi: 'ऑफलाइन कतारबद्ध दस्तावेज डिजीलॉकर बैकएंड से सफलतापूर्वक सिंक संपन्न',
              actor: 'Kalyansetu Sync Gateway',
              status: 'VERIFIED' as const,
            },
          ],
        };
      }
      return d;
    });

    if (docsUpdated > 0) {
      setDigiLockerDocs(syncedDocs);
      await offlineDb.cacheDocuments(syncedDocs);
    }

    const totalSynced = res.syncedCount + queuedNotes.length + docsUpdated;
    if (totalSynced > 0) {
      const now = new Date().toISOString();
      setLastSyncTime(now);
      await offlineDb.setLastSyncTime(now);
      await refreshApplications();
      showNotification(
        language === 'hi'
          ? `क्लाउड सिंक संपन्न: ${totalSynced} रिकॉर्ड्स डिजीलॉकर बैकएंड से सिंक हुए!`
          : `Cloud sync completed: ${totalSynced} records synced with DigiLocker backend!`,
        'success'
      );
    }
  };

  const openWizardWithScheme = (scheme: Scheme) => {
    setSelectedSchemeForWizard(scheme);
    setWizardOpen(true);
  };

  const updateStudentProfile = (updates: Partial<StudentProfile>) => {
    if (!currentStudent) return;
    const updated = { ...currentStudent, ...updates };
    setCurrentStudent(updated);
    offlineDb.cacheStudent(updated);
    showNotification(
      language === 'hi'
        ? 'विद्यार्थी प्रोफ़ाइल विवरण सफलतापूर्वक सहेजे गए!'
        : 'Student profile details updated successfully!',
      'success'
    );
  };

  const switchStudentProfile = (student: StudentProfile) => {
    setCurrentStudent(student);
    offlineDb.cacheStudent(student);
    setUserRole('student');
    showNotification(
      language === 'hi'
        ? `विद्यार्थी बदला गया: ${student.nameHi || student.name}`
        : `Switched profile to: ${student.name}`,
      'info'
    );
  };

  const logout = () => {
    api.logout();
    setUserRole(null);
    setCurrentStudent(null);
    setAccountSlideOverOpen(false);
    showNotification(language === 'hi' ? 'सफलतापूर्वक लॉगआउट हुए' : 'Logged out successfully', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        userRole,
        setUserRole,
        currentStudent,
        setCurrentStudent,
        schemes,
        applications,
        digiLockerDocs,
        voiceNotes,
        isDigiLockerModalOpen,
        setDigiLockerModalOpen,
        isBankModalOpen,
        setBankModalOpen,
        isWizardOpen,
        setWizardOpen,
        selectedSchemeForWizard,
        openWizardWithScheme,
        isAssistantOpen,
        setAssistantOpen,
        isAuthModalOpen,
        setAuthModalOpen,
        isAccountSlideOverOpen,
        setAccountSlideOverOpen,
        updateStudentProfile,
        switchStudentProfile,
        isNotificationPanelOpen,
        setNotificationPanelOpen,
        notificationSettings,
        updateNotificationSettings,
        notificationsList,
        unreadNotificationsCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        sendTestNotificationAlert,
        isAdminView,
        setIsAdminView,
        isOnline,
        toggleSimulatedOffline: toggleSimulateOffline,
        lastSyncTime,
        refreshApplications,
        updateAppStage,
        submitNewApplication,
        linkDigiLocker,
        verifyBank,
        addVoiceNote,
        uploadOfflineDocument,
        syncPendingData,
        notification,
        showNotification,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
