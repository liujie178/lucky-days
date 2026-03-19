import { usePeriodStore } from '../store';
import { Settings as SettingsIcon, Save, Info, Trash2, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { getDynamicAverages } from '../utils/periodLogic';

export default function Settings() {
  const { records, settings, setSettings, clearAllData, restoreData, hasBackup } = usePeriodStore();
  const [cycleLength, setCycleLength] = useState(settings.averageCycleLength);
  const [periodLength, setPeriodLength] = useState(settings.averagePeriodLength);
  const [reminderDays, setReminderDays] = useState(settings.reminderDays || 2);
  const [saved, setSaved] = useState(false);
  
  const [confirmClear, setConfirmClear] = useState(false);
  const [confirmRestore, setConfirmRestore] = useState(false);

  const averages = getDynamicAverages(records, settings);

  const handleSave = () => {
    setSettings({
      averageCycleLength: cycleLength,
      averagePeriodLength: periodLength,
      reminderDays: reminderDays
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClearData = () => {
    clearAllData();
    setConfirmClear(false);
    // Reset local state to defaults
    setCycleLength(28);
    setPeriodLength(5);
    setReminderDays(2);
  };

  const handleRestoreData = () => {
    restoreData();
    setConfirmRestore(false);
    // Note: To perfectly sync local state, we'd need to read from the restored settings,
    // but since the component will re-render with new settings from store, we can just use an effect or let the user see it.
    // Actually, it's better to just reload the window to ensure all states across the app are perfectly synced from localStorage
    // since we are using a simple custom hook without global state management.
    window.location.reload();
  };

  return (
    <div className="px-4 py-8 max-w-md mx-auto space-y-8">
      <div className="flex items-center gap-3 mb-8">
        <SettingsIcon className="w-6 h-6 text-stone-800" />
        <h2 className="text-2xl font-light text-stone-800 tracking-tight">设置</h2>
      </div>

      {averages.isCalculated && (
        <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-start gap-3">
          <Info className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-rose-800 mb-1">智能预测已开启</h4>
            <p className="text-xs text-rose-600 leading-relaxed">
              根据您的历史记录，系统已自动计算出您的平均周期为 <strong>{averages.cycle}</strong> 天，平均经期为 <strong>{averages.period}</strong> 天。以下手动设置仅在数据不足时作为初始参考。
            </p>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-6">
        <div className={averages.isCalculated ? 'opacity-60 pointer-events-none' : ''}>
          <label className="block text-sm font-medium text-stone-600 mb-2 tracking-wide">
            初始平均周期长度 (天)
          </label>
          <input
            type="number"
            value={cycleLength}
            onChange={(e) => setCycleLength(Number(e.target.value))}
            className="w-full bg-stone-50 border-none rounded-2xl px-4 py-3 text-stone-800 focus:ring-2 focus:ring-rose-200 transition-all"
            min="15"
            max="60"
            disabled={averages.isCalculated}
          />
          <p className="text-xs text-stone-400 mt-2">通常在 21 到 35 天之间</p>
        </div>

        <div className={averages.isCalculated ? 'opacity-60 pointer-events-none' : ''}>
          <label className="block text-sm font-medium text-stone-600 mb-2 tracking-wide">
            初始平均经期长度 (天)
          </label>
          <input
            type="number"
            value={periodLength}
            onChange={(e) => setPeriodLength(Number(e.target.value))}
            className="w-full bg-stone-50 border-none rounded-2xl px-4 py-3 text-stone-800 focus:ring-2 focus:ring-rose-200 transition-all"
            min="1"
            max="15"
            disabled={averages.isCalculated}
          />
          <p className="text-xs text-stone-400 mt-2">通常在 3 到 7 天之间</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-600 mb-2 tracking-wide">
            经期提前提醒 (天)
          </label>
          <input
            type="number"
            value={reminderDays}
            onChange={(e) => setReminderDays(Number(e.target.value))}
            className="w-full bg-stone-50 border-none rounded-2xl px-4 py-3 text-stone-800 focus:ring-2 focus:ring-rose-200 transition-all"
            min="1"
            max="7"
          />
          <p className="text-xs text-stone-400 mt-2">在预测经期前几天发送提醒</p>
        </div>

        <button
          onClick={handleSave}
          className="w-full flex items-center justify-center gap-2 bg-stone-800 text-white rounded-2xl py-4 font-medium tracking-wide hover:bg-stone-700 transition-colors active:scale-95"
        >
          {saved ? (
            <>
              <Save className="w-5 h-5 text-emerald-400" />
              <span className="text-emerald-400">已保存</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>保存设置</span>
            </>
          )}
        </button>
      </div>
      
      {/* Data Management Section */}
      <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-6">
        <h3 className="text-sm font-medium text-stone-800 tracking-wide mb-4">数据管理</h3>
        
        <div className="space-y-4">
          <button
            onClick={() => setConfirmClear(true)}
            className="w-full flex items-center justify-center gap-2 bg-rose-50 text-rose-600 rounded-2xl py-4 font-medium tracking-wide hover:bg-rose-100 transition-colors active:scale-95 border border-rose-100"
          >
            <Trash2 className="w-5 h-5" />
            <span>清除所有数据</span>
          </button>

          {hasBackup && (
            <button
              onClick={() => setConfirmRestore(true)}
              className="w-full flex items-center justify-center gap-2 bg-stone-50 text-stone-600 rounded-2xl py-4 font-medium tracking-wide hover:bg-stone-100 transition-colors active:scale-95 border border-stone-200"
            >
              <RotateCcw className="w-5 h-5" />
              <span>恢复最近清除的数据</span>
            </button>
          )}
        </div>
      </div>

      <div className="text-center pt-4">
        <p className="text-xs text-stone-400">
          数据仅保存在您的设备本地，保护您的隐私。
        </p>
      </div>

      {/* Clear Confirmation Modal */}
      {confirmClear && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 max-w-xs w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-medium text-stone-800 mb-2">清除所有数据</h3>
            <p className="text-stone-500 text-sm mb-6 leading-relaxed">
              确定要清除所有经期记录、症状日志和设置吗？此操作会将应用恢复到初始状态。
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmClear(false)}
                className="flex-1 py-3 rounded-xl bg-stone-100 text-stone-600 font-medium hover:bg-stone-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleClearData}
                className="flex-1 py-3 rounded-xl bg-rose-500 text-white font-medium hover:bg-rose-600 transition-colors"
              >
                确定清除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Restore Confirmation Modal */}
      {confirmRestore && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 max-w-xs w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-medium text-stone-800 mb-2">恢复数据</h3>
            <p className="text-stone-500 text-sm mb-6 leading-relaxed">
              确定要恢复最近一次清除的数据吗？这将会覆盖您当前的所有新记录。
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmRestore(false)}
                className="flex-1 py-3 rounded-xl bg-stone-100 text-stone-600 font-medium hover:bg-stone-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleRestoreData}
                className="flex-1 py-3 rounded-xl bg-stone-800 text-white font-medium hover:bg-stone-700 transition-colors"
              >
                确定恢复
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
