/**
 * Updated stage definitions emphasizing melodic contour (가락의 흐름과 선율선)
 */
import { NoteInfo, NoteName, Stage } from '../types';

export const NOTE_DEFINITIONS: Record<NoteName, NoteInfo> = {
  'C4': { id: 'C4', pitch: 261.63, solfège: '도', color: '#EF4444', bgGradient: 'from-red-500 to-rose-600', borderColor: 'border-red-400', stepIndex: 0, staffY: 110 },
  'D4': { id: 'D4', pitch: 293.66, solfège: '레', color: '#F97316', bgGradient: 'from-orange-500 to-amber-600', borderColor: 'border-orange-400', stepIndex: 1, staffY: 98 },
  'E4': { id: 'E4', pitch: 329.63, solfège: '미', color: '#EAB308', bgGradient: 'from-yellow-400 to-amber-500', borderColor: 'border-yellow-300', stepIndex: 2, staffY: 86 },
  'F4': { id: 'F4', pitch: 349.23, solfège: '파', color: '#10B981', bgGradient: 'from-emerald-500 to-teal-600', borderColor: 'border-emerald-400', stepIndex: 3, staffY: 74 },
  'G4': { id: 'G4', pitch: 392.00, solfège: '솔', color: '#3B82F6', bgGradient: 'from-blue-500 to-indigo-600', borderColor: 'border-blue-400', stepIndex: 4, staffY: 62 },
  'A4': { id: 'A4', pitch: 440.00, solfège: '라', color: '#6366F1', bgGradient: 'from-indigo-500 to-violet-600', borderColor: 'border-indigo-400', stepIndex: 5, staffY: 50 },
  'B4': { id: 'B4', pitch: 493.88, solfège: '시', color: '#8B5CF6', bgGradient: 'from-violet-500 to-purple-600', borderColor: 'border-violet-400', stepIndex: 6, staffY: 38 },
  'C5': { id: 'C5', pitch: 523.25, solfège: '높은도', color: '#EC4899', bgGradient: 'from-pink-500 to-rose-500', borderColor: 'border-pink-400', stepIndex: 7, staffY: 26 },
};

