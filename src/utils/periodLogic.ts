import { differenceInDays, addDays, parseISO, isBefore, isAfter, startOfDay, format, isSameDay } from 'date-fns';
import { PeriodRecord, UserSettings } from '../store';

export function getTodayStr() {
  return format(new Date(), 'yyyy-MM-dd');
}

export function getDynamicAverages(records: PeriodRecord[], settings: UserSettings) {
  if (records.length === 0) {
    return { cycle: settings.averageCycleLength, period: settings.averagePeriodLength, isCalculated: false };
  }
  
  const sorted = [...records].sort((a, b) => b.startDate.localeCompare(a.startDate));
  let totalCycle = 0;
  let cycleCount = 0;
  let totalPeriod = 0;
  let periodCount = 0;

  for (let i = 0; i < sorted.length - 1; i++) {
    const current = parseISO(sorted[i].startDate);
    const prev = parseISO(sorted[i+1].startDate);
    const diff = differenceInDays(current, prev);
    // Filter out extreme outliers (e.g., missed logging for a month)
    if (diff >= 15 && diff <= 60) {
      totalCycle += diff;
      cycleCount++;
    }
  }

  for (const r of sorted) {
    if (r.endDate) {
      const diff = differenceInDays(parseISO(r.endDate), parseISO(r.startDate)) + 1;
      // Filter out extreme outliers
      if (diff >= 1 && diff <= 15) {
        totalPeriod += diff;
        periodCount++;
      }
    }
  }

  const cycle = cycleCount > 0 ? Math.round(totalCycle / cycleCount) : settings.averageCycleLength;
  const period = periodCount > 0 ? Math.round(totalPeriod / periodCount) : settings.averagePeriodLength;

  return {
    cycle,
    period,
    isCalculated: cycleCount > 0 || periodCount > 0,
    cycleCount,
    periodCount
  };
}

export function getCycleStatus(records: PeriodRecord[], settings: UserSettings, todayStr: string = getTodayStr()) {
  const today = startOfDay(parseISO(todayStr));
  const averages = getDynamicAverages(records, settings);
  
  if (records.length === 0) {
    return {
      status: 'no_data',
      message: '暂无记录',
      days: 0,
      nextPeriodDate: null,
      isPeriod: false,
      currentRecord: null,
      isUpcoming: false
    };
  }

  const sorted = [...records].sort((a, b) => b.startDate.localeCompare(a.startDate));
  const latestRecord = sorted[0];
  const latestStart = startOfDay(parseISO(latestRecord.startDate));
  
  let isPeriod = false;
  let currentPeriodDay = 0;
  
  if (latestRecord.endDate) {
    const latestEnd = startOfDay(parseISO(latestRecord.endDate));
    if ((isAfter(today, latestStart) || isSameDay(today, latestStart)) && 
        (isBefore(today, latestEnd) || isSameDay(today, latestEnd))) {
      isPeriod = true;
      currentPeriodDay = differenceInDays(today, latestStart) + 1;
    }
  } else {
    if (isAfter(today, latestStart) || isSameDay(today, latestStart)) {
      const daysSinceStart = differenceInDays(today, latestStart);
      if (daysSinceStart < averages.period) {
        isPeriod = true;
        currentPeriodDay = daysSinceStart + 1;
      }
    }
  }

  const nextPeriodDate = addDays(latestStart, averages.cycle);
  const daysUntilNext = differenceInDays(nextPeriodDate, today);
  const isUpcoming = !isPeriod && daysUntilNext > 0 && daysUntilNext <= (settings.reminderDays || 2);

  if (isPeriod) {
    return {
      status: 'period',
      message: `经期第 ${currentPeriodDay} 天`,
      days: currentPeriodDay,
      nextPeriodDate,
      isPeriod: true,
      currentRecord: latestRecord,
      isUpcoming: false
    };
  }

  if (daysUntilNext < 0) {
    return {
      status: 'late',
      message: `姨妈迟到了 ${Math.abs(daysUntilNext)} 天`,
      days: Math.abs(daysUntilNext),
      nextPeriodDate,
      isPeriod: false,
      currentRecord: latestRecord,
      isUpcoming: false
    };
  }

  return {
    status: 'waiting',
    message: `距离下次姨妈还有 ${daysUntilNext} 天`,
    days: daysUntilNext,
    nextPeriodDate,
    isPeriod: false,
    currentRecord: latestRecord,
    isUpcoming
  };
}

export function isDayInPeriod(dateStr: string, records: PeriodRecord[], settings: UserSettings) {
  const date = startOfDay(parseISO(dateStr));
  const averages = getDynamicAverages(records, settings);
  for (const record of records) {
    const start = startOfDay(parseISO(record.startDate));
    const end = record.endDate ? startOfDay(parseISO(record.endDate)) : addDays(start, averages.period - 1);
    if ((isAfter(date, start) || isSameDay(date, start)) && 
        (isBefore(date, end) || isSameDay(date, end))) {
      return true;
    }
  }
  return false;
}

export function getPredictedPeriods(records: PeriodRecord[], settings: UserSettings, monthsAhead: number = 3) {
  if (records.length === 0) return [];
  
  const averages = getDynamicAverages(records, settings);
  const sorted = [...records].sort((a, b) => b.startDate.localeCompare(a.startDate));
  const latestStart = startOfDay(parseISO(sorted[0].startDate));
  
  const predictions = [];
  for (let i = 1; i <= monthsAhead; i++) {
    const predictedStart = addDays(latestStart, averages.cycle * i);
    const predictedEnd = addDays(predictedStart, averages.period - 1);
    predictions.push({ start: predictedStart, end: predictedEnd });
  }
  return predictions;
}

export function isDayPredictedPeriod(dateStr: string, records: PeriodRecord[], settings: UserSettings) {
  const date = startOfDay(parseISO(dateStr));
  const predictions = getPredictedPeriods(records, settings);
  
  for (const pred of predictions) {
    if ((isAfter(date, pred.start) || isSameDay(date, pred.start)) && 
        (isBefore(date, pred.end) || isSameDay(date, pred.end))) {
      return true;
    }
  }
  return false;
}
