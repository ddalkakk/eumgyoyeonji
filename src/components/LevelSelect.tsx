/**
 * Level selection and stage map component with integrated real-time leaderboard on the first screen
 */
import { STAGES } from '../data/stages';
import { GameProgress, Stage } from '../types';
import { Play, Star, Award, Sparkles, Music, Lock, CheckCircle2, LogOut } from 'lucide-react';
import { soundEngine } from '../utils/audio';
import { useState } from 'react';
import { Leaderboard } from './Leaderboard';

interface LevelSelectProps {
  progress: GameProgress;
  currentStudent: string;
  onSelectStage: (stage: Stage) => void;
  onOpenSandbox: () => void;
  onLogout: () => void;
}

export function LevelSelect({ progress, currentStudent, onSelectStage, onOpenSandbox, onLogout }: LevelSelectProps) {
  const [selectedLevel, setSelectedLevel] = useState<1 | 2 | 3>(1);

  const levels = [
    {
      level: 1,
      title: '1단계 [입문 · 3~4학년]',
      desc: '도, 미, 솔 3개 음으로 높낮이와 계단형 가락을 배워요!',
      color: 'from-emerald-500 to-teal-600',
      badge: '초급 탐험가',
      targetNotes: '도 · 미 · 솔'
    },
    {
      level: 2,
      title: '2단계 [발전 · 3~5학년]',
      desc: '도, 레, 미, 파, 솔 5음계와 오선보 계이름을 익혀요!',
      color: 'from-blue-500 to-indigo-600',
      badge: '리듬 마스터',
      targetNotes: '도 · 레 · 미 · 파 · 솔'
    },
    {
      level: 3,
      title: '3단계 [도전 · 5~6학년]',
      desc: '도~높은도 8음 전체와 동요 프레이즈 청음 챌린지!',
      color: 'from-purple-500 to-pink-600',
      badge: '절대음감 천재',
      targetNotes: '1옥타브 전 음역'
    },
  ];

  const filteredStages = STAGES.filter(s => s.level === selectedLevel);

  const handleStageClick = (stage: Stage, isUnlocked: boolean) => {
    if (!isUnlocked) {
      soundEngine.playSFX('wrong');
      return;
    }
    soundEngine.playSFX('click');
    onSelectStage(stage);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      {/* Student Welcome & Header */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center text-white text-2xl shadow-md">
            🎓
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              반가워요, <span className="text-indigo-600 dark:text-indigo-400">{currentStudent}</span> 학생!
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">오늘도 즐겁게 가락을 탐험해볼까요?</p>
          </div>
        </div>
        <button
          onClick={() => {
            soundEngine.playSFX('click');
            onLogout();
          }}
          className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          로그아웃
        </button>
      </div>

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-8 md:p-12 shadow-2xl">
        <div className="absolute right-4 -bottom-10 opacity-20 md:opacity-30 pointer-events-none">
          <Music className="w-64 h-64" />
        </div>
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
            초등 음악 교육 인터랙티브 게임
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            멜로디 몬스터와 음표 사냥
          </h1>
          <p className="text-indigo-100 text-base md:text-lg leading-relaxed">
            귀여운 몬스터와 함께 소리의 높낮이를 구별하고, 다장조 계이름과 아름다운 동요 선율을 즐겁게 연주해 봐요!
          </p>
          <div className="pt-2 flex flex-wrap gap-4">
            <button
              onClick={() => {
                soundEngine.playSFX('click');
                onOpenSandbox();
              }}
              className="px-6 py-3 rounded-2xl bg-white text-indigo-900 font-bold hover:bg-indigo-50 transition-all shadow-lg flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5 text-indigo-600" />
              자유 작곡 놀이터 열기
            </button>
          </div>
        </div>
      </div>

      {/* Real-time Leaderboard on First Screen */}
      <Leaderboard currentStudent={currentStudent} />

      {/* Level Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {levels.map((lvl) => {
          const isSelected = selectedLevel === lvl.level;
          const isUnlocked = progress.unlockedLevel >= lvl.level;

          return (
            <button
              key={lvl.level}
              onClick={() => {
                soundEngine.playSFX('click');
                setSelectedLevel(lvl.level as 1 | 2 | 3);
              }}
              className={`text-left p-6 rounded-3xl transition-all relative overflow-hidden border ${
                isSelected
                  ? 'bg-white dark:bg-slate-800 border-indigo-500 shadow-xl ring-2 ring-indigo-500/20 scale-[1.02]'
                  : 'bg-white/70 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs font-bold px-3 py-1 rounded-full text-white bg-gradient-to-r ${lvl.color}`}>
                  {lvl.badge}
                </span>
                {!isUnlocked && <Lock className="w-5 h-5 text-slate-400" />}
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                {lvl.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                {lvl.desc}
              </p>
              <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 py-1.5 px-3 rounded-xl inline-block">
                사용 음역: {lvl.targetNotes}
              </div>
            </button>
          );
        })}
      </div>

      {/* Stage Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>{selectedLevel}단계 스테이지 선택</span>
          </h2>
          <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
            획득한 별 총합: ⭐ {Object.values(progress.stageStars).reduce((a, b) => a + b, 0)}개
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredStages.map((stage, idx) => {
            const isCompleted = progress.completedStages.includes(stage.id);
            const stars = progress.stageStars[stage.id] || 0;
            const isUnlocked = selectedLevel < progress.unlockedLevel || idx === 0 || progress.completedStages.includes(filteredStages[idx - 1]?.id);

            return (
              <div
                key={stage.id}
                onClick={() => handleStageClick(stage, isUnlocked)}
                className={`group rounded-3xl p-6 transition-all relative flex flex-col justify-between border ${
                  isUnlocked
                    ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-xl hover:border-indigo-400 cursor-pointer transform hover:-translate-y-1'
                    : 'bg-slate-100 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 opacity-60 cursor-not-allowed'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      STAGE {selectedLevel}-{idx + 1}
                    </span>
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : !isUnlocked ? (
                      <Lock className="w-5 h-5 text-slate-400" />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 text-xs font-bold">
                        {idx + 1}
                      </div>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {stage.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
                    {stage.subtitle}
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-500">
                      {[1, 2, 3].map((s) => (
                        <Star
                          key={s}
                          className={`w-4 h-4 ${s <= stars ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-600'}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-indigo-500" />
                      {stage.badgeName}
                    </span>
                  </div>

                  <button
                    disabled={!isUnlocked}
                    className={`w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                      isUnlocked
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/30'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <Play className="w-4 h-4 fill-current" />
                    {isCompleted ? '다시 도전' : '게임 시작'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
