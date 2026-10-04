import type { ContentModule } from '../types';

export const lookAfterThem: ContentModule = {
  id: 's1-u10-m1',
  unitId: 's1-u10',
  grade: 1,
  title: 'Look After Living Things',
  icon: '💚',
  prereq: ['s1-u9-m1'],
  skills: ['sci-care'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['clue-tap', 'choose-text'],
  visuals: ['evidence-text'],
  vocab: ['help', 'pet', 'gentle', 'kind', 'hand'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Help a plant to live.',
      visual: {
        kind: 'evidence-text',
        title: 'A drink',
        sentences: ['The pot is dry.', 'Mira gives the plant water.'],
      },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Look at the picture.',
      visual: {
        kind: 'evidence-text',
        title: 'A kind act',
        sentences: ['See the living thing.', 'See the helpful act.'],
      },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Kind hands help a pet.',
      visual: {
        kind: 'evidence-text',
        title: 'Care',
        sentences: ['Give water, give food, and use gentle hands.'],
      },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'clue-tap',
      skill: 'sci-care',
      params: { s: [0, 4] },
      answer: () => 1,
      text: () => 'Which sentence shows good care?',
      visual: (p) => {
        const stories = [
          {
            title: 'Dry pot',
            sentences: ['The leaves droop.', 'Lina pours water on the soil.'],
          },
          {
            title: 'Empty bowl',
            sentences: ['The puppy waits.', 'Budi puts food in the bowl.'],
          },
          {
            title: 'Soft hands',
            sentences: ['The kitten is small.', 'Siti pets it with gentle hands.'],
          },
          {
            title: 'The park',
            sentences: ['Paper is on the grass.', 'Rudi picks the paper up.'],
          },
          {
            title: 'Fresh air',
            sentences: ['The bird bath is empty.', 'Dewi fills it with clean water.'],
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
      skill: 'sci-care',
      params: { c: [0, 4] },
      answer: () => 0,
      text: (p) => {
        const stories = [
          'The plant looks dry. What is good care?',
          'The puppy bowl is empty. What is good care?',
          'The kitten is small. How should you touch it?',
          'Paper is on the grass. What is good care?',
          'The bird bath is empty. What is good care?',
        ];
        return stories[p.c as number] ?? '';
      },
      options: (p) => {
        const list = [
          ['Give it water', 'Hide the pot', 'Pick the leaves off', 'Shout at it'],
          ['Give it food', 'Take the bowl', 'Close the door', 'Ignore it'],
          ['Gentle hands', 'A hard hit', 'A loud drum', 'A strong pull'],
          ['Pick it up', 'Add more paper', 'Bury the grass', 'Kick it'],
          ['Fill it with water', 'Empty it more', 'Cover it', 'Tip it over'],
        ];
        return list[p.c as number] ?? ['A', 'B', 'C', 'D'];
      },
    },
  ],
};
