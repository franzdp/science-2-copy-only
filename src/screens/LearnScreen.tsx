import React from 'react';
import {
  Play,
  Search,
  Sparkles,
  Star,
  Users,
  X,
} from 'lucide-react';
import { LearnerAvatarBadge } from '../components/LearnerSwitcherDialog';
import { ScienceAppController } from '../hooks/useScienceApp';
import { ScienceLesson } from '../types/curriculum';

const GRADE_COLORS: Record<number, string> = {
  3: '#059669',
  4: '#0284C7',
  5: '#6366F1',
  6: '#F59E0B',
};

const TERM_COLORS: Record<number, string> = {
  1: '#0284C7',
  2: '#059669',
  3: '#6366F1',
};

export function LearnScreen({
  app,
  onOpenLearnerSwitcher,
}: {
  app: ScienceAppController;
  onOpenLearnerSwitcher: () => void;
}) {
  const gradeLessons = app.allLessons.filter(
    (l) => l.grade === app.selectedGrade,
  );
  const nextLesson =
    gradeLessons.find((l) => (app.progressMap[l.id]?.stars ?? 0) === 0) ??
    gradeLessons[0] ??
    null;

  const terms: Array<{ value: number | null; label: string }> = [
    { value: null, label: 'All Terms' },
    { value: 1, label: 'Term 1' },
    { value: 2, label: 'Term 2' },
    { value: 3, label: 'Term 3' },
  ];

  return (
    <div className="w-full max-w-[680px] mx-auto px-4 py-3.5 space-y-3.5 pb-24 md:pb-8">
      {/* Branded School Header Card */}
      <div
        data-testid="school_brand_header"
        className="rounded-[20px] bg-white border-[1.2px] border-[#0284C7]/30 px-3.5 py-2.5 flex items-center gap-3"
      >
        <img
          src="/images/ic_launcher_art.jpg"
          alt="SCIENTISTS of Bagacay ES Logo"
          referrerPolicy="no-referrer"
          className="w-12 h-12 rounded-[14px] object-cover shrink-0"
        />
        <div className="min-w-0 flex-1">
          <div className="text-base font-bold text-[#0284C7] leading-snug truncate">
            SCIENTISTS of Bagacay ES
          </div>
          <div className="text-[11px] font-medium text-[#475569]">
            This is innovated by FRANZ D. PADOJINOG
          </div>
        </div>
      </div>

      {/* Top Learner Greeting, Switcher & Stars Strip */}
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onOpenLearnerSwitcher}
          className="flex items-center gap-2.5 flex-1 min-w-0 rounded-[14px] py-1 text-left hover:bg-[#EAF2F8]/60 transition-colors cursor-pointer"
        >
          <LearnerAvatarBadge
            avatarIndex={app.stats.avatarIndex}
            size={48}
            alt={`${app.stats.learnerName} Avatar`}
          />
          <div className="min-w-0">
            <div className="font-display text-xl font-semibold text-[#0F172A] truncate">
              Hi, {app.stats.learnerName}!
            </div>
            <div className="text-xs text-[#475569] tabular-nums">
              Grade {app.selectedGrade} • {app.stats.totalXp} XP
            </div>
          </div>
        </button>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            data-testid="switch_learner_button"
            onClick={onOpenLearnerSwitcher}
            className="inline-flex items-center gap-1 rounded-full bg-[#0284C7]/12 border border-[#0284C7]/30 px-2.5 py-2 text-xs font-bold text-[#0284C7] hover:bg-[#0284C7]/20 transition-colors cursor-pointer whitespace-nowrap"
          >
            <Users className="w-4 h-4" />
            <span>
              {app.learners.length > 1
                ? `Switch (${app.learners.length})`
                : 'Switch'}
            </span>
          </button>

          <div className="inline-flex items-center gap-1 rounded-full bg-[#F59E0B]/16 px-2.5 py-1.5 text-sm font-bold text-[#F59E0B] tabular-nums">
            <Star className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
            <span>{app.totalStars}</span>
          </div>
        </div>
      </div>

      {/* Hero Continue Learning Card */}
      {nextLesson && (
        <div
          data-testid="hero_continue_card"
          className="relative rounded-3xl overflow-hidden shadow-md h-[196px]"
        >
          <img
            src="/images/img_science_hero.jpg"
            alt="Science Hero Illustration"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(90deg, rgba(12,74,110,0.92) 0%, rgba(2,132,199,0.68) 60%, rgba(2,132,199,0.25) 100%)',
            }}
          />
          <div className="relative z-10 h-full p-[18px] flex flex-col justify-between">
            <div>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/22 px-2.5 py-1 text-[11px] font-bold text-white">
                <Sparkles className="w-3.5 h-3.5 text-[#FDE047]" />
                RECOMMENDED NEXT
              </span>
            </div>

            <div>
              <h2 className="font-display text-[22px] leading-7 font-semibold text-white line-clamp-2">
                {nextLesson.title}
              </h2>
              <p className="text-xs text-white/90 mt-0.5">
                Grade {nextLesson.grade} • Term {nextLesson.term} •{' '}
                {nextLesson.weeks}
              </p>
            </div>

            <div>
              <button
                type="button"
                data-testid="hero_start_button"
                onClick={() => app.startLesson(nextLesson)}
                className="inline-flex items-center gap-1.5 rounded-[14px] bg-[#FBBF24] hover:bg-[#F59E0B] text-[#422006] px-4 py-2 text-sm font-bold transition-colors cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                Start Lesson
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grade Level Selector Pills */}
      <div className="space-y-2">
        <h3 className="text-base font-bold text-[#0F172A]">
          Choose Grade Level
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {[3, 4, 5, 6].map((grade) => {
            const selected = app.selectedGrade === grade;
            const color = GRADE_COLORS[grade];
            return (
              <button
                key={grade}
                type="button"
                data-testid={`grade_pill_${grade}`}
                onClick={() => app.selectGrade(grade)}
                style={{
                  backgroundColor: selected ? color : '#FFFFFF',
                  borderColor: selected ? color : 'rgba(203, 213, 225, 0.7)',
                  color: selected ? '#FFFFFF' : '#0F172A',
                }}
                className="h-12 rounded-2xl border-[1.5px] text-sm font-bold transition-colors cursor-pointer whitespace-nowrap"
              >
                Grade {grade}
              </button>
            );
          })}
        </div>
      </div>

      {/* Term Filter Chips + Search Bar */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {terms.map(({ value, label }) => {
            const selected = app.selectedTerm === value;
            return (
              <button
                key={label}
                type="button"
                data-testid={`term_chip_${value ?? 'all'}`}
                onClick={() => app.selectTerm(value)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  selected
                    ? 'bg-[#E0F2FE] text-[#0C4A6E] border-[#0284C7]/40'
                    : 'bg-white text-[#475569] border-[#CBD5E1] hover:bg-[#EAF2F8]'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-[#475569] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={app.searchQuery}
            onChange={(e) => app.updateSearchQuery(e.target.value)}
            placeholder="Search topics (e.g. Matter, Volcano, Circuits)..."
            data-testid="lesson_search_input"
            className="w-full rounded-2xl bg-white border border-[#CBD5E1] pl-10 pr-10 py-3 text-sm text-[#0F172A] placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
          />
          {app.searchQuery && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => app.updateSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-[#475569] hover:bg-[#EAF2F8] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Lesson List */}
      {app.filteredLessons.length === 0 ? (
        <div className="rounded-[20px] bg-white border border-[#CBD5E1]/60 p-7 text-center flex flex-col items-center">
          <Search className="w-11 h-11 text-[#0284C7] mb-2" />
          <div className="text-base font-bold text-[#0F172A]">
            No matching lessons found
          </div>
          <p className="text-sm text-[#475569] mt-0.5">
            Try switching terms or clearing your search.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {app.filteredLessons.map((lesson) => (
            <LessonModuleCard
              key={lesson.id}
              lesson={lesson}
              progress={app.progressMap[lesson.id]}
              onClick={() => app.startLesson(lesson)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function LessonModuleCard({
  lesson,
  progress,
  onClick,
}: {
  lesson: ScienceLesson;
  progress?: { stars: number; bestScore: number; totalQuestions: number };
  onClick: () => void;
}) {
  const stars = progress?.stars ?? 0;
  const termColor = TERM_COLORS[lesson.term] ?? '#6366F1';
  const ratio =
    progress && progress.totalQuestions > 0
      ? Math.min(1, Math.max(0, progress.bestScore / progress.totalQuestions))
      : 0;

  return (
    <button
      type="button"
      data-testid={`lesson_card_${lesson.id}`}
      onClick={onClick}
      style={{
        borderColor:
          stars > 0 ? `${termColor}73` : 'rgba(203, 213, 225, 0.7)',
      }}
      className="w-full rounded-[20px] bg-white border p-4 text-left hover:shadow-sm transition-shadow cursor-pointer"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span
            style={{
              backgroundColor: `${termColor}24`,
              color: termColor,
            }}
            className="rounded-lg px-2 py-1 text-[11px] font-bold whitespace-nowrap"
          >
            Term {lesson.term} • {lesson.weeks}
          </span>
          <span className="text-[11px] text-[#475569] tabular-nums whitespace-nowrap">
            {lesson.questions.length} items
          </span>
        </div>

        <div className="flex items-center gap-0.5 shrink-0">
          {[1, 2, 3].map((s) => (
            <Star
              key={s}
              className={`w-5 h-5 ${
                s <= stars
                  ? 'fill-[#F59E0B] text-[#F59E0B]'
                  : 'text-[#CBD5E1]'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="mt-2.5 text-base font-bold text-[#0F172A]">
        {lesson.title}
      </div>
      <div className="mt-0.5 text-xs text-[#475569]">
        {lesson.contentTopic}
      </div>

      {progress && progress.totalQuestions > 0 && (
        <div className="mt-2.5 flex items-center gap-2.5">
          <div
            style={{ backgroundColor: `${termColor}29` }}
            className="flex-1 h-[7px] rounded-full overflow-hidden"
          >
            <div
              style={{
                width: `${ratio * 100}%`,
                backgroundColor: termColor,
              }}
              className="h-full rounded-full transition-all"
            />
          </div>
          <span
            style={{ color: termColor }}
            className="text-[11px] font-bold tabular-nums whitespace-nowrap"
          >
            Best: {progress.bestScore}/{progress.totalQuestions}
          </span>
        </div>
      )}
    </button>
  );
}
