import type { ContentModule } from '../types';

export const whereDoesItHappen: ContentModule = {
  id: 'r1-u1-m2',
  unitId: 'r1-u1',
  grade: 1,
  title: 'Where is It?',
  icon: '🏡',
  prereq: ['r1-u1-m1'],
  skills: ['read-where'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['clue-tap', 'choose-text'],
  visuals: ['evidence-text'],
  vocab: ['kitchen', 'farm', 'pond', 'grass', 'house', 'lake', 'room'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'A story tells where things happen.',
      visual: {
        kind: 'evidence-text',
        title: 'Budi at School',
        sentences: ['Budi walked into the school.', 'He sat at his wooden desk.'],
      },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Look for words that tell the place.',
      visual: {
        kind: 'evidence-text',
        title: 'Morning Song',
        sentences: ['The little bird sings high in the tree.'],
      },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'In the garden tells WHERE.',
      visual: {
        kind: 'evidence-text',
        title: 'Where?',
        sentences: ['Dewi found a stone in the garden.'],
      },
      action: 'watch',
      caption: 'in the garden',
    },
  ],

  rules: [
    {
      type: 'clue-tap',
      skill: 'read-where',
      params: { s: [0, 4] },
      answer: () => 1, // kalimat kedua memuat lokasi
      text: () => 'Which sentence tells WHERE this happens?',
      visual: (p) => {
        const stories = [
          {
            title: 'Cookie Time',
            sentences: ['Mom bakes warm sweet cookies.', 'She puts them on the kitchen table.'],
          },
          {
            title: 'Swim Fast',
            sentences: ['Two ducks paddle and splash.', 'They swim together in the cool lake.'],
          },
          {
            title: 'Barn Animals',
            sentences: ['The white sheep eats green grass.', 'The sheep lives on a big farm.'],
          },
          {
            title: 'Sleepy Cat',
            sentences: ['Fluffy curls up for a nap.', 'The cat sleeps on the soft sofa.'],
          },
          {
            title: 'Camp Fire',
            sentences: ['The stars sparkle in the sky.', 'The kids roast snacks by the camp tent.'],
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
      skill: 'read-where',
      params: { c: [0, 4] },
      answer: () => 0,
      text: (p) => {
        const stories = [
          'Rudi builds a sand castle on the sunny beach.',
          'Siti eats a red apple in the quiet library.',
          'A brown rabbit hides inside the dark cave.',
          'Budi finds colorful shells on the sandy island.',
          'Dewi rides her shiny bicycle in the city park.',
        ];
        return `${stories[p.c as number]} Where does this happen?`;
      },
      options: (p) => {
        const list = [
          ['On the beach', 'In the car', 'At school', 'In bed'],
          ['In the library', 'On a boat', 'At the park', 'In the lake'],
          ['Inside the cave', 'On the roof', 'In the tree', 'At the shop'],
          ['On the island', 'At the doctor', 'In a plane', 'Inside a bus'],
          ['In the city park', 'At the dentist', 'In the train', 'On the bridge'],
        ];
        return list[p.c as number] ?? ['Tempat A', 'B', 'C', 'D'];
      },
    },
  ],
};
