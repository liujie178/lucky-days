import { useState } from 'react';
import { usePeriodStore } from '../store';
import { isDayInPeriod, isDayPredictedPeriod, getTodayStr } from '../utils/periodLogic';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, isSameMonth, isSameDay, startOfWeek, endOfWeek } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import DailyLogModal from './DailyLogModal';

export default function Calendar() {
  const { records, settings, dailyLogs, saveDailyLog } = usePeriodStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  return (
    <div className="px-4 py-8 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-8">
        <button onClick={handlePrevMonth} className="p-2 text-stone-400 hover:text-stone-800 transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-medium text-stone-800 tracking-wide">
          {format(currentDate, 'yyyy年 MM月')}
        </h2>
        <button onClick={handleNextMonth} className="p-2 text-stone-400 hover:text-stone-800 transition-colors">
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-4">
        {['一', '二', '三', '四', '五', '六', '日'].map(day => (
          <div key={day} className="text-center text-xs font-medium text-stone-400 pb-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-4 gap-x-2">
        {days.map(day => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isToday = isSameDay(day, new Date());
          const isPeriod = isDayInPeriod(dateStr, records, settings);
          const isPredicted = isDayPredictedPeriod(dateStr, records, settings);
          const hasLog = dailyLogs[dateStr] && (dailyLogs[dateStr].symptoms.length > 0 || dailyLogs[dateStr].emotions.length > 0 || dailyLogs[dateStr].customTags.length > 0);

          let bgClass = 'bg-transparent';
          let textClass = isCurrentMonth ? 'text-stone-700' : 'text-stone-300';
          let borderClass = 'border-transparent';

          if (isPeriod) {
            bgClass = 'bg-rose-500';
            textClass = 'text-white font-medium';
          } else if (isPredicted) {
            bgClass = 'bg-rose-50';
            textClass = 'text-rose-400';
            borderClass = 'border-rose-200 border-dashed';
          }

          if (isToday && !isPeriod) {
            borderClass = 'border-stone-800';
            textClass = 'text-stone-900 font-bold';
          }

          return (
            <div key={dateStr} className="flex flex-col items-center gap-1">
              <button 
                onClick={() => setSelectedDateStr(dateStr)}
                className={`w-10 h-10 flex items-center justify-center rounded-full text-sm transition-all border hover:scale-110 active:scale-95 ${bgClass} ${textClass} ${borderClass}`}
              >
                {format(day, 'd')}
              </button>
              {/* Indicator for logs */}
              <div className={`w-1.5 h-1.5 rounded-full ${hasLog ? 'bg-amber-400' : 'bg-transparent'}`}></div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 space-y-4 bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <h3 className="text-sm font-medium text-stone-800 mb-4">图例说明</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 text-sm text-stone-600">
            <div className="w-4 h-4 rounded-full bg-rose-500"></div>
            <span>经期</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-stone-600">
            <div className="w-4 h-4 rounded-full bg-rose-50 border border-rose-200 border-dashed"></div>
            <span>预测经期</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-stone-600">
            <div className="w-4 h-4 rounded-full border border-stone-800"></div>
            <span>今天</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-stone-600">
            <div className="w-4 h-4 flex items-end justify-center pb-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
            </div>
            <span>有症状记录</span>
          </div>
        </div>
      </div>

      {selectedDateStr && (
        <DailyLogModal 
          isOpen={!!selectedDateStr} 
          onClose={() => setSelectedDateStr(null)} 
          date={selectedDateStr}
          initialData={dailyLogs[selectedDateStr]}
          onSave={saveDailyLog}
        />
      )}
    </div>
  );
}
