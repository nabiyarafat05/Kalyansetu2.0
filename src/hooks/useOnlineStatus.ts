import { useEffect, useState } from 'react';

// Shared state for simulated offline override
let simulatedOffline = false;
const listeners = new Set<(online: boolean) => void>();

export function setSimulatedOffline(isSimulatedOffline: boolean) {
  simulatedOffline = isSimulatedOffline;
  const currentStatus = !simulatedOffline && (typeof navigator !== 'undefined' ? navigator.onLine : true);
  listeners.forEach((listener) => listener(currentStatus));
}

export function getSimulatedOffline(): boolean {
  return simulatedOffline;
}

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    if (simulatedOffline) return false;
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });

  useEffect(() => {
    const update = () => {
      if (simulatedOffline) {
        setIsOnline(false);
      } else {
        setIsOnline(typeof navigator !== 'undefined' ? navigator.onLine : true);
      }
    };

    listeners.add(setIsOnline);
    window.addEventListener('online', update);
    window.addEventListener('offline', update);

    return () => {
      listeners.delete(setIsOnline);
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);

  return {
    isOnline,
    isSimulated: simulatedOffline,
    toggleSimulateOffline: () => {
      setSimulatedOffline(!simulatedOffline);
    },
  };
}
