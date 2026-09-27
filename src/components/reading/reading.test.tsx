import { describe, expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EvidenceText } from './EvidenceText';
import { SequenceCards } from './SequenceCards';
import { whoIsInTheStory } from '../../content/readGrade1/r1-u1-m1';
import { whereDoesItHappen } from '../../content/readGrade1/r1-u1-m2';
import { orderOfEvents } from '../../content/readGrade1/r1-u2-m1';
import { whyDidItHappen } from '../../content/readGrade1/r1-u3-m1';
import { mainIdeaSummary } from '../../content/readGrade2/r2-u1-m1';
import { factVsOpinion } from '../../content/readGrade2/r2-u2-m1';
import { characterFeelings } from '../../content/readGrade2/r2-u3-m1';
import { howToFollowSteps } from '../../content/readGrade3/r3-u1-m1';
import { scienceAnimalClues } from '../../content/readGrade3/r3-u2-m1';

describe('Literasi Pemahaman Teks (Reading Mechanics)', () => {
  it('EvidenceText: anak bisa mengetuk kalimat sebagai bukti (clue-tap)', () => {
    let picked: number | null = null;
    const sentences = ['Mimi is a little cat.', 'Mimi sat by the tree.'];

    render(
      <EvidenceText
        title="Mimi Story"
        sentences={sentences}
        selectedIndex={picked}
        onSelect={(i) => {
          picked = i;
        }}
        interactive={true}
      />,
    );

    expect(screen.getByText('Mimi Story')).toBeInTheDocument();
    const firstSentenceBtn = screen.getByText('Mimi is a little cat.');
    expect(firstSentenceBtn).toBeInTheDocument();

    fireEvent.click(firstSentenceBtn);
    expect(picked).toBe(0);
  });

  it('SequenceCards: anak bisa mengubah urutan kartu alur cerita', () => {
    let updatedOrder: number[] = [0, 1, 2];
    const cards = [
      { text: 'Seed in pot', icon: '🌱' },
      { text: 'Water daily', icon: '💧' },
      { text: 'Flower blooms', icon: '🌻' },
    ];

    render(
      <SequenceCards
        cards={cards}
        onChange={(next) => {
          updatedOrder = next;
        }}
        interactive={true}
      />,
    );

    expect(screen.getByText('Seed in pot')).toBeInTheDocument();
    const moveDownButtons = screen.getAllByRole('button', { name: 'Move down' });
    expect(moveDownButtons.length).toBeGreaterThan(0);

    // Geser kartu pertama ke bawah
    fireEvent.click(moveDownButtons[0]!);
    expect(updatedOrder).toEqual([1, 0, 2]);
  });

  it('Modul-modul Read Grade 1, 2, dan 3 terdefinisi lengkap dengan rules dan stages CPA', () => {
    const modules = [
      whoIsInTheStory,
      whereDoesItHappen,
      orderOfEvents,
      whyDidItHappen,
      mainIdeaSummary,
      factVsOpinion,
      characterFeelings,
      howToFollowSteps,
      scienceAnimalClues,
    ];
    for (const m of modules) {
      expect(m.id).toMatch(/^[r](\d+)-/);
      expect(m.rules.length).toBeGreaterThanOrEqual(2);
      expect(m.learn.length).toBeGreaterThanOrEqual(3);
    }
  });
});
