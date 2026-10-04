import type { ContentModule } from '../types';

export const bodyAndSenses: ContentModule = {
  id: 's1-u2-m1',
  unitId: 's1-u2',
  grade: 1,
  title: 'Body and Senses',
  icon: '👂',
  prereq: ['s1-u1-m1'],
  skills: ['sci-senses'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['clue-tap', 'choose-text'],
  visuals: ['evidence-text'],
  vocab: ['eye', 'ear', 'hear', 'nose', 'smell', 'skin', 'feel', 'hot', 'cold', 'look'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Eyes see and ears hear.',
      visual: {
        kind: 'evidence-text',
        title: 'See and hear',
        sentences: ['Eyes take in the bright lamp.', 'Ears take in the drum.'],
      },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Look at the picture.',
      visual: {
        kind: 'evidence-text',
        title: 'Which part',
        sentences: ['Someone uses one body part.', 'Match the part to the job.'],
      },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Skin feels hot or cold.',
      visual: {
        kind: 'evidence-text',
        title: 'Five ways',
        sentences: ['Eyes see, ears hear, the nose smells, the tongue tastes, and skin feels.'],
      },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'clue-tap',
      skill: 'sci-senses',
      params: { s: [0, 4] },
      answer: () => 1,
      text: () => 'Which sentence shows the sense?',
      visual: (p) => {
        const stories = [
          {
            title: 'Loud drum',
            sentences: ['The room was quiet.', 'Dewi covers her ears when the drum is loud.'],
          },
          {
            title: 'Bright yard',
            sentences: ['The lamp is on.', 'Rudi shuts his eyes in the sunny yard.'],
          },
          {
            title: 'Warm soup',
            sentences: ['Soup is on the table.', 'Siti sniffs and says it smells good.'],
          },
          {
            title: 'Sweet mango',
            sentences: ['The mango is cut.', 'Leo tastes the sweet piece.'],
          },
          {
            title: 'Hot pan',
            sentences: ['The stove is on.', 'Ana pulls her hand back from the hot pan.'],
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
      skill: 'sci-senses',
      params: { c: [0, 4] },
      answer: () => 0,
      text: (p) => {
        const stories = [
          'A bird sings outside. Which body part hears it?',
          'A rainbow is in the sky. Which body part sees it?',
          'Cookies bake in the oven. Which body part smells them?',
          'Honey is on the spoon. Which body part tastes it?',
          'Ice is in the hand. Which body part feels the cold?',
        ];
        return stories[p.c as number] ?? '';
      },
      options: (p) => {
        const list = [
          ['Ears', 'Eyes', 'Nose', 'Knees'],
          ['Eyes', 'Ears', 'Tongue', 'Elbows'],
          ['Nose', 'Ears', 'Toes', 'Hair'],
          ['Tongue', 'Ears', 'Nose', 'Knees'],
          ['Skin', 'Hair', 'Ears', 'Eyes'],
        ];
        return list[p.c as number] ?? ['A', 'B', 'C', 'D'];
      },
    },
  ],
};
