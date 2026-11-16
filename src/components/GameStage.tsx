/**
 * Crystal-clear GameStage component with explicit user instructions
 */
import { useState, useEffect } from 'react';
import { Stage, NoteName } from '../types';
import { NOTE_DEFINITIONS } from '../data/stages';
import { soundEngine } from '../utils/audio';
import { ArrowLeft, Volume2, Heart, Sparkles, HelpCircle, Activity, Ear, RotateCcw, Home } from 'lucide-react';

interface GameStageProps {
  stage: Stage;
  onBack: () => void;
  onCompleteStage: (stars: number, score: number) => void;
}

export function GameStage({ stage, onBack, onCompleteStage }: GameStageProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [combo, setCombo] = useState(0);
  const [fever, setFever] = useState(false);
  const [score, setScore] = useState(0);
  const [hintsLeft, setHintsLeft] = useState(2);
  const [monsterState, setMonsterState] = useState<'idle' | 'happy' | 'dizzy' | 'fever'>('idle');
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [isPlayingMelody, setIsPlayingMelody] = useState(false);
  const [, setPlayedNotes] = useState<NoteName[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);

  // Available notes based on level
  const activeNotes: NoteName[] = stage.level === 1 
    ? ['C4', 'E4', 'G4'] 
    : stage.level === 2 
    ? ['C4', 'D4', 'E4', 'F4', 'G4'] 
    : ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];

  // Play target melody
  const playTargetMelody = () => {
    if (isPlayingMelody || isGameOver) return;
    setIsPlayingMelody(true);
    setFeedbackText('🎵 멜로디가 재생됩니다! 귀를 기울여 들어보세요.');
    soundEngine.playMelody(stage.notes, 0.45, 0.45);
    setTimeout(() => {
      setIsPlayingMelody(false);
      setFeedbackText('👉 아래 건반을 눌러 첫 번째 음부터 순서대로 맞혀보세요!');
    }, stage.notes.length * 450 + 200);
  };

  useEffect(() => {
    playTargetMelody();
  }, [stage]);

  const handleNotePress = (note: NoteName) => {
    if (isPlayingMelody || isGameOver) return;

    soundEngine.playNote(note, 0.5);
    setPlayedNotes(prev => [...prev, note]);

    const targetNote = stage.notes[currentIndex];

    if (note === targetNote) {
      const newCombo = combo + 1;
      setCombo(newCombo);
      const isFeverNow = newCombo >= 5;
      if (isFeverNow && !fever) {
        setFever(true);
        setMonsterState('fever');
        soundEngine.playSFX('fever');
        setFeedbackText('🔥 FEVER TIME! 절대음감 천재 등극!');
      } else {
        setMonsterState('happy');
        soundEngine.playSFX('correct');
        setFeedbackText(`정답! '${NOTE_DEFINITIONS[note].solfège}' (${note}) ✨ 다음 ❓ 위치를 맞혀보세요.`);
      }

      const points = isFeverNow ? 200 : 100;
      setScore(prev => prev + points);

      const nextIndex = currentIndex + 1;
      if (nextIndex >= stage.notes.length) {
        soundEngine.playSFX('clear');
        setMonsterState('happy');
        setTimeout(() => {
          const stars = hearts === 3 ? 3 : hearts === 2 ? 2 : 1;
          onCompleteStage(stars, score + points);
        }, 1200);
      } else {
        setCurrentIndex(nextIndex);
        setTimeout(() => setMonsterState(isFeverNow ? 'fever' : 'idle'), 800);
      }
    } else {
      setCombo(0);
      setFever(false);
      setHearts(prev => {
        const nextHearts = prev - 1;
        if (nextHearts <= 0) {
          soundEngine.playSFX('wrong');
          setIsGameOver(true);
          setFeedbackText('앗, 하트를 모두 소모했어요!');
        }
        return nextHearts;
      });
      setMonsterState('dizzy');
      soundEngine.playSFX('wrong');
      const targetFreq = NOTE_DEFINITIONS[targetNote].pitch;
      const playedFreq = NOTE_DEFINITIONS[note].pitch;
      const directionHint = playedFreq < targetFreq ? '📈 방금 누른 음보다 더 높은 음이에요!' : '📉 방금 누른 음보다 더 낮은 음이에요!';
      setFeedbackText(`아쉬워요! ${directionHint}`);
      setTimeout(() => setMonsterState('idle'), 1000);
    }
  };

  const handleRetry = () => {
    soundEngine.playSFX('click');
    setHearts(3);
    setCurrentIndex(0);
    setScore(0);
    setCombo(0);
    setFever(false);
    setIsGameOver(false);
    setFeedbackText('');
    setTimeout(() => playTargetMelody(), 300);
  };

  const handleUseHint = () => {
    if (hintsLeft <= 0 || isGameOver) return;
    setHintsLeft(prev => prev - 1);
    soundEngine.playSFX('click');
    const targetNote = stage.notes[currentIndex];
    setFeedbackText(`💡 청음 힌트: 지금 찾아야 할 ${currentIndex + 1}번째 음은 '${NOTE_DEFINITIONS[targetNote].solfège}' 입니다!`);
  };

  // Render SVG Melodic Contour Line Graph
  const renderContourGraph = () => {
    const points = stage.notes.map((noteId, idx) => {
      const info = NOTE_DEFINITIONS[noteId];
      const x = (idx / (stage.notes.length - 1 || 1)) * 260 + 20;
      const y = 90 - (info.stepIndex / 7) * 70;
      return { x, y, solfège: info.solfège, color: info.color };
    });

    const pathData = points.reduce((acc, pt, idx) => {
      return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
    }, '');

    return (
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl p-4 border-2 border-indigo-400 dark:border-indigo-600 shadow-md space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
          <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 text-sm">
            <Activity className="w-4 h-4" />
            선율선 가이드: {stage.contourDescription}
          </span>
          <span className="bg-indigo-100 dark:bg-indigo-950 px-3 py-1 rounded-full text-indigo-700 dark:text-indigo-300 font-extrabold animate-pulse">
            🎯 지금 맞혀야 할 순서: <span className="text-rose-500 font-black text-sm">{currentIndex + 1}번째 ❓</span>
          </span>
        </div>

        <div className="relative h-32 w-full bg-slate-50 dark:bg-slate-950/60 rounded-xl overflow-hidden flex items-center justify-center border border-slate-200 dark:border-slate-800">
          <svg className="w-full h-full max-w-md overflow-visible" viewBox="0 0 300 100">
            {[0, 2, 4, 6, 7].map(step => {
              const y = 90 - (step / 7) * 70;
              return (
                <line key={step} x1="10" y1={y} x2="290" y2={y} stroke="currentColor" strokeOpacity="0.15" strokeDasharray="4 4" className="text-slate-500" />
              );
            })}

            <path d={pathData} fill="none" stroke="#6366F1" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="opacity-50" />

            {points.map((pt, idx) => {
              const isPassed = idx < currentIndex;
              const isCurrent = idx === currentIndex;
              return (
                <g key={idx} className="transition-all duration-300">
                  {isCurrent && (
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="16"
                      fill="none"
                      stroke="#EC4899"
                      strokeWidth="2.5"
                      className="animate-ping opacity-75"
                    />
                  )}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isCurrent ? "10" : "6"}
                    fill={isPassed ? "#10B981" : isCurrent ? "#EC4899" : "#94A3B8"}
                    stroke="#ffffff"
                    strokeWidth="2.5"
                  />
                  <text
                    x={pt.x}
                    y={isCurrent ? pt.y - 18 : pt.y - 12}
                    textAnchor="middle"
                    className={`text-[11px] font-black ${isCurrent ? 'fill-rose-600 dark:fill-rose-400 text-sm' : 'fill-slate-700 dark:fill-slate-200'}`}
                  >
                    {isPassed ? pt.solfège : isCurrent ? `👉 ${currentIndex + 1}번` : '❓'}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    );
  };

  return (
    <div className={`max-w-4xl mx-auto px-4 py-6 space-y-6 transition-colors duration-500 rounded-3xl ${fever ? 'bg-amber-50/80 dark:bg-amber-950/20 ring-4 ring-amber-400' : ''}`}>
      {/* Top HUD */}
      <div className="flex items-center justify-between bg-white/90 dark:bg-slate-800/90 backdrop-blur-md px-6 py-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
        <button
          onClick={() => {
            soundEngine.playSFX('click');
            onBack();
          }}
          className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 font-semibold text-sm"
        >
          <ArrowLeft className="w-5 h-5" />
          스테이지 목록
        </button>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5">
            {[1, 2, 3].map(h => (
              <Heart
                key={h}
                className={`w-6 h-6 transition-transform ${h <= hearts ? 'fill-rose-500 text-rose-500 animate-pulse' : 'text-slate-300 dark:text-slate-600'}`}
              />
            ))}
          </div>
          <div className="text-sm font-bold text-slate-700 dark:text-slate-200">
            점수: <span className="text-indigo-600 dark:text-indigo-400">{score}점</span>
          </div>
        </div>
      </div>

      {/* Stage Header & Explicit Instructions */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 text-xs font-bold shadow-sm">
          <Ear className="w-4 h-4 text-indigo-600 animate-bounce" />
          청음 게임 규칙: 멜로디를 듣고 ❓ 칸에 들어갈 음을 아래 건반에서 순서대로 누르세요!
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">{stage.subtitle}</p>
        <div className="h-9 flex items-center justify-center bg-rose-50 dark:bg-rose-950/40 rounded-2xl border border-rose-200 dark:border-rose-900 px-4">
          <span className={`text-sm font-extrabold transition-all ${monsterState === 'dizzy' ? 'text-rose-500 animate-bounce' : 'text-rose-600 dark:text-rose-300'}`}>
            {feedbackText || stage.hint}
          </span>
        </div>
      </div>

      {renderContourGraph()}

      {/* Melody Monster Character Arena */}
      <div className="bg-gradient-to-b from-indigo-50/50 to-purple-50/50 dark:from-slate-800/50 dark:to-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
        {fever && (
          <div className="absolute inset-0 bg-amber-400/10 pointer-events-none animate-pulse flex items-center justify-center">
            <Sparkles className="w-48 h-48 text-amber-400 opacity-30 animate-spin" />
          </div>
        )}

        {combo > 1 && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black px-4 py-1.5 rounded-full shadow-lg animate-bounce text-sm">
            🔥 {combo} COMBO! {fever ? '(FEVER)' : ''}
          </div>
        )}

        {/* Melody Monster Avatar */}
        <div className="relative my-2">
          <div className={`w-32 h-32 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
            monsterState === 'happy' ? 'bg-gradient-to-tr from-emerald-400 to-teal-500 scale-110 rotate-6' :
            monsterState === 'dizzy' ? 'bg-gradient-to-tr from-rose-400 to-pink-500 rotate-12 scale-95' :
            monsterState === 'fever' ? 'bg-gradient-to-tr from-amber-400 to-orange-500 scale-125 animate-pulse' :
            'bg-gradient-to-tr from-indigo-500 to-purple-600 animate-bounce'
          }`}>
            <span className="text-5xl select-none">
              {monsterState === 'happy' ? '😆' : monsterState === 'dizzy' ? '😵' : monsterState === 'fever' ? '🤩' : '👂'}
            </span>
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-black/20 dark:bg-white/20 blur-sm w-20 h-3 rounded-full" />
        </div>

        {/* Note Progress with Highlighted Target Box */}
        <div className="w-full max-w-md space-y-2.5 mt-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
            <span>빈칸 채우기 ({currentIndex + 1} / {stage.notes.length})</span>
            <span className="text-rose-600 dark:text-rose-400 font-black animate-pulse">🎯 지금 ❓ 박스를 채울 차례입니다!</span>
          </div>
          <div className="flex items-center justify-center gap-3">
            {stage.notes.map((note, idx) => {
              const isPassed = idx < currentIndex;
              const isCurrent = idx === currentIndex;
              const noteInfo = NOTE_DEFINITIONS[note];

              return (
                <div
                  key={idx}
                  className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center font-bold text-xs transition-all ${
                    isPassed
                      ? 'bg-emerald-500 text-white shadow-md scale-95'
                      : isCurrent
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white border-4 border-rose-500 shadow-xl scale-125 animate-bounce z-10'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                  }`}
                  style={{ backgroundColor: isPassed ? noteInfo.color : undefined }}
                >
                  <span>{isPassed ? noteInfo.solfège : isCurrent ? `❓ ${idx + 1}` : '❓'}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-4 mt-5">
          <button
            onClick={playTargetMelody}
            disabled={isPlayingMelody}
            className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md flex items-center gap-2 transition-all"
          >
            <Volume2 className="w-4 h-4" />
            멜로디 다시 듣기
          </button>
          <button
            onClick={handleUseHint}
            disabled={hintsLeft <= 0}
            className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <HelpCircle className="w-4 h-4" />
            청음 힌트 ({hintsLeft})
          </button>
        </div>
      </div>

      {/* Virtual Xylophone / Piano Keyboard with onPointerDown */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl border border-slate-200 dark:border-slate-700 space-y-4">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 px-2">
          <span>청음 건반 (귀로 듣고 위의 ❓ 순서에 맞는 음을 터치/클릭하세요)</span>
          <span>무지개 컬러 코드 적용</span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
          {activeNotes.map((noteId) => {
            const info = NOTE_DEFINITIONS[noteId];
            return (
              <button
                key={noteId}
                onPointerDown={() => handleNotePress(noteId)}
                className={`group flex flex-col items-center justify-between p-4 rounded-2xl text-white shadow-lg transition-transform transform active:scale-95 hover:brightness-110 bg-gradient-to-b ${info.bgGradient} border-b-4 ${info.borderColor} min-h-[115px] select-none cursor-pointer`}
              >
                <span className="text-xs font-semibold opacity-90">{noteId}</span>
                <span className="text-2xl font-black my-1">{info.solfège}</span>
                <span className="w-3 h-3 rounded-full bg-white/40 group-hover:scale-125 transition-transform" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Game Over Modal */}
      {isGameOver && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl text-center space-y-6 border border-slate-200 dark:border-slate-700">
            <div className="w-20 h-20 bg-gradient-to-tr from-rose-500 to-pink-600 rounded-full flex items-center justify-center mx-auto shadow-lg text-4xl animate-bounce">
              😢
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                도전 실패...
              </h3>
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                하트를 모두 소모했어요. 가락의 흐름을 다시 귀로 듣고 재도전해볼까요?
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={handleRetry}
                className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
              >
                <RotateCcw className="w-5 h-5" />
                다시 도전하기
              </button>
              <button
                onClick={() => {
                  soundEngine.playSFX('click');
                  onBack();
                }}
                className="w-full py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold text-base flex items-center justify-center gap-2 transition-all"
              >
                <Home className="w-5 h-5" />
                스테이지 목록으로
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
