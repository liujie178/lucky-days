import { usePeriodStore } from '../store';
import { differenceInDays, parseISO, format } from 'date-fns';
import { Activity, CalendarDays } from 'lucide-react';

export default function Stats() {
  const { records, settings } = usePeriodStore();

  const sortedRecords = [...records].sort((a, b) => b.startDate.localeCompare(a.startDate));

  const cycleLengths = [];
  for (let i = 0; i < sortedRecords.length - 1; i++) {
    const current = parseISO(sortedRecords[i].startDate);
    const previous = parseISO(sortedRecords[i + 1].startDate);
    cycleLengths.push(differenceInDays(current, previous));
  }

  const avgCycle = cycleLengths.length > 0 
    ? Math.round(cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length)
    : settings.averageCycleLength;

  return (
    <div className="px-4 py-8 max-w-md mx-auto space-y-8">
      <h2 className="text-2xl font-light text-stone-800 tracking-tight mb-6">统计数据</h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center justify-center text-center">
          <Activity className="w-6 h-6 text-rose-400 mb-3" />
          <div className="text-3xl font-light text-stone-800 mb-1">
            {avgCycle} <span className="text-sm text-stone-500 font-normal">天</span>
          </div>
          <div className="text-xs text-stone-400 font-medium tracking-wide uppercase">平均周期</div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center justify-center text-center">
          <CalendarDays className="w-6 h-6 text-rose-400 mb-3" />
          <div className="text-3xl font-light text-stone-800 mb-1">
            {settings.averagePeriodLength} <span className="text-sm text-stone-500 font-normal">天</span>
          </div>
          <div className="text-xs text-stone-400 font-medium tracking-wide uppercase">平均经期</div>
        </div>
      </div>

      <div className="mt-12">
        <h3 className="text-sm font-medium text-stone-500 tracking-wide uppercase mb-4">历史记录</h3>
        {sortedRecords.length === 0 ? (
          <p className="text-stone-400 text-sm text-center py-8">暂无记录</p>
        ) : (
          <div className="space-y-3">
            {sortedRecords.map((record, index) => {
              const start = parseISO(record.startDate);
              const end = record.endDate ? parseISO(record.endDate) : null;
              const periodLength = end ? differenceInDays(end, start) + 1 : '-';
              const cycleLength = index < sortedRecords.length - 1 
                ? differenceInDays(start, parseISO(sortedRecords[index + 1].startDate))
                : '-';

              return (
                <div key={record.id} className="bg-white p-4 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] flex items-center justify-between">
                  <div>
                    <div className="text-stone-800 font-medium">
                      {format(start, 'MM月dd日')}
                      {end && <span className="text-stone-400 font-normal text-sm ml-2">至 {format(end, 'MM月dd日')}</span>}
                    </div>
                    <div className="text-xs text-stone-400 mt-1">
                      经期: {periodLength}天
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg text-rose-500 font-light">{cycleLength}</div>
                    <div className="text-[10px] text-stone-400 uppercase tracking-wider">周期天数</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
