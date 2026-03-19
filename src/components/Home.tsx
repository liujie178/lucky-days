import { useState } from 'react';
import { usePeriodStore } from '../store';
import { getCycleStatus, getTodayStr } from '../utils/periodLogic';
import { Droplet, Plus, Check, Bell, PenLine } from 'lucide-react';
import { format } from 'date-fns';
import DailyLogModal from './DailyLogModal';

export default function Home() {
  const { records, settings, dailyLogs, addRecord, updateRecord, saveDailyLog } = usePeriodStore();
  const todayStr = getTodayStr();
  const status = getCycleStatus(records, settings, todayStr);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  const handleLogPeriod = () => {
    if (status.isPeriod && status.currentRecord) {
      updateRecord(status.currentRecord.id, { endDate: todayStr });
    } else {
      addRecord({
        id: crypto.randomUUID(),
        startDate: todayStr,
        endDate: null,
      });
    }
  };

  const todayLog = dailyLogs[todayStr];

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] px-4 py-8">
      
      {status.isUpcoming && (
        <div className="w-full max-w-sm mb-8 bg-rose-50 border border-rose-100 rounded-2xl p-4 flex items-start gap-3 shadow-sm animate-in fade-in slide-in-from-top-4">
          <div className="bg-rose-100 p-2 rounded-full shrink-0">
            <Bell className="w-5 h-5 text-rose-500" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-rose-800 mb-1">温馨提示</h4>
            <p className="text-xs text-rose-600 leading-relaxed">
              预计还有 <span className="font-bold text-rose-700">{status.days}</span> 天来姨妈，请注意保暖，提前准备好卫生用品哦～
            </p>
          </div>
        </div>
      )}

      <div className="relative w-64 h-64 flex items-center justify-center rounded-full bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-rose-50 mb-12">
        <div className="absolute inset-2 rounded-full border border-rose-100/50"></div>
        <div className="absolute inset-4 rounded-full border border-rose-100/30"></div>
        
        <div className="text-center z-10 flex flex-col items-center">
          {status.status === 'period' ? (
            <Droplet className="w-8 h-8 text-rose-500 mb-2 fill-rose-500" />
          ) : (
            <Droplet className="w-8 h-8 text-rose-300 mb-2" />
          )}
          
          <h2 className="text-4xl font-light text-stone-800 mb-2 tracking-tight">
            {status.days} <span className="text-lg text-stone-500 font-normal">天</span>
          </h2>
          <p className="text-sm text-stone-500 font-medium tracking-wide">
            {status.message}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <button
          onClick={handleLogPeriod}
          className={`flex items-center justify-center gap-2 px-8 py-4 rounded-full text-white font-medium tracking-wide transition-all shadow-lg hover:shadow-xl active:scale-95 ${
            status.isPeriod 
              ? 'bg-stone-800 shadow-stone-800/20 hover:bg-stone-700' 
              : 'bg-rose-500 shadow-rose-500/30 hover:bg-rose-600'
          }`}
        >
          {status.isPeriod ? (
            <>
              <Check className="w-5 h-5" />
              <span>结束姨妈</span>
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" />
              <span>记录姨妈</span>
            </>
          )}
        </button>

        <button
          onClick={() => setIsLogModalOpen(true)}
          className="flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-stone-700 font-medium tracking-wide transition-all shadow-sm border border-stone-100 hover:bg-stone-50 active:scale-95"
        >
          <PenLine className="w-5 h-5 text-stone-400" />
          <span>{todayLog && (todayLog.symptoms.length > 0 || todayLog.emotions.length > 0) ? '修改今日症状' : '记录今日症状'}</span>
        </button>
      </div>

      {status.nextPeriodDate && !status.isPeriod && (
        <p className="mt-8 text-sm text-stone-400">
          预计下次: {format(status.nextPeriodDate, 'yyyy年MM月dd日')}
        </p>
      )}

      <DailyLogModal 
        isOpen={isLogModalOpen} 
        onClose={() => setIsLogModalOpen(false)} 
        date={todayStr}
        initialData={todayLog}
        onSave={saveDailyLog}
      />
    </div>
  );
}
