import React from 'react';
import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Hand,
  X,
  XCircle,
} from 'lucide-react';
import { ScienceAppController } from '../hooks/useScienceApp';
import { ActivitySessionState, ScienceQuestion } from '../types/curriculum';
import {
  InteractiveHotspotScene,
  InteractiveRulerSlider,
  InteractiveScienceSimulation,
  resolveScienceVisual,
} from './ScienceVisuals';

const PAIR_COLORS = ['#0284C7', '#059669', '#F59E0B', '#6366F1', '#E11D48'];

export function QuestionInteractionBody({
  question,
  session,
  controller,
}: {
  question: ScienceQuestion;
  session: ActivitySessionState;
  controller: ScienceAppController;
}) {
  const isSubmitted = session.feedback !== null;

  switch (question.type) {
    case 'MULTIPLE_CHOICE':
      return (
        <MultipleChoiceBody
          q={question}
          s={session}
          isSubmitted={isSubmitted}
          onSelect={controller.onSelectSingle}
        />
      );
    case 'TRUE_FALSE':
      return (
        <TrueFalseBody
          q={question}
          s={session}
          isSubmitted={isSubmitted}
          onSelect={controller.onSelectBool}
        />
      );
    case 'MULTI_SELECT':
      return (
        <MultiSelectBody
          q={question}
          s={session}
          isSubmitted={isSubmitted}
          onToggle={controller.onToggleMultiSelect}
        />
      );
    case 'MATCHING':
      return (
        <MatchingBody
          q={question}
          s={session}
          isSubmitted={isSubmitted}
          onSelectLeft={controller.onSelectMatchingLeft}
          onSelectRight={controller.onSelectMatchingRight}
        />
      );
    case 'SORT_BUCKETS':
      return (
        <SortBucketsBody
          q={question}
          s={session}
          isSubmitted={isSubmitted}
          onSelectCard={controller.onSelectSortCard}
          onAssignBucket={controller.onAssignCardToBucket}
          onRemoveCard={controller.onRemoveCardFromBucket}
        />
      );
    case 'ORDER_STEPS':
      return (
        <OrderStepsBody
          q={question}
          s={session}
          isSubmitted={isSubmitted}
          onMoveUp={controller.onMoveStepUp}
          onMoveDown={controller.onMoveStepDown}
        />
      );
    case 'HOTSPOT':
      return (
        <InteractiveHotspotScene
          sceneTitle={question.sceneTitle}
          hotspots={question.hotspots}
          selectedIndices={session.selectedHotspotIndices}
          correctIndices={question.correctIndices}
          isSubmitted={isSubmitted}
          onToggleHotspot={controller.onToggleHotspot}
        />
      );
    case 'SLIDER':
      return (
        <InteractiveRulerSlider
          minValue={question.minValue}
          maxValue={question.maxValue}
          targetValue={question.targetValue}
          unit={question.unit}
          currentValue={session.sliderValue}
          isSubmitted={isSubmitted}
          onValueChange={controller.onSliderChange}
        />
      );
    case 'SIMULATION':
      return (
        <InteractiveScienceSimulation
          simType={question.simType}
          choices={question.choices}
          selectedChoice={session.simSelectedChoice}
          correctIndex={question.correctIndex}
          isSubmitted={isSubmitted}
          simHasRun={session.simHasRun}
          onRunSimulation={controller.onSimulationRun}
          onSelectChoice={controller.onSelectSimulationChoice}
        />
      );
    case 'FILL_BLANK':
      return (
        <FillBlankBody
          q={question}
          s={session}
          isSubmitted={isSubmitted}
          onToggleChoice={controller.onToggleFillBlankChoice}
        />
      );
  }
}

