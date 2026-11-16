/**
 * Login Modal component requiring student nickname and password '2026'
 */
import { useState } from 'react';
import { soundEngine } from '../utils/audio';
import { Lock, User, Sparkles, AlertCircle } from 'lucide-react';

interface LoginModalProps {
  onLoginSuccess: (nickname: string) => void;
}

export function LoginModal({ onLoginSuccess }: LoginModalProps) {
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) {
      setError('별명을 입력해주세요!');
      soundEngine.playSFX('wrong');
      return;
    }
    if (password !== '2026') {
      setError('비밀번호가 틀렸습니다. (힌트: 2026)');
      soundEngine.playSFX('wrong');
      return;
    }

    soundEngine.playSFX('correct');
    localStorage.setItem('melody_monster_student', nickname.trim());
    onLoginSuccess(nickname.trim());
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6 border border-slate-200 dark:border-slate-700 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 opacity-10 pointer-events-none">
          <Sparkles className="w-48 h-48 text-indigo-600" />
        </div>

        <div className="text-center space-y-2 relative z-10">
          <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg text-white text-3xl">
            🎵
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            멜로디 몬스터 로그인
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            별명과 선생님이 알려준 비밀번호를 입력하고 리더보드에 참여하세요!
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 relative z-10">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <User className="w-4 h-4 text-indigo-500" />
              학생 별명 (예: 음악왕 꿀벌)
            </label>
            <input
              type="text"
              value={nickname}
              onChange={e => setNickname(e.target.value)}
              placeholder="본인의 별명을 입력하세요"
              maxLength={20}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-indigo-500" />
              비밀번호 (2026)
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="비밀번호 4자리"
              maxLength={10}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-300 text-xs font-semibold animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-lg shadow-indigo-600/30 transition-all"
          >
            게임 시작 및 리더보드 참여
          </button>
        </form>
      </div>
    </div>
  );
}
