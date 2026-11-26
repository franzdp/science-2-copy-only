export type QuestionType =
  | 'MULTIPLE_CHOICE'
  | 'TRUE_FALSE'
  | 'MULTI_SELECT'
  | 'MATCHING'
  | 'SORT_BUCKETS'
  | 'ORDER_STEPS'
  | 'HOTSPOT'
  | 'SLIDER'
  | 'SIMULATION'
  | 'FILL_BLANK';

export interface BucketCard {
  text: string;
  bucketIndex: number;
}

export type SimulationType = 'CART_PUSH' | 'GRAVITY_DROP';

export interface ScienceQuestion {
  id: string;
  lessonId: string;
  type: QuestionType;
  prompt: string;
  answerText: string;
  explanation: string;
  // Multiple Choice
  options: string[];
  correctIndex: number;
  // True / False
  correctBool: boolean;
  // Multi-Select (Select Pictures / Select Objects)
  isPictureMode: boolean;
  items: string[];
  correctIndices: number[];
  // Matching
  leftItems: string[];
  rightItems: string[];
  correctPairs: Record<number, number>;
  // Sort Buckets
  buckets: string[];
  cards: BucketCard[];
  // Order Steps
  steps: string[];
  // Hotspot
  sceneTitle: string;
  hotspots: string[];
  // Slider
  minValue: number;
  maxValue: number;
  targetValue: number;
  unit: string;
  // Simulation
  simType: SimulationType;
  choices: string[];
  // Fill Blank
  correctAnswers: string[];
}

export interface ScienceLesson {
  id: string;
  order: number;
  title: string;
  grade: number;
  term: number;
  contentTopic: string;
  weeks: string;
  questions: ScienceQuestion[];
}

export interface ScienceBadge {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  progressText: string;
}

export type ChallengeModeId =
  | 'DAILY_MIX'
  | 'QUICK_QUIZ'
  | 'SORT_AND_MATCH'
  | 'VISUAL_SPOTTER'
  | 'MISTAKE_REVIEW';

export interface ChallengeModeMeta {
  id: ChallengeModeId;
  title: string;
  subtitle: string;
}

export const CHALLENGE_MODES: Record<ChallengeModeId, ChallengeModeMeta> = {
  DAILY_MIX: {
    id: 'DAILY_MIX',
    title: 'Daily Science Sprint',
    subtitle: '10 mixed questions across your selected grade',
  },
  QUICK_QUIZ: {
    id: 'QUICK_QUIZ',
    title: 'Flash Quiz Lab',
    subtitle: 'Multiple Choice & True/False speed round',
  },
  SORT_AND_MATCH: {
    id: 'SORT_AND_MATCH',
    title: 'Sort, Match & Order',
    subtitle: 'Hands-on sorting buckets, pairs & sequences',
  },
  VISUAL_SPOTTER: {
    id: 'VISUAL_SPOTTER',
    title: 'Visual & Lab Explorer',
    subtitle: 'Picture picks, science diagrams & simulations',
  },
  MISTAKE_REVIEW: {
    id: 'MISTAKE_REVIEW',
    title: 'Review Missed Items',
    subtitle: 'Master questions you missed earlier',
  },
};

export interface LearnerStats {
  id: number;
  learnerName: string;
  selectedGrade: number;
  totalXp: number;
  currentStreak: number;
  lastActiveDay: string;
  totalCorrect: number;
  totalAnswered: number;
  ttsAutoRead: boolean;
  avatarIndex: number;
  createdAt: number;
}

export interface LessonProgress {
  learnerId: number;
  lessonId: string;
  stars: number;
  bestScore: number;
  totalQuestions: number;
  attempts: number;
  completedAt: number;
}

export interface MistakeRecord {
  learnerId: number;
  questionId: string;
  lessonId: string;
  timestamp: number;
}

export interface QuestionAnswerFeedback {
  isCorrect: boolean;
  headline: string;
  detail: string;
  xpGained: number;
}

export interface ActivitySessionState {
  learnerId: number;
  title: string;
  subtitle: string;
  lessonId: string | null;
  questions: ScienceQuestion[];
  currentIndex: number;
  correctCount: number;
  sessionXp: number;
  currentStreakInSession: number;
  missedInSession: ScienceQuestion[];
  isCompleted: boolean;
  feedback: QuestionAnswerFeedback | null;
  // Interactive working states
  selectedSingleIndex: number | null;
  selectedBool: boolean | null;
  selectedMultiIndices: number[];
  shuffledRightIndices: number[];
  activeLeftIndex: number | null;
  matchedPairs: Record<number, number>;
  shuffledCardIndices: number[];
  activeCardIndex: number | null;
  cardBucketAssignments: Record<number, number>;
  orderedStepIndices: number[];
  selectedHotspotIndices: number[];
  sliderValue: number;
  simHasRun: boolean;
  simSelectedChoice: number | null;
  fillBlankSelections: string[];
}

export type TopTab = 'learn' | 'challenge' | 'progress';