export const STAGES: Stage[] = [
  // --- 1단계: 입문 (3~4학년 기초) - 도, 미, 솔 3음 & 가락의 오르내림 ---
  {
    id: 'l1_1',
    level: 1,
    title: '1-1. 계단 오르기 (상행 가락)',
    subtitle: '소리가 점점 높아지는 오르막길',
    notes: ['C4', 'E4', 'G4'],
    hint: '도에서 미, 미에서 솔로 음이 점점 올라가요 (상행 진행)',
    contourType: 'ascending',
    contourDescription: '↗ 위로 올라가는 오르막길 선율',
    musicalConcept: '순차진행과 상행 (Ascending)',
    badgeName: '새싹 도레미',
    badgeIcon: '🌱'
  },
  {
    id: 'l1_2',
    level: 1,
    title: '1-2. 뻐꾸기 산새 (물결 가락)',
    subtitle: '솔-미-솔-미 메아리',
    notes: ['G4', 'E4', 'G4', 'E4'],
    hint: '높았다가 낮아지고 다시 높아지는 물결 모양 가락이에요',
    contourType: 'wave',
    contourDescription: '〰 출렁이는 물결 모양 선율',
    musicalConcept: '음의 도약과 반복',
    badgeName: '숲속 뻐꾸기',
    badgeIcon: '🐦'
  },
  {
    id: 'l1_3',
    level: 1,
    title: '1-3. 미끄럼틀 타기 (하행 가락)',
    subtitle: '솔에서 도로 슝~ 내려오기',
    notes: ['G4', 'E4', 'C4'],
    hint: '꼭대기 솔에서 미를 거쳐 도까지 미끄럼틀을 타듯 내려와요',
    contourType: 'descending',
    contourDescription: '↘ 아래로 내려오는 내리막길 선율',
    musicalConcept: '하행 진행 (Descending)',
    badgeName: '미끄럼틀 대장',
    badgeIcon: '🛝'
  },
  {
    id: 'l1_4',
    level: 1,
    title: '1-4. 통통 튀는 공 (도약 가락)',
    subtitle: '낮았다가 높이뛰기',
    notes: ['C4', 'G4', 'C4', 'G4'],
    hint: '낮은 도와 높은 솔 사이를 멀리 뛰어넘는 가락이에요',
    contourType: 'jump',
    contourDescription: '⚡ 크게 도약하는 뾰족한 선율',
    musicalConcept: '도약진행 (Skip / Leap)',
    badgeName: '통통볼 요정',
    badgeIcon: '⚽'
  },

  // --- 2단계: 발전 (3~4학년 심화/5학년) - 도, 레, 미, 파, 솔 5음 선율 흐름 ---
  {
    id: 'l2_1',
    level: 2,
    title: '2-1. 순차진행 행진곡',
    subtitle: '도-레-미-파-솔 차례대로',
    notes: ['C4', 'D4', 'E4', 'F4', 'G4'],
    hint: '이웃한 음들끼리 한 칸씩 차례대로 올라가는 순차진행이에요',
    contourType: 'ascending',
    contourDescription: '↗ 5음 연속 오르막길 선율',
    musicalConcept: '순차진행 (Stepwise Motion)',
    badgeName: '행진 대장',
    badgeIcon: '🥁'
  },
  {
    id: 'l2_2',
    level: 2,
    title: '2-2. 산새의 하소연',
    subtitle: '솔-파-미-레-도 내려오기',
    notes: ['G4', 'F4', 'E4', 'D4', 'C4'],
    hint: '솔에서 도까지 이웃한 음들로 차례대로 내려오는 하행 선율',
    contourType: 'descending',
    contourDescription: '↘ 5음 연속 내리막길 선율',
    musicalConcept: '순차 하행 진행',
    badgeName: '산새 지저귐',
    badgeIcon: '🎶'
  },
  {
    id: 'l2_3',
    level: 2,
    title: '2-3. 학교종의 물결 선율',
    subtitle: '솔솔 라라 솔솔 미',
    notes: ['G4', 'G4', 'A4', 'A4', 'G4', 'G4', 'E4'],
    hint: '솔에서 라로 살짝 올라갔다가 다시 미로 내려오는 물결 가락',
    contourType: 'wave',
    contourDescription: '〰 산등성이 같은 물결 선율',
    musicalConcept: '동요 프레이즈 구조',
    badgeName: '학교종 마스터',
    badgeIcon: '🔔'
  },
  {
    id: 'l2_4',
    level: 2,
    title: '2-4. 나비의 날갯짓',
    subtitle: '미파 솔솔~ 미파 솔솔~',
    notes: ['E4', 'F4', 'G4', 'G4', 'E4', 'F4', 'G4', 'G4'],
    hint: '미-파-솔로 부드럽게 올라가는 상행 웨이브 선율',
    contourType: 'ascending',
    contourDescription: '↗ 웨이브를 그리며 상승하는 선율',
    musicalConcept: '선율의 반복과 상행',
    badgeName: '나비 날개',
    badgeIcon: '🦋'
  },

  // --- 3단계: 도전 (5~6학년) - 1옥타브 청음 & 가락 구조 분석 ---
  {
    id: 'l3_1',
    level: 3,
    title: '3-1. 작은 별의 대칭 가락',
    subtitle: '도도 솔솔 라라 솔~',
    notes: ['C4', 'C4', 'G4', 'G4', 'A4', 'A4', 'G4'],
    hint: '낮은 도에서 솔로 크게 도약한 뒤 라로 올라가 솔로 마무리되는 선율',
    contourType: 'jump',
    contourDescription: '⚡ 도약과 순차가 결합된 선율',
    musicalConcept: '도약과 순차진행의 조화',
    badgeName: '반짝별 요정',
    badgeIcon: '⭐'
  },
  {
    id: 'l3_2',
    level: 3,
    title: '3-2. 무지개 아치 그리기',
    subtitle: '도-미-솔-높은도-솔-미-도',
    notes: ['C4', 'E4', 'G4', 'C5', 'G4', 'E4', 'C4'],
    hint: '지팡이 모양으로 올라갔다가 다시 완만하게 내려오는 아치형 가락',
    contourType: 'wave',
    contourDescription: '∩ 무지개 아치 모양의 선율',
    musicalConcept: '아치형 선율 (Arch Contour)',
    badgeName: '무지개 탐험가',
    badgeIcon: '🌈'
  },
  {
    id: 'l3_3',
    level: 3,
    title: '3-3. 산등성이 오르내리기',
    subtitle: '미-레-도-레-미-미-미',
    notes: ['E4', 'D4', 'C4', 'D4', 'E4', 'E4', 'E4'],
    hint: '미에서 아래로 내려갔다가 다시 올라오는 V자형 물결 가락',
    contourType: 'wave',
    contourDescription: '∪ V자 골짜기 모양 선율',
    musicalConcept: '하행 후 상행 선율',
    badgeName: '아기염소 친구',
    badgeIcon: '🐐'
  },
  {
    id: 'l3_4',
    level: 3,
    title: '3-4. 절대음감 가락 낚시',
    subtitle: '솔-시-레-높은도 고난도 청음',
    notes: ['G4', 'B4', 'D4', 'F4', 'A4', 'C5'],
    hint: '음과 음 사이의 넓은 간격을 귀로 듣고 가락의 흐름을 파악하기',
    contourType: 'jump',
    contourDescription: '⚡ 넓은 음역의 대형 도약 선율',
    musicalConcept: '음정 도약과 청음 분석',
    badgeName: '절대음감 마스터',
    badgeIcon: '👑'
  }
];
