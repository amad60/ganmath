import type { ContentModule } from '../types';

export const mysteryClues: ContentModule = {
  id: 'r1-u4-m1',
  unitId: 'r1-u4',
  grade: 1,
  title: 'Mystery Clues',
  icon: '🕵️',
  prereq: ['r1-u3-m1'],
  skills: ['read-infer'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-text', 'clue-tap'],
  visuals: ['evidence-text'],
  vocab: ['mystery', 'hidden', 'whistle', 'clues', 'solve', 'infer', 'beach', 'look', 'means', 'guess', 'idea'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Look at the clues to solve the mystery.',
      visual: {
        kind: 'evidence-text',
        title: 'Who Am I?',
        sentences: ['I have soft white fur and long ears.', 'I hop on grass and love crunchy carrots.'],
      },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Tap the clue that shows the beach.',
      visual: {
        kind: 'evidence-text',
        title: 'Where Is Dewi?',
        sentences: [
          'Waves splashed on the sand by Dewi.',
          "She held Mom's hand.",
          'She smiled at Mom.',
        ],
      },
      action: 'tap-clue',
      target: 0,
    },
    {
      stage: 'abstract',
      prompt: 'Infer means use clues to guess.',
      visual: {
        kind: 'evidence-text',
        title: 'Smart Detective',
        sentences: ['Dark clouds and rumbling sky mean rain is coming soon.'],
      },
      action: 'watch',
      caption: 'clues ➔ idea',
    },
  ],

  rules: [
    {
      type: 'choose-text',
      skill: 'read-infer',
      params: { c: [0, 4] },
      answer: () => 0,
      text: (p) => {
        const stories = [
          'I wear a tall white hat and bake fresh bread every morning. Who am I?',
          'I have sharp teeth and swim fast in the ocean with my fin. What am I?',
          'I fly high in the sky with wings, and carry people across the world. What am I?',
          'I live in a beehive and make sweet yellow honey. What am I?',
          'I ring a loud siren and put out hot fires with water hoses. Who am I?',
        ];
        return stories[p.c as number] ?? '';
      },
      options: (p) => {
        const list = [
          ['A baker', 'A police officer', 'A pilot', 'A farmer'],
          ['A shark', 'A frog', 'A duck', 'A crab'],
          ['An airplane', 'A bird', 'A kite', 'A balloon'],
          ['A bee', 'A butterfly', 'An ant', 'A spider'],
          ['A firefighter', 'A teacher', 'A doctor', 'A builder'],
        ];
        return list[p.c as number] ?? ['A', 'B', 'C', 'D'];
      },
    },
    {
      type: 'clue-tap',
      skill: 'read-infer',
      params: { s: [0, 4] },
      answer: () => 1, // kalimat kedua berisi petunjuk kunci
      text: () => 'Which sentence gives the BEST clue?',
      visual: (p) => {
        const stories = [
          {
            title: 'Cold Weather',
            sentences: ['Ana opened the front door.', 'Snow covered the ground in white ice.', 'She walked to school.'],
          },
          {
            title: 'Birthday Surprise',
            sentences: ['Budi walked into the living room.', 'A chocolate cake with burning candles stood on the table.', 'Everyone smiled.'],
          },
          {
            title: 'At the Doctor',
            sentences: ['Rudi sat on the high paper bed.', 'The doctor checked his heartbeat with a stethoscope.', 'Rudi felt better.'],
          },
          {
            title: 'Bedtime',
            sentences: ['The stars twinkled outside.', 'Dewi yawned and put on her warm pajamas.', 'She hugged her teddy bear.'],
          },
          {
            title: 'Artist at Work',
            sentences: ['Timi cleaned his brushes.', 'Bright red and blue paints dried on the canvas.', 'He hung the picture.'],
          },
        ];
        return {
          kind: 'evidence-text',
          title: stories[p.s as number]?.title,
          sentences: stories[p.s as number]?.sentences ?? [],
        };
      },
    },
  ],
};
