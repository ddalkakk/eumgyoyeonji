/**
 * Real-time Leaderboard component displaying student rankings on the main screen
 */
import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { Trophy, Award, Medal, Users } from 'lucide-react';

interface ScoreRecord {
  nickname: string;
  score: number;
  stars: number;
  updatedAt: string;
}

interface LeaderboardProps {
  currentStudent: string;
}

export function Leaderboard({ currentStudent }: LeaderboardProps) {
  const [scores, setScores] = useState<ScoreRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'scores'), orderBy('score', 'desc'), limit(10));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const records: ScoreRecord[] = [];
      snapshot.forEach((doc) => {
        records.push(doc.data() as ScoreRecord);
      });
      setScores(records);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching leaderboard:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl border border-slate-200 dark:border-slate-700 animate-pulse space-y-4">
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-xl w-40" />
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-12 bg-slate-100 dark:bg-slate-900/50 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl border border-slate-200 dark:border-slate-700 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          실시간 멜로디 리더보드
        </h3>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-300 flex items-center gap-1">
          <Users className="w-3.5 h-3.5" />
          실시간 순위
        </span>
      </div>

      {scores.length === 0 ? (
        <div className="text-center py-8 text-slate-400 text-sm">
          아직 등록된 점수가 없어요! 첫 번째 주인공이 되어보세요 🏆
        </div>
      ) : (
        <div className="space-y-2.5">
          {scores.map((item, index) => {
            const isMe = item.nickname === currentStudent;
            return (
              <div
                key={item.nickname}
                className={`flex items-center justify-between p-4 rounded-2xl transition-all border ${
                  isMe
                    ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-700 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-900/40 border-slate-100 dark:border-slate-700/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm">
                    {index === 0 ? <Medal className="w-6 h-6 text-amber-500 fill-amber-400" /> :
                     index === 1 ? <Medal className="w-6 h-6 text-slate-400 fill-slate-300" /> :
                     index === 2 ? <Medal className="w-6 h-6 text-amber-700 fill-amber-600" /> :
                     <span className="text-slate-500 font-extrabold">{index + 1}</span>}
                  </div>
                  <div>
                    <span className={`font-bold text-sm ${isMe ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-900 dark:text-white'}`}>
                      {item.nickname} {isMe && '(나)'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                    ⭐ {item.stars}개
                  </span>
                  <span className="text-sm font-black text-indigo-600 dark:text-indigo-400 min-w-[60px] text-right">
                    {item.score}점
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
