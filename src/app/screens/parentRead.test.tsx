import { describe, expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ParentScreen } from './ParentScreen';
import { BadgesScreen } from './BadgesScreen';
import { createInitialState } from '../../store/schema';
import { BADGES } from '../../engine/gamification';

describe('Integrasi Parent Area & Rewards untuk Track Read', () => {
  it('ParentScreen menampilkan Math Progress dan Reading Progress', () => {
    const data = createInitialState();
    data.modules['r1-u1-m1'] = {
      status: 'mastered',
      stars: 2,
      reviewStage: 1,
      masteredAt: '2026-09-27',
      consecutiveFails: 0,
      attempts: [],
      totals: { sessions: 1, questions: 10, correct: 10 },
    };

    render(
      <ParentScreen
        data={data}
        onGrade={() => {}}
        onSettings={() => {}}
        onImport={() => {}}
        onReset={() => {}}
        onBack={() => {}}
      />,
    );

    expect(screen.getByText('Math Progress by grade')).toBeInTheDocument();
    expect(screen.getByText('Reading Progress (Literasi)')).toBeInTheDocument();
    expect(screen.getByText('Read Level 1')).toBeInTheDocument();
    expect(screen.getByText('Jump to Reading Level')).toBeInTheDocument();

    // Navigasi ke Tab Settings
    const settingsTabBtn = screen.getByRole('button', { name: /Settings/i });
    fireEvent.click(settingsTabBtn);
    expect(screen.getByText('Preferences')).toBeInTheDocument();
    expect(screen.getByText('Mastery threshold')).toBeInTheDocument();

    // Navigasi ke Tab Sync & Data
    const syncTabBtn = screen.getByRole('button', { name: /Sync & Data/i });
    fireEvent.click(syncTabBtn);
    expect(screen.getByText('Progress backup')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reset progress' })).toBeInTheDocument();
  });

  it('BadgesScreen memiliki badge membaca dan mendukung track read', () => {
    expect(BADGES['bookworm-1']).toBeDefined();
    expect(BADGES['story-detective']).toBeDefined();
    expect(BADGES['read-graduate-1']).toBeDefined();
    expect(BADGES['read-graduate-2']).toBeDefined();
    expect(BADGES['read-graduate-3']).toBeDefined();
    expect(BADGES['read-graduate-4']).toBeDefined();

    render(
      <BadgesScreen
        owned={['bookworm-1', 'story-detective']}
        states={{}}
        streakBest={3}
        streakCurrent={2}
        nextId="r1-u1-m1"
        grade={1}
        activeTrack="read"
        onBack={() => {}}
      />,
    );

    expect(screen.getByText('Reading Level 1')).toBeInTheDocument();
    expect(screen.getByText('Unit 1')).toBeInTheDocument();
  });
});
