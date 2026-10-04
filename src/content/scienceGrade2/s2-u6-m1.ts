import type { ContentModule } from '../types';

export const magnetsPull: ContentModule = {
  id: 's2-u6-m1',
  unitId: 's2-u6',
  grade: 2,
  title: 'Magnets',
  icon: '🧲',
  prereq: ['s2-u5-m1'],
  skills: ['sci-magnet'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['clue-tap', 'choose-text'],
  visuals: ['evidence-text'],
  vocab: ['magnet', 'pull', 'metal', 'clip', 'wood'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'A magnet pulls a metal clip.',
      visual: {
        kind: 'evidence-text',
        title: 'The clip jumps',
        sentences: ['The clip is metal.', 'The magnet pulls it across the table.'],
      },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Look at the picture.',
      visual: {
        kind: 'evidence-text',
        title: 'Near it',
        sentences: ['See what is near the magnet.', 'See if it moves.'],
      },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'A magnet pulls metal only.',
      visual: {
        kind: 'evidence-text',
        title: 'Not wood',
        sentences: ['Metal moves to the magnet. Wood stays where it is.'],
      },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'clue-tap',
      skill: 'sci-magnet',
      params: { s: [0, 4] },
      answer: () => 1,
      text: () => 'Which sentence shows what the magnet does?',
      visual: (p) => {
        const stories = [
          {
            title: 'On the table',
            sentences: ['The clip is on the table.', 'The magnet pulls the metal clip.'],
          },
          {
            title: 'The spoon',
            sentences: ['The spoon is metal.', 'The magnet pulls the spoon up.'],
          },
          {
            title: 'Wood block',
            sentences: ['The wood block is near.', 'The magnet does not pull the wood.'],
          },
          {
            title: 'A leaf',
            sentences: ['A leaf falls close.', 'The magnet does not pull the leaf.'],
          },
          {
            title: 'A pin',
            sentences: ['The pin is small.', 'The magnet pulls the metal pin.'],
          },
        ];
        return {
          kind: 'evidence-text',
          title: stories[p.s as number]?.title,
          sentences: stories[p.s as number]?.sentences ?? [],
        };
      },
    },
    {
      type: 'choose-text',
      skill: 'sci-magnet',
      params: { c: [0, 4] },
      answer: () => 0,
      text: (p) => {
        const stories = [
          'A magnet is held near a metal clip. What happens?',
          'A magnet is held near a wood block. What happens?',
          'Which thing can a magnet pull?',
          'Which thing does a magnet not pull?',
          'Why does the clip move to the magnet?',
        ];
        return stories[p.c as number] ?? '';
      },
      options: (p) => {
        const list = [
          ['It pulls the clip', 'It melts the clip', 'It freezes the clip', 'The clip is wood'],
          ['It does not pull the wood', 'It pulls the wood', 'The wood melts', 'The wood sprouts'],
          ['A metal clip', 'A dry leaf', 'A cup of water', 'A nest'],
          ['Wood', 'A metal pin', 'A metal spoon', 'A metal clip'],
          ['The clip is metal', 'The clip is water', 'The clip is a seed', 'The clip is cold'],
        ];
        return list[p.c as number] ?? ['A', 'B', 'C', 'D'];
      },
    },
  ],
};
