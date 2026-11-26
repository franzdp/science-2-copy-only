import { useCallback, useEffect, useMemo, useState } from 'react';
import { loadCurriculumLessons } from '../services/curriculumLoader';
import {
  addLearnerToStore,
  completeActivitySessionInStore,
  computeBadges,
  computeProgressMapForLearner,
  computeStarsByLearner,
  deleteLearnerFromStore,
  getActiveLearner,
  getMistakesForLearner,
  loadStore,
  PersistedStore,
  recordQuestionResultInStore,
  resetActiveLearnerProgress,
  saveStore,
  setActiveLearnerGrade,
  setActiveLearnerTts,
  switchLearnerInStore,
  updateActiveLearnerProfile,
} from '../services/storageRepository';
import {
  ActivitySessionState,
  CHALLENGE_MODES,
  ChallengeModeId,
  ScienceLesson,
  ScienceQuestion,
} from '../types/curriculum';

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = copy[i];
    copy[i] = copy[j];
    copy[j] = tmp;
  }
  return copy;
}

function initQuestionState(
  base: ActivitySessionState,
  q: ScienceQuestion,
): ActivitySessionState {
  let shuffledRight: number[] = [];
  if (q.type === 'MATCHING') {
    const orig = q.rightItems.map((_, i) => i);
    shuffledRight = shuffleArray(orig);
    if (
      shuffledRight.length > 1 &&
      shuffledRight.every((v, idx) => v === orig[idx])
    ) {
      shuffledRight = [...orig].reverse();
    }
  }

  const shuffledCards =
    q.type === 'SORT_BUCKETS' ? shuffleArray(q.cards.map((_, i) => i)) : [];

  let shuffledSteps: number[] = [];
  if (q.type === 'ORDER_STEPS') {
    const orig = q.steps.map((_, i) => i);
    shuffledSteps = shuffleArray(orig);
    if (
      shuffledSteps.length > 1 &&
      shuffledSteps.every((v, idx) => v === orig[idx])
    ) {
      shuffledSteps = [...orig].reverse();
    }
  }

  return {
    ...base,
    feedback: null,
    selectedSingleIndex: null,
    selectedBool: null,
    selectedMultiIndices: [],
    shuffledRightIndices: shuffledRight,
    activeLeftIndex: q.type === 'MATCHING' ? 0 : null,
    matchedPairs: {},
    shuffledCardIndices: shuffledCards,
    activeCardIndex: shuffledCards[0] ?? null,
    cardBucketAssignments: {},
    orderedStepIndices: shuffledSteps,
    selectedHotspotIndices: [],
    sliderValue: q.minValue,
    simHasRun: false,
    simSelectedChoice: null,
    fillBlankSelections: [],
  };
}

export function canSubmitAnswer(session: ActivitySessionState | null): boolean {
  if (!session) return false;
  const q = session.questions[session.currentIndex];
  if (!q || session.feedback !== null) return false;

  switch (q.type) {
    case 'MULTIPLE_CHOICE':
      return session.selectedSingleIndex !== null;
    case 'TRUE_FALSE':
      return session.selectedBool !== null;
    case 'MULTI_SELECT':
      return session.selectedMultiIndices.length > 0;
    case 'MATCHING':
      return Object.keys(session.matchedPairs).length === q.leftItems.length;
    case 'SORT_BUCKETS':
      return Object.keys(session.cardBucketAssignments).length === q.cards.length;
    case 'ORDER_STEPS':
      return session.orderedStepIndices.length === q.steps.length;
    case 'HOTSPOT':
      return session.selectedHotspotIndices.length > 0;
    case 'SLIDER':
      return true;
    case 'SIMULATION':
      return session.simSelectedChoice !== null;
    case 'FILL_BLANK':
      return (
        session.fillBlankSelections.length === Math.max(1, q.correctAnswers.length)
      );
  }
}

