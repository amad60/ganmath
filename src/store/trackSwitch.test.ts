import { describe, expect, it } from 'vitest';
import { createProgressStore, memoryStorage } from './progress';

describe('Track Switching — Math ⇄ Read di Store', () => {
  it('berpindah track tanpa merusak grade atau progress modul math', () => {
    const store = createProgressStore(memoryStorage());

    // Set profil awal Math Grade 2
    store.getState().setProfile('Sun', 'cat');
    store.getState().setGrade(2);
    expect(store.getState().data.profile.grade).toBe(2);
    expect(store.getState().data.profile.activeTrack).toBe('math');

    // Switch ke track 'read'
    store.getState().setTrack('read');
    expect(store.getState().data.profile.activeTrack).toBe('read');
    // Math grade tetap utuh di angka 2
    expect(store.getState().data.profile.grade).toBe(2);
    // Read grade default adalah 1
    expect(store.getState().data.profile.readGrade).toBe(1);

    // Ubah read grade menjadi 2 jika anak naik level di membaca
    store.getState().setReadGrade(2);
    expect(store.getState().data.profile.readGrade).toBe(2);

    // Switch kembali ke track 'math'
    store.getState().setTrack('math');
    expect(store.getState().data.profile.activeTrack).toBe('math');
    expect(store.getState().data.profile.grade).toBe(2);
    expect(store.getState().data.profile.readGrade).toBe(2);
  });
});
