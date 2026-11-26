import {
  LearnerStats,
  LessonProgress,
  MistakeRecord,
  ScienceBadge,
  ScienceLesson,
} from '../types/curriculum';

const STORAGE_KEY = 'aral_science_bagacay_store_v1';

export interface PersistedStore {
  nextLearnerId: number;
  activeLearnerId: number;
  learners: LearnerStats[];
  lessonProgress: LessonProgress[];
  mistakes: MistakeRecord[];
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function createInitialStore(): PersistedStore {
  const defaultLearner: LearnerStats = {
    id: 1,
    learnerName: 'Young Scientist',
    selectedGrade: 5,
    totalXp: 0,
    currentStreak: 0,
    lastActiveDay: '',
    totalCorrect: 0,
    totalAnswered: 0,
    ttsAutoRead: false,
    avatarIndex: 0,
    createdAt: Date.now(),
  };
  return {
    nextLearnerId: 2,
    activeLearnerId: 1,
    learners: [defaultLearner],
    lessonProgress: [],
    mistakes: [],
  };
}

export function loadStore(): PersistedStore {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = createInitialStore();
      saveStore(initial);
      return initial;
    }
    const parsed = JSON.parse(raw) as Partial<PersistedStore>;
    const learners = Array.isArray(parsed.learners) && parsed.learners.length > 0
      ? parsed.learners
      : createInitialStore().learners;
    const activeExists = learners.some((l) => l.id === parsed.activeLearnerId);
    const activeLearnerId = activeExists ? (parsed.activeLearnerId as number) : learners[0].id;
    const maxId = learners.reduce((acc, l) => Math.max(acc, l.id), 0);
    return {
      nextLearnerId: Math.max(parsed.nextLearnerId ?? 2, maxId + 1),
      activeLearnerId,
      learners,
      lessonProgress: Array.isArray(parsed.lessonProgress) ? parsed.lessonProgress : [],
      mistakes: Array.isArray(parsed.mistakes) ? parsed.mistakes : [],
    };
  } catch {
    const initial = createInitialStore();
    saveStore(initial);
    return initial;
  }
}

export function saveStore(store: PersistedStore): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // Ignore storage quota errors cleanly
  }
}

export function getActiveLearner(store: PersistedStore): LearnerStats {
  return (
    store.learners.find((l) => l.id === store.activeLearnerId) ??
    store.learners[0] ??
    createInitialStore().learners[0]
  );
}

export function computeStarsByLearner(store: PersistedStore): Record<number, number> {
  const map: Record<number, number> = {};
  for (const row of store.lessonProgress) {
    map[row.learnerId] = (map[row.learnerId] ?? 0) + row.stars;
  }
  return map;
}

export function computeProgressMapForLearner(
  store: PersistedStore,
  learnerId: number,
): Record<string, LessonProgress> {
  const map: Record<string, LessonProgress> = {};
  for (const row of store.lessonProgress) {
    if (row.learnerId === learnerId) {
      map[row.lessonId] = row;
    }
  }
  return map;
}

export function getMistakesForLearner(
  store: PersistedStore,
  learnerId: number,
): MistakeRecord[] {
  return store.mistakes
    .filter((m) => m.learnerId === learnerId)
    .sort((a, b) => b.timestamp - a.timestamp);
}

export function addLearnerToStore(
  store: PersistedStore,
  name: string,
  grade: number,
  avatarIndex: number,
  switchToNew = true,
): PersistedStore {
  const cleanName = name.trim() || `Scientist ${store.learners.length + 1}`;
  const clampedGrade = Math.min(6, Math.max(3, grade));
  const clampedAvatar = Math.min(5, Math.max(0, avatarIndex));
  const newLearner: LearnerStats = {
    id: store.nextLearnerId,
    learnerName: cleanName,
    selectedGrade: clampedGrade,
    totalXp: 0,
    currentStreak: 0,
    lastActiveDay: '',
    totalCorrect: 0,
    totalAnswered: 0,
    ttsAutoRead: false,
    avatarIndex: clampedAvatar,
    createdAt: Date.now(),
  };
  return {
    ...store,
    nextLearnerId: store.nextLearnerId + 1,
    activeLearnerId: switchToNew ? newLearner.id : store.activeLearnerId,
    learners: [...store.learners, newLearner],
  };
}