function MultipleChoiceBody({
  q,
  s,
  isSubmitted,
  onSelect,
}: {
  q: ScienceQuestion;
  s: ActivitySessionState;
  isSubmitted: boolean;
  onSelect: (idx: number) => void;
}) {
  const letters = ['A', 'B', 'C', 'D'];
  return (
    <div className="space-y-2.5">
      {q.options.map((opt, idx) => {
        const selected = s.selectedSingleIndex === idx;
        const correct = idx === q.correctIndex;

        let borderColor = 'border-[#CBD5E1]/80';
        let bgColor = 'bg-white hover:border-[#0284C7]/60';
        let badgeStyle = 'bg-[#EAF2F8] text-[#0F172A]';

        if (isSubmitted && correct) {
          borderColor = 'border-[#059669]';
          bgColor = 'bg-[#059669]/12';
          badgeStyle = 'bg-[#059669] text-white';
        } else if (isSubmitted && selected && !correct) {
          borderColor = 'border-[#E11D48]';
          bgColor = 'bg-[#E11D48]/12';
          badgeStyle = 'bg-[#E11D48] text-white';
        } else if (selected) {
          borderColor = 'border-[#0284C7]';
          bgColor = 'bg-[#0284C7]/12';
          badgeStyle = 'bg-[#0284C7] text-white';
        }

        return (
          <button
            key={idx}
            type="button"
            disabled={isSubmitted}
            data-testid={`mc_option_${idx}`}
            onClick={() => onSelect(idx)}
            className={`w-full rounded-[18px] border-2 px-3.5 py-3.5 flex items-center gap-3 text-left transition-colors cursor-pointer ${borderColor} ${bgColor}`}
          >
            <span
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${badgeStyle}`}
            >
              {letters[idx] ?? String(idx + 1)}
            </span>
            <span
              className={`flex-1 text-sm sm:text-base text-[#0F172A] ${
                selected ? 'font-semibold' : 'font-normal'
              }`}
            >
              {opt}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function TrueFalseBody({
  q,
  s,
  isSubmitted,
  onSelect,
}: {
  q: ScienceQuestion;
  s: ActivitySessionState;
  isSubmitted: boolean;
  onSelect: (val: boolean) => void;
}) {
  const options: Array<{ value: boolean; label: string }> = [
    { value: true, label: 'True' },
    { value: false, label: 'False' },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {options.map(({ value, label }) => {
        const selected = s.selectedBool === value;
        const correct = q.correctBool === value;
        const accentColor = value ? '#059669' : '#E11D48';

        let borderColor = '#CBD5E1';
        let bgColor = '#FFFFFF';
        let iconColor = accentColor;

        if (isSubmitted && correct) {
          borderColor = '#059669';
          bgColor = 'rgba(5, 150, 105, 0.16)';
          iconColor = '#059669';
        } else if (isSubmitted && selected && !correct) {
          borderColor = '#E11D48';
          bgColor = 'rgba(225, 29, 72, 0.14)';
          iconColor = '#E11D48';
        } else if (selected) {
          borderColor = accentColor;
          bgColor = value
            ? 'rgba(5, 150, 105, 0.14)'
            : 'rgba(225, 29, 72, 0.14)';
          iconColor = accentColor;
        }

        return (
          <button
            key={label}
            type="button"
            disabled={isSubmitted}
            data-testid={`tf_option_${label.toLowerCase()}`}
            onClick={() => onSelect(value)}
            style={{ borderColor, backgroundColor: bgColor }}
            className="h-32 rounded-[22px] border-2 p-3 flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            {value ? (
              <CheckCircle2 className="w-10 h-10" style={{ color: iconColor }} />
            ) : (
              <XCircle className="w-10 h-10" style={{ color: iconColor }} />
            )}
            <span className="font-display text-lg font-semibold text-[#0F172A]">
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function MultiSelectBody({
  q,
  s,
  isSubmitted,
  onToggle,
}: {
  q: ScienceQuestion;
  s: ActivitySessionState;
  isSubmitted: boolean;
  onToggle: (idx: number) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="text-sm font-bold text-[#0284C7]">
        {q.isPictureMode
          ? 'Tap all picture cards that match:'
          : 'Tap all items that apply:'}
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {q.items.map((label, idx) => {
          const selected = s.selectedMultiIndices.includes(idx);
          const isCorrect = q.correctIndices.includes(idx);

          let borderColor = '#CBD5E1';
          let bgColor = '#FFFFFF';
          if (isSubmitted && isCorrect) {
            borderColor = '#059669';
            bgColor = 'rgba(5, 150, 105, 0.14)';
          } else if (isSubmitted && selected && !isCorrect) {
            borderColor = '#E11D48';
            bgColor = 'rgba(225, 29, 72, 0.12)';
          } else if (selected) {
            borderColor = '#0284C7';
            bgColor = 'rgba(2, 132, 199, 0.12)';
          }

          const { Icon, color } = resolveScienceVisual(label);

          return (
            <button
              key={idx}
              type="button"
              disabled={isSubmitted}
              data-testid={`multi_item_${idx}`}
              onClick={() => onToggle(idx)}
              style={{ borderColor, backgroundColor: bgColor }}
              className="rounded-[18px] border-2 p-3.5 flex flex-col items-center text-center gap-2 transition-colors cursor-pointer"
            >
              <div
                style={{ backgroundColor: `${color}26` }}
                className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
              >
                <Icon className="w-6 h-6" style={{ color }} />
              </div>
              <span className="text-sm font-semibold text-[#0F172A] leading-snug">
                {label}
              </span>
              {(selected || (isSubmitted && isCorrect)) && (
                <CheckCircle2
                  className="w-4 h-4 shrink-0"
                  style={{ color: borderColor }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MatchingBody({
  q,
  s,
  isSubmitted,
  onSelectLeft,
  onSelectRight,
}: {
  q: ScienceQuestion;
  s: ActivitySessionState;
  isSubmitted: boolean;
  onSelectLeft: (idx: number) => void;
  onSelectRight: (rightOrigIdx: number) => void;
}) {
  return (
    <div className="space-y-2.5">
      <div className="text-sm font-bold text-[#0284C7]">
        Tap an item on the left, then tap its match on the right:
      </div>
      {q.leftItems.map((leftText, rowIdx) => {
        const rightOrigIdx = s.shuffledRightIndices[rowIdx] ?? rowIdx;
        const rightText = q.rightItems[rightOrigIdx] ?? '';

        const isLeftMatched = s.matchedPairs[rowIdx] !== undefined;
        const leftColorIdx = isLeftMatched ? rowIdx % PAIR_COLORS.length : -1;

        const rightOwnerEntry = Object.entries(s.matchedPairs).find(
          ([, val]) => val === rightOrigIdx,
        );
        const rightOwnerLeftIdx = rightOwnerEntry
          ? Number(rightOwnerEntry[0])
          : null;
        const rightColorIdx =
          rightOwnerLeftIdx !== null
            ? rightOwnerLeftIdx % PAIR_COLORS.length
            : -1;

        const isLeftActive = s.activeLeftIndex === rowIdx;

        let leftBg = '#FFFFFF';
        let leftBorder = '#CBD5E1';
        if (isSubmitted && s.matchedPairs[rowIdx] === q.correctPairs[rowIdx]) {
          leftBg = 'rgba(5, 150, 105, 0.15)';
          leftBorder = '#059669';
        } else if (isSubmitted) {
          leftBg = 'rgba(225, 29, 72, 0.12)';
          leftBorder = '#E11D48';
        } else if (isLeftActive) {
          leftBg = 'rgba(2, 132, 199, 0.18)';
          leftBorder = '#0284C7';
        } else if (leftColorIdx >= 0) {
          leftBg = `${PAIR_COLORS[leftColorIdx]}24`;
          leftBorder = PAIR_COLORS[leftColorIdx];
        }

        const rightBg =
          rightColorIdx >= 0 ? `${PAIR_COLORS[rightColorIdx]}24` : '#FFFFFF';
        const rightBorder =
          rightColorIdx >= 0 ? PAIR_COLORS[rightColorIdx] : '#CBD5E1';

        return (
          <div key={rowIdx} className="grid grid-cols-12 gap-2 items-stretch">
            <button
              type="button"
              disabled={isSubmitted}
              data-testid={`match_left_${rowIdx}`}
              onClick={() => onSelectLeft(rowIdx)}
              style={{ backgroundColor: leftBg, borderColor: leftBorder }}
              className="col-span-5 rounded-[14px] border-2 p-2.5 flex items-center gap-2 text-left cursor-pointer"
            >
              <span
                style={{
                  backgroundColor:
                    leftColorIdx >= 0
                      ? PAIR_COLORS[leftColorIdx]
                      : '#EAF2F8',
                  color: leftColorIdx >= 0 ? '#FFFFFF' : '#0F172A',
                }}
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
              >
                {rowIdx + 1}
              </span>
              <span className="text-xs sm:text-sm font-semibold text-[#0F172A]">
                {leftText}
              </span>
            </button>

            <button
              type="button"
              disabled={isSubmitted}
              data-testid={`match_right_${rowIdx}`}
              onClick={() => onSelectRight(rightOrigIdx)}
              style={{ backgroundColor: rightBg, borderColor: rightBorder }}
              className="col-span-7 rounded-[14px] border-2 p-2.5 flex items-center gap-2 text-left cursor-pointer"
            >
              {rightOwnerLeftIdx !== null && (
                <span
                  style={{ backgroundColor: PAIR_COLORS[rightColorIdx] }}
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                >
                  {rightOwnerLeftIdx + 1}
                </span>
              )}
              <span className="text-xs sm:text-sm text-[#0F172A]">
                {rightText}
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );
}

function SortBucketsBody({
  q,
  s,
  isSubmitted,
  onSelectCard,
  onAssignBucket,
  onRemoveCard,
}: {
  q: ScienceQuestion;
  s: ActivitySessionState;
  isSubmitted: boolean;
  onSelectCard: (cardIdx: number) => void;
  onAssignBucket: (bucketIdx: number) => void;
  onRemoveCard: (cardIdx: number) => void;
}) {
  const unassigned = s.shuffledCardIndices.filter(
    (idx) => s.cardBucketAssignments[idx] === undefined,
  );

  return (
    <div className="space-y-3">
      <div className="text-sm font-bold text-[#0284C7]">
        Select a card below, then tap a bucket to place it:
      </div>

      {q.buckets.map((bName, bIdx) => {
        const bucketColor = PAIR_COLORS[bIdx % PAIR_COLORS.length];
        const cardsInBucket = Object.entries(s.cardBucketAssignments)
          .filter(([, v]) => v === bIdx)
          .map(([k]) => Number(k));

        return (
          <div
            key={bIdx}
            role="button"
            tabIndex={0}
            data-testid={`sort_bucket_${bIdx}`}
            onClick={() => {
              if (!isSubmitted) onAssignBucket(bIdx);
            }}
            onKeyDown={(e) => {
              if (!isSubmitted && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                onAssignBucket(bIdx);
              }
            }}
            style={{
              backgroundColor: `${bucketColor}14`,
              borderColor: `${bucketColor}8C`,
            }}
            className="rounded-[18px] border-2 p-3 space-y-2 cursor-pointer"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-bold" style={{ color: bucketColor }}>
                {bName}
              </span>
              {!isSubmitted && s.activeCardIndex !== null && (
                <span
                  className="inline-flex items-center gap-1 text-xs font-semibold"
                  style={{ color: bucketColor }}
                >
                  <Hand className="w-3.5 h-3.5" />
                  Tap to drop
                </span>
              )}
            </div>

            {cardsInBucket.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {cardsInBucket.map((cardOrigIdx) => {
                  const card = q.cards[cardOrigIdx];
                  const cardOk = card.bucketIndex === bIdx;
                  const chipColor =
                    isSubmitted && cardOk
                      ? '#059669'
                      : isSubmitted && !cardOk
                        ? '#E11D48'
                        : bucketColor;
                  return (
                    <button
                      key={cardOrigIdx}
                      type="button"
                      disabled={isSubmitted}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isSubmitted) onRemoveCard(cardOrigIdx);
                      }}
                      style={{ backgroundColor: chipColor }}
                      className="inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-medium text-white cursor-pointer"
                    >
                      <span>{card.text}</span>
                      {!isSubmitted && <X className="w-3.5 h-3.5" />}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-[#475569]">No cards placed yet</p>
            )}
          </div>
        );
      })}

      {unassigned.length > 0 && (
        <div className="space-y-2 pt-1">
          <div className="text-sm font-bold text-[#0F172A]">Cards to Sort:</div>
          {unassigned.map((cardIdx) => {
            const active = s.activeCardIndex === cardIdx;
            return (
              <button
                key={cardIdx}
                type="button"
                disabled={isSubmitted}
                data-testid={`sort_card_${cardIdx}`}
                onClick={() => onSelectCard(cardIdx)}
                className={`w-full rounded-[14px] border-2 px-3.5 py-3 text-left text-sm transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#0284C7]/14 border-[#0284C7] font-bold text-[#0F172A]'
                    : 'bg-white border-[#CBD5E1]/80 font-medium text-[#0F172A] hover:border-[#0284C7]/50'
                }`}
              >
                {q.cards[cardIdx].text}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function OrderStepsBody({
  q,
  s,
  isSubmitted,
  onMoveUp,
  onMoveDown,
}: {
  q: ScienceQuestion;
  s: ActivitySessionState;
  isSubmitted: boolean;
  onMoveUp: (pos: number) => void;
  onMoveDown: (pos: number) => void;
}) {
  return (
    <div className="space-y-2.5">
      <div className="text-sm font-bold text-[#0284C7]">
        Use the arrows to arrange the steps in order (1 to {q.steps.length}):
      </div>
      {s.orderedStepIndices.map((origIdx, pos) => {
        const isRightPos = origIdx === pos;
        let borderColor = 'border-[#CBD5E1]/80';
        if (isSubmitted && isRightPos) borderColor = 'border-[#059669]';
        else if (isSubmitted && !isRightPos) borderColor = 'border-[#E11D48]';

        return (
          <div
            key={`${origIdx}-${pos}`}
            className={`rounded-2xl bg-white border-2 px-3 py-2.5 flex items-center gap-2.5 ${borderColor}`}
          >
            <span className="w-7 h-7 rounded-full bg-[#0284C7] text-white text-xs font-bold flex items-center justify-center shrink-0">
              {pos + 1}
            </span>
            <span className="flex-1 text-sm font-medium text-[#0F172A]">
              {q.steps[origIdx]}
            </span>
            {!isSubmitted && (
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  aria-label="Move up"
                  data-testid={`order_up_${pos}`}
                  disabled={pos === 0}
                  onClick={() => onMoveUp(pos)}
                  className="p-2 rounded-lg hover:bg-[#EAF2F8] disabled:opacity-30 text-[#0F172A] cursor-pointer disabled:cursor-default"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  aria-label="Move down"
                  data-testid={`order_down_${pos}`}
                  disabled={pos === s.orderedStepIndices.length - 1}
                  onClick={() => onMoveDown(pos)}
                  className="p-2 rounded-lg hover:bg-[#EAF2F8] disabled:opacity-30 text-[#0F172A] cursor-pointer disabled:cursor-default"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function FillBlankBody({
  q,
  s,
  isSubmitted,
  onToggleChoice,
}: {
  q: ScienceQuestion;
  s: ActivitySessionState;
  isSubmitted: boolean;
  onToggleChoice: (choice: string) => void;
}) {
  const needed = Math.max(1, q.correctAnswers.length);

  return (
    <div className="space-y-3">
      <div className="rounded-2xl bg-[#E0F2FE]/60 p-3.5 space-y-2">
        <div className="text-sm font-bold text-[#0F172A]">
          Selected word(s):
        </div>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: needed }, (_, i) => {
            const chosen = s.fillBlankSelections[i];
            return (
              <span
                key={i}
                className={`rounded-[10px] border-[1.5px] border-[#0284C7] px-3 py-1.5 text-sm font-bold ${
                  chosen
                    ? 'bg-[#0284C7] text-white'
                    : 'bg-white text-[#475569]'
                }`}
              >
                {chosen ?? `Blank ${i + 1}`}
              </span>
            );
          })}
        </div>
      </div>

      <div className="text-sm font-bold text-[#0F172A]">
        Tap to fill in order:
      </div>
      <div className="flex flex-wrap gap-2">
        {q.choices.map((choice, idx) => {
          const selected = s.fillBlankSelections.includes(choice);
          return (
            <button
              key={`${choice}-${idx}`}
              type="button"
              disabled={isSubmitted}
              data-testid={`fill_choice_${idx}`}
              onClick={() => onToggleChoice(choice)}
              className={`rounded-[14px] border-[1.5px] px-3.5 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
                selected
                  ? 'bg-[#0284C7] border-[#0284C7] text-white'
                  : 'bg-white border-[#CBD5E1] text-[#0F172A] hover:border-[#0284C7]'
              }`}
            >
              {choice}
            </button>
          );
        })}
      </div>
    </div>
  );
}
