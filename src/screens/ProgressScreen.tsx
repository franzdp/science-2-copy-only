import React, { useState } from 'react';
import {
  CheckCircle2,
  Flame,
  Lock,
  Pencil,
  Plus,
  RotateCcw,
  Star,
  Trophy,
  Users,
  Volume2,
} from 'lucide-react';
import {
  AvatarPickerRow,
  LearnerAvatarBadge,
} from '../components/LearnerSwitcherDialog';
import { ScienceAppController } from '../hooks/useScienceApp';

const GRADE_COLORS: Record<number, string> = {
  3: '#059669',
  4: '#0284C7',
  5: '#6366F1',
  6: '#F59E0B',
};

export function ProgressScreen({
  app,
  onOpenLearnerSwitcher,
  onOpenAddLearner,
}: {
  app: ScienceAppController;
  onOpenLearnerSwitcher: () => void;
  onOpenAddLearner: () => void;
}) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);

  const [nameDraft, setNameDraft] = useState(app.stats.learnerName);
  const [gradeDraft, setGradeDraft] = useState(app.stats.selectedGrade);
  const [avatarDraft, setAvatarDraft] = useState(app.stats.avatarIndex);

  const openEditDialog = () => {
    setNameDraft(app.stats.learnerName);
    setGradeDraft(app.stats.selectedGrade);
    setAvatarDraft(app.stats.avatarIndex);
    setShowEditDialog(true);
  };

  const accuracy =
    app.stats.totalAnswered > 0
      ? Math.round((app.stats.totalCorrect * 100) / app.stats.totalAnswered)
      : 0;

  return (
    <div className="w-full max-w-[680px] mx-auto px-4 py-3.5 space-y-3.5 pb-24 md:pb-8">
      {/* Learner Profile & Switcher Card */}
      <div className="rounded-3xl bg-white border-[1.5px] border-[#0284C7]/30 p-4 space-y-3">
        <div className="flex items-center gap-3.5">
          <LearnerAvatarBadge
            avatarIndex={app.stats.avatarIndex}
            size={64}
            alt={`${app.stats.learnerName} Avatar`}
          />
          <div className="flex-1 min-w-0">
            <div className="font-display text-xl font-semibold text-[#0F172A] truncate">
              {app.stats.learnerName}
            </div>
            <div className="text-sm font-semibold text-[#0284C7] tabular-nums">
              Grade {app.stats.selectedGrade} • {app.stats.totalXp} Science XP
            </div>
          </div>
          <button
            type="button"
            aria-label="Edit profile"
            data-testid="edit_profile_button"
            onClick={openEditDialog}
            className="p-2.5 rounded-full text-[#475569] hover:bg-[#EAF2F8] transition-colors cursor-pointer"
          >
            <Pencil className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            data-testid="progress_switch_learner_button"
            onClick={onOpenLearnerSwitcher}
            className="h-12 rounded-[14px] border border-[#0284C7]/45 text-[#0284C7] font-semibold text-sm flex items-center justify-center gap-1.5 hover:bg-[#E0F2FE]/50 transition-colors cursor-pointer"
          >
            <Users className="w-4 h-4" />
            Switch ({app.learners.length})
          </button>
          <button
            type="button"
            data-testid="progress_add_learner_button"
            onClick={onOpenAddLearner}
            className="h-12 rounded-[14px] bg-[#0284C7] hover:bg-[#0369A1] text-white font-semibold text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Learner
          </button>
        </div>
      </div>

      {/* Quick Metric Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        <MetricTile
          label="Mastery Stars"
          value={`${app.totalStars}/${app.maxStars}`}
          Icon={Star}
          color="#F59E0B"
        />
        <MetricTile
          label="Lessons Done"
          value={`${app.completedLessonsCount}/${app.allLessons.length}`}
          Icon={CheckCircle2}
          color="#059669"
        />
        <MetricTile
          label="Daily Streak"
          value={`${app.stats.currentStreak} days`}
          Icon={Flame}
          color="#E11D48"
        />
        <MetricTile
          label="Accuracy"
          value={`${accuracy}%`}
          Icon={Trophy}
          color="#6366F1"
        />
      </div>

      {/* Grade Progress Bars */}
      <div className="rounded-[22px] bg-white border border-[#CBD5E1]/60 p-4 space-y-3">
        <h3 className="text-base font-bold text-[#0F172A]">
          Progress by Grade
        </h3>
        {[3, 4, 5, 6].map((grade) => {
          const gLessons = app.allLessons.filter((l) => l.grade === grade);
          const gStars = gLessons.reduce(
            (sum, l) => sum + (app.progressMap[l.id]?.stars ?? 0),
            0,
          );
          const gMax = Math.max(1, gLessons.length * 3);
          const ratio = Math.min(1, Math.max(0, gStars / gMax));
          const barColor = GRADE_COLORS[grade];
          return (
            <div key={grade} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#0F172A]">
                  Grade {grade} Science
                </span>
                <span
                  style={{ color: barColor }}
                  className="font-semibold tabular-nums"
                >
                  {gStars} / {gMax} stars
                </span>
              </div>
              <div
                style={{ backgroundColor: `${barColor}29` }}
                className="w-full h-2 rounded-full overflow-hidden"
              >
                <div
                  style={{
                    width: `${ratio * 100}%`,
                    backgroundColor: barColor,
                  }}
                  className="h-full rounded-full transition-all"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Badges */}
      <div className="space-y-2.5">
        <h3 className="text-base font-bold text-[#0F172A]">Science Badges</h3>
        {app.badges.map((badge) => (
          <div
            key={badge.id}
            style={{
              borderColor: badge.unlocked
                ? '#F59E0B'
                : 'rgba(203, 213, 225, 0.6)',
            }}
            className="rounded-[18px] bg-white border-[1.2px] p-3.5 flex items-center gap-3"
          >
            <div
              className={`w-[46px] h-[46px] rounded-full flex items-center justify-center shrink-0 ${
                badge.unlocked ? 'bg-[#F59E0B]/18' : 'bg-[#EAF2F8]'
              }`}
            >
              {badge.unlocked ? (
                <Trophy className="w-5 h-5 text-[#F59E0B]" />
              ) : (
                <Lock className="w-5 h-5 text-[#475569]" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-[#0F172A]">
                {badge.title}
              </div>
              <div className="text-xs text-[#475569]">
                {badge.description}
              </div>
            </div>
            <div
              className={`text-xs font-bold tabular-nums shrink-0 ${
                badge.unlocked ? 'text-[#059669]' : 'text-[#475569]'
              }`}
            >
              {badge.progressText}
            </div>
          </div>
        ))}
      </div>

      {/* Learning Preferences */}
      <div className="rounded-[22px] bg-white border border-[#CBD5E1]/60 p-4 space-y-3">
        <h3 className="text-base font-bold text-[#0F172A]">
          Learning Preferences
        </h3>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Volume2 className="w-5 h-5 text-[#0284C7] shrink-0" />
            <div>
              <div className="text-sm font-medium text-[#0F172A]">
                Auto Read Aloud
              </div>
              <div className="text-xs text-[#475569]">
                Speak each question automatically
              </div>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={app.stats.ttsAutoRead}
            aria-label="Auto Read Aloud"
            data-testid="auto_tts_switch"
            onClick={() => app.setTtsAutoRead(!app.stats.ttsAutoRead)}
            className={`relative w-12 h-7 rounded-full transition-colors cursor-pointer shrink-0 ${
              app.stats.ttsAutoRead ? 'bg-[#0284C7]' : 'bg-[#CBD5E1]'
            }`}
          >
            <span
              className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                app.stats.ttsAutoRead ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <button
          type="button"
          data-testid="reset_progress_button"
          onClick={() => setShowResetDialog(true)}
          className="w-full py-2.5 rounded-xl border border-[#E11D48]/50 text-[#E11D48] text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#FFE4E6]/40 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          Reset Learning Progress
        </button>
      </div>

      {/* App Attribution Card */}
      <div
        data-testid="app_attribution_card"
        className="rounded-[20px] bg-[#E0F2FE]/45 border border-[#0284C7]/30 p-3.5 flex items-center gap-3"
      >
        <img
          src="/images/ic_launcher_art.jpg"
          alt="SCIENTISTS of Bagacay ES Logo"
          referrerPolicy="no-referrer"
          className="w-11 h-11 rounded-xl object-cover shrink-0"
        />
        <div>
          <div className="text-sm font-semibold text-[#0F172A]">
            SCIENTISTS of Bagacay ES
          </div>
          <div className="text-xs text-[#475569]">
            This is innovated by FRANZ D. PADOJINOG
          </div>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      {showEditDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Edit Learner Profile"
        >
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
            <h3 className="font-display text-xl font-semibold text-[#0F172A] mb-4">
              Edit Learner Profile
            </h3>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="edit-learner-name"
                  className="block text-xs font-semibold text-[#475569] mb-1.5"
                >
                  Learner Name
                </label>
                <input
                  id="edit-learner-name"
                  type="text"
                  value={nameDraft}
                  onChange={(e) => setNameDraft(e.target.value)}
                  className="w-full rounded-xl border border-[#CBD5E1] px-3.5 py-2.5 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
                />
              </div>

              <div>
                <div className="text-sm font-bold text-[#0F172A] mb-2">
                  Choose Avatar
                </div>
                <AvatarPickerRow
                  selectedIndex={avatarDraft}
                  onSelect={setAvatarDraft}
                />
              </div>

              <div>
                <div className="text-sm font-bold text-[#0F172A] mb-2">
                  Default Grade Level
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[3, 4, 5, 6].map((g) => {
                    const selected = gradeDraft === g;
                    return (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGradeDraft(g)}
                        className={`h-12 rounded-[10px] font-bold text-sm transition-colors cursor-pointer ${
                          selected
                            ? 'bg-[#0284C7] text-white'
                            : 'bg-[#EAF2F8] text-[#0F172A]'
                        }`}
                      >
                        G{g}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowEditDialog(false)}
                className="px-4 py-2 text-sm font-semibold text-[#475569] hover:bg-[#EAF2F8] rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  app.updateProfile(nameDraft, gradeDraft, avatarDraft);
                  setShowEditDialog(false);
                }}
                className="px-5 py-2 text-sm font-bold text-white bg-[#0284C7] hover:bg-[#0369A1] rounded-xl cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Dialog */}
      {showResetDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl">
            <h3 className="font-display text-lg font-semibold text-[#0F172A]">
              Reset {app.stats.learnerName}&apos;s Progress?
            </h3>
            <p className="text-sm text-[#475569] mt-2">
              This clears {app.stats.learnerName}&apos;s stars, XP, streaks, and
              missed question history on this device. Other learners&apos;
              records are kept.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowResetDialog(false)}
                className="px-4 py-2 text-sm font-semibold text-[#475569] hover:bg-[#EAF2F8] rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  app.resetAllProgress();
                  setShowResetDialog(false);
                }}
                className="px-4 py-2 text-sm font-bold text-white bg-[#E11D48] hover:bg-[#BE123C] rounded-xl cursor-pointer"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MetricTile({
  label,
  value,
  Icon,
  color,
}: {
  label: string;
  value: string;
  Icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
}) {
  return (
    <div className="rounded-[20px] bg-white border border-[#CBD5E1]/60 p-3.5 flex items-center gap-2.5">
      <div
        style={{ backgroundColor: `${color}24` }}
        className="w-[42px] h-[42px] rounded-xl flex items-center justify-center shrink-0"
      >
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <div className="min-w-0">
        <div className="text-base font-bold text-[#0F172A] tabular-nums truncate">
          {value}
        </div>
        <div className="text-[11px] text-[#475569] truncate">{label}</div>
      </div>
    </div>
  );
}
