import { useState } from 'react';
import { usePeriodStore } from '../store';
import { getCycleStatus, getTodayStr } from '../utils/periodLogic';
import { Droplet, Plus, Check, Bell, PenLine, RotateCcw } from 'lucide-react';
import { format } from 'date-fns';
import DailyLogModal from './DailyLogModal';

export default function Home() {
  const { records, settings, dailyLogs, addRecord, updateRecord, deleteRecord, saveDailyLog } = usePeriodStore();
  const todayStr = getTodayStr();
  const status = getCycleStatus(records, settings, todayStr);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [confirmState, setConfirmState] = useState<{isOpen: boolean, action: 'start' | 'end' | 'undo_end' | 'undo_start' | null}>({isOpen: false, action: null});

  const currentRecord = status.currentRecord;
  const isPeriodActive = status.isPeriod && !currentRecord?.endDate;
  const hasEndedToday = status.isPeriod && currentRecord?.endDate === todayStr;
  const hasStartedToday = status.isPeriod && currentRecord?.startDate === todayStr;

  const executeAction = () => {
    if (confirmState.action === 'start') {
      addRecord({ id: Date.now().toString() + Math.random().toString(36).substring(2), startDate: todayStr, endDate: null });
    } else if (confirmState.action === 'end' && currentRecord) {
      updateRecord(currentRecord.id, { endDate: todayStr });
    } else if (confirmState.action === 'undo_end' && currentRecord) {
      updateRecord(currentRecord.id, { endDate: null });
    } else if (confirmState.action === 'undo_start' && currentRecord) {
      deleteRecord(currentRecord.id);
    }
    setConfirmState({ isOpen: false, action: null });
  };

  const todayLog = dailyLogs[todayStr];

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] px-4 py-8 relative">
      
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

      <div className="flex flex-col gap-4 w-full max-w-xs items-center">
        {isPeriodActive ? (
          <button
            onClick={() => setConfirmState({ isOpen: true, action: 'end' })}
            className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-full text-white font-medium tracking-wide transition-all shadow-lg bg-stone-800 shadow-stone-800/20 hover:bg-stone-700 active:scale-95"
          >
            <Check className="w-5 h-5" />
            <span>结束姨妈</span>
          </button>
        ) : hasEndedToday ? (
          <button
            onClick={() => setConfirmState({ isOpen: true, action: 'undo_end' })}
            className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-full text-white font-medium tracking-wide transition-all shadow-lg bg-amber-500 shadow-amber-500/30 hover:bg-amber-600 active:scale-95"
          >
            <RotateCcw className="w-5 h-5" />
            <span>撤销结束</span>
          </button>
        ) : (
          <button
            onClick={() => setConfirmState({ isOpen: true, action: 'start' })}
            className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-full text-white font-medium tracking-wide transition-all shadow-lg bg-rose-500 shadow-rose-500/30 hover:bg-rose-600 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            <span>记录姨妈</span>
          </button>
        )}

        {isPeriodActive && hasStartedToday && (
          <button
            onClick={() => setConfirmState({ isOpen: true, action: 'undo_start' })}
            className="text-sm text-stone-400 hover:text-stone-600 transition-colors underline underline-offset-4 mt-1 mb-1"
          >
            撤销今日开始记录
          </button>
        )}

        <button
          onClick={() => setIsLogModalOpen(true)}
          className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-stone-700 font-medium tracking-wide transition-all shadow-sm border border-stone-100 hover:bg-stone-50 active:scale-95"
        >
          <PenLine className="w-5 h-5 text-stone-400" />
          <span>{todayLog && (todayLog.symptoms.length > 0 || todayLog.emotions.length > 0 || todayLog.customTags.length > 0) ? '修改今日症状' : '记录今日症状'}</span>
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
        records={records}
        addRecord={addRecord}
        updateRecord={updateRecord}
        deleteRecord={deleteRecord}
        onSave={saveDailyLog}
      />

      {/* Confirm Modal */}
      {confirmState.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 max-w-xs w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-medium text-stone-800 mb-2">
              {confirmState.action === 'start' && '记录姨妈'}
              {confirmState.action === 'end' && '结束姨妈'}
              {confirmState.action === 'undo_end' && '撤销结束'}
              {confirmState.action === 'undo_start' && '撤销记录'}
            </h3>
            <p className="text-stone-500 text-sm mb-6 leading-relaxed">
              {confirmState.action === 'start' && '确定要记录今天为经期开始吗？'}
              {confirmState.action === 'end' && '确定今天姨妈已经结束了吗？'}
              {confirmState.action === 'undo_end' && '确定要撤销结束状态，继续记录经期吗？'}
              {confirmState.action === 'undo_start' && '确定要删除今天的经期开始记录吗？'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmState({ isOpen: false, action: null })}
                className="flex-1 py-3 rounded-xl bg-stone-100 text-stone-600 font-medium hover:bg-stone-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={executeAction}
                className="flex-1 py-3 rounded-xl bg-rose-500 text-white font-medium hover:bg-rose-600 transition-colors"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
