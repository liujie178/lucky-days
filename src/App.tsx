import { useState } from 'react';
import Home from './components/Home';
import Calendar from './components/Calendar';
import Stats from './components/Stats';
import Settings from './components/Settings';
import Discover from './components/Discover';
import { Home as HomeIcon, Calendar as CalendarIcon, Activity, Settings as SettingsIcon, Leaf } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="min-h-screen bg-[#FFF5F5] font-sans text-stone-800 pb-24">
      <main className="max-w-md mx-auto h-full">
        {activeTab === 'home' && <Home />}
        {activeTab === 'calendar' && <Calendar />}
        {activeTab === 'discover' && <Discover />}
        {activeTab === 'stats' && <Stats />}
        {activeTab === 'settings' && <Settings />}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-rose-100/50 pb-safe z-40">
        <div className="max-w-md mx-auto px-4 py-3 flex justify-between items-center">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 transition-colors w-14 ${
              activeTab === 'home' ? 'text-rose-500' : 'text-stone-400 hover:text-stone-600'
            }`}
          >
            <HomeIcon className="w-5 h-5" />
            <span className="text-[10px] font-medium tracking-wide">首页</span>
          </button>
          
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex flex-col items-center gap-1 transition-colors w-14 ${
              activeTab === 'calendar' ? 'text-rose-500' : 'text-stone-400 hover:text-stone-600'
            }`}
          >
            <CalendarIcon className="w-5 h-5" />
            <span className="text-[10px] font-medium tracking-wide">日历</span>
          </button>

          <button
            onClick={() => setActiveTab('discover')}
            className={`flex flex-col items-center gap-1 transition-colors w-14 ${
              activeTab === 'discover' ? 'text-rose-500' : 'text-stone-400 hover:text-stone-600'
            }`}
          >
            <Leaf className="w-5 h-5" />
            <span className="text-[10px] font-medium tracking-wide">发现</span>
          </button>
          
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex flex-col items-center gap-1 transition-colors w-14 ${
              activeTab === 'stats' ? 'text-rose-500' : 'text-stone-400 hover:text-stone-600'
            }`}
          >
            <Activity className="w-5 h-5" />
            <span className="text-[10px] font-medium tracking-wide">统计</span>
          </button>
          
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center gap-1 transition-colors w-14 ${
              activeTab === 'settings' ? 'text-rose-500' : 'text-stone-400 hover:text-stone-600'
            }`}
          >
            <SettingsIcon className="w-5 h-5" />
            <span className="text-[10px] font-medium tracking-wide">设置</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
