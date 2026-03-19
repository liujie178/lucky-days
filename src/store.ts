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

  return { records, dailyLogs, settings, setSettings, addRecord, updateRecord, deleteRecord, saveDailyLog };
}
