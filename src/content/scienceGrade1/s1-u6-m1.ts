import type { ContentModule } from '../types';

export const howAnimalsMove: ContentModule = {
  id: 's1-u6-m1',
  unitId: 's1-u6',
  grade: 1,
  title: 'How Animals Move',
  icon: '🐦',
  prereq: ['s1-u5-m1'],
  skills: ['sci-move'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['clue-tap', 'choose-text'],
  visuals: ['evidence-text'],
  vocab: ['bird', 'fly', 'fish', 'swim', 'hop', 'crawl'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'A bird can fly.',
      visual: {
        kind: 'evidence-text',
        title: 'In the air',
        sentences: ['A bird opens its wings.', 'It moves through the air.'],
      },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Look at the picture.',
      visual: {
        kind: 'evidence-text',
        title: 'How it goes',
        sentences: ['See the animal.', 'See how its body moves.'],
      },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'A fish can swim.',
      visual: {
        kind: 'evidence-text',
        title: 'Many ways',
        sentences: ['Birds fly, fish swim, frogs hop, and worms crawl.'],
      },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'clue-tap',
      skill: 'sci-move',
      params: { s: [0, 4] },
      answer: () => 1,
      text: () => 'Which sentence shows how it moves?',
      visual: (p) => {
        const stories = [
          {
            title: 'Above the trees',
            sentences: ['The sky is clear.', 'The bird flaps its wings and flies.'],
          },
          {
            title: 'In the pond',
            sentences: ['The water is cool.', 'The fish wiggles and swims along.'],
          },
          {
            title: 'On the path',
            sentences: ['The grass is wet.', 'The frog hops from pad to pad.'],
          },
          {
            title: 'On the log',
            sentences: ['The log is damp.', 'The worm crawls slowly across it.'],
          },
          {
            title: 'By the gate',
            sentences: ['The yard is open.', 'The dog runs on four legs.'],
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
      skill: 'sci-move',
      params: { c: [0, 4] },
      answer: () => 0,
      text: (p) => {
        const stories = [
          'A sparrow leaves the branch. How does it move?',
          'A goldfish is in the bowl. How does it move?',
          'A frog is by the pond. How does it move?',
          'A worm is on the soil. How does it move?',
          'A puppy chases a ball. How does it move?',
        ];
        return stories[p.c as number] ?? '';
      },
      options: (p) => {
        const list = [
          ['It flies', 'It swims', 'It melts', 'It sinks'],
          ['It swims', 'It flies', 'It blooms', 'It reads'],
          ['It hops', 'It flies', 'It sinks', 'It melts'],
          ['It crawls', 'It flies', 'It hops high', 'It swims'],
          ['It runs', 'It flies', 'It swims', 'It melts'],
        ];
        return list[p.c as number] ?? ['A', 'B', 'C', 'D'];
      },
    },
  ],
};
