import { useEffect, useMemo, useState } from 'react';
import { evaluate, type Evaluation } from '../engine/mastery';
import { createSession, toSessionResult, type SessionState } from '../engine/session';
import { nextModule } from '../engine/unlock';
import { nextStepFor, type ModuleStep } from '../engine/steps';
import { dueReviews } from '../engine/review';
import { emptyModuleState, GRADE_THRESHOLDS } from '../engine/types';
import type { SessionKind } from '../engine/types';
import { all, moduleById, registryFor, unitModules, unitTestDef } from '../content';
import { useProgress } from '../store/progress';
import { en } from '../i18n/en';
import { toDateString } from '../engine/review';
import { MapScreen } from './screens/MapScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { BadgesScreen } from './screens/BadgesScreen';
import { ParentScreen } from './screens/ParentScreen';
import { ParentGate } from './screens/ParentGate';
import { usePwa } from './usePwa';
import { setSoundEnabled } from './sfx';
import { looksWiped, readMeta } from '../store/meta';
import { readProgressFile } from './backupFile';
import { clearSession, loadSession, saveSession } from '../store/session';
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
  const setGrade = useProgress((s) => s.setGrade);
  const masterModules = useProgress((s) => s.masterModules);
  const reset = useProgress((s) => s.reset);

  // Sesi yang sedang berjalan dipulihkan saat app dibuka: HP terkunci atau app
  // dibunuh sistem tidak boleh menghapus jawaban yang sudah dikerjakan anak.
  const [session, setSessionState] = useState<SessionState | null>(() => loadSession());
  const [screen, setScreen] = useState<Screen>(() =>
    session ? { name: 'session', moduleId: session.moduleId } : { name: 'map' },
  );
  const [installDismissed, setInstallDismissed] = useState(false);

  const setSession = (next: SessionState | null) => {
    setSessionState(next);
    if (next) saveSession(next);
    else clearSession();
  };
  const [gateOpen, setGateOpen] = useState(false);

  const today = toDateString(new Date());
  const grade = data.profile.grade ?? 1;
  const registry = useMemo(() => registryFor(grade), [grade]);
  const next = useMemo(() => nextModule(data.modules, registry), [data.modules, registry]);
  const pwa = usePwa(Object.keys(data.modules).length > 0);

  /**
   * Modul yang jatuh tempo diulang. Tanpa ini seluruh jadwal ulangan berjarak
   * (3 / 7 / 30 / 60 hari) tidak pernah terjadi: modul yang sudah dikuasai
   * dilewati oleh nextModule, jadi tidak akan pernah muncul lagi di peta.
   */
  const reviews = useMemo(
    () =>
      dueReviews(data.modules, today)
        .filter((r) => registry.modules[r.moduleId])
        .map((r) => ({ moduleId: r.moduleId, title: moduleById(r.moduleId).title })),
    [data.modules, today, registry],
  );

  useEffect(() => {
    setSoundEnabled(data.settings.sound);
  }, [data.settings.sound]);

  useEffect(() => {
    // Setelan orang tua ditulis ke atribut root; komponen manipulatif membacanya
    // di samping prefers-reduced-motion. Sebelumnya togglenya tersimpan tapi tidak
    // pernah dibaca siapa pun.
    const root = document.documentElement;
    if (data.settings.reducedMotion === true) root.dataset.reduceMotion = 'true';
    else delete root.dataset.reduceMotion;
  }, [data.settings.reducedMotion]);

  /** Langkah yang harus dikerjakan anak untuk sebuah modul, satu sumber kebenaran. */
  const stepFor = (moduleId: string): ModuleStep =>
    nextStepFor(moduleById(moduleId), moduleState(moduleId), today);

  const startSession = (moduleId: string, kind: SessionKind) => {
    const def = moduleById(moduleId);
    setSession(createSession(def, kind, Date.now(), Date.now()));
    setScreen({ name: 'session', moduleId });
  };

  /** Lompati SATU UNIT sekaligus: satu tes yang menjangkau seluruh modulnya. */
  const startUnitTest = (unitId: string) => {
    const def = unitTestDef(unitId);
    setSession(createSession(def, 'testout', Date.now(), Date.now()));
    setScreen({ name: 'session', moduleId: def.id });
  };

  /**
   * Membuka modul = mengerjakan LANGKAH BERIKUTNYA-nya. Versi pertama menebak
   * sendiri (`status === 'learning' ? 'practice' : 'quiz'`), dan karena sesi latihan
   * tidak pernah menaikkan status, anak terjebak berlatih selamanya.
   */
  const openModule = (moduleId: string): void => {
    const step = stepFor(moduleId);
    if (step === 'learn') {
      setScreen({ name: 'learn', moduleId });
      return;
    }
    if (step === 'done') {
      // Modul ini sudah tuntas. Menekan node yang sudah selesai TIDAK boleh
      // meluncurkan modul lain — anak menekan "Count to 5" lalu tiba-tiba
      // mengerjakan modul yang sama sekali berbeda. Yang benar: mengulang modul
      // yang dia tekan, sebagai ulangan singkat tanpa risiko.
      startSession(moduleId, 'review');
      return;
    }
    // Sisa langkah semuanya berupa sesi soal.
    startSession(moduleId, step satisfies SessionKind);
  };

  /** Tombol utama di peta & layar hasil: maju ke modul berikutnya, bukan mengulang. */
  const goToNextModule = (): void => {
    const after = nextModule(data.modules, registry);
    if (after) openModule(after);
    else setScreen({ name: 'map' });
  };

  /** Kalimat untuk tombol utama: selalu menyebut apa yang terjadi berikutnya. */
  const nextActionFor = (moduleId: string): { label: string; run: () => void } => {
    if (moduleId.startsWith('unit:')) {
      const after = nextModule(data.modules, registry);
      if (!after) return { label: en.result.allDone, run: () => setScreen({ name: 'map' }) };
      return { label: en.result.nextModule(moduleById(after).title), run: goToNextModule };
    }
    const step = stepFor(moduleId);
    if (step !== 'done') {
      return {
        label: en.result.nextIs(en.step[step], moduleById(moduleId).title),
        run: () => openModule(moduleId),
      };
    }
    const after = nextModule(data.modules, registry);
    if (!after) return { label: en.result.allDone, run: () => setScreen({ name: 'map' }) };
    return { label: en.result.nextModule(moduleById(after).title), run: goToNextModule };
  };

  const finishSession = (final: SessionState) => {
    // Tes satu unit: kalau lolos, seluruh modul unit itu ditandai dikuasai sekaligus.
    if (final.moduleId.startsWith('unit:')) {
      const unitId = final.moduleId.slice('unit:'.length);
      const virtualDef = unitTestDef(unitId);
      const result = toSessionResult(final, today);
      const evaluation = evaluate(virtualDef, emptyModuleState(), result);
      if (evaluation.next.status === 'mastered') {
        masterModules(
          unitModules(unitId).map((m) => m.id),
          today,
        );
      }
      setSession(null);
      setScreen({
        name: 'result',
        moduleId: final.moduleId,
        evaluation,
        xpGained: 0,
        earnedBadges: [],
      });
      return;
    }

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
    const wiped = looksWiped(Object.keys(data.modules).length > 0, readMeta());
    const restore = () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'application/json,.json';
      input.onchange = () => {
        const file = input.files?.[0];
        if (!file) return;
        void readProgressFile(file).then((r) => {
          if (r.ok) replaceAll(r.state);
        });
      };
      input.click();
    };
    return (
      <OnboardingScreen
        onRestore={wiped ? restore : null}
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
      const isUnitTest = screen.moduleId.startsWith('unit:');
      const action = nextActionFor(screen.moduleId);
      const st = moduleState(screen.moduleId);
      // Master Round adalah satu-satunya jalan ke bintang ke-3. Tanpa tawaran ini
      // bintang ketiga dan badge Gold Brain mustahil didapat.
      const canMaster =
        !isUnitTest && (st.status === 'mastered' || st.status === 'retained') && st.stars < 3;
      return (
        <ResultScreen
          module={
            isUnitTest
              ? unitTestDef(screen.moduleId.slice('unit:'.length))
              : moduleById(screen.moduleId)
          }
          evaluation={screen.evaluation}
          xpGained={screen.xpGained}
          earnedBadges={screen.earnedBadges}
          sessionsNeeded={
            isUnitTest
              ? 1
              : (moduleById(screen.moduleId).masteryOverride?.sessions ??
                GRADE_THRESHOLDS[moduleById(screen.moduleId).grade].sessions)
          }
          nextLabel={action.label}
          onNext={action.run}
          onBackToMap={() => setScreen({ name: 'map' })}
          extra={
            canMaster
              ? {
                  label: en.result.masterRound,
                  run: () => startSession(screen.moduleId, 'master'),
                }
              : null
          }
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
          grade={grade}
          onBack={() => setScreen({ name: 'map' })}
        />
      );

    case 'parent':
      return (
        <ParentScreen
          data={data}
          onGrade={setGrade}
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
              className="safe-top sticky top-0 z-30 w-full px-6 pb-2 text-[15px] font-black"
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
            onSkipUnit={startUnitTest}
            onMaster={(id) => startSession(id, 'master')}
            grade={grade}
            nextStepLabel={next ? en.step[stepFor(next)] : en.step.done}
            reviews={reviews}
            onReview={(id) => startSession(id, 'review')}
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
