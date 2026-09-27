import type { ContentModule } from '../types';

export const factVsOpinion: ContentModule = {
  id: 'r2-u2-m1',
  unitId: 'r2-u2',
  grade: 2,
  title: 'Fact or Feeling?',
  icon: '⚖️',
  prereq: ['r2-u1-m1'],
  skills: ['read-fact-opinion'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['clue-tap', 'choose-text'],
  visuals: ['evidence-text'],
  vocab: ['fact', 'opinion', 'true', 'feeling', 'prove', 'best'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'A fact is always true and can be proven.',
      visual: {
        kind: 'evidence-text',
        title: 'Cats',
        sentences: ['Cats have four paws.', 'Cats are the cutest animals in the world.'],
      },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'An opinion tells what someone thinks or feels.',
      visual: {
        kind: 'evidence-text',
        title: 'Fact vs Opinion',
        sentences: [
          'Fact: Spiders have eight legs.',
          'Opinion: Spiders are super scary.',
        ],
      },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Words like best, cute, and delicious show opinions.',
      visual: {
        kind: 'evidence-text',
        title: 'Look for Clues',
        sentences: ['Ice cream is cold (fact). Ice cream is the best snack (opinion).'],
      },
      action: 'watch',
      caption: 'fact vs opinion',
    },
  ],

  rules: [
    {
      type: 'clue-tap',
      skill: 'read-fact-opinion',
      params: { s: [0, 7] },
      answer: () => 0, // kalimat pertama adalah FAKTA
      text: () => 'Which sentence is a true FACT that can be proven?',
      visual: (p) => {
        const stories = [
          {
            title: 'Sunlight',
            sentences: ['The sun rises in the east every morning.', 'Sunsets are the prettiest thing to watch.'],
          },
          {
            title: 'Frogs',
            sentences: ['Tadpoles hatch from eggs in water.', 'Frogs make the funniest croaking noises.'],
          },
          {
            title: 'Apples',
            sentences: ['Apples grow on wooden branches of trees.', 'Apple pie is the tastiest dessert ever.'],
          },
          {
            title: 'Dogs',
            sentences: ['Dogs belong to the canine animal family.', 'Puppies are much better pets than cats.'],
          },
          {
            title: 'Bicycle',
            sentences: ['A bicycle moves on two rolling wheels.', 'Riding bikes is the most exciting sport.'],
          },
          {
            title: 'Rain',
            sentences: ['Rain is water that falls from clouds.', 'Rainy days are the coziest days.'],
          },
          {
            title: 'Moon',
            sentences: ['The moon orbits the Earth.', 'The moon is the loveliest night light.'],
          },
          {
            title: 'Books',
            sentences: ['A book is made of pages and a cover.', 'Mystery books are the best stories.'],
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
      skill: 'read-fact-opinion',
      params: { c: [0, 7] },
      answer: () => 0,
      text: (p) => {
        const stories = [
          'Which statement about dogs is an OPINION?',
          'Which statement about winter is an OPINION?',
          'Which statement about pizza is an OPINION?',
          'Which statement about books is an OPINION?',
          'Which statement about rain is a true FACT?',
          'Which statement about cats is an OPINION?',
          'Which statement about the ocean is a true FACT?',
          'Which statement about soccer is an OPINION?',
        ];
        return stories[p.c as number] ?? '';
      },
      options: (p) => {
        const list = [
          ['Dogs are the friendliest animals', 'Dogs can bark', 'Dogs have four legs', 'Dogs drink water'],
          ['Winter is too cold and boring', 'Snow falls in winter', 'Water freezes at zero degrees', 'Winter comes after fall'],
          ['Pizza is the most delicious food', 'Pizza dough is baked', 'Cheese melts on hot pizza', 'Pizza crust has flour'],
          ['Comic books are better than novels', 'Books have paper pages', 'Libraries store many books', 'Authors write books'],
          ['Rain clouds carry tiny water drops', 'Rain is always depressing', 'Puddles are the best to jump in', 'Rainy days are boring'],
          ['Cats are nicer than dogs', 'Cats have whiskers', 'Cats can purr', 'Cats drink water'],
          ['The ocean is a large body of salt water', 'The ocean is the prettiest place', 'Beaches are boring', 'Waves are the most fun'],
          ['Soccer is the greatest sport', 'Soccer is played with a ball', 'A match has two teams', 'Players kick the ball'],
        ];
        return list[p.c as number] ?? ['A', 'B', 'C', 'D'];
      },
    },
  ],
};
