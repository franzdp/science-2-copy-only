import React, { useState } from 'react';
import { BookOpen, Compass, Trophy } from 'lucide-react';
import {
  AddLearnerDialog,
  LearnerSwitcherDialog,
} from './components/LearnerSwitcherDialog';
import { useScienceApp } from './hooks/useScienceApp';
import { ActivityScreen } from './screens/ActivityScreen';
import { ChallengeScreen } from './screens/ChallengeScreen';
import { LearnScreen } from './screens/LearnScreen';
import { ProgressScreen } from './screens/ProgressScreen';
import { TopTab } from './types/curriculum';

const TABS: Array<{
  id: TopTab;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: 'learn', label: 'Learn', Icon: BookOpen },
  { id: 'challenge', label: 'Challenge', Icon: Compass },
  { id: 'progress', label: 'Progress', Icon: Trophy },
];

export function App() {
  const app = useScienceApp();
  const [activeTab, setActiveTab] = useState<TopTab>('learn');
  const [showLearnerSwitcher, setShowLearnerSwitcher] = useState(false);
  const [showAddLearner, setShowAddLearner] = useState(false);

  if (app.isLoading) {
    return (
      <div className="min-h-screen bg-[#F4F8FB] flex flex-col items-center justify-center gap-3 p-6">
        <div className="w-9 h-9 rounded-full border-4 border-[#0284C7]/25 border-t-[#0284C7] animate-spin" />
        <p className="text-sm font-medium text-[#475569]">
          Loading Science Explorer...
        </p>
      </div>
    );
  }

  if (app.errorMessage) {
    return (
      <div className="min-h-screen bg-[#F4F8FB] flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md rounded-3xl bg-white border border-[#E11D48]/30 p-6 space-y-2">
          <h1 className="font-display text-xl font-bold text-[#0F172A]">
            Could Not Load Curriculum
          </h1>
          <p className="text-sm text-[#475569]">{app.errorMessage}</p>
        </div>
      </div>
    );
  }

  if (app.session) {
    return <ActivityScreen session={app.session} app={app} />;
  }

  return (
    <div className="min-h-screen bg-[#F4F8FB] flex flex-col md:flex-row">
      {/* Desktop / Tablet Navigation Rail */}
      <aside className="hidden md:flex md:w-20 md:flex-col md:items-center md:py-6 md:gap-4 md:bg-white md:border-r md:border-[#CBD5E1]/60 md:sticky md:top-0 md:h-screen shrink-0">
        {TABS.map(({ id, label, Icon }) => {
          const selected = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              data-testid={`rail_tab_${id}`}
              onClick={() => setActiveTab(id)}
              className="flex flex-col items-center gap-1 w-16 py-2 rounded-2xl transition-colors cursor-pointer group"
            >
              <span
                className={`w-12 h-8 rounded-full flex items-center justify-center transition-colors ${
                  selected
                    ? 'bg-[#E0F2FE] text-[#0284C7]'
                    : 'text-[#475569] group-hover:bg-[#EAF2F8]'
                }`}
              >
                <Icon className="w-5 h-5" />
              </span>
              <span
                className={`text-[11px] font-semibold ${
                  selected ? 'text-[#0284C7]' : 'text-[#475569]'
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {activeTab === 'learn' && (
          <LearnScreen
            app={app}
            onOpenLearnerSwitcher={() => setShowLearnerSwitcher(true)}
          />
        )}
        {activeTab === 'challenge' && (
          <ChallengeScreen
            app={app}
            onOpenLearnerSwitcher={() => setShowLearnerSwitcher(true)}
          />
        )}
        {activeTab === 'progress' && (
          <ProgressScreen
            app={app}
            onOpenLearnerSwitcher={() => setShowLearnerSwitcher(true)}
            onOpenAddLearner={() => setShowAddLearner(true)}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav
        aria-label="Primary Navigation"
        className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-[#CBD5E1]/60 flex items-center justify-around py-1.5 px-2"
      >
        {TABS.map(({ id, label, Icon }) => {
          const selected = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              data-testid={`nav_tab_${id}`}
              onClick={() => setActiveTab(id)}
              className="flex flex-col items-center gap-0.5 py-1 px-4 rounded-2xl cursor-pointer"
            >
              <span
                className={`px-4 py-1 rounded-full transition-colors ${
                  selected
                    ? 'bg-[#E0F2FE] text-[#0284C7]'
                    : 'text-[#475569]'
                }`}
              >
                <Icon className="w-5 h-5" />
              </span>
              <span
                className={`text-[11px] font-semibold ${
                  selected ? 'text-[#0284C7]' : 'text-[#475569]'
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Dialogs */}
      {showLearnerSwitcher && (
        <LearnerSwitcherDialog
          learners={app.learners}
          activeLearnerId={app.stats.id}
          learnerStarsMap={app.learnerStarsMap}
          onSwitchLearner={app.switchLearner}
          onOpenAddLearner={() => setShowAddLearner(true)}
          onDeleteLearner={app.deleteLearner}
          onDismiss={() => setShowLearnerSwitcher(false)}
        />
      )}

      {showAddLearner && (
        <AddLearnerDialog
          suggestedNumber={app.learners.length + 1}
          onCreateLearner={app.addLearner}
          onDismiss={() => setShowAddLearner(false)}
        />
      )}
    </div>
  );
}

export default App;