export function useScienceApp() {
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [allLessons, setAllLessons] = useState<ScienceLesson[]>([]);
  const [selectedTerm, setSelectedTerm] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [store, setStore] = useState<PersistedStore>(() => loadStore());
  const [session, setSession] = useState<ActivitySessionState | null>(null);

  useEffect(() => {
    let active = true;
    loadCurriculumLessons()
      .then((lessons) => {
        if (!active) return;
        setAllLessons(lessons);
        setIsLoading(false);
      })
      .catch((err: unknown) => {
        if (!active) return;
        setErrorMessage(
          err instanceof Error ? err.message : 'Failed to load curriculum',
        );
        setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const updateStore = useCallback(
    (updater: (prev: PersistedStore) => PersistedStore) => {
      setStore((prev) => {
        const next = updater(prev);
        saveStore(next);
        return next;
      });
    },
    [],
  );

  const stats = useMemo(() => getActiveLearner(store), [store]);
  const selectedGrade = stats.selectedGrade;
  const progressMap = useMemo(
    () => computeProgressMapForLearner(store, stats.id),
    [store, stats.id],
  );
  const mistakes = useMemo(
    () => getMistakesForLearner(store, stats.id),
    [store, stats.id],
  );
  const learnerStarsMap = useMemo(() => computeStarsByLearner(store), [store]);
  const badges = useMemo(
    () => computeBadges(allLessons, progressMap, stats),
    [allLessons, progressMap, stats],
  );

  const filteredLessons = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allLessons.filter(
      (lesson) =>
        lesson.grade === selectedGrade &&
        (selectedTerm === null || lesson.term === selectedTerm) &&
        (!q ||
          lesson.title.toLowerCase().includes(q) ||
          lesson.contentTopic.toLowerCase().includes(q)),
    );
  }, [allLessons, selectedGrade, selectedTerm, searchQuery]);

  const totalStars = useMemo(
    () => Object.values(progressMap).reduce((sum, p) => sum + p.stars, 0),
    [progressMap],
  );
  const maxStars = allLessons.length * 3;
  const completedLessonsCount = useMemo(
    () => Object.values(progressMap).filter((p) => p.stars >= 1).length,
    [progressMap],
  );

  // Actions
  const selectGrade = useCallback(
    (grade: number) => updateStore((s) => setActiveLearnerGrade(s, grade)),
    [updateStore],
  );

  const updateProfile = useCallback(
    (name: string, grade: number, avatarIndex?: number) =>
      updateStore((s) => updateActiveLearnerProfile(s, name, grade, avatarIndex)),
    [updateStore],
  );

  const switchLearner = useCallback(
    (learnerId: number) => {
      setSession(null);
      updateStore((s) => switchLearnerInStore(s, learnerId));
    },
    [updateStore],
  );

  const addLearner = useCallback(
    (name: string, grade: number, avatarIndex: number) => {
      setSession(null);
      updateStore((s) => addLearnerToStore(s, name, grade, avatarIndex, true));
    },
    [updateStore],
  );

  const deleteLearner = useCallback(
    (learnerId: number) => {
      updateStore((s) => deleteLearnerFromStore(s, learnerId));
    },
    [updateStore],
  );

  const setTtsAutoRead = useCallback(
    (enabled: boolean) => updateStore((s) => setActiveLearnerTts(s, enabled)),
    [updateStore],
  );

  const resetAllProgress = useCallback(
    () => updateStore((s) => resetActiveLearnerProgress(s)),
    [updateStore],
  );

  const startLesson = useCallback(
    (lesson: ScienceLesson) => {
      const firstQ = lesson.questions[0];
      if (!firstQ) return;
      const base: ActivitySessionState = {
        learnerId: stats.id,
        title: lesson.title,
        subtitle: `Grade ${lesson.grade} • Term ${lesson.term} • ${lesson.weeks}`,
        lessonId: lesson.id,
        questions: lesson.questions,
        currentIndex: 0,
        correctCount: 0,
        sessionXp: 0,
        currentStreakInSession: 0,
        missedInSession: [],
        isCompleted: false,
        feedback: null,
        selectedSingleIndex: null,
        selectedBool: null,
        selectedMultiIndices: [],
        shuffledRightIndices: [],
        activeLeftIndex: null,
        matchedPairs: {},
        shuffledCardIndices: [],
        activeCardIndex: null,
        cardBucketAssignments: {},
        orderedStepIndices: [],
        selectedHotspotIndices: [],
        sliderValue: firstQ.minValue,
        simHasRun: false,
        simSelectedChoice: null,
        fillBlankSelections: [],
      };
      setSession(initQuestionState(base, firstQ));
    },
    [stats.id],
  );

  const startReviewMistakes = useCallback(() => {
    const qMap = new Map<string, ScienceQuestion>();
    for (const l of allLessons) {
      for (const q of l.questions) {
        qMap.set(q.id, q);
      }
    }
    const reviewQs = mistakes
      .map((m) => qMap.get(m.questionId))
      .filter((q): q is ScienceQuestion => Boolean(q))
      .slice(0, 15);
    if (reviewQs.length === 0) return;

    const firstQ = reviewQs[0];
    const base: ActivitySessionState = {
      learnerId: stats.id,
      title: 'Review Missed Questions',
      subtitle: `${reviewQs.length} items to master`,
      lessonId: null,
      questions: reviewQs,
      currentIndex: 0,
      correctCount: 0,
      sessionXp: 0,
      currentStreakInSession: 0,
      missedInSession: [],
      isCompleted: false,
      feedback: null,
      selectedSingleIndex: null,
      selectedBool: null,
      selectedMultiIndices: [],
      shuffledRightIndices: [],
      activeLeftIndex: null,
      matchedPairs: {},
      shuffledCardIndices: [],
      activeCardIndex: null,
      cardBucketAssignments: {},
      orderedStepIndices: [],
      selectedHotspotIndices: [],
      sliderValue: firstQ.minValue,
      simHasRun: false,
      simSelectedChoice: null,
      fillBlankSelections: [],
    };
    setSession(initQuestionState(base, firstQ));
  }, [allLessons, mistakes, stats.id]);

  const startChallenge = useCallback(
    (mode: ChallengeModeId) => {
      if (mode === 'MISTAKE_REVIEW') {
        startReviewMistakes();
        return;
      }
      const gradeQs = allLessons
        .filter((l) => l.grade === selectedGrade)
        .flatMap((l) => l.questions);

      let pool: ScienceQuestion[] = [];
      switch (mode) {
        case 'DAILY_MIX':
          pool = gradeQs;
          break;
        case 'QUICK_QUIZ':
          pool = gradeQs.filter(
            (q) => q.type === 'MULTIPLE_CHOICE' || q.type === 'TRUE_FALSE',
          );
          break;
        case 'SORT_AND_MATCH':
          pool = gradeQs.filter(
            (q) =>
              q.type === 'SORT_BUCKETS' ||
              q.type === 'MATCHING' ||
              q.type === 'ORDER_STEPS' ||
              q.type === 'FILL_BLANK',
          );
          break;
        case 'VISUAL_SPOTTER':
          pool = gradeQs.filter(
            (q) =>
              q.type === 'MULTI_SELECT' ||
              q.type === 'HOTSPOT' ||
              q.type === 'SLIDER' ||
              q.type === 'SIMULATION',
          );
          break;
      }

      const picked = shuffleArray(pool).slice(0, 10);
      if (picked.length === 0) return;

      const meta = CHALLENGE_MODES[mode];
      const firstQ = picked[0];
      const base: ActivitySessionState = {
        learnerId: stats.id,
        title: meta.title,
        subtitle: `Grade ${selectedGrade} • ${picked.length} Activities`,
        lessonId: null,
        questions: picked,
        currentIndex: 0,
        correctCount: 0,
        sessionXp: 0,
        currentStreakInSession: 0,
        missedInSession: [],
        isCompleted: false,
        feedback: null,
        selectedSingleIndex: null,
        selectedBool: null,
        selectedMultiIndices: [],
        shuffledRightIndices: [],
        activeLeftIndex: null,
        matchedPairs: {},
        shuffledCardIndices: [],
        activeCardIndex: null,
        cardBucketAssignments: {},
        orderedStepIndices: [],
        selectedHotspotIndices: [],
        sliderValue: firstQ.minValue,
        simHasRun: false,
        simSelectedChoice: null,
        fillBlankSelections: [],
      };
      setSession(initQuestionState(base, firstQ));
    },
    [allLessons, selectedGrade, startReviewMistakes, stats.id],
  );

  const startRetryMissedInSession = useCallback(() => {
    setSession((cur) => {
      if (!cur || cur.missedInSession.length === 0) return cur;
      const qs = cur.missedInSession;
      const firstQ = qs[0];
      const base: ActivitySessionState = {
        learnerId: cur.learnerId,
        title: 'Practice Missed Items',
        subtitle: `${qs.length} items`,
        lessonId: null,
        questions: qs,
        currentIndex: 0,
        correctCount: 0,
        sessionXp: 0,
        currentStreakInSession: 0,
        missedInSession: [],
        isCompleted: false,
        feedback: null,
        selectedSingleIndex: null,
        selectedBool: null,
        selectedMultiIndices: [],
        shuffledRightIndices: [],
        activeLeftIndex: null,
        matchedPairs: {},
        shuffledCardIndices: [],
        activeCardIndex: null,
        cardBucketAssignments: {},
        orderedStepIndices: [],
        selectedHotspotIndices: [],
        sliderValue: firstQ.minValue,
        simHasRun: false,
        simSelectedChoice: null,
        fillBlankSelections: [],
      };
      return initQuestionState(base, firstQ);
    });
  }, []);

  const exitSession = useCallback(() => setSession(null), []);

  // Per-question interaction handlers
  const onSelectSingle = useCallback((index: number) => {
    setSession((cur) => (cur ? { ...cur, selectedSingleIndex: index } : cur));
  }, []);

  const onSelectBool = useCallback((value: boolean) => {
    setSession((cur) => (cur ? { ...cur, selectedBool: value } : cur));
  }, []);

  const onToggleMultiSelect = useCallback((index: number) => {
    setSession((cur) => {
      if (!cur) return cur;
      const exists = cur.selectedMultiIndices.includes(index);
      const next = exists
        ? cur.selectedMultiIndices.filter((i) => i !== index)
        : [...cur.selectedMultiIndices, index];
      return { ...cur, selectedMultiIndices: next };
    });
  }, []);

  const onSelectMatchingLeft = useCallback((leftIdx: number) => {
    setSession((cur) => {
      if (!cur) return cur;
      const updatedMap = { ...cur.matchedPairs };
      delete updatedMap[leftIdx];
      return { ...cur, activeLeftIndex: leftIdx, matchedPairs: updatedMap };
    });
  }, []);

  const onSelectMatchingRight = useCallback((rightOriginalIdx: number) => {
    setSession((cur) => {
      if (!cur) return cur;
      const q = cur.questions[cur.currentIndex];
      if (!q) return cur;
      const leftIdx =
        cur.activeLeftIndex ??
        q.leftItems.findIndex((_, i) => cur.matchedPairs[i] === undefined);
      if (leftIdx < 0) return cur;

      const updatedMap: Record<number, number> = {};
      for (const [k, v] of Object.entries(cur.matchedPairs)) {
        if (v !== rightOriginalIdx) {
          updatedMap[Number(k)] = v;
        }
      }
      updatedMap[leftIdx] = rightOriginalIdx;
      const nextLeft = q.leftItems.findIndex(
        (_, i) => updatedMap[i] === undefined,
      );
      return {
        ...cur,
        matchedPairs: updatedMap,
        activeLeftIndex: nextLeft >= 0 ? nextLeft : null,
      };
    });
  }, []);

  const onSelectSortCard = useCallback((cardOriginalIdx: number) => {
    setSession((cur) =>
      cur ? { ...cur, activeCardIndex: cardOriginalIdx } : cur,
    );
  }, []);

  const onAssignCardToBucket = useCallback((bucketIdx: number) => {
    setSession((cur) => {
      if (!cur || cur.activeCardIndex === null) return cur;
      const updated = {
        ...cur.cardBucketAssignments,
        [cur.activeCardIndex]: bucketIdx,
      };
      const nextCard =
        cur.shuffledCardIndices.find((idx) => updated[idx] === undefined) ??
        null;
      return {
        ...cur,
        cardBucketAssignments: updated,
        activeCardIndex: nextCard,
      };
    });
  }, []);

  const onRemoveCardFromBucket = useCallback((cardOriginalIdx: number) => {
    setSession((cur) => {
      if (!cur) return cur;
      const updated = { ...cur.cardBucketAssignments };
      delete updated[cardOriginalIdx];
      return {
        ...cur,
        cardBucketAssignments: updated,
        activeCardIndex: cardOriginalIdx,
      };
    });
  }, []);

  const onMoveStepUp = useCallback((position: number) => {
    if (position <= 0) return;
    setSession((cur) => {
      if (!cur) return cur;
      const list = [...cur.orderedStepIndices];
      const tmp = list[position - 1];
      list[position - 1] = list[position];
      list[position] = tmp;
      return { ...cur, orderedStepIndices: list };
    });
  }, []);

  const onMoveStepDown = useCallback((position: number) => {
    setSession((cur) => {
      if (!cur || position >= cur.orderedStepIndices.length - 1) return cur;
      const list = [...cur.orderedStepIndices];
      const tmp = list[position + 1];
      list[position + 1] = list[position];
      list[position] = tmp;
      return { ...cur, orderedStepIndices: list };
    });
  }, []);

  const onToggleHotspot = useCallback((index: number) => {
    setSession((cur) => {
      if (!cur) return cur;
      const q = cur.questions[cur.currentIndex];
      if (!q) return cur;
      let updated: number[];
      if (q.correctIndices.length === 1) {
        updated = [index];
      } else {
        updated = cur.selectedHotspotIndices.includes(index)
          ? cur.selectedHotspotIndices.filter((i) => i !== index)
          : [...cur.selectedHotspotIndices, index];
      }
      return { ...cur, selectedHotspotIndices: updated };
    });
  }, []);

  const onSliderChange = useCallback((value: number) => {
    setSession((cur) => (cur ? { ...cur, sliderValue: value } : cur));
  }, []);

  const onSimulationRun = useCallback(() => {
    setSession((cur) => (cur ? { ...cur, simHasRun: true } : cur));
  }, []);

  const onSelectSimulationChoice = useCallback((index: number) => {
    setSession((cur) => (cur ? { ...cur, simSelectedChoice: index } : cur));
  }, []);

  const onToggleFillBlankChoice = useCallback((choice: string) => {
    setSession((cur) => {
      if (!cur) return cur;
      const q = cur.questions[cur.currentIndex];
      if (!q) return cur;
      const needed = Math.max(1, q.correctAnswers.length);
      const list = [...cur.fillBlankSelections];
      const idx = list.indexOf(choice);
      if (idx >= 0) {
        list.splice(idx, 1);
      } else {
        if (list.length >= needed) {
          list.pop();
        }
        list.push(choice);
      }
      return { ...cur, fillBlankSelections: list };
    });
  }, []);

  const submitAnswer = useCallback(() => {
    if (!session) return;
    const q = session.questions[session.currentIndex];
    if (!q || session.feedback !== null) return;

    let isCorrect = false;
    switch (q.type) {
      case 'MULTIPLE_CHOICE':
        isCorrect = session.selectedSingleIndex === q.correctIndex;
        break;
      case 'TRUE_FALSE':
        isCorrect = session.selectedBool === q.correctBool;
        break;
      case 'MULTI_SELECT': {
        const sel = new Set(session.selectedMultiIndices);
        const target = new Set(q.correctIndices);
        isCorrect =
          sel.size === target.size && [...sel].every((v) => target.has(v));
        break;
      }
      case 'MATCHING':
        isCorrect = Object.entries(q.correctPairs).every(
          ([l, r]) => session.matchedPairs[Number(l)] === r,
        );
        break;
      case 'SORT_BUCKETS':
        isCorrect = q.cards.every(
          (card, idx) => session.cardBucketAssignments[idx] === card.bucketIndex,
        );
        break;
      case 'ORDER_STEPS':
        isCorrect = session.orderedStepIndices.every((val, pos) => val === pos);
        break;
      case 'HOTSPOT': {
        const sel = new Set(session.selectedHotspotIndices);
        const targets = new Set(q.correctIndices);
        const sameSet =
          sel.size === targets.size && [...sel].every((v) => targets.has(v));
        const lowerAns = q.answerText.toLowerCase();
        isCorrect =
          sel.size > 0 &&
          [...sel].every((v) => targets.has(v)) &&
          (targets.size === 1 ||
            sameSet ||
            lowerAns.includes(' or ') ||
            lowerAns.includes('either'));
        break;
      }
      case 'SLIDER':
        isCorrect = Math.abs(session.sliderValue - q.targetValue) <= 1.5;
        break;
      case 'SIMULATION':
        isCorrect = session.simSelectedChoice === q.correctIndex;
        break;
      case 'FILL_BLANK':
        isCorrect =
          session.fillBlankSelections.length === q.correctAnswers.length &&
          session.fillBlankSelections.every(
            (v, i) =>
              v.trim().toLowerCase() === q.correctAnswers[i].trim().toLowerCase(),
          );
        break;
    }

    const newStreak = isCorrect ? session.currentStreakInSession + 1 : 0;
    const xpGained = isCorrect ? 10 + (newStreak >= 3 ? 5 : 0) : 2;
    const headline = isCorrect
      ? newStreak >= 5
        ? `Unstoppable! ${newStreak} in a row!`
        : newStreak >= 3
          ? `Great Streak! +${xpGained} XP`
          : `Awesome Job! +${xpGained} XP`
      : "Not quite — let's learn!";

    const parts: string[] = [];
    if (!isCorrect) {
      let ans = q.answerText;
      if (q.type === 'MULTIPLE_CHOICE') {
        ans = q.options[q.correctIndex] ?? q.answerText;
      } else if (q.type === 'TRUE_FALSE') {
        ans = q.correctBool ? 'True' : 'False';
      }
      parts.push(`Correct answer: ${ans}`);
    }
    if (q.explanation.trim()) {
      parts.push(q.explanation.trim());
    }
    const detail =
      parts.join('\n') ||
      (isCorrect
        ? 'You nailed this science concept!'
        : 'Review the highlighted answer above.');

    updateStore((s) =>
      recordQuestionResultInStore(
        s,
        session.learnerId,
        q.id,
        q.lessonId,
        isCorrect,
      ),
    );

    setSession((cur) =>
      cur
        ? {
            ...cur,
            correctCount: cur.correctCount + (isCorrect ? 1 : 0),
            sessionXp: cur.sessionXp + xpGained,
            currentStreakInSession: newStreak,
            missedInSession: isCorrect
              ? cur.missedInSession
              : [...cur.missedInSession, q],
            feedback: {
              isCorrect,
              headline,
              detail,
              xpGained,
            },
          }
        : cur,
    );
  }, [session, updateStore]);

  const nextQuestion = useCallback(() => {
    if (!session) return;
    const nextIdx = session.currentIndex + 1;
    if (nextIdx >= session.questions.length) {
      updateStore((s) =>
        completeActivitySessionInStore(
          s,
          session.learnerId,
          session.lessonId,
          session.correctCount,
          session.questions.length,
          session.sessionXp,
        ),
      );
      setSession((cur) =>
        cur ? { ...cur, isCompleted: true, feedback: null } : cur,
      );
    } else {
      const nextQ = session.questions[nextIdx];
      setSession((cur) =>
        cur
          ? initQuestionState({ ...cur, currentIndex: nextIdx }, nextQ)
          : cur,
      );
    }
  }, [session, updateStore]);

  return {
    isLoading,
    errorMessage,
    allLessons,
    filteredLessons,
    selectedGrade,
    selectedTerm,
    searchQuery,
    progressMap,
    mistakes,
    stats,
    learners: store.learners,
    learnerStarsMap,
    badges,
    totalStars,
    maxStars,
    completedLessonsCount,
    session,
    selectGrade,
    selectTerm: setSelectedTerm,
    updateSearchQuery: setSearchQuery,
    updateProfile,
    switchLearner,
    addLearner,
    deleteLearner,
    setTtsAutoRead,
    resetAllProgress,
    startLesson,
    startChallenge,
    startRetryMissedInSession,
    exitSession,
    onSelectSingle,
    onSelectBool,
    onToggleMultiSelect,
    onSelectMatchingLeft,
    onSelectMatchingRight,
    onSelectSortCard,
    onAssignCardToBucket,
    onRemoveCardFromBucket,
    onMoveStepUp,
    onMoveStepDown,
    onToggleHotspot,
    onSliderChange,
    onSimulationRun,
    onSelectSimulationChoice,
    onToggleFillBlankChoice,
    submitAnswer,
    nextQuestion,
  };
}

export type ScienceAppController = ReturnType<typeof useScienceApp>;