export function switchLearnerInStore(
  store: PersistedStore,
  learnerId: number,
): PersistedStore {
  if (!store.learners.some((l) => l.id === learnerId)) return store;
  return { ...store, activeLearnerId: learnerId };
}

export function deleteLearnerFromStore(
  store: PersistedStore,
  learnerId: number,
): PersistedStore {
  if (store.learners.length <= 1) return store;
  const remaining = store.learners.filter((l) => l.id !== learnerId);
  const nextActiveId =
    store.activeLearnerId === learnerId && remaining.length > 0
      ? remaining[0].id
      : store.activeLearnerId;
  return {
    ...store,
    activeLearnerId: nextActiveId,
    learners: remaining,
    lessonProgress: store.lessonProgress.filter((p) => p.learnerId !== learnerId),
    mistakes: store.mistakes.filter((m) => m.learnerId !== learnerId),
  };
}

export function updateActiveLearnerProfile(
  store: PersistedStore,
  name: string,
  grade: number,
  avatarIndex?: number,
): PersistedStore {
  const cleanName = name.trim() || 'Young Scientist';
  const clampedGrade = Math.min(6, Math.max(3, grade));
  return {
    ...store,
    learners: store.learners.map((l) =>
      l.id === store.activeLearnerId
        ? {
            ...l,
            learnerName: cleanName,
            selectedGrade: clampedGrade,
            avatarIndex:
              avatarIndex !== undefined
                ? Math.min(5, Math.max(0, avatarIndex))
                : l.avatarIndex,
          }
        : l,
    ),
  };
}

export function setActiveLearnerGrade(
  store: PersistedStore,
  grade: number,
): PersistedStore {
  const clampedGrade = Math.min(6, Math.max(3, grade));
  return {
    ...store,
    learners: store.learners.map((l) =>
      l.id === store.activeLearnerId ? { ...l, selectedGrade: clampedGrade } : l,
    ),
  };
}

export function setActiveLearnerTts(
  store: PersistedStore,
  enabled: boolean,
): PersistedStore {
  return {
    ...store,
    learners: store.learners.map((l) =>
      l.id === store.activeLearnerId ? { ...l, ttsAutoRead: enabled } : l,
    ),
  };
}

export function recordQuestionResultInStore(
  store: PersistedStore,
  learnerId: number,
  questionId: string,
  lessonId: string,
  isCorrect: boolean,
): PersistedStore {
  const targetId = store.learners.some((l) => l.id === learnerId)
    ? learnerId
    : store.activeLearnerId;

  if (isCorrect) {
    return {
      ...store,
      mistakes: store.mistakes.filter(
        (m) => !(m.learnerId === targetId && m.questionId === questionId),
      ),
    };
  }

  const filtered = store.mistakes.filter(
    (m) => !(m.learnerId === targetId && m.questionId === questionId),
  );
  return {
    ...store,
    mistakes: [
      ...filtered,
      {
        learnerId: targetId,
        questionId,
        lessonId,
        timestamp: Date.now(),
      },
    ],
  };
}

