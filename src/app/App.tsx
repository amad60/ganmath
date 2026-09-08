import { useEffect, useMemo, useState } from 'react';
import type { Evaluation } from '../engine/mastery';
import { createSession, toSessionResult, type SessionState } from '../engine/session';
import { nextModule } from '../engine/unlock';
import { GRADE_THRESHOLDS } from '../engine/types';
import type { SessionKind } from '../engine/types';
import { all, moduleById, registry } from '../content';
import { useProgress } from '../store/progress';
import { toDateString } from '../engine/review';
import { MapScreen } from './screens/MapScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { BadgesScreen } from './screens/BadgesScreen';
import { ParentScreen } from './screens/ParentScreen';
import { ParentGate } from './screens/ParentGate';
import { usePwa } from './usePwa';
import { setSoundEnabled } from './sfx';
import { LearnScreen } from './screens/LearnScreen';
import { QuestionScreen } from './screens/QuestionScreen';
import { ResultScreen } from './screens/ResultScreen';

type Screen =
  | { name: 'map' }
  | { name: 'badges' }
  | { name: 'parent' }
  | { name: 'learn'; moduleId: string }
  | { name: 'session'; moduleId: string }
  | {
      name: 'result';
      moduleId: string;
      evaluation: Evaluation;
      xpGained: number;
      earnedBadges: string[];
    };

/** Mesin state layar — bukan router (docs/tech/architecture.md §3). */
export function App() {
  const data = useProgress((s) => s.data);
  const moduleState = useProgress((s) => s.moduleState);
  const recordSession = useProgress((s) => s.recordSession);
  const markLearnComplete = useProgress((s) => s.markLearnComplete);

  const setProfile = useProgress((s) => s.setProfile);
  const updateSettings = useProgress((s) => s.updateSettings);
  const replaceAll = useProgress((s) => s.replaceAll);
  const reset = useProgress((s) => s.reset);

  const [screen, setScreen] = useState<Screen>({ name: 'map' });
  const [installDismissed, setInstallDismissed] = useState(false);
  const [session, setSession] = useState<SessionState | null>(null);
  const [gateOpen, setGateOpen] = useState(false);

  const next = useMemo(() => nextModule(data.modules, registry), [data.modules]);
  const pwa = usePwa(Object.keys(data.modules).length > 0);

  useEffect(() => {
    setSoundEnabled(data.settings.sound);
  }, [data.settings.sound]);
  const today = toDateString(new Date());

  const startSession = (moduleId: string, kind: SessionKind) => {
    const def = moduleById(moduleId);
    setSession(createSession(def, kind, Date.now(), Date.now()));
    setScreen({ name: 'session', moduleId });
  };

  const openModule = (moduleId: string) => {
    const st = moduleState(moduleId);
    // Materi hanya dipaksa sekali; sesudahnya anak langsung berlatih,
    // tapi Learn tetap bisa dibuka ulang kapan saja dari layar hasil.
    if (!st.learnCompletedAt) setScreen({ name: 'learn', moduleId });
    else startSession(moduleId, st.status === 'learning' ? 'practice' : 'quiz');
  };

  const finishSession = (final: SessionState) => {
    const def = moduleById(final.moduleId);
    const unitModuleIds = all.filter((m) => m.unitId === def.unitId).map((m) => m.id);
    const outcome = recordSession(def, toSessionResult(final, today), { unitModuleIds });
    setSession(null);
    setScreen({
      name: 'result',
      moduleId: final.moduleId,
      evaluation: outcome,
      xpGained: outcome.xpGained,
      earnedBadges: outcome.earnedBadges,
    });
  };

  // Onboarding muncul sekali seumur hidup, sebelum apa pun yang lain.
  if (!data.profile.name) {
    return (
      <OnboardingScreen
        onDone={(name, avatar) => {
          setProfile(name, avatar);
          if (next) openModule(next);
        }}
      />
    );
  }

  switch (screen.name) {
    case 'learn':
      return (
        <LearnScreen
          module={moduleById(screen.moduleId)}
          onExit={() => setScreen({ name: 'map' })}
          onDone={() => {
            markLearnComplete(screen.moduleId, today);
            startSession(screen.moduleId, 'practice');
          }}
        />
      );

    case 'session':
      return session ? (
        <QuestionScreen
          session={session}
          onSession={setSession}
          onFinish={finishSession}
          onExit={() => {
            setSession(null);
            setScreen({ name: 'map' });
          }}
        />
      ) : null;

    case 'result': {
      const st = moduleState(screen.moduleId);
      const retryKind: SessionKind = st.status === 'practiced' ? 'speed' : 'practice';
      return (
        <ResultScreen
          module={moduleById(screen.moduleId)}
          evaluation={screen.evaluation}
          xpGained={screen.xpGained}
          earnedBadges={screen.earnedBadges}
          sessionsNeeded={
            moduleById(screen.moduleId).masteryOverride?.sessions ??
            GRADE_THRESHOLDS[moduleById(screen.moduleId).grade].sessions
          }
          onContinue={() => setScreen({ name: 'map' })}
          onRetry={() => startSession(screen.moduleId, retryKind)}
        />
      );
    }

    case 'badges':
      return (
        <BadgesScreen
          owned={data.badges}
          states={data.modules}
          streakBest={data.streak.best}
          streakCurrent={data.streak.current}
          nextId={next}
          onBack={() => setScreen({ name: 'map' })}
        />
      );

    case 'parent':
      return (
        <ParentScreen
          data={data}
          onSettings={updateSettings}
          onImport={(state) => {
            replaceAll(state);
            setScreen({ name: 'map' });
          }}
          onReset={() => {
            reset();
            setScreen({ name: 'map' });
          }}
          onBack={() => setScreen({ name: 'map' })}
        />
      );

    default:
      return (
        <div className="min-h-full">
          {/* Tawaran, bukan paksaan: tidak pernah reload otomatis di tengah sesi anak.
              Bar tipis di atas, supaya tidak pernah menutupi jalur belajar. */}
          {pwa.needRefresh ? (
            <button
              type="button"
              onClick={pwa.applyUpdate}
              className="safe-top sticky top-0 z-30 w-full px-5 py-2 text-[15px] font-black"
              style={{ background: 'var(--c-primary)', color: 'var(--c-primary-ink)' }}
            >
              New version ready — tap to update
            </button>
          ) : null}
          <MapScreen
            states={data.modules}
            nextId={next}
            xp={data.xp}
            level={data.level}
            streak={data.streak.current}
            onOpen={openModule}
            onTestOut={(id) => startSession(id, 'testout')}
            onBadges={() => setScreen({ name: 'badges' })}
            onParent={() => setGateOpen(true)}
            install={
              pwa.canInstall && !installDismissed
                ? {
                    label: 'Add GanMath to the home screen so progress is safer.',
                    onAccept: pwa.promptInstall,
                    onDismiss: () => setInstallDismissed(true),
                  }
                : null
            }
          />
          <ParentGate
            open={gateOpen}
            onClose={() => setGateOpen(false)}
            onPass={() => {
              setGateOpen(false);
              setScreen({ name: 'parent' });
            }}
          />
        </div>
      );
  }
}
