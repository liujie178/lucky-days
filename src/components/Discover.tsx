import { BookOpen, Heart, Coffee, Smile, Activity, Moon } from 'lucide-react';

const ARTICLES = [
  { 
    id: 1, 
    title: '经期喝红糖水真的有用吗？', 
    desc: '红糖水能缓解痛经吗？科学解析经期饮食误区，教你正确喝出好气色。', 
    category: '饮食调理', 
    icon: Coffee, 
    color: 'text-amber-500', 
    bg: 'bg-amber-50',
    image: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=400&h=200'
  },
  { 
    id: 2, 
    title: '缓解经前综合征(PMS)的小妙招', 
    desc: '情绪低落、胸部胀痛、容易暴躁？试试这几个科学方法缓解经前不适。', 
    category: '情绪管理', 
    icon: Smile, 
    color: 'text-blue-500', 
    bg: 'bg-blue-50',
    image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&q=80&w=400&h=200'
  },
  { 
    id: 3, 
    title: '姨妈期可以运动吗？科学指南', 
    desc: '经期不是绝对不能动，选对运动方式不仅不伤身，还能帮助缓解痛经。', 
    category: '经期护理', 
    icon: Activity, 
    color: 'text-emerald-500', 
    bg: 'bg-emerald-50',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=400&h=200'
  },
  { 
    id: 4, 
    title: '如何科学调理气血？中医养生', 
    desc: '日常如何补气养血？从饮食到作息，全方位改善手脚冰凉和疲惫感。', 
    category: '女性健康', 
    icon: Heart, 
    color: 'text-rose-500', 
    bg: 'bg-rose-50',
    image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=400&h=200'
  },
  { 
    id: 5, 
    title: '经期睡眠指南：如何睡个好觉', 
    desc: '经期容易失眠多梦？调整睡姿和睡前习惯，让你在特殊时期也能安稳入睡。', 
    category: '生活作息', 
    icon: Moon, 
    color: 'text-indigo-500', 
    bg: 'bg-indigo-50',
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&q=80&w=400&h=200'
  },
];

export default function Discover() {
  return (
    <div className="px-4 py-8 max-w-md mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="w-6 h-6 text-stone-800" />
        <h2 className="text-2xl font-light text-stone-800 tracking-tight">健康资讯</h2>
      </div>

      <div className="space-y-6">
        {ARTICLES.map(article => {
          const Icon = article.icon;
          return (
            <div key={article.id} className="bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-transform hover:scale-[1.02] cursor-pointer">
              <div className="h-32 w-full overflow-hidden relative">
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute bottom-3 left-4 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full">
                  <Icon className={`w-3.5 h-3.5 ${article.color}`} />
                  <span className="text-[10px] font-medium text-stone-700">{article.category}</span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-medium text-stone-800 mb-2 leading-snug">{article.title}</h3>
                <p className="text-sm text-stone-500 line-clamp-2 leading-relaxed">{article.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="text-center pt-6 pb-4">
        <p className="text-xs text-stone-400">更多内容持续更新中...</p>
      </div>
    </div>
  );
}
