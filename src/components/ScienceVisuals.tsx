import React, { useEffect, useRef, useState } from 'react';
import {
  BatteryCharging,
  BellRing,
  Bug,
  CheckCircle2,
  Cloud,
  Compass,
  Droplets,
  Filter,
  Flame,
  FlaskConical,
  Globe,
  Heart,
  Leaf,
  Lightbulb,
  Magnet,
  Microscope,
  Moon,
  Mountain,
  PawPrint,
  Play,
  Recycle,
  RotateCcw,
  Ruler,
  Scale,
  Scissors,
  Search,
  Settings,
  Sprout,
  Star,
  Sun,
  Thermometer,
  Timer,
  Umbrella,
  Waves,
  Wind,
  Wrench,
  Zap,
} from 'lucide-react';
import { SimulationType } from '../types/curriculum';

export interface ScienceVisualSpec {
  Icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
}

const SKY_PRIMARY = '#0284C7';
const SKY_BRIGHT = '#0EA5E9';
const LEAF_SECONDARY = '#059669';
const LEAF_BRIGHT = '#10B981';
const SUN_GOLD = '#F59E0B';
const VIOLET_ACCENT = '#6366F1';
const CORAL_ERROR = '#E11D48';

export function resolveScienceVisual(label: string): ScienceVisualSpec {
  const l = label.toLowerCase();
  if (l.includes('thermometer') || l.includes('temperature') || l.includes('heat')) {
    return { Icon: Thermometer, color: CORAL_ERROR };
  }
  if (l.includes('ruler') || l.includes('meterstick') || l.includes('cm') || l.includes('mm')) {
    return { Icon: Ruler, color: SKY_PRIMARY };
  }
  if (l.includes('beaker') || l.includes('cylinder') || l.includes('liquid') || l.includes('solution')) {
    return { Icon: FlaskConical, color: SKY_BRIGHT };
  }
  if (l.includes('hand lens') || l.includes('magnifying') || l.includes('observ')) {
    return { Icon: Search, color: VIOLET_ACCENT };
  }
  if (l.includes('balance') || l.includes('scale') || l.includes('mass') || l.includes('kg') || l.includes('mg')) {
    return { Icon: Scale, color: SUN_GOLD };
  }
  if (l.includes('scissor') || l.includes('cut')) {
    return { Icon: Scissors, color: CORAL_ERROR };
  }
  if (l.includes('stopwatch') || l.includes('timer') || l.includes('clock')) {
    return { Icon: Timer, color: VIOLET_ACCENT };
  }
  if (l.includes('magnet') || l.includes('iron') || l.includes('nail') || l.includes('steel')) {
    return { Icon: Magnet, color: CORAL_ERROR };
  }
  if (l.includes('compass')) {
    return { Icon: Compass, color: CORAL_ERROR };
  }
  if (l.includes('sun') || l.includes('light') || l.includes('lamp') || l.includes('flashlight')) {
    return { Icon: Sun, color: SUN_GOLD };
  }
  if (l.includes('moon') || l.includes('night') || l.includes('star') || l.includes('constellation')) {
    return { Icon: Moon, color: VIOLET_ACCENT };
  }
  if (l.includes('planet') || l.includes('earth') || l.includes('solar') || l.includes('globe')) {
    return { Icon: Globe, color: SKY_PRIMARY };
  }
  if (l.includes('cloud') || l.includes('rain') || l.includes('weather') || l.includes('storm') || l.includes('cyclone')) {
    return { Icon: Cloud, color: SKY_BRIGHT };
  }
  if (
    l.includes('water') ||
    l.includes('river') ||
    l.includes('sea') ||
    l.includes('rainwater') ||
    l.includes('ice') ||
    l.includes('evap') ||
    l.includes('condens')
  ) {
    return { Icon: Droplets, color: SKY_PRIMARY };
  }
  if (l.includes('wind') || l.includes('air') || l.includes('balloon') || l.includes('gas') || l.includes('steam')) {
    return { Icon: Wind, color: SKY_BRIGHT };
  }
  if (
    l.includes('volcano') ||
    l.includes('lava') ||
    l.includes('ash') ||
    l.includes('mountain') ||
    l.includes('rock') ||
    l.includes('soil') ||
    l.includes('sand') ||
    l.includes('clay') ||
    l.includes('loam') ||
    l.includes('silt')
  ) {
    return { Icon: Mountain, color: SUN_GOLD };
  }
  if (
    l.includes('plant') ||
    l.includes('leaf') ||
    l.includes('leaves') ||
    l.includes('seed') ||
    l.includes('root') ||
    l.includes('flower') ||
    l.includes('tree') ||
    l.includes('mangrove') ||
    l.includes('fern') ||
    l.includes('herbivore')
  ) {
    return { Icon: Leaf, color: LEAF_SECONDARY };
  }
  if (
    l.includes('animal') ||
    l.includes('bird') ||
    l.includes('fish') ||
    l.includes('frog') ||
    l.includes('dog') ||
    l.includes('cat') ||
    l.includes('mammal') ||
    l.includes('reptile') ||
    l.includes('crab') ||
    l.includes('snail') ||
    l.includes('carnivore')
  ) {
    return { Icon: PawPrint, color: SUN_GOLD };
  }
  if (l.includes('butterfly') || l.includes('insect') || l.includes('worm')) {
    return { Icon: Bug, color: LEAF_BRIGHT };
  }
  if (l.includes('bacteria') || l.includes('fungi') || l.includes('micro') || l.includes('decompos')) {
    return { Icon: Microscope, color: VIOLET_ACCENT };
  }
  if (l.includes('heart') || l.includes('blood') || l.includes('circul')) {
    return { Icon: Heart, color: CORAL_ERROR };
  }
  if (l.includes('lung') || l.includes('breath') || l.includes('nose') || l.includes('windpipe')) {
    return { Icon: Sprout, color: SKY_PRIMARY };
  }
  if (l.includes('battery')) {
    return { Icon: BatteryCharging, color: SUN_GOLD };
  }
  if (
    l.includes('circuit') ||
    l.includes('wire') ||
    l.includes('switch') ||
    l.includes('electro') ||
    l.includes('static')
  ) {
    return { Icon: Zap, color: SUN_GOLD };
  }
  if (l.includes('bulb')) {
    return { Icon: Lightbulb, color: SUN_GOLD };
  }
  if (l.includes('sound') || l.includes('bell') || l.includes('speaker') || l.includes('ear')) {
    return { Icon: BellRing, color: VIOLET_ACCENT };
  }
  if (l.includes('wave') || l.includes('crest') || l.includes('trough')) {
    return { Icon: Waves, color: SKY_BRIGHT };
  }
  if (l.includes('burn') || l.includes('fire') || l.includes('flame') || l.includes('stove')) {
    return { Icon: Flame, color: CORAL_ERROR };
  }
  if (l.includes('recycl') || l.includes('compost') || l.includes('jar') || l.includes('bottle')) {
    return { Icon: Recycle, color: LEAF_SECONDARY };
  }
  if (l.includes('filter') || l.includes('sieve') || l.includes('funnel')) {
    return { Icon: Filter, color: SKY_PRIMARY };
  }
  if (l.includes('pulley') || l.includes('lever') || l.includes('wedge') || l.includes('ramp')) {
    return { Icon: Settings, color: VIOLET_ACCENT };
  }
  if (l.includes('umbrella') || l.includes('hat') || l.includes('shade')) {
    return { Icon: Umbrella, color: SKY_PRIMARY };
  }
  if (l.includes('gold') || l.includes('silver') || l.includes('copper') || l.includes('metal') || l.includes('wrench')) {
    return { Icon: Wrench, color: SUN_GOLD };
  }
  return { Icon: Star, color: SKY_PRIMARY };
}

