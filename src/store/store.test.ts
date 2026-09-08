import { describe, expect, it } from 'vitest';
import { createProgressStore, memoryStorage, storageIsAvailable } from './progress';
import { buildBackup, backupFileName, parseBackup, summarize } from './backup';
import { migrate } from './migrations';
import { createInitialState } from './schema';
import { addModule, session } from '../engine/fixtures';
import { looksWiped, shouldRemindBackup, type Meta } from './meta';

describe('store + persist', () => {
  it('progress bertahan setelah app ditutup dan dibuka lagi', () => {
    const storage = memoryStorage();
    const a = createProgressStore(storage);
    a.getState().setProfile('Sun', 'panda');
    a.getState().recordSession(addModule(), session());

    const b = createProgressStore(storage); // simulasi buka ulang app
    expect(b.getState().data.profile.name).toBe('Sun');
    expect(b.getState().data.modules['g1-u2-m5']?.totals.sessions).toBe(1);
  });

  it('recordSession memakai engine dan mengembalikan event', () => {
    const s = createProgressStore(memoryStorage());
    const def = addModule();
    s.getState().recordSession(def, session());
    const events = s.getState().recordSession(def, session());
    expect(events.map((e) => e.type)).toContain('mastered');
    expect(s.getState().moduleState(def.id).status).toBe('mastered');
  });

  it('ambang dari orang tua dipakai saat menilai', () => {
    const s = createProgressStore(memoryStorage());
    s.getState().updateSettings({ masteryAccuracyOverride: 0.95 });
    const def = addModule();
    s.getState().recordSession(def, session({ correct: 9 })); // 90% < 95%
    expect(s.getState().moduleState(def.id).status).toBe('learning');
  });

  it('modul yang belum tersentuh mengembalikan state kosong, bukan undefined', () => {
    const s = createProgressStore(memoryStorage());
    expect(s.getState().moduleState('belum-ada').status).toBe('available');
  });

  it('storage yang diblokir (Safari mode privat) tidak membuat app gagal', () => {
    const blocked = {
      getItem: () => {
        throw new Error('blocked');
      },
      setItem: () => {
        throw new Error('blocked');
      },
      removeItem: () => {},
      clear: () => {},
      key: () => null,
      length: 0,
    } as unknown as Storage;
    const s = createProgressStore(blocked);
    expect(() => s.getState().setProfile('Sun', 'fox')).not.toThrow();
    // app tetap jalan penuh dalam sesi itu, hanya tidak tersimpan lintas sesi
    expect(s.getState().data.profile.name).toBe('Sun');
    expect(storageIsAvailable(blocked)).toBe(false);
  });
});

describe('migrasi', () => {
  it('state versi sekarang lewat tanpa perubahan', () => {
    const r = migrate(createInitialState());
    expect(r.ok).toBe(true);
  });

  it('menolak file dari versi app yang lebih baru daripada menebak isinya', () => {
    const r = migrate({ ...createInitialState(), schemaVersion: 99 });
    expect(r).toMatchObject({ ok: false, reason: 'from-future' });
  });

  it('menolak objek yang bukan state GanMath', () => {
    expect(migrate({ hello: 'world' })).toMatchObject({ ok: false, reason: 'not-ganmath' });
    expect(migrate(null)).toMatchObject({ ok: false, reason: 'corrupt' });
  });

  it('field baru diisi default aman kalau state lama tidak punya', () => {
    const old = { schemaVersion: 1, modules: {} };
    const r = migrate(old);
    expect(r.ok && r.state.settings.sound).toBe(true);
    expect(r.ok && r.state.streak.freezes).toBe(2);
  });
});

describe('backup file', () => {
  const state = () => {
    const s = createProgressStore(memoryStorage());
    s.getState().setProfile('Sun', 'tiger');
    const def = addModule();
    s.getState().recordSession(def, session());
    s.getState().recordSession(def, session());
    return s.getState().data;
  };

  it('export lalu import menghasilkan state yang identik', () => {
    const before = state();
    const json = JSON.stringify(buildBackup(before, '0.1.0'));
    const parsed = parseBackup(json);
    expect(parsed.ok).toBe(true);
    expect(parsed.ok && parsed.state).toEqual(before);
  });

  it('ringkasan menghitung modul yang dikuasai (untuk konfirmasi menimpa)', () => {
    const file = buildBackup(state(), '0.1.0');
    expect(summarize(file).mastered).toBe(1);
    expect(summarize(file).profileName).toBe('Sun');
  });

  it('menolak file yang bukan backup GanMath', () => {
    expect(parseBackup('{"app":"lainnya"}')).toMatchObject({ ok: false });
    expect(parseBackup('bukan json')).toMatchObject({ ok: false });
    expect(parseBackup('{"app":"ganmath","fileVersion":1}')).toMatchObject({ ok: false });
  });

  it('nama file aman untuk semua nama anak', () => {
    const s = createInitialState();
    s.profile.name = 'Sun Æ 王';
    expect(backupFileName(s, new Date(2026, 8, 8))).toMatch(/^ganmath-progress-[a-z0-9-]*-2026-09-08\.json$/);
  });

  it('impor mengganti total, tidak menggabungkan', () => {
    const store = createProgressStore(memoryStorage());
    store.getState().recordSession(addModule({ id: 'lama' }), session());
    const imported = createInitialState();
    store.getState().replaceAll(imported);
    expect(store.getState().data.modules['lama']).toBeUndefined();
  });
});

describe('deteksi data terhapus & pengingat backup', () => {
  const meta = (over: Partial<Meta> = {}): Meta => ({
    lastBackupAt: null,
    installPromptShown: false,
    everUsed: false,
    ...over,
  });

  it('pernah dipakai tapi progress hilang → tawarkan pulihkan dari file', () => {
    expect(looksWiped(false, meta({ everUsed: true }))).toBe(true);
    expect(looksWiped(false, meta())).toBe(false); // anak baru, bukan data hilang
  });

  it('mengingatkan backup setelah 5 modul dikuasai kalau belum pernah backup', () => {
    expect(shouldRemindBackup(meta(), 5)).toBe(true);
    expect(shouldRemindBackup(meta(), 2)).toBe(false);
  });

  it('mengingatkan lagi setelah 14 hari dan ada kemajuan baru', () => {
    const m = meta({ lastBackupAt: '2026-09-01T00:00:00.000Z' });
    expect(shouldRemindBackup(m, 5, new Date('2026-09-20T00:00:00.000Z'))).toBe(true);
    expect(shouldRemindBackup(m, 5, new Date('2026-09-05T00:00:00.000Z'))).toBe(false);
    expect(shouldRemindBackup(m, 0, new Date('2026-09-20T00:00:00.000Z'))).toBe(false);
  });
});
