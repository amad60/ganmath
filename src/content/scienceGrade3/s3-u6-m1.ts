import type { ContentModule } from '../types';

export const rampsAndLevers: ContentModule = {
  id: 's3-u6-m1',
  unitId: 's3-u6',
  grade: 3,
  title: 'Ramps and Levers',
  icon: '🪵',
  prereq: ['s3-u5-m1'],
  skills: ['sci-ramp'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['clue-tap', 'choose-text'],
  visuals: ['evidence-text'],
  vocab: ['ramp', 'help', 'heavy', 'lever', 'lift', 'rock'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'A ramp helps a heavy box.',
      visual: {
        kind: 'evidence-text',
        title: 'Up the step',
        sentences: ['The box is too heavy to lift.', 'She rolls it up the ramp.'],
      },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Look at the picture.',
      visual: {
        kind: 'evidence-text',
        title: 'The tool',
        sentences: ['See the heavy thing.', 'See what helps it move.'],
      },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'A lever can lift a rock.',
      visual: {
        kind: 'evidence-text',
        title: 'Two helpers',
        sentences: ['A ramp makes a push easier. A lever can lift what hands cannot.'],
      },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'clue-tap',
      skill: 'sci-ramp',
      params: { s: [0, 4] },
      answer: () => 1,
      text: () => 'Which sentence shows the ramp or the lever?',
      visual: (p) => {
        const stories = [
          {
            title: 'The step',
            sentences: ['The box is heavy.', 'The ramp helps her push it up.'],
          },
          {
            title: 'The rock',
            sentences: ['The rock is big.', 'A lever lifts the rock.'],
          },
          {
            title: 'Straight up',
            sentences: ['He cannot lift the box.', 'The ramp makes the move easier.'],
          },
          {
            title: 'The log',
            sentences: ['The log is the lever.', 'She pushes down and the rock goes up.'],
          },
          {
            title: 'A long ramp',
            sentences: ['The short ramp is steep.', 'A longer ramp makes the push easier.'],
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
      skill: 'sci-ramp',
      params: { c: [0, 4] },
      answer: () => 0,
      text: (p) => {
        const stories = [
          'A heavy box must go up a step. What helps?',
          'What can a lever do?',
          'Why use a ramp for a heavy box?',
          'She pushes the long end of a lever down. What happens to the rock?',
          'Which ramp makes the push easier?',
        ];
        return stories[p.c as number] ?? '';
      },
      options: (p) => {
        const list = [
          ['A ramp', 'A pale leaf', 'A dry pond', 'Thick fur'],
          ['Lift a rock', 'Make a leaf pale', 'Dry a pond', 'Fill a balloon with soil'],
          ['The push is easier', 'The box gets heavier', 'The box falls faster', 'The box turns to air'],
          ['It lifts up', 'It becomes air', 'It grows fur', 'It leaves the pond'],
          ['A long low ramp', 'A short steep ramp', 'A high step with no ramp', 'A rough wall'],
        ];
        return list[p.c as number] ?? ['A', 'B', 'C', 'D'];
      },
    },
  ],
};
