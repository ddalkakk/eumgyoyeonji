/**
 * Updated TypeScript definitions for Melody Monster emphasizing Melodic Contour (가락의 흐름)
 */
export type NoteName = 'C4' | 'D4' | 'E4' | 'F4' | 'G4' | 'A4' | 'B4' | 'C5';

export interface NoteInfo {
  id: NoteName;
  pitch: number; // frequency
  solfège: string; // 도, 레, 미...
  color: string;
  bgGradient: string;
  borderColor: string;
  stepIndex: number; // 0 to 7 for stair visualization
  staffY: number; // Y position on treble staff
}

export type ContourType = 'ascending' | 'descending' | 'wave' | 'jump' | 'flat';

export interface Stage {
  id: string;
  level: 1 | 2 | 3;
  title: string;
  subtitle: string;
  notes: NoteName[];
  hint: string;
  contourType: ContourType;
  contourDescription: string; // e.g. "점점 높아지는 상행 가락"
  musicalConcept: string; // e.g. "순차진행과 상행"
  badgeName: string;
  badgeIcon: string;
}

export interface GameProgress {
  unlockedLevel: number;
  completedStages: string[];
  stageStars: Record<string, number>;
  earnedBadges: string[];
  totalScore: number;
}
