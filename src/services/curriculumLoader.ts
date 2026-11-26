import {
  BucketCard,
  QuestionType,
  ScienceLesson,
  ScienceQuestion,
  SimulationType,
} from '../types/curriculum';

interface RawQuestion {
  id: string;
  type: QuestionType;
  prompt: string;
  answerText?: string;
  explanation?: string;
  options?: string[];
  correctIndex?: number;
  correctBool?: boolean;
  isPictureMode?: boolean;
  items?: string[];
  correctIndices?: number[];
  leftItems?: string[];
  rightItems?: string[];
  correctPairs?: Record<string, number>;
  buckets?: string[];
  cards?: Array<{ text: string; bucketIndex: number }>;
  steps?: string[];
  sceneTitle?: string;
  hotspots?: string[];
  minValue?: number;
  maxValue?: number;
  targetValue?: number;
  unit?: string;
  simType?: string;
  choices?: string[];
  correctAnswers?: string[];
}

interface RawLesson {
  id: string;
  order: number;
  title: string;
  grade: number;
  term: number;
  contentTopic: string;
  weeks: string;
  questions: RawQuestion[];
}

function normalizeQuestion(raw: RawQuestion, lessonId: string): ScienceQuestion {
  const correctPairs: Record<number, number> = {};
  if (raw.correctPairs) {
    for (const [k, v] of Object.entries(raw.correctPairs)) {
      correctPairs[Number(k)] = Number(v);
    }
  }

  const cards: BucketCard[] = (raw.cards ?? []).map((c) => ({
    text: c.text,
    bucketIndex: c.bucketIndex,
  }));

  const simType: SimulationType =
    raw.simType === 'GRAVITY_DROP' ? 'GRAVITY_DROP' : 'CART_PUSH';

  return {
    id: raw.id,
    lessonId,
    type: raw.type,
    prompt: raw.prompt,
    answerText: raw.answerText ?? '',
    explanation: raw.explanation ?? '',
    options: raw.options ?? [],
    correctIndex: raw.correctIndex ?? 0,
    correctBool: raw.correctBool ?? true,
    isPictureMode: raw.isPictureMode ?? false,
    items: raw.items ?? [],
    correctIndices: raw.correctIndices ?? [],
    leftItems: raw.leftItems ?? [],
    rightItems: raw.rightItems ?? [],
    correctPairs,
    buckets: raw.buckets ?? [],
    cards,
    steps: raw.steps ?? [],
    sceneTitle: raw.sceneTitle ?? '',
    hotspots: raw.hotspots ?? [],
    minValue: raw.minValue ?? 0,
    maxValue: raw.maxValue ?? 30,
    targetValue: raw.targetValue ?? 25,
    unit: raw.unit ?? 'cm',
    simType,
    choices: raw.choices ?? [],
    correctAnswers: raw.correctAnswers ?? [],
  };
}

export async function loadCurriculumLessons(): Promise<ScienceLesson[]> {
  const response = await fetch('/data/science_curriculum.json');
  if (!response.ok) {
    throw new Error(`Failed to load curriculum (${response.status})`);
  }
  const root = (await response.json()) as { lessons: RawLesson[] };
  return (root.lessons ?? []).map((lesson) => ({
    id: lesson.id,
    order: lesson.order,
    title: lesson.title,
    grade: lesson.grade,
    term: lesson.term,
    contentTopic: lesson.contentTopic,
    weeks: lesson.weeks,
    questions: (lesson.questions ?? []).map((q) => normalizeQuestion(q, lesson.id)),
  }));
}
