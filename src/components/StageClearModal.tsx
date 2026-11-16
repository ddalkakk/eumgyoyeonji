/**
 * Stage Clear Modal component with star rating and badge award
 */
import { Stage } from '../types';
import { Star, Award, RotateCcw, ArrowRight, Home } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface StageClearModalProps {
  stage: Stage;
  stars: number;
  score: number;
  onRetry: () => void;
  onNext: () => void;
  onHome: () => void;
}

export function StageClearModal({ stage, stars, score, onRetry, onNext, onHome }: StageClearModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl text-center space-y-6 border border-slate-200 dark:border-slate-700 relative overflow-hidden">
        {/* Celebration Header */}
        <div className="space-y-2">
          <div className="w-20 h-20 bg-gradient-to-tr from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto shadow-lg text-4xl animate-bounce">
            🎉
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            스테이지 클리어!
          </h2>
          <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
            {stage.title} 정복 완료
          </p>
        </div>

        {/* Stars Display */}
        <div className="flex items-center justify-center gap-3">
          {[1, 2, 3].map((s) => (
            <Star
              key={s}
              className={`w-10 h-10 transition-transform duration-300 ${
                s <= stars ? 'fill-amber-400 text-amber-400 scale-110 drop-shadow-md' : 'text-slate-300 dark:text-slate-600'
              }`}
            />
          ))}
        </div>

        {/* Badge & Score Card */}
        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 space-y-3 border border-slate-100 dark:border-slate-700/50">
          <div className="flex items-center justify-center gap-2 text-slate-700 dark:text-slate-200 font-bold text-sm">
            <Award className="w-5 h-5 text-indigo-500" />
            획득 칭호: <span className="text-indigo-600 dark:text-indigo-400">{stage.badgeName} {stage.badgeIcon}</span>
          </div>
          <div className="text-sm font-semibold text-slate-600 dark:text-slate-400">
            최종 획득 점수: <span className="text-xl font-black text-slate-900 dark:text-white">{score}점</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <button
            onClick={() => {
              soundEngine.playSFX('click');
              onNext();
            }}
            className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
          >
            다음 스테이지로
            <ArrowRight className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                soundEngine.playSFX('click');
                onRetry();
              }}
              className="py-3 rounded-2xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold text-sm flex items-center justify-center gap-2 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              다시 하기
            </button>
            <button
              onClick={() => {
                soundEngine.playSFX('click');
                onHome();
              }}
              className="py-3 rounded-2xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold text-sm flex items-center justify-center gap-2 transition-all"
            >
              <Home className="w-4 h-4" />
              메뉴로
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