export function completeActivitySessionInStore(
  store: PersistedStore,
  learnerId: number,
  lessonId: string | null,
  correctCount: number,
  totalCount: number,
  xpEarned: number,
): PersistedStore {
  const targetLearner =
    store.learners.find((l) => l.id === learnerId) ?? getActiveLearner(store);
  const targetId = targetLearner.id;

  let nextProgress = store.lessonProgress;
  if (lessonId !== null && totalCount > 0) {
    const accuracy = (correctCount * 100) / totalCount;
    const earnedStars =
      accuracy >= 85 ? 3 : accuracy >= 65 ? 2 : accuracy >= 40 ? 1 : 0;
    const existing = store.lessonProgress.find(
      (p) => p.learnerId === targetId && p.lessonId === lessonId,
    );
    const updatedRow: LessonProgress = {
      learnerId: targetId,
      lessonId,
      stars: Math.max(existing?.stars ?? 0, earnedStars),
      bestScore: Math.max(existing?.bestScore ?? 0, correctCount),
      totalQuestions: totalCount,
      attempts: (existing?.attempts ?? 0) + 1,
      completedAt: Date.now(),
    };
    nextProgress = [
      ...store.lessonProgress.filter(
        (p) => !(p.learnerId === targetId && p.lessonId === lessonId),
      ),
      updatedRow,
    ];
  }

  const now = new Date();
  const today = formatDate(now);
  const yesterdayDate = new Date(now);
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = formatDate(yesterdayDate);

  const newStreak =
    targetLearner.lastActiveDay === today
      ? Math.max(1, targetLearner.currentStreak)
      : targetLearner.lastActiveDay === yesterday
        ? targetLearner.currentStreak + 1
        : 1;

  const nextLearners = store.learners.map((l) =>
    l.id === targetId
      ? {
          ...l,
          totalXp: l.totalXp + xpEarned,
          currentStreak: newStreak,
          lastActiveDay: today,
          totalCorrect: l.totalCorrect + correctCount,
          totalAnswered: l.totalAnswered + totalCount,
        }
      : l,
  );

  return {
    ...store,
    learners: nextLearners,
    lessonProgress: nextProgress,
  };
}

export function resetActiveLearnerProgress(store: PersistedStore): PersistedStore {
  const targetId = store.activeLearnerId;
  return {
    ...store,
    lessonProgress: store.lessonProgress.filter((p) => p.learnerId !== targetId),
    mistakes: store.mistakes.filter((m) => m.learnerId !== targetId),
    learners: store.learners.map((l) =>
      l.id === targetId
        ? {
            ...l,
            totalXp: 0,
            currentStreak: 0,
            lastActiveDay: '',
            totalCorrect: 0,
            totalAnswered: 0,
          }
        : l,
    ),
  };
}

export function computeBadges(
  lessons: ScienceLesson[],
  progressMap: Record<string, LessonProgress>,
  stats: LearnerStats,
): ScienceBadge[] {
  const values = Object.values(progressMap);
  const completedCount = values.filter((p) => p.stars >= 1).length;
  const threeStarCount = values.filter((p) => p.stars === 3).length;
  const totalStars = values.reduce((acc, p) => acc + p.stars, 0);

  const gDone = (grade: number) =>
    lessons.filter((l) => l.grade === grade && (progressMap[l.id]?.stars ?? 0) >= 1)
      .length;
  const g3Done = gDone(3);
  const g4Done = gDone(4);
  const g5Done = gDone(5);
  const g6Done = gDone(6);
  const gradesCompletedCount = [g3Done, g4Done, g5Done, g6Done].filter(
    (c) => c >= 1,
  ).length;

  return [
    {
      id: 'first_discovery',
      title: 'First Discovery',
      description: 'Complete your first Science lesson',
      unlocked: completedCount >= 1,
      progressText: `${completedCount} / 1 lesson`,
    },
    {
      id: 'star_collector',
      title: 'Star Collector',
      description: 'Earn 15 mastery stars across lessons',
      unlocked: totalStars >= 15,
      progressText: `${totalStars} / 15 stars`,
    },
    {
      id: 'lab_perfection',
      title: '3-Star Scientist',
      description: 'Earn 3 stars in 3 different lessons',
      unlocked: threeStarCount >= 3,
      progressText: `${threeStarCount} / 3 lessons`,
    },
    {
      id: 'streak_hero',
      title: 'Curiosity Streak',
      description: 'Reach a 3-day learning streak',
      unlocked: stats.currentStreak >= 3,
      progressText: `${stats.currentStreak} / 3 days`,
    },
    {
      id: 'xp_explorer',
      title: 'Lab Whiz (500 XP)',
      description: 'Accumulate 500 Science XP',
      unlocked: stats.totalXp >= 500,
      progressText: `${stats.totalXp} / 500 XP`,
    },
    {
      id: 'all_grades',
      title: 'Grade Explorer',
      description: 'Try at least 1 lesson in Grades 3, 4, 5 & 6',
      unlocked: g3Done >= 1 && g4Done >= 1 && g5Done >= 1 && g6Done >= 1,
      progressText: `${gradesCompletedCount} / 4 grades`,
    },
  ];
}
