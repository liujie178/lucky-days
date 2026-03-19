import { usePeriodStore } from '../store';
import { Settings as SettingsIcon, Save } from 'lucide-react';
import { useState } from 'react';

export default function Settings() {
  const { settings, setSettings } = usePeriodStore();
  const [cycleLength, setCycleLength] = useState(settings.averageCycleLength);
  const [periodLength, setPeriodLength] = useState(settings.averagePeriodLength);
  const [reminderDays, setReminderDays] = useState(settings.reminderDays || 2);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSettings({
      averageCycleLength: cycleLength,
      averagePeriodLength: periodLength,
      reminderDays: reminderDays
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="px-4 py-8 max-w-md mx-auto space-y-8">
      <div className="flex items-center gap-3 mb-8">
        <SettingsIcon className="w-6 h-6 text-stone-800" />
        <h2 className="text-2xl font-light text-stone-800 tracking-tight">设置</h2>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-6">
        <div>
          <label className="block text-sm font-medium text-stone-600 mb-2 tracking-wide">
            平均周期长度 (天)
          </label>
          <input
            type="number"
            value={cycleLength}
            onChange={(e) => setCycleLength(Number(e.target.value))}
            className="w-full bg-stone-50 border-none rounded-2xl px-4 py-3 text-stone-800 focus:ring-2 focus:ring-rose-200 transition-all"
            min="15"
            max="60"
          />
          <p className="text-xs text-stone-400 mt-2">通常在 21 到 35 天之间</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-600 mb-2 tracking-wide">
            平均经期长度 (天)
          </label>
          <input
            type="number"
            value={periodLength}
            onChange={(e) => setPeriodLength(Number(e.target.value))}
            className="w-full bg-stone-50 border-none rounded-2xl px-4 py-3 text-stone-800 focus:ring-2 focus:ring-rose-200 transition-all"
            min="1"
            max="15"
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
      
      <div className="text-center pt-12">
        <p className="text-xs text-stone-400">
          数据仅保存在您的设备本地，保护您的隐私。
        </p>
      </div>
    </div>
  );
}
