import { useMemo, useState } from 'react';
import type { Evaluation } from '../engine/mastery';
import { createSession, toSessionResult, type SessionState } from '../engine/session';
import { nextModule } from '../engine/unlock';
import type { SessionKind } from '../engine/types';
import { all, moduleById, registry } from '../content';
import { useProgress } from '../store/progress';
import { toDateString } from '../engine/review';
import { MapScreen } from './screens/MapScreen';
import { LearnScreen } from './screens/LearnScreen';
import { QuestionScreen } from './screens/QuestionScreen';
import { ResultScreen } from './screens/ResultScreen';

type Screen =
  | { name: 'map' }
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

  const [screen, setScreen] = useState<Screen>({ name: 'map' });
  const [session, setSession] = useState<SessionState | null>(null);

  const next = useMemo(() => nextModule(data.modules, registry), [data.modules]);
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
          onContinue={() => setScreen({ name: 'map' })}
          onRetry={() => startSession(screen.moduleId, retryKind)}
        />
      );
    }

    default:
      return (
        <div className="mx-auto min-h-full max-w-[430px]">
          <MapScreen
            states={data.modules}
            nextId={next}
            xp={data.xp}
            level={data.level}
            streak={data.streak.current}
            onOpen={openModule}
            onParent={() => setScreen({ name: 'map' })}
          />
        </div>
      );
  }
}
