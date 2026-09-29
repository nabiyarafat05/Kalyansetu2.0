import { Scheme, Application, StudentProfile, DigiLockerDoc, VoiceNoteRecord } from '../types';

const DB_NAME = 'KalyansetuDB';
const DB_VERSION = 2;

class OfflineDatabase {
  private dbPromise: Promise<IDBDatabase | null>;

  constructor() {
    this.dbPromise = this.initIndexedDB();
  }

  private initIndexedDB(): Promise<IDBDatabase | null> {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      return Promise.resolve(null);
    }

    return new Promise((resolve) => {
      try {
        const request = window.indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains('schemes')) {
            db.createObjectStore('schemes', { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains('applications')) {
            db.createObjectStore('applications', { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains('documents')) {
            db.createObjectStore('documents', { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains('offline_queue')) {
            db.createObjectStore('offline_queue', { keyPath: 'id', autoIncrement: true });
          }
          if (!db.objectStoreNames.contains('voice_notes')) {
            db.createObjectStore('voice_notes', { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains('keyval')) {
            db.createObjectStore('keyval', { keyPath: 'key' });
          }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => {
          console.warn('IndexedDB failed to open, falling back to LocalStorage.');
          resolve(null);
        };
      } catch (e) {
        console.warn('IndexedDB init error:', e);
        resolve(null);
      }
    });
  }

  // Generic keyval fallback
  public async setItem<T>(key: string, value: T): Promise<void> {
    const db = await this.dbPromise;
    if (db) {
      return new Promise((resolve) => {
        try {
          const tx = db.transaction('keyval', 'readwrite');
          const store = tx.objectStore('keyval');
          store.put({ key, value });
          tx.oncomplete = () => resolve();
          tx.onerror = () => {
            this.fallbackSetItem(key, value);
            resolve();
          };
        } catch {
          this.fallbackSetItem(key, value);
          resolve();
        }
      });
    }
    this.fallbackSetItem(key, value);
  }

  public async getItem<T>(key: string): Promise<T | null> {
    const db = await this.dbPromise;
    if (db) {
      return new Promise((resolve) => {
        try {
          const tx = db.transaction('keyval', 'readonly');
          const store = tx.objectStore('keyval');
          const req = store.get(key);
          req.onsuccess = () => {
            if (req.result) {
              resolve(req.result.value as T);
            } else {
              resolve(this.fallbackGetItem<T>(key));
            }
          };
          req.onerror = () => resolve(this.fallbackGetItem<T>(key));
        } catch {
          resolve(this.fallbackGetItem<T>(key));
        }
      });
    }
    return this.fallbackGetItem<T>(key);
  }

  private fallbackSetItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(`kalyansetu_${key}`, JSON.stringify(value));
    } catch (e) {
      console.warn('LocalStorage write failed:', e);
    }
  }

  private fallbackGetItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(`kalyansetu_${key}`);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  }

  // Scheme caching
  public async cacheSchemes(schemes: Scheme[]): Promise<void> {
    await this.setItem('schemes', schemes);
    await this.setItem('schemes_last_synced', new Date().toISOString());
  }

  public async getCachedSchemes(): Promise<Scheme[]> {
    const schemes = await this.getItem<Scheme[]>('schemes');
    return schemes || [];
  }

  // Application caching
  public async cacheApplications(apps: Application[]): Promise<void> {
    await this.setItem('applications', apps);
    await this.setItem('apps_last_synced', new Date().toISOString());
  }

  public async getCachedApplications(): Promise<Application[]> {
    const apps = await this.getItem<Application[]>('applications');
    return apps || [];
  }

  // Student Profile caching
  public async cacheStudent(student: StudentProfile | null): Promise<void> {
    await this.setItem('student_profile', student);
  }

  public async getCachedStudent(): Promise<StudentProfile | null> {
    return this.getItem<StudentProfile>('student_profile');
  }

  // DigiLocker Documents
  public async cacheDocuments(docs: DigiLockerDoc[]): Promise<void> {
    await this.setItem('digilocker_docs', docs);
  }

  public async getCachedDocuments(): Promise<DigiLockerDoc[]> {
    const docs = await this.getItem<DigiLockerDoc[]>('digilocker_docs');
    return docs || [];
  }

  // Offline Voice Notes
  public async saveVoiceNote(note: VoiceNoteRecord): Promise<void> {
    const notes = await this.getVoiceNotes();
    const existingIndex = notes.findIndex((n) => n.id === note.id);
    if (existingIndex >= 0) {
      notes[existingIndex] = note;
    } else {
      notes.unshift(note);
    }
    await this.setItem('voice_notes', notes);
  }

  public async getVoiceNotes(): Promise<VoiceNoteRecord[]> {
    const notes = await this.getItem<VoiceNoteRecord[]>('voice_notes');
    return notes || [];
  }

  // Offline Queue for Actions
  public async enqueueOfflineAction(action: {
    type: 'SUBMIT_APPLICATION' | 'LINK_DIGILOCKER' | 'VERIFY_BANK' | 'VOICE_QUERY';
    payload: unknown;
    timestamp: string;
  }): Promise<void> {
    const queue = (await this.getItem<Array<unknown>>('offline_queue')) || [];
    queue.push(action);
    await this.setItem('offline_queue', queue);
  }

  public async getOfflineQueue(): Promise<Array<{ type: string; payload: unknown; timestamp: string }>> {
    const queue = await this.getItem<Array<{ type: string; payload: unknown; timestamp: string }>>('offline_queue');
    return queue || [];
  }

  public async clearOfflineQueue(): Promise<void> {
    await this.setItem('offline_queue', []);
  }

  public async getLastSyncTime(): Promise<string> {
    const time = await this.getItem<string>('last_sync_timestamp');
    return time || new Date().toISOString();
  }

  public async setLastSyncTime(isoString: string): Promise<void> {
    await this.setItem('last_sync_timestamp', isoString);
  }
}

export const offlineDb = new OfflineDatabase();
