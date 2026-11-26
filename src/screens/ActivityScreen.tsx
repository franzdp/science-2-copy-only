import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Flame,
  RotateCcw,
  Sparkles,
  Star,
  Volume2,
  X,
} from 'lucide-react';
import { QuestionInteractionBody } from '../components/QuestionInputRenderers';
import { canSubmitAnswer, ScienceAppController } from '../hooks/useScienceApp';
import { ActivitySessionState, QuestionType } from '../types/curriculum';
import { speakText, stopSpeech } from '../utils/tts';

function friendlyTypeLabel(type: QuestionType, isPictureMode: boolean): string {
  switch (type) {
    case 'MULTIPLE_CHOICE':
      return 'Multiple Choice';
    case 'TRUE_FALSE':
      return 'True or False';
    case 'MULTI_SELECT':
      return isPictureMode ? 'Select Pictures' : 'Select Objects';
    case 'MATCHING':
      return 'Matching Type';
    case 'SORT_BUCKETS':
      return 'Interactive Sort';
    case 'ORDER_STEPS':
      return 'Put in Order';
    case 'HOTSPOT':
      return 'Interactive Diagram';
    case 'SLIDER':
      return 'Interactive Ruler';
    case 'SIMULATION':
      return 'Science Simulation';
    case 'FILL_BLANK':
      return 'Complete Sentence';
  }
}

