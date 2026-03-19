import { useState, useEffect } from 'react';
import { X, Plus, Check } from 'lucide-react';
import { DailyLog } from '../store';
import { format, parseISO } from 'date-fns';

const SYMPTOMS_LIST = ['腹痛', '头痛', '疲劳', '水肿', '长痘', '胸胀', '腰酸', '失眠', '食欲大增', '畏寒'];
const EMOTIONS_LIST = ['开心', '平静', '焦虑', '易怒', '低落', '敏感', '疲惫', '充满活力'];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  date: string;
  initialData?: DailyLog;
  onSave: (log: DailyLog) => void;
}

export default function DailyLogModal({ isOpen, onClose, date, initialData, onSave }: Props) {
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [emotions, setEmotions] = useState<string[]>([]);
  const [customTags, setCustomTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setSymptoms(initialData.symptoms || []);
        setEmotions(initialData.emotions || []);
        setCustomTags(initialData.customTags || []);
      } else {
        setSymptoms([]);
        setEmotions([]);
        setCustomTags([]);
      }
      setNewTag('');
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const toggleItem = (list: string[], setList: (l: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleAddCustomTag = () => {
    if (newTag.trim() && !customTags.includes(newTag.trim())) {
      setCustomTags([...customTags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleSave = () => {
    onSave({
      date,
      symptoms,
      emotions,
      customTags
    });
    onClose();
  };

  const displayDate = format(parseISO(date), 'MM月dd日');

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl h-[85vh] sm:h-auto sm:max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <h3 className="text-lg font-medium text-stone-800">{displayDate} 记录</h3>
          <button onClick={onClose} className="p-2 text-stone-400 hover:text-stone-600 rounded-full hover:bg-stone-50 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Symptoms */}
          <section>
            <h4 className="text-sm font-medium text-stone-500 mb-3 tracking-wide">身体症状</h4>
            <div className="flex flex-wrap gap-2">
              {SYMPTOMS_LIST.map(sym => {
                const isSelected = symptoms.includes(sym);
                return (
                  <button
                    key={sym}
                    onClick={() => toggleItem(symptoms, setSymptoms, sym)}
                    className={`px-4 py-2 rounded-full text-sm transition-all border ${
                      isSelected 
                        ? 'bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-500/20' 
                        : 'bg-white text-stone-600 border-stone-200 hover:border-rose-300 hover:bg-rose-50'
                    }`}
                  >
                    {sym}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Emotions */}
          <section>
            <h4 className="text-sm font-medium text-stone-500 mb-3 tracking-wide">情绪状态</h4>
            <div className="flex flex-wrap gap-2">
              {EMOTIONS_LIST.map(emo => {
                const isSelected = emotions.includes(emo);
                return (
                  <button
                    key={emo}
                    onClick={() => toggleItem(emotions, setEmotions, emo)}
                    className={`px-4 py-2 rounded-full text-sm transition-all border ${
                      isSelected 
                        ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/20' 
                        : 'bg-white text-stone-600 border-stone-200 hover:border-amber-300 hover:bg-amber-50'
                    }`}
                  >
                    {emo}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Custom Tags */}
          <section>
            <h4 className="text-sm font-medium text-stone-500 mb-3 tracking-wide">自定义标签</h4>
            <div className="flex flex-wrap gap-2 mb-3">
              {customTags.map(tag => (
                <div key={tag} className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm bg-stone-100 text-stone-700 border border-stone-200">
                  <span>{tag}</span>
                  <button onClick={() => setCustomTags(customTags.filter(t => t !== tag))} className="text-stone-400 hover:text-stone-600">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddCustomTag()}
                placeholder="添加新标签..."
                className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-200 transition-all"
              />
              <button 
                onClick={handleAddCustomTag}
                className="p-2 bg-stone-800 text-white rounded-xl hover:bg-stone-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </section>
        </div>

        <div className="p-6 border-t border-stone-100 bg-white">
          <button
            onClick={handleSave}
            className="w-full flex items-center justify-center gap-2 bg-stone-800 text-white rounded-2xl py-4 font-medium tracking-wide hover:bg-stone-700 transition-colors active:scale-95 shadow-lg shadow-stone-800/20"
          >
            <Check className="w-5 h-5" />
            <span>保存记录</span>
          </button>
        </div>
      </div>
    </div>
  );
}
