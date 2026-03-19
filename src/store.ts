import { useState, useEffect } from 'react';

export interface PeriodRecord {
  id: string;
  startDate: string; // YYYY-MM-DD
  endDate: string | null; // YYYY-MM-DD
  flow?: 'light' | 'medium' | 'heavy';
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  symptoms: string[];
  emotions: string[];
  customTags: string[];
  note?: string;
}

export interface UserSettings {
  averageCycleLength: number;
  averagePeriodLength: number;
  reminderDays: number;
}

export function usePeriodStore() {
  const [records, setRecords] = useState<PeriodRecord[]>(() => {
    const saved = localStorage.getItem('period_records');
    return saved ? JSON.parse(saved) : [];
  });

  const [dailyLogs, setDailyLogs] = useState<Record<string, DailyLog>>(() => {
    const saved = localStorage.getItem('period_daily_logs');
    return saved ? JSON.parse(saved) : {};
  });

  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('period_settings');
    return saved ? JSON.parse(saved) : { averageCycleLength: 28, averagePeriodLength: 5, reminderDays: 2 };
  });

  const [hasBackup, setHasBackup] = useState<boolean>(() => {
    return !!localStorage.getItem('period_backup_records');
  });

  useEffect(() => {
    localStorage.setItem('period_records', JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    localStorage.setItem('period_daily_logs', JSON.stringify(dailyLogs));
  }, [dailyLogs]);

  useEffect(() => {
    localStorage.setItem('period_settings', JSON.stringify(settings));
  }, [settings]);

  const addRecord = (record: PeriodRecord) => {
    setRecords(prev => [...prev, record].sort((a, b) => a.startDate.localeCompare(b.startDate)));
  };

  const updateRecord = (id: string, updates: Partial<PeriodRecord>) => {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const deleteRecord = (id: string) => {
    setRecords(prev => prev.filter(r => r.id !== id));
  };

  const saveDailyLog = (log: DailyLog) => {
    setDailyLogs(prev => ({ ...prev, [log.date]: log }));
  };

  const clearAllData = () => {
    localStorage.setItem('period_backup_records', JSON.stringify(records));
    localStorage.setItem('period_backup_daily_logs', JSON.stringify(dailyLogs));
    localStorage.setItem('period_backup_settings', JSON.stringify(settings));
    setHasBackup(true);

    setRecords([]);
    setDailyLogs({});
    setSettings({ averageCycleLength: 28, averagePeriodLength: 5, reminderDays: 2 });
  };

  const restoreData = () => {
    const backupRecords = localStorage.getItem('period_backup_records');
    const backupLogs = localStorage.getItem('period_backup_daily_logs');
    const backupSettings = localStorage.getItem('period_backup_settings');

    if (backupRecords) setRecords(JSON.parse(backupRecords));
    if (backupLogs) setDailyLogs(JSON.parse(backupLogs));
    if (backupSettings) setSettings(JSON.parse(backupSettings));

    localStorage.removeItem('period_backup_records');
    localStorage.removeItem('period_backup_daily_logs');
    localStorage.removeItem('period_backup_settings');
    setHasBackup(false);
  };

  return { 
    records, 
    dailyLogs, 
    settings, 
    hasBackup,
    setSettings, 
    addRecord, 
    updateRecord, 
    deleteRecord, 
    saveDailyLog,
    clearAllData,
    restoreData
  };
}
