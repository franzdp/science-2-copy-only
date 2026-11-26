import React, { useState } from 'react';
import {
  CheckCircle2,
  FlaskConical,
  Leaf,
  Plus,
  Rocket,
  Sun,
  Trash2,
  Zap,
} from 'lucide-react';
import { LearnerStats } from '../types/curriculum';

interface AvatarSpec {
  id: number;
  label: string;
  color: string;
  bg: string;
  border: string;
  Icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
}

export const AVATAR_SPECS: AvatarSpec[] = [
  {
    id: 0,
    label: 'Owl Scientist',
    color: '#0284C7',
    bg: 'rgba(2, 132, 199, 0.16)',
    border: 'rgba(2, 132, 199, 0.45)',
    Icon: FlaskConical,
  },
  {
    id: 1,
    label: 'Lab Chemist',
    color: '#0284C7',
    bg: 'rgba(2, 132, 199, 0.16)',
    border: 'rgba(2, 132, 199, 0.45)',
    Icon: FlaskConical,
  },
  {
    id: 2,
    label: 'Botanist',
    color: '#059669',
    bg: 'rgba(5, 150, 105, 0.16)',
    border: 'rgba(5, 150, 105, 0.45)',
    Icon: Leaf,
  },
  {
    id: 3,
    label: 'Space Explorer',
    color: '#6366F1',
    bg: 'rgba(99, 102, 241, 0.16)',
    border: 'rgba(99, 102, 241, 0.45)',
    Icon: Rocket,
  },
  {
    id: 4,
    label: 'Solar Physicist',
    color: '#F59E0B',
    bg: 'rgba(245, 158, 11, 0.16)',
    border: 'rgba(245, 158, 11, 0.45)',
    Icon: Sun,
  },
  {
    id: 5,
    label: 'Inventor',
    color: '#E11D48',
    bg: 'rgba(225, 29, 72, 0.16)',
    border: 'rgba(225, 29, 72, 0.45)',
    Icon: Zap,
  },
];

export function LearnerAvatarBadge({
  avatarIndex,
  size = 48,
  alt = 'Learner avatar',
}: {
  avatarIndex: number;
  size?: number;
  alt?: string;
}) {
  const idx = Math.max(0, Math.min(AVATAR_SPECS.length - 1, avatarIndex));
  if (idx === 0) {
    return (
      <img
        src="/images/img_owl_scientist.jpg"
        alt={alt}
        referrerPolicy="no-referrer"
        style={{ width: size, height: size }}
        className="rounded-full object-cover shrink-0 border border-[#CBD5E1]/50"
      />
    );
  }
  const spec = AVATAR_SPECS[idx];
  const Icon = spec.Icon;
  const iconSize = Math.round(size * 0.56);
  return (
    <div
      aria-label={alt}
      style={{
        width: size,
        height: size,
        backgroundColor: spec.bg,
        borderColor: spec.border,
      }}
      className="rounded-full border-[1.5px] flex items-center justify-center shrink-0"
    >
      <Icon
        style={{ width: iconSize, height: iconSize, color: spec.color }}
      />
    </div>
  );
}

export function AvatarPickerRow({
  selectedIndex,
  onSelect,
}: {
  selectedIndex: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-1.5">
      {AVATAR_SPECS.map((spec) => {
        const selected = spec.id === selectedIndex;
        return (
          <button
            key={spec.id}
            type="button"
            onClick={() => onSelect(spec.id)}
            aria-label={spec.label}
            data-testid={`avatar_option_${spec.id}`}
            className={`p-1 rounded-full transition-transform active:scale-95 cursor-pointer ${
              selected
                ? 'ring-2 ring-[#0284C7] ring-offset-1'
                : 'hover:bg-[#EAF2F8]'
            }`}
          >
            <LearnerAvatarBadge
              avatarIndex={spec.id}
              size={40}
              alt={spec.label}
            />
          </button>
        );
      })}
    </div>
  );
}