export function ActivityScreen({
  session,
  app,
}: {
  session: ActivitySessionState;
  app: ScienceAppController;
}) {
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const curQ = session.questions[session.currentIndex] ?? null;
  const ttsAutoRead = app.stats.ttsAutoRead;

  useEffect(() => {
    if (ttsAutoRead && curQ && !session.isCompleted) {
      speakText(curQ.prompt);
    }
    return () => {
      stopSpeech();
    };
  }, [curQ?.id, ttsAutoRead, session.isCompleted, curQ]);

  if (session.isCompleted) {
    return (
      <LessonSummaryView
        session={session}
        onRetryMissed={() => app.startRetryMissedInSession()}
        onDone={() => {
          stopSpeech();
          app.exitSession();
        }}
      />
    );
  }

  const total = Math.max(1, session.questions.length);
  const progress = ((session.currentIndex + 1) / total) * 100;
  const canSubmit = canSubmitAnswer(session);
  const fb = session.feedback;
  const isLast = session.currentIndex >= session.questions.length - 1;

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F8FB]">
      {/* Scrollable Main Area */}
      <div className="flex-1 w-full max-w-[680px] mx-auto px-4 flex flex-col">
        {/* Top Header */}
        <div className="flex items-center gap-2.5 py-2.5">
          <button
            type="button"
            aria-label="Exit activity"
            data-testid="close_activity_button"
            onClick={() => setShowExitConfirm(true)}
            className="p-2 rounded-full text-[#0F172A] hover:bg-[#EAF2F8] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex-1 h-2.5 rounded-full bg-[#0284C7]/18 overflow-hidden">
            <div
              style={{ width: `${progress}%` }}
              className="h-full rounded-full bg-[#0284C7] transition-all duration-200"
            />
          </div>

          {session.currentStreakInSession >= 2 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#E11D48]/14 px-2 py-1 text-xs font-bold text-[#E11D48] tabular-nums">
              <Flame className="w-4 h-4" />
              {session.currentStreakInSession}
            </span>
          )}

          <span className="text-sm font-bold text-[#0F172A] tabular-nums">
            {session.currentIndex + 1}/{session.questions.length}
          </span>
        </div>

        {/* Question Body */}
        {curQ && (
          <div className="flex-1 py-2 space-y-3.5 pb-6">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-block rounded-lg bg-[#E0F2FE] text-[#0C4A6E] px-2.5 py-1 text-xs font-semibold">
                {friendlyTypeLabel(curQ.type, curQ.isPictureMode)}
              </span>

              <button
                type="button"
                data-testid="tts_speak_button"
                onClick={() => speakText(curQ.prompt)}
                className="inline-flex items-center gap-1.5 rounded-full bg-white border border-[#CBD5E1]/70 px-3 py-1.5 text-xs font-semibold text-[#0284C7] hover:bg-[#E0F2FE]/40 transition-colors cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                Read Aloud
              </button>
            </div>

            <div className="rounded-[20px] bg-white border border-[#CBD5E1]/70 p-4">
              <p className="text-base font-bold text-[#0F172A] leading-snug">
                {curQ.prompt}
              </p>
            </div>

            <QuestionInteractionBody
              question={curQ}
              session={session}
              controller={app}
            />
          </div>
        )}
      </div>

      {/* Bottom Action & Feedback Bar */}
      <div className="sticky bottom-0 z-20 bg-white border-t border-[#CBD5E1]/60 shadow-[0_-4px_18px_rgba(15,23,42,0.06)]">
        <div className="w-full max-w-[680px] mx-auto px-4 py-3 space-y-2.5">
          {fb && (
            <div
              style={{
                backgroundColor: fb.isCorrect
                  ? 'rgba(5, 150, 105, 0.13)'
                  : 'rgba(225, 29, 72, 0.13)',
                borderColor: fb.isCorrect ? '#059669' : '#E11D48',
              }}
              className="rounded-2xl border-[1.5px] p-3 flex items-start gap-2.5"
            >
              {fb.isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-[#059669] shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-[#E11D48] shrink-0 mt-0.5" />
              )}
              <div className="flex-1 min-w-0">
                <div
                  style={{ color: fb.isCorrect ? '#059669' : '#E11D48' }}
                  className="text-sm font-bold"
                >
                  {fb.headline}
                </div>
                <div className="text-xs text-[#0F172A] whitespace-pre-line mt-0.5">
                  {fb.detail}
                </div>
              </div>
            </div>
          )}

          {fb === null ? (
            <button
              type="button"
              disabled={!canSubmit}
              data-testid="check_answer_button"
              onClick={() => {
                stopSpeech();
                app.submitAnswer();
              }}
              className="w-full h-[52px] rounded-2xl bg-[#0284C7] hover:bg-[#0369A1] disabled:bg-[#CBD5E1] disabled:text-[#64748B] text-white text-sm font-bold transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              Check Answer
            </button>
          ) : (
            <button
              type="button"
              data-testid="continue_button"
              onClick={() => {
                stopSpeech();
                app.nextQuestion();
              }}
              style={{
                backgroundColor: fb.isCorrect ? '#059669' : '#0284C7',
              }}
              className="w-full h-[52px] rounded-2xl text-white text-sm font-bold hover:opacity-95 transition-opacity cursor-pointer"
            >
              {isLast ? 'See Results' : 'Continue'}
            </button>
          )}
        </div>
      </div>

      {/* Exit Confirmation Dialog */}
      {showExitConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl">
            <h3 className="font-display text-lg font-semibold text-[#0F172A]">
              Leave Activity?
            </h3>
            <p className="text-sm text-[#475569] mt-2">
              Your progress in this current quiz session won&apos;t be saved
              yet.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowExitConfirm(false)}
                className="px-4 py-2 text-sm font-semibold text-[#475569] hover:bg-[#EAF2F8] rounded-xl cursor-pointer"
              >
                Keep Learning
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowExitConfirm(false);
                  stopSpeech();
                  app.exitSession();
                }}
                className="px-4 py-2 text-sm font-bold text-white bg-[#E11D48] hover:bg-[#BE123C] rounded-xl cursor-pointer"
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LessonSummaryView({
  session,
  onRetryMissed,
  onDone,
}: {
  session: ActivitySessionState;
  onRetryMissed: () => void;
  onDone: () => void;
}) {
  const total = Math.max(1, session.questions.length);
  const accuracy = Math.round((session.correctCount * 100) / total);
  const stars =
    accuracy >= 85 ? 3 : accuracy >= 65 ? 2 : accuracy >= 40 ? 1 : 0;

  const headline =
    stars === 3
      ? 'Outstanding Scientist!'
      : stars === 2
        ? 'Great Discovery!'
        : stars === 1
          ? 'Good Effort — Keep Exploring!'
          : 'Nice Try — Practice Makes Progress!';

  return (
    <div className="min-h-screen bg-[#F4F8FB] flex items-center justify-center p-6">
      <div className="w-full max-w-[500px] rounded-[28px] bg-white border-[1.5px] border-[#0284C7]/35 p-6 shadow-sm flex flex-col items-center text-center space-y-3.5">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F59E0B]/16 px-3.5 py-1.5 text-xs font-bold text-[#F59E0B]">
          <Sparkles className="w-4 h-4" />
          ACTIVITY COMPLETE!
        </span>

        <div className="flex items-center gap-2 py-1">
          {[1, 2, 3].map((s) => (
            <Star
              key={s}
              className={`w-12 h-12 ${
                s <= stars
                  ? 'fill-[#F59E0B] text-[#F59E0B]'
                  : 'text-[#CBD5E1]'
              }`}
            />
          ))}
        </div>

        <h2 className="font-display text-[22px] font-semibold text-[#0F172A]">
          {headline}
        </h2>
        <p className="text-sm text-[#475569]">{session.title}</p>

        <div className="w-full grid grid-cols-3 gap-2.5 pt-1">
          <SummaryStatBox
            label="Score"
            value={`${session.correctCount}/${total}`}
            color="#0284C7"
          />
          <SummaryStatBox
            label="Accuracy"
            value={`${accuracy}%`}
            color="#059669"
          />
          <SummaryStatBox
            label="XP Earned"
            value={`+${session.sessionXp}`}
            color="#F59E0B"
          />
        </div>

        {session.missedInSession.length > 0 && (
          <button
            type="button"
            data-testid="retry_missed_button"
            onClick={onRetryMissed}
            className="w-full h-12 rounded-2xl border border-[#CBD5E1] text-[#0284C7] font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#EAF2F8] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Review {session.missedInSession.length} Missed Items
          </button>
        )}

        <button
          type="button"
          data-testid="summary_done_button"
          onClick={onDone}
          className="w-full h-[52px] rounded-2xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-sm font-bold transition-colors cursor-pointer"
        >
          Back to Science Hub
        </button>
      </div>
    </div>
  );
}

function SummaryStatBox({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div
      style={{ backgroundColor: `${color}1F` }}
      className="rounded-2xl p-3 flex flex-col items-center"
    >
      <div
        style={{ color }}
        className="font-display text-xl font-bold tabular-nums"
      >
        {value}
      </div>
      <div className="text-[11px] text-[#475569] mt-0.5">{label}</div>
    </div>
  );
}