function SceneBackdropSvg({ sceneTitle }: { sceneTitle: string }) {
  const lower = sceneTitle.toLowerCase();

  if (lower.includes('sky') || lower.includes('solar') || lower.includes('globe')) {
    return (
      <svg
        viewBox="0 0 600 220"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="skySpaceGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0F172A" />
            <stop offset="50%" stopColor="#1E3A8A" />
            <stop offset="100%" stopColor="#312E81" />
          </linearGradient>
        </defs>
        <rect width="600" height="220" fill="url(#skySpaceGrad)" />
        <circle cx="96" cy="62" r="24" fill="#FDE047" />
        <circle cx="300" cy="114" r="16" fill="#38BDF8" />
        <circle cx="492" cy="74" r="9" fill="#E2E8F0" />
      </svg>
    );
  }

  if (
    lower.includes('water cycle') ||
    lower.includes('erosion') ||
    lower.includes('coastal') ||
    lower.includes('weather')
  ) {
    return (
      <svg
        viewBox="0 0 600 220"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="waterSkyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E0F2FE" />
            <stop offset="50%" stopColor="#BAE6FD" />
            <stop offset="100%" stopColor="#7DD3FC" />
          </linearGradient>
        </defs>
        <rect width="600" height="220" fill="url(#waterSkyGrad)" />
        <rect x="0" y="150" width="600" height="70" fill="#0284C7" fillOpacity="0.28" />
      </svg>
    );
  }

  if (lower.includes('wave') || lower.includes('slinky')) {
    const points: string[] = [];
    for (let x = 0; x <= 600; x += 8) {
      const y = 110 + Math.sin(x / 38) * 52;
      points.push(`${x === 0 ? 'M' : 'L'}${x},${y.toFixed(1)}`);
    }
    return (
      <svg
        viewBox="0 0 600 220"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      >
        <rect width="600" height="220" fill="#EFF6FF" />
        <path
          d={points.join(' ')}
          fill="none"
          stroke="#0EA5E9"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (lower.includes('volcano') || lower.includes('landscape')) {
    return (
      <svg
        viewBox="0 0 600 220"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="volcanoGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FEF3C7" />
            <stop offset="100%" stopColor="#FDE68A" />
          </linearGradient>
        </defs>
        <rect width="600" height="220" fill="url(#volcanoGrad)" />
        <polygon
          points="120,220 270,62 330,62 480,220"
          fill="#78350F"
          fillOpacity="0.25"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 600 220"
      preserveAspectRatio="none"
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="defaultLabGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E0F2FE" />
          <stop offset="100%" stopColor="#D1FAE5" />
        </linearGradient>
      </defs>
      <rect width="600" height="220" fill="url(#defaultLabGrad)" />
      <rect
        x="18"
        y="158"
        width="564"
        height="16"
        rx="8"
        fill="#94A3B8"
        fillOpacity="0.22"
      />
    </svg>
  );
}

export function InteractiveHotspotScene({
  sceneTitle,
  hotspots,
  selectedIndices,
  correctIndices,
  isSubmitted,
  onToggleHotspot,
}: {
  sceneTitle: string;
  hotspots: string[];
  selectedIndices: number[];
  correctIndices: number[];
  isSubmitted: boolean;
  onToggleHotspot: (index: number) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="relative w-full min-h-[220px] rounded-[22px] overflow-hidden border-[1.5px] border-[#CBD5E1]/70 bg-[#EAF2F8]/60">
        <SceneBackdropSvg sceneTitle={sceneTitle} />

        <div className="relative z-10 p-3 flex flex-col justify-between min-h-[220px]">
          <div>
            <span className="inline-block rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#0284C7] shadow-xs">
              {sceneTitle || 'Interactive Scene'}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-evenly gap-2.5 py-4 px-1">
            {hotspots.map((label, idx) => {
              const isSelected = selectedIndices.includes(idx);
              const isCorrect = correctIndices.includes(idx);

              let bgClass = 'bg-white text-[#0F172A] border-[#0284C7]/45';
              if (isSubmitted && isCorrect) {
                bgClass = 'bg-[#059669] text-white border-[#059669]';
              } else if (isSubmitted && isSelected && !isCorrect) {
                bgClass = 'bg-[#E11D48] text-white border-[#E11D48]';
              } else if (isSelected) {
                bgClass = 'bg-[#0284C7] text-white border-[#0284C7]';
              }

              const shiftClass =
                idx % 3 === 0
                  ? '-translate-y-2'
                  : idx % 3 === 1
                    ? 'translate-y-3'
                    : '-translate-y-0.5';

              const { Icon, color } = resolveScienceVisual(label);
              const activeTextWhite = isSelected || (isSubmitted && isCorrect);

              return (
                <button
                  key={`${label}-${idx}`}
                  type="button"
                  disabled={isSubmitted}
                  data-testid={`hotspot_pin_${idx}`}
                  onClick={() => onToggleHotspot(idx)}
                  className={`min-w-[110px] max-w-[180px] flex-1 rounded-2xl border-2 px-3 py-2.5 flex flex-col items-center gap-1 transition-all cursor-pointer ${shiftClass} ${bgClass} ${
                    isSelected ? 'shadow-md' : 'shadow-xs hover:shadow-sm'
                  }`}
                >
                  <Icon
                    className="w-6 h-6 shrink-0"
                    style={{ color: activeTextWhite ? '#FFFFFF' : color }}
                  />
                  <span className="text-xs font-semibold text-center leading-snug">
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <p className="text-xs text-[#475569]">
        Tap a highlighted item on the science scene above.
      </p>
    </div>
  );
}

export function InteractiveRulerSlider({
  minValue,
  maxValue,
  targetValue,
  unit,
  currentValue,
  isSubmitted,
  onValueChange,
}: {
  minValue: number;
  maxValue: number;
  targetValue: number;
  unit: string;
  currentValue: number;
  isSubmitted: boolean;
  onValueChange: (val: number) => void;
}) {
  const span = Math.max(1, maxValue - minValue);
  const pad = 24;
  const width = 560;
  const rulerW = width - pad * 2;
  const frac = Math.min(1, Math.max(0, (currentValue - minValue) / span));
  const mx = pad + frac * rulerW;
  const targetFrac = Math.min(
    1,
    Math.max(0, (targetValue - minValue) / span),
  );
  const tx = pad + targetFrac * rulerW;
  const midLabel = Math.round((minValue + maxValue) / 2);

  return (
    <div className="rounded-[20px] bg-white border-[1.5px] border-[#CBD5E1]/70 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-[#0F172A]">
          Virtual Metric Ruler
        </span>
        <span className="rounded-full bg-[#0284C7]/15 px-3 py-1 text-sm font-bold text-[#0284C7] tabular-nums">
          {Math.round(currentValue)} {unit}
        </span>
      </div>

      <svg
        viewBox={`0 0 ${width} 94`}
        className="w-full h-24"
        aria-label="Virtual Metric Ruler"
      >
        <rect
          x={pad}
          y={28}
          width={rulerW}
          height={56}
          rx={10}
          fill="#FDE68A"
        />
        {Array.from({ length: span + 1 }, (_, i) => {
          const x = pad + (i / span) * rulerW;
          const isMajor = i % 5 === 0;
          const tickH = isMajor ? 26 : 14;
          return (
            <line
              key={i}
              x1={x}
              y1={28}
              x2={x}
              y2={28 + tickH}
              stroke="#78350F"
              strokeWidth={isMajor ? 3 : 1.75}
            />
          );
        })}
        <line
          x1={mx}
          y1={4}
          x2={mx}
          y2={84}
          stroke="#0284C7"
          strokeWidth={5}
          strokeLinecap="round"
        />
        <circle cx={mx} cy={10} r={9} fill="#0284C7" />
        {isSubmitted && <circle cx={tx} cy={56} r={9} fill="#059669" />}
      </svg>

      <div>
        <input
          type="range"
          min={minValue}
          max={maxValue}
          step={1}
          disabled={isSubmitted}
          value={currentValue}
          data-testid="ruler_slider"
          onChange={(e) => onValueChange(Number(e.target.value))}
          className="w-full accent-[#0284C7] cursor-pointer"
        />
        <div className="flex items-center justify-between text-xs text-[#475569] mt-1 tabular-nums">
          <span>
            {minValue} {unit}
          </span>
          <span>
            {midLabel} {unit}
          </span>
          <span>
            {maxValue} {unit}
          </span>
        </div>
      </div>
    </div>
  );
}

export function InteractiveScienceSimulation({
  simType,
  choices,
  selectedChoice,
  correctIndex,
  isSubmitted,
  simHasRun,
  onRunSimulation,
  onSelectChoice,
}: {
  simType: SimulationType;
  choices: string[];
  selectedChoice: number | null;
  correctIndex: number;
  isSubmitted: boolean;
  simHasRun: boolean;
  onRunSimulation: () => void;
  onSelectChoice: (index: number) => void;
}) {
  const [animProgress, setAnimProgress] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    if (!simHasRun) {
      setAnimProgress(0);
    }
  }, [simHasRun, simType]);

  const triggerAnimation = () => {
    onRunSimulation();
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    const start = performance.now();
    const duration = 1000;

    const tick = (now: number) => {
      const raw = Math.min(1, (now - start) / duration);
      // FastOutSlowIn-like cubic easing
      const eased = 1 - Math.pow(1 - raw, 3);
      setAnimProgress(eased);
      if (raw < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  const w = 540;
  const h = 150;
  const t = animProgress;
  const cx = w * (0.55 - 0.32 * t);
  const dropY = 28 + (h * 0.74 - 28) * (t * t);

  return (
    <div className="space-y-3">
      <div className="rounded-[22px] bg-[#EAF2F8]/80 border-[1.5px] border-[#CBD5E1]/70 p-4">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-sm font-bold text-[#0284C7]">
            {simType === 'CART_PUSH'
              ? 'Force & Cart Simulator'
              : 'Gravity Drop Simulator (1.5 m)'}
          </span>
          <button
            type="button"
            data-testid="run_simulation_button"
            onClick={triggerAnimation}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white px-3.5 py-1.5 text-xs font-bold transition-colors cursor-pointer shrink-0"
          >
            {simHasRun ? (
              <RotateCcw className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            {simType === 'CART_PUSH' ? 'Apply Force' : 'Drop Balls'}
          </button>
        </div>

        <svg
          viewBox={`0 0 ${w} ${h}`}
          className="w-full h-36 rounded-2xl bg-white border border-[#CBD5E1]/50"
          aria-label="Science Simulation Stage"
        >
          {simType === 'CART_PUSH' ? (
            <>
              <line
                x1={24}
                y1={h * 0.78}
                x2={w - 24}
                y2={h * 0.78}
                stroke="#94A3B8"
                strokeWidth={6}
                strokeLinecap="round"
              />
              <rect
                x={cx - 42}
                y={h * 0.48}
                width={84}
                height={36}
                rx={10}
                fill="#0EA5E9"
              />
              <circle cx={cx - 22} cy={h * 0.75} r={11} fill="#0F172A" />
              <circle cx={cx + 22} cy={h * 0.75} r={11} fill="#0F172A" />
              {/* Push arrow pointing LEFT */}
              <line
                x1={cx + 95}
                y1={h * 0.6}
                x2={cx + 48}
                y2={h * 0.6}
                stroke="#E11D48"
                strokeWidth={6}
                strokeLinecap="round"
              />
              <polygon
                points={`${cx + 44},${h * 0.6} ${cx + 58},${h * 0.6 - 8} ${cx + 58},${h * 0.6 + 8}`}
                fill="#E11D48"
              />
            </>
          ) : (
            <>
              <rect
                x={24}
                y={h * 0.82}
                width={w - 48}
                height={18}
                rx={8}
                fill="#10B981"
                fillOpacity={0.28}
              />
              <circle cx={w * 0.34} cy={dropY} r={22} fill="#0284C7" />
              <circle cx={w * 0.66} cy={dropY} r={20} fill="#F59E0B" />
            </>
          )}
        </svg>
      </div>

      <div className="text-sm font-bold text-[#0F172A]">
        Choose what you observed:
      </div>
      <div className="space-y-2.5">
        {choices.map((ch, idx) => {
          const isSelected = selectedChoice === idx;
          const isCorrect = idx === correctIndex;
          let styleClass =
            'bg-white border-[#CBD5E1]/70 text-[#0F172A] hover:border-[#0284C7]/50';
          if (isSubmitted && isCorrect) {
            styleClass = 'bg-[#059669]/15 border-[#059669] text-[#0F172A]';
          } else if (isSubmitted && isSelected && !isCorrect) {
            styleClass = 'bg-[#E11D48]/12 border-[#E11D48] text-[#0F172A]';
          } else if (isSelected) {
            styleClass = 'bg-[#0284C7]/12 border-[#0284C7] text-[#0F172A]';
          }

          return (
            <button
              key={idx}
              type="button"
              disabled={isSubmitted}
              data-testid={`sim_choice_${idx}`}
              onClick={() => onSelectChoice(idx)}
              className={`w-full rounded-2xl border-2 px-4 py-3.5 flex items-center justify-between text-left transition-colors cursor-pointer ${styleClass}`}
            >
              <span className="text-sm sm:text-base font-semibold">{ch}</span>
              {isSelected && (
                <CheckCircle2
                  className="w-5 h-5 shrink-0"
                  style={{
                    color:
                      isSubmitted && !isCorrect
                        ? '#E11D48'
                        : isSubmitted && isCorrect
                          ? '#059669'
                          : '#0284C7',
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
