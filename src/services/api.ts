import { Scheme, Application, StudentProfile, DigiLockerDoc, BankAccountVerification, AdminMetrics, VoiceNoteRecord } from '../types';
import { offlineDb } from './db';
import { getSimulatedOffline } from '../hooks/useOnlineStatus';

const API_BASE = '/api';

function checkNetworkOnline(): boolean {
  if (getSimulatedOffline()) return false;
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
}

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('kalyansetu_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  // --- AUTHENTICATION ---
  async sendOtp(mobile: string): Promise<{ success: boolean; message: string; demoOtp: string }> {
    if (!checkNetworkOnline()) {
      // In offline mode, provide seamless demo code
      return {
        success: true,
        message: 'Offline OTP generated',
        demoOtp: '684201',
      };
    }
    const res = await fetch(`${API_BASE}/auth/otp/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile }),
    });
    if (!res.ok) throw new Error('Failed to send OTP');
    return res.json();
  },

  async verifyOtp(mobile: string, otp: string): Promise<{ token: string; student: StudentProfile }> {
    if (!checkNetworkOnline()) {
      // Offline fallback: load cached student or provide demo verified tribal student
      const cached = await offlineDb.getCachedStudent();
      const student: StudentProfile = cached || {
        id: 'stu-santhal-01',
        name: 'Ramesh Soren',
        nameHi: 'रमेश सोरेन',
        mobile,
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
      const token = 'offline-demo-jwt-token';
      localStorage.setItem('kalyansetu_token', token);
      await offlineDb.cacheStudent(student);
      return { token, student };
    }

    const res = await fetch(`${API_BASE}/auth/otp/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile, otp }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'OTP verification failed');
    }
    const data = await res.json();
    localStorage.setItem('kalyansetu_token', data.token);
    await offlineDb.cacheStudent(data.student);
    return data;
  },

  async adminLogin(email: string, password: string): Promise<{ token: string; admin: { name: string; role: string; email: string } }> {
    const res = await fetch(`${API_BASE}/auth/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Invalid credentials');
    }
    const data = await res.json();
    localStorage.setItem('kalyansetu_token', data.token);
    return data;
  },

  async getCurrentUser(): Promise<{ role: 'student' | 'admin'; profile: StudentProfile | null } | null> {
    const token = localStorage.getItem('kalyansetu_token');
    if (!token) return null;

    if (!checkNetworkOnline()) {
      const cached = await offlineDb.getCachedStudent();
      return cached ? { role: 'student', profile: cached } : null;
    }

    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { ...getAuthHeader() },
      });
      if (!res.ok) return null;
      const data = await res.json();
      if (data.student) {
        await offlineDb.cacheStudent(data.student);
      }
      return data;
    } catch {
      const cached = await offlineDb.getCachedStudent();
      return cached ? { role: 'student', profile: cached } : null;
    }
  },

  logout(): void {
    localStorage.removeItem('kalyansetu_token');
  },

  // --- SCHEMES ---
  async getSchemes(): Promise<Scheme[]> {
    if (!checkNetworkOnline()) {
      const cached = await offlineDb.getCachedSchemes();
      if (cached.length > 0) return cached;
    }

    try {
      const res = await fetch(`${API_BASE}/schemes`);
      if (!res.ok) throw new Error('Failed to fetch schemes');
      const data: Scheme[] = await res.json();
      await offlineDb.cacheSchemes(data);
      return data;
    } catch (e) {
      const cached = await offlineDb.getCachedSchemes();
      if (cached.length > 0) return cached;
      throw e;
    }
  },

  // --- APPLICATIONS ---
  async getApplications(): Promise<Application[]> {
    if (!checkNetworkOnline()) {
      const cached = await offlineDb.getCachedApplications();
      return cached;
    }

    try {
      const res = await fetch(`${API_BASE}/applications`, {
        headers: { ...getAuthHeader() },
      });
      if (!res.ok) throw new Error('Failed to fetch applications');
      const data: Application[] = await res.json();
      await offlineDb.cacheApplications(data);
      return data;
    } catch {
      return await offlineDb.getCachedApplications();
    }
  },

  async submitApplication(appData: Partial<Application>): Promise<Application> {
    if (!checkNetworkOnline()) {
      // Save locally to offline database & queue
      const offlineApp: Application = {
        id: `offline-app-${Date.now()}`,
        applicationNumber: `JH/ST/2026/OFF-${Math.floor(1000 + Math.random() * 9000)}`,
        studentId: appData.studentId || 'stu-santhal-01',
        studentName: appData.studentName || 'Ramesh Soren',
        studentMobile: appData.studentMobile || '9876543210',
        schemeId: appData.schemeId || 'scheme-post-matric',
        schemeName: appData.schemeName || 'Post-Matric Scholarship for ST Students',
        schemeNameHi: appData.schemeNameHi || 'अनुसूचित जनजाति के छात्रों हेतु पोस्ट-मैट्रिक छात्रवृत्ति',
        grantAmount: appData.grantAmount || '₹48,000 / year',
        currentStage: 'APPLICATION_SUBMITTED',
        submittedAt: new Date().toISOString(),
        lastUpdatedAt: new Date().toISOString(),
        daysStuck: 1,
        history: [
          {
            stage: 'APPLICATION_SUBMITTED',
            title: 'Application Queued Offline',
            titleHi: 'आवेदन ऑफलाइन कतारबद्ध किया गया',
            timestamp: new Date().toISOString(),
            description: 'Saved on local device storage. Will auto-sync when network returns.',
            descriptionHi: 'स्थानीय डिवाइस पर सुरक्षित। नेटवर्क प्राप्त होते ही स्वतः सिंक होगा।',
            actor: 'Student (Offline Mode)',
          },
        ],
        verifiedDocs: appData.verifiedDocs || {
          aadhaarRef: 'UIDAI-XXXX-XXXX-4912',
          casteCertRef: 'JK/ST/2024/991204',
          incomeCertRef: 'REV/INC/2025/1102',
        },
        dropoutRiskScore: 32,
        dropoutRiskLevel: 'LOW',
        isInterventionRequired: false,
      };

      const currentCached = await offlineDb.getCachedApplications();
      currentCached.unshift(offlineApp);
      await offlineDb.cacheApplications(currentCached);

      await offlineDb.enqueueOfflineAction({
        type: 'SUBMIT_APPLICATION',
        payload: offlineApp,
        timestamp: new Date().toISOString(),
      });

      return offlineApp;
    }

    const res = await fetch(`${API_BASE}/applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(appData),
    });
    if (!res.ok) throw new Error('Application submission failed');
    const saved: Application = await res.json();
    const currentCached = await offlineDb.getCachedApplications();
    const filtered = currentCached.filter((a) => a.id !== saved.id);
    filtered.unshift(saved);
    await offlineDb.cacheApplications(filtered);
    return saved;
  },

  async updateApplicationStage(id: string, stage: string, notes?: string): Promise<Application> {
    const res = await fetch(`${API_BASE}/applications/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ stage, notes }),
    });
    if (!res.ok) throw new Error('Failed to update stage');
    return res.json();
  },

  // --- DIGILOCKER (Sandbox) ---
  async getDigiLockerDocs(): Promise<DigiLockerDoc[]> {
    if (!checkNetworkOnline()) {
      return offlineDb.getCachedDocuments();
    }
    const res = await fetch(`${API_BASE}/digilocker/documents`, {
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) return offlineDb.getCachedDocuments();
    const docs = await res.json();
    await offlineDb.cacheDocuments(docs);
    return docs;
  },

  async linkDigiLockerSandbox(): Promise<{ success: boolean; documents: DigiLockerDoc[] }> {
    if (!checkNetworkOnline()) {
      throw new Error('DigiLocker verification requires an active internet connection');
    }
    const res = await fetch(`${API_BASE}/digilocker/authorize-sandbox`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
    });
    if (!res.ok) throw new Error('DigiLocker sandbox authentication failed');
    const data = await res.json();
    await offlineDb.cacheDocuments(data.documents);
    return data;
  },

  // --- BANK & PFMS (Sandbox) ---
  async verifyBankPennyDrop(accountNumber: string, ifscCode: string): Promise<BankAccountVerification> {
    if (!checkNetworkOnline()) {
      throw new Error('Bank Penny-Drop verification requires an active internet connection');
    }
    const res = await fetch(`${API_BASE}/bank/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ accountNumber, ifscCode }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Bank verification failed');
    }
    return res.json();
  },

  // --- JAGO CHATBOT & VOICE ASSISTANT ---
  async sendChatMessage(message: string, history: Array<{ role: string; content: string }>): Promise<{ reply: string }> {
    if (!checkNetworkOnline()) {
      return {
        reply: 'आप वर्तमान में ऑफलाइन हैं। आपके प्रश्न को ऑफलाइन वॉइस/टेक्स्ट कतार में सुरक्षित कर लिया गया है। जैसे ही नेटवर्क वापस आएगा, यह उत्तर सिंक हो जाएगा। (You are offline. Your query has been safely queued.)',
      };
    }
    const res = await fetch(`${API_BASE}/chat/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ message, history }),
    });
    if (!res.ok) throw new Error('Assistant service unreachable');
    return res.json();
  },

  async syncVoiceNote(note: VoiceNoteRecord): Promise<VoiceNoteRecord> {
    if (!checkNetworkOnline()) {
      note.status = 'QUEUED_OFFLINE';
      await offlineDb.saveVoiceNote(note);
      return note;
    }

    try {
      const res = await fetch(`${API_BASE}/chat/sync-voice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify(note),
      });
      if (!res.ok) throw new Error('Voice sync failed');
      const synced: VoiceNoteRecord = await res.json();
      await offlineDb.saveVoiceNote(synced);
      return synced;
    } catch {
      note.status = 'QUEUED_OFFLINE';
      await offlineDb.saveVoiceNote(note);
      return note;
    }
  },

  // --- ADMIN METRICS ---
  async getAdminMetrics(): Promise<AdminMetrics> {
    const res = await fetch(`${API_BASE}/admin/metrics`, {
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) throw new Error('Failed to load metrics');
    return res.json();
  },

  // --- SYNC ENGINE ---
  async syncOfflineQueue(): Promise<{ syncedCount: number }> {
    if (!checkNetworkOnline()) return { syncedCount: 0 };
    const queue = await offlineDb.getOfflineQueue();
    if (!queue || queue.length === 0) return { syncedCount: 0 };

    try {
      const res = await fetch(`${API_BASE}/sync/batch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify({ actions: queue }),
      });
      if (res.ok) {
        await offlineDb.clearOfflineQueue();
        await offlineDb.setLastSyncTime(new Date().toISOString());
        return { syncedCount: queue.length };
      }
    } catch (e) {
      console.warn('Sync failed:', e);
    }
    return { syncedCount: 0 };
  },
};
