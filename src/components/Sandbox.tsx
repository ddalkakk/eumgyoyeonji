/**
 * Advanced Sandbox / Free Play component with Treble Staff Notation (오선보),
 * Melodic Contour (가락선), and Note Duration (박자) adjustment.
 */
import { useState } from 'react';
import { NOTE_DEFINITIONS } from '../data/stages';
import { NoteName } from '../types';
import { soundEngine } from '../utils/audio';
import { Play, ArrowLeft, Sparkles, Music, Trash2, Activity, Clock } from 'lucide-react';

interface SandboxProps {
  onBack: () => void;
}

interface SandboxNote {
  note: NoteName;
  beats: number; // 0.5, 1, 2, 4
}

export function Sandbox({ onBack }: SandboxProps) {
  const [recordedNotes, setRecordedNotes] = useState<SandboxNote[]>([]);
  const [selectedBeats, setSelectedBeats] = useState<number>(1); // Default 1 beat (quarter note)
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const allNotes: NoteName[] = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];

  const handleNoteClick = (note: NoteName) => {
    soundEngine.playNote(note, selectedBeats * 0.4);
    if (isRecording) {
      setRecordedNotes(prev => [...prev, { note, beats: selectedBeats }]);
    }
  };

  const handlePlayRecorded = () => {
    if (recordedNotes.length === 0 || isPlaying) return;
    setIsPlaying(true);
    
    // Play notes sequentially with duration proportional to beats
    let totalDelay = 0;
    recordedNotes.forEach((item, idx) => {
      setTimeout(() => {
        soundEngine.playNote(item.note, item.beats * 0.4);
      }, totalDelay * 1000);
      totalDelay += item.beats * 0.5;
    });

    setTimeout(() => {
      setIsPlaying(false);
    }, totalDelay * 1000 + 400);
  };

  const handlePresetPlay = (preset: SandboxNote[]) => {
    if (isPlaying) return;
    setIsPlaying(true);
    let totalDelay = 0;
    preset.forEach((item) => {
      setTimeout(() => {
        soundEngine.playNote(item.note, item.beats * 0.4);
      }, totalDelay * 1000);
      totalDelay += item.beats * 0.5;
    });

    setTimeout(() => {
      setIsPlaying(false);
    }, totalDelay * 1000 + 400);
  };

  // Render Treble Staff (오선보) with Contour Line & Noteheads
  const renderTrebleStaff = () => {
    if (recordedNotes.length === 0) {
      return (
        <div className="relative h-48 w-full bg-slate-50 dark:bg-slate-950/50 rounded-2xl overflow-hidden flex flex-col items-center justify-center border border-slate-200 dark:border-slate-800 text-slate-400 text-xs gap-2">
          <Activity className="w-8 h-8 opacity-30 animate-pulse" />
          <span>박자를 선택하고 작곡 녹음을 켠 뒤 건반을 누르면, 오선보에 음표와 가락선이 그려집니다!</span>
        </div>
      );
    }

    // Staff line Y coordinates in SVG (viewBox height = 140)
    // 5 lines: y = 40, 55, 70, 85, 100
    const staffLines = [40, 55, 70, 85, 100];

    // Map each note to staff Y position
    const getStaffY = (noteId: NoteName) => {
      switch (noteId) {
        case 'C4': return 115; // Ledger line below staff
        case 'D4': return 107.5;
        case 'E4': return 100; // 1st line
        case 'F4': return 92.5;  // 1st space
        case 'G4': return 85;  // 2nd line
        case 'A4': return 77.5;  // 2nd space
        case 'B4': return 70;  // 3rd line
        case 'C5': return 62.5;  // 3rd space
        default: return 70;
      }
    };

    const points = recordedNotes.map((item, idx) => {
      const info = NOTE_DEFINITIONS[item.note];
      const x = Math.min(40 + idx * 45, 540);
      const y = getStaffY(item.note);
      return { x, y, solfège: info.solfège, color: info.color, beats: item.beats, noteId: item.note };
    });

    const pathData = points.reduce((acc, pt, idx) => {
      return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
    }, '');

    return (
      <div className="relative h-52 w-full bg-slate-50 dark:bg-slate-950/50 rounded-2xl overflow-x-auto overflow-y-hidden border border-slate-200 dark:border-slate-800 p-2 flex items-center">
        <svg className="h-full min-w-[600px] overflow-visible" viewBox="0 0 600 140">
          {/* Treble Clef symbol placeholder / text */}
          <text x="15" y="85" className="text-3xl font-serif fill-indigo-600 dark:fill-indigo-400 select-none">𝄞</text>

          {/* 5 Staff lines */}
          {staffLines.map((yLine, i) => (
            <line key={i} x1="45" y1={yLine} x2="580" y2={yLine} stroke="currentColor" strokeWidth="1.5" className="text-slate-400 dark:text-slate-600" />
          ))}

          {/* Ledger line for C4 (도) */}
          <line x1="25" y1="115" x2="45" y2="115" stroke="currentColor" strokeWidth="1.5" className="text-slate-400 dark:text-slate-600" />

          {/* Melodic Contour Wave connecting notes */}
          <path d={pathData} fill="none" stroke="#6366F1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="opacity-60" />

          {/* Notes on Staff */}
          {points.map((pt, idx) => (
            <g key={idx}>
              {/* Ledger line for C4 specific note */}
              {pt.noteId === 'C4' && (
                <line x1={pt.x - 8} y1="115" x2={pt.x + 8} y2="115" stroke="currentColor" strokeWidth="1.5" className="text-slate-600 dark:text-slate-400" />
              )}
              {/* Note head (Filled for quarter/half, hollow or stem for duration) */}
              <ellipse
                cx={pt.x}
                cy={pt.y}
                rx="6"
                ry="4.5"
                fill={pt.color}
                transform={`rotate(-15 ${pt.x} ${pt.y})`}
                stroke="#1e293b"
                strokeWidth="1"
              />
              {/* Stem */}
              <line
                x1={pt.y > 70 ? pt.x + 5.5 : pt.x - 5.5}
                y1={pt.y}
                x2={pt.y > 70 ? pt.x + 5.5 : pt.x - 5.5}
                y2={pt.y > 70 ? pt.y - 25 : pt.y + 25}
                stroke="#1e293b"
                strokeWidth="1.5"
              />
              {/* Solfège label below */}
              <text
                x={pt.x}
                y="130"
                textAnchor="middle"
                className="text-[10px] font-bold fill-slate-700 dark:fill-slate-200"
              >
                {pt.solfège} ({pt.beats}박)
              </text>
            </g>
          ))}
        </svg>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            soundEngine.playSFX('click');
            onBack();
          }}
          className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 font-semibold text-sm"
        >
          <ArrowLeft className="w-5 h-5" />
          돌아가기
        </button>
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 font-bold text-sm">
          <Sparkles className="w-4 h-4 text-amber-500" />
          자유 작곡 놀이터
        </div>
      </div>

      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-3xl p-8 shadow-xl space-y-3">
        <h2 className="text-2xl md:text-3xl font-extrabold">오선보 작곡 & 가락선 놀이터</h2>
        <p className="text-indigo-100 text-sm md:text-base">
          박자(음표 길이)를 선택하고 오선보에 음표를 그려보세요. 가락선과 함께 악보가 실시간으로 완성됩니다!
        </p>
      </div>

      {/* Preset Songs */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl border border-slate-200 dark:border-slate-700 space-y-4">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <Music className="w-4 h-4 text-indigo-500" />
          추천 동요 오선보 불러오기
        </h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handlePresetPlay([
              { note: 'G4', beats: 1 }, { note: 'G4', beats: 1 }, { note: 'A4', beats: 1 }, { note: 'A4', beats: 1 },
              { note: 'G4', beats: 1 }, { note: 'G4', beats: 1 }, { note: 'E4', beats: 2 }
            ])}
            disabled={isPlaying}
            className="px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-300 font-bold text-xs transition-colors"
          >
            🔔 학교종
          </button>
          <button
            onClick={() => handlePresetPlay([
              { note: 'E4', beats: 1 }, { note: 'F4', beats: 1 }, { note: 'G4', beats: 1 }, { note: 'G4', beats: 1 },
              { note: 'E4', beats: 1 }, { note: 'F4', beats: 1 }, { note: 'G4', beats: 1 }, { note: 'G4', beats: 1 }
            ])}
            disabled={isPlaying}
            className="px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-300 font-bold text-xs transition-colors"
          >
            🦋 나비야
          </button>
        </div>
      </div>

      {/* Beat Selector & Recording Controls */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl border border-slate-200 dark:border-slate-700 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Beat Duration Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1">
              <Clock className="w-4 h-4 text-indigo-500" />
              음표 박자(길이):
            </span>
            <div className="flex items-center bg-slate-100 dark:bg-slate-700 p-1 rounded-xl text-xs font-bold">
              {[
                { label: '0.5박(8분)', value: 0.5 },
                { label: '1박(4분)', value: 1 },
                { label: '2박(2분)', value: 2 },
                { label: '4박(온음표)', value: 4 },
              ].map(b => (
                <button
                  key={b.value}
                  onClick={() => {
                    soundEngine.playSFX('click');
                    setSelectedBeats(b.value);
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-all ${selectedBeats === b.value ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-300 shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                soundEngine.playSFX('click');
                setIsRecording(!isRecording);
              }}
              className={`px-5 py-2 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all ${
                isRecording
                  ? 'bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-500/30'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
              }`}
            >
              <span className={`w-3 h-3 rounded-full ${isRecording ? 'bg-white' : 'bg-rose-500'}`} />
              {isRecording ? '작곡 녹음 중지' : '작곡 녹음 시작'}
            </button>
            <button
              onClick={() => {
                soundEngine.playSFX('click');
                setRecordedNotes([]);
              }}
              className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              title="녹음 초기화"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Treble Staff Notation Display */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Music className="w-4 h-4 text-indigo-500" />
              오선보 악보 & 가락선
            </span>
            <span>총 {recordedNotes.length}개 음표</span>
          </div>
          {renderTrebleStaff()}
        </div>

        {/* Playback Button */}
        <div className="flex justify-end">
          <button
            onClick={handlePlayRecorded}
            disabled={recordedNotes.length === 0 || isPlaying}
            className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-base shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all"
          >
            <Play className="w-5 h-5 fill-current" />
            내 악보 재생하기
          </button>
        </div>
      </div>

      {/* Full Keyboard Grid */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl border border-slate-200 dark:border-slate-700 space-y-4">
        <div className="text-xs font-bold text-slate-500 dark:text-slate-400 px-2">
          오선보 건반 입력 (선택한 박자 적용)
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
          {allNotes.map((noteId) => {
            const info = NOTE_DEFINITIONS[noteId];
            return (
              <button
                key={noteId}
              onClick={() => handleNoteClick(noteId)}
                className={`group flex flex-col items-center justify-between p-4 rounded-2xl text-white shadow-lg transition-all transform active:scale-95 hover:brightness-110 bg-gradient-to-b ${info.bgGradient} border-b-4 ${info.borderColor} min-h-[120px]`}
              >
                <span className="text-xs font-semibold opacity-90">{noteId}</span>
                <span className="text-2xl font-black my-1">{info.solfège}</span>
                <span className="w-3 h-3 rounded-full bg-white/40 group-hover:scale-125 transition-transform" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