export function LearnerSwitcherDialog({
  learners,
  activeLearnerId,
  learnerStarsMap,
  onSwitchLearner,
  onOpenAddLearner,
  onDeleteLearner,
  onDismiss,
}: {
  learners: LearnerStats[];
  activeLearnerId: number;
  learnerStarsMap: Record<number, number>;
  onSwitchLearner: (learnerId: number) => void;
  onOpenAddLearner: () => void;
  onDeleteLearner: (learnerId: number) => void;
  onDismiss: () => void;
}) {
  const [pendingDelete, setPendingDelete] = useState<LearnerStats | null>(null);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Switch Learner"
    >
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl border border-[#CBD5E1]/60">
        <div className="mb-4">
          <h2 className="font-display text-xl font-semibold text-[#0F172A]">
            Switch Learner
          </h2>
          <p className="text-xs text-[#475569] mt-0.5">
            Each learner keeps separate stars, XP, badges, and missed items.
          </p>
        </div>

        <div className="space-y-2 max-h-76 overflow-y-auto pr-1">
          {learners.map((learner) => {
            const isActive = learner.id === activeLearnerId;
            const stars = learnerStarsMap[learner.id] ?? 0;
            return (
              <div
                key={learner.id}
                data-testid={`learner_row_${learner.id}`}
                onClick={() => {
                  onSwitchLearner(learner.id);
                  onDismiss();
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSwitchLearner(learner.id);
                    onDismiss();
                  }
                }}
                className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 cursor-pointer transition-colors ${
                  isActive
                    ? 'bg-[#0284C7]/10 border-2 border-[#0284C7]'
                    : 'bg-[#EAF2F8]/55 border border-[#CBD5E1]/60 hover:bg-[#EAF2F8]'
                }`}
              >
                <LearnerAvatarBadge
                  avatarIndex={learner.avatarIndex}
                  size={44}
                  alt={learner.learnerName}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-[#0F172A] truncate">
                    {learner.learnerName}
                  </div>
                  <div className="text-xs text-[#475569] tabular-nums">
                    Grade {learner.selectedGrade} • {learner.totalXp} XP •{' '}
                    {stars} ★
                  </div>
                </div>
                {isActive && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#059669]/15 px-2.5 py-1 text-[11px] font-bold text-[#059669] shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Active
                  </span>
                )}
                {learners.length > 1 && (
                  <button
                    type="button"
                    aria-label={`Remove ${learner.learnerName}`}
                    data-testid={`delete_learner_${learner.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setPendingDelete(learner);
                    }}
                    className="p-2 rounded-full text-[#E11D48]/80 hover:bg-[#FFE4E6] transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <button
          type="button"
          data-testid="open_add_learner_button"
          onClick={() => {
            onDismiss();
            onOpenAddLearner();
          }}
          className="mt-4 w-full h-12 rounded-[14px] bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add New Learner
        </button>

        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={onDismiss}
            className="px-4 py-2 text-sm font-semibold text-[#0284C7] hover:bg-[#E0F2FE] rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>

      {pendingDelete && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
            <h3 className="font-display text-lg font-semibold text-[#0F172A]">
              Remove {pendingDelete.learnerName}?
            </h3>
            <p className="text-sm text-[#475569] mt-2">
              This removes {pendingDelete.learnerName}&apos;s saved stars, XP,
              and missed questions from this device.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPendingDelete(null)}
                className="px-4 py-2 text-sm font-semibold text-[#475569] hover:bg-[#EAF2F8] rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteLearner(pendingDelete.id);
                  setPendingDelete(null);
                }}
                className="px-4 py-2 text-sm font-bold text-white bg-[#E11D48] hover:bg-[#BE123C] rounded-xl cursor-pointer"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function AddLearnerDialog({
  suggestedNumber,
  onCreateLearner,
  onDismiss,
}: {
  suggestedNumber: number;
  onCreateLearner: (name: string, grade: number, avatarIndex: number) => void;
  onDismiss: () => void;
}) {
  const [nameDraft, setNameDraft] = useState('');
  const [gradeDraft, setGradeDraft] = useState(5);
  const [avatarDraft, setAvatarDraft] = useState(
    Math.max(1, suggestedNumber - 1) % AVATAR_SPECS.length,
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Add New Learner"
    >
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl border border-[#CBD5E1]/60">
        <h2 className="font-display text-xl font-semibold text-[#0F172A] mb-4">
          Add New Learner
        </h2>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="new-learner-name"
              className="block text-xs font-semibold text-[#475569] mb-1.5"
            >
              Learner Name
            </label>
            <input
              id="new-learner-name"
              type="text"
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              placeholder={`Scientist ${suggestedNumber}`}
              data-testid="new_learner_name_input"
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
              Grade Level
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[3, 4, 5, 6].map((g) => {
                const selected = gradeDraft === g;
                return (
                  <button
                    key={g}
                    type="button"
                    data-testid={`add_learner_grade_${g}`}
                    onClick={() => setGradeDraft(g)}
                    className={`h-12 rounded-[10px] font-bold text-sm transition-colors cursor-pointer ${
                      selected
                        ? 'bg-[#0284C7] text-white'
                        : 'bg-[#EAF2F8] text-[#0F172A] hover:bg-[#E0F2FE]'
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
            onClick={onDismiss}
            className="px-4 py-2 text-sm font-semibold text-[#475569] hover:bg-[#EAF2F8] rounded-xl cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            data-testid="confirm_add_learner_button"
            onClick={() => {
              const finalName =
                nameDraft.trim() || `Scientist ${suggestedNumber}`;
              onCreateLearner(finalName, gradeDraft, avatarDraft);
              onDismiss();
            }}
            className="px-5 py-2.5 text-sm font-bold text-white bg-[#0284C7] hover:bg-[#0369A1] rounded-xl cursor-pointer"
          >
            Create & Switch
          </button>
        </div>
      </div>
    </div>
  );
}
