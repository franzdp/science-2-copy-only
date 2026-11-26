import React from 'react';
import {
  ArrowRight,
  Compass,
  History,
  LayoutGrid,
  Play,
  Users,
  Zap,
} from 'lucide-react';
import { LearnerAvatarBadge } from '../components/LearnerSwitcherDialog';
import { ScienceAppController } from '../hooks/useScienceApp';
import { CHALLENGE_MODES, ChallengeModeId } from '../types/curriculum';

export function ChallengeScreen({
  app,
  onOpenLearnerSwitcher,
}: {
  app: ScienceAppController;
  onOpenLearnerSwitcher: () => void;
}) {
  const mistakeCount = app.mistakes.length;

  return (
    <div className="w-full max-w-[680px] mx-auto px-4 py-3.5 space-y-3.5 pb-24 md:pb-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h1 className="font-display text-[26px] leading-8 font-bold text-[#0F172A]">
            Science Arcade & Challenges
          </h1>
          <p className="text-sm text-[#475569] mt-0.5">
            Sharpen your Grade {app.selectedGrade} skills with interactive
            sprints and lab modes.
          </p>
        </div>

        <button
          type="button"
          data-testid="challenge_switch_learner_button"
          onClick={onOpenLearnerSwitcher}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#0284C7]/12 border border-[#0284C7]/30 px-2.5 py-1.5 text-xs font-bold text-[#0284C7] hover:bg-[#0284C7]/20 transition-colors shrink-0 cursor-pointer"
        >
          <LearnerAvatarBadge
            avatarIndex={app.stats.avatarIndex}
            size={24}
            alt={app.stats.learnerName}
          />
          <span className="max-w-[96px] truncate">{app.stats.learnerName}</span>
          <Users className="w-4 h-4 shrink-0" />
        </button>
      </div>

      {/* Daily Science Sprint Banner Card */}
      <div
        data-testid="daily_sprint_card"
        className="relative rounded-3xl overflow-hidden shadow-md h-[185px]"
      >
        <img
          src="/images/img_lab_challenge.jpg"
          alt="Science Challenge Arena"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(30,27,75,0.35) 0%, rgba(30,27,75,0.92) 100%)',
          }}
        />
        <div className="relative z-10 h-full p-[18px] flex flex-col justify-end">
          <h2 className="font-display text-[22px] leading-7 font-semibold text-white">
            {CHALLENGE_MODES.DAILY_MIX.title}
          </h2>
          <p className="text-xs text-white/90 mt-0.5">
            10 mixed questions across Grade {app.selectedGrade} topics
          </p>
          <div className="mt-2.5">
            <button
              type="button"
              data-testid="start_daily_sprint_button"
              onClick={() => app.startChallenge('DAILY_MIX')}
              className="inline-flex items-center gap-1.5 rounded-[14px] bg-[#F59E0B] hover:bg-[#D97706] text-[#422006] px-4 py-2 text-sm font-bold transition-colors cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              Play Daily Sprint
            </button>
          </div>
        </div>
      </div>

      <h3 className="text-base font-bold text-[#0F172A] pt-1">
        Practice by Activity Mode
      </h3>

      <div className="space-y-3">
        <ChallengeModeCard
          mode="QUICK_QUIZ"
          Icon={Zap}
          accent="#0284C7"
          badge="10 Questions"
          onClick={() => app.startChallenge('QUICK_QUIZ')}
        />

        <ChallengeModeCard
          mode="SORT_AND_MATCH"
          Icon={LayoutGrid}
          accent="#059669"
          badge="Hands-On Lab"
          onClick={() => app.startChallenge('SORT_AND_MATCH')}
        />

        <ChallengeModeCard
          mode="VISUAL_SPOTTER"
          Icon={Compass}
          accent="#6366F1"
          badge="Diagrams & Sims"
          onClick={() => app.startChallenge('VISUAL_SPOTTER')}
        />

        <ChallengeModeCard
          mode="MISTAKE_REVIEW"
          Icon={History}
          accent="#E11D48"
          badge={
            mistakeCount === 0 ? 'All Clear!' : `${mistakeCount} to review`
          }
          enabled={mistakeCount > 0}
          onClick={() => app.startChallenge('MISTAKE_REVIEW')}
        />
      </div>
    </div>
  );
}

function ChallengeModeCard({
  mode,
  Icon,
  accent,
  badge,
  enabled = true,
  onClick,
}: {
  mode: ChallengeModeId;
  Icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  accent: string;
  badge: string;
  enabled?: boolean;
  onClick: () => void;
}) {
  const meta = CHALLENGE_MODES[mode];
  return (
    <button
      type="button"
      disabled={!enabled}
      data-testid={`challenge_mode_${mode}`}
      onClick={onClick}
      style={{
        borderColor: enabled ? `${accent}59` : 'rgba(203, 213, 225, 0.5)',
      }}
      className={`w-full rounded-[20px] bg-white border-[1.2px] p-4 flex items-center gap-3.5 text-left transition-shadow ${
        enabled ? 'hover:shadow-sm cursor-pointer' : 'opacity-75 cursor-not-allowed'
      }`}
    >
      <div
        style={{ backgroundColor: enabled ? `${accent}24` : `${accent}14` }}
        className="w-[54px] h-[54px] rounded-2xl flex items-center justify-center shrink-0"
      >
        <Icon
          className="w-7 h-7"
          style={{ color: enabled ? accent : '#94A3B8' }}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div
          className={`text-base font-bold ${
            enabled ? 'text-[#0F172A]' : 'text-[#475569]'
          }`}
        >
          {meta.title}
        </div>
        <div className="text-xs text-[#475569] mt-0.5">{meta.subtitle}</div>
        <div className="mt-1.5">
          <span
            style={{ backgroundColor: `${accent}1F`, color: accent }}
            className="inline-block rounded-full px-2 py-0.5 text-[11px] font-bold"
          >
            {badge}
          </span>
        </div>
      </div>

      {enabled && (
        <ArrowRight className="w-5 h-5 shrink-0" style={{ color: accent }} />
      )}
    </button>
  );
}
