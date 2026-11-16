/**
 * Melody Monster App - Main Controller with Firebase Auth & Real-time Leaderboard
 */
import { useState, useEffect } from 'react';
import { GameProgress, Stage } from './types';
import { Navbar } from './components/Navbar';
import { LevelSelect } from './components/LevelSelect';
import { GameStage } from './components/GameStage';
import { Sandbox } from './components/Sandbox';
import { StageClearModal } from './components/StageClearModal';
import { LoginModal } from './components/LoginModal';
import { STAGES } from './data/stages';
import { doc, setDoc } from 'firebase/firestore';
import { db } from './utils/firebase';

export default function App() {
  const [currentStudent, setCurrentStudent] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'levelSelect' | 'playing' | 'sandbox'>('levelSelect');
  const [currentStage, setCurrentStage] = useState<Stage | null>(null);
  
  const [progress, setProgress] = useState<GameProgress>({
    unlockedLevel: 1,
    completedStages: [],
    stageStars: {},
    earnedBadges: [],
    totalScore: 0,
  });

  const [clearedData, setClearedData] = useState<{ stage: Stage; stars: number; score: number } | null>(null);

  useEffect(() => {
    const savedStudent = localStorage.getItem('melody_monster_student');
    if (savedStudent) {
      setCurrentStudent(savedStudent);
    }
  }, []);

  const handleLoginSuccess = (nickname: string) => {
    setCurrentStudent(nickname);
  };

  const handleLogout = () => {
    localStorage.removeItem('melody_monster_student');
    setCurrentStudent(null);
  };

  const syncScoreToFirestore = async (newTotalScore: number, newStars: number) => {
    if (!currentStudent) return;
    try {
      const scoreRef = doc(db, 'scores', currentStudent);
      await setDoc(scoreRef, {
        nickname: currentStudent,
        score: newTotalScore,
        stars: Object.values(progress.stageStars).reduce((a, b) => a + b, 0) + newStars,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.error('Failed to sync score to Firestore:', err);
    }
  };

  const handleSelectStage = (stage: Stage) => {
    setCurrentStage(stage);
    setCurrentView('playing');
  };

  const handleCompleteStage = (stars: number, score: number) => {
    if (!currentStage) return;

    setProgress(prev => {
      const isNewCompletion = !prev.completedStages.includes(currentStage.id);
      const completedStages = isNewCompletion ? [...prev.completedStages, currentStage.id] : prev.completedStages;
      
      const existingStars = prev.stageStars[currentStage.id] || 0;
      const stageStars = {
        ...prev.stageStars,
        [currentStage.id]: Math.max(existingStars, stars)
      };

      const earnedBadges = prev.earnedBadges.includes(currentStage.badgeName)
        ? prev.earnedBadges
        : [...prev.earnedBadges, currentStage.badgeName];

      let unlockedLevel = prev.unlockedLevel;
      if (currentStage.level === 1 && completedStages.filter(id => id.startsWith('l1')).length >= 2) {
        unlockedLevel = Math.max(unlockedLevel, 2);
      } else if (currentStage.level === 2 && completedStages.filter(id => id.startsWith('l2')).length >= 2) {
        unlockedLevel = Math.max(unlockedLevel, 3);
      }

      const newTotalScore = prev.totalScore + score;
      syncScoreToFirestore(newTotalScore, stars);

      return {
        unlockedLevel,
        completedStages,
        stageStars,
        earnedBadges,
        totalScore: newTotalScore
      };
    });

    setClearedData({ stage: currentStage, stars, score });
  };

  const handleNextStage = () => {
    if (!clearedData) return;
    const currentIndex = STAGES.findIndex(s => s.id === clearedData.stage.id);
    setClearedData(null);

    if (currentIndex >= 0 && currentIndex < STAGES.length - 1) {
      const nextStage = STAGES[currentIndex + 1];
      setCurrentStage(nextStage);
      setCurrentView('playing');
    } else {
      setCurrentView('levelSelect');
      setCurrentStage(null);
    }
  };

  const handleRetryStage = () => {
    setClearedData(null);
  };

  const handleNavigate = (view: 'levelSelect' | 'sandbox') => {
    setClearedData(null);
    setCurrentView(view);
    setCurrentStage(null);
  };

  if (!currentStudent) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
        <LoginModal onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <Navbar currentView={currentView} onNavigate={handleNavigate} />

      <main className="flex-1 pb-16">
        {currentView === 'levelSelect' && (
          <LevelSelect
            progress={progress}
            currentStudent={currentStudent}
            onSelectStage={handleSelectStage}
            onOpenSandbox={() => setCurrentView('sandbox')}
            onLogout={handleLogout}
          />
        )}

        {currentView === 'playing' && currentStage && (
          <div className="py-6">
            <GameStage
              stage={currentStage}
              onBack={() => setCurrentView('levelSelect')}
              onCompleteStage={handleCompleteStage}
            />
          </div>
        )}

        {currentView === 'sandbox' && (
          <Sandbox onBack={() => setCurrentView('levelSelect')} />
        )}
      </main>

      {/* Stage Clear Modal */}
      {clearedData && (
        <StageClearModal
          stage={clearedData.stage}
          stars={clearedData.stars}
          score={clearedData.score}
          onRetry={handleRetryStage}
          onNext={handleNextStage}
          onHome={() => {
            setClearedData(null);
            setCurrentView('levelSelect');
            setCurrentStage(null);
          }}
        />
      )}
    </div>
  );
}
