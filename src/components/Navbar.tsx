/**
 * Navbar component with expanded instrument sound toys selector
 */
import { Music, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { soundEngine } from '../utils/audio';
import { useState } from 'react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: 'levelSelect' | 'sandbox') => void;
}

export function Navbar({ currentView, onNavigate }: NavbarProps) {
  const [muted, setMuted] = useState(soundEngine.isMuted());
  const [instrument, setInstrument] = useState(soundEngine.getInstrument());

  const handleToggleMute = () => {
    const isMuted = soundEngine.toggleMute();
    setMuted(isMuted);
    soundEngine.playSFX('click');
  };

  const handleInstrumentChange = (inst: 'xylophone' | 'piano' | 'synth' | 'cat' | 'robot') => {
    soundEngine.setInstrument(inst);
    setInstrument(inst);
    soundEngine.playSFX('click');
    soundEngine.playNote('C4', 0.3);
  };

  return (
    <header className="flex items-center justify-between gap-8 px-6 py-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-colors">
      <div 
        onClick={() => onNavigate('levelSelect')}
        className="flex items-center gap-3 cursor-pointer group shrink-0"
      >
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
          <Music className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
            멜로디 몬스터
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 font-semibold">음악교실</span>
          </h1>
        </div>
      </div>

      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
        <button 
          onClick={() => onNavigate('levelSelect')}
          className={`transition-colors whitespace-nowrap shrink-0 ${currentView === 'levelSelect' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'hover:text-slate-900 dark:hover:text-white'}`}
        >
          스테이지 탐험
        </button>
        <button 
          onClick={() => onNavigate('sandbox')}
          className={`transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${currentView === 'sandbox' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'hover:text-slate-900 dark:hover:text-white'}`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          자유 작곡 놀이터
        </button>
      </nav>

      <div className="flex items-center gap-3 shrink-0">
        {/* Sound Toy Instrument Selector */}
        <div className="hidden lg:flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-medium">
          <button
            onClick={() => handleInstrumentChange('xylophone')}
            className={`px-2.5 py-1.5 rounded-lg transition-all ${instrument === 'xylophone' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
          >
            실로폰
          </button>
          <button
            onClick={() => handleInstrumentChange('piano')}
            className={`px-2.5 py-1.5 rounded-lg transition-all ${instrument === 'piano' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
          >
            피아노
          </button>
          <button
            onClick={() => handleInstrumentChange('synth')}
            className={`px-2.5 py-1.5 rounded-lg transition-all ${instrument === 'synth' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
          >
            8비트
          </button>
          <button
            onClick={() => handleInstrumentChange('cat')}
            className={`px-2.5 py-1.5 rounded-lg transition-all ${instrument === 'cat' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
            title="고양이 사운드 토이"
          >
            🐱 고양이
          </button>
          <button
            onClick={() => handleInstrumentChange('robot')}
            className={`px-2.5 py-1.5 rounded-lg transition-all ${instrument === 'robot' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
            title="로보트 사운드 토이"
          >
            🤖 로보트
          </button>
        </div>

        <button
          onClick={handleToggleMute}
          className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
          title={muted ? '소리 켜기' : '소리 끄기'}
        >
          {muted ? <VolumeX className="w-5 h-5 text-rose-500" /> : <Volume2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
        </button>
      </div>
    </header>
  );
}
