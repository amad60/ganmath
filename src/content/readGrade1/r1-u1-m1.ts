import type { ContentModule } from '../types';

export const whoIsInTheStory: ContentModule = {
  id: 'r1-u1-m1',
  unitId: 'r1-u1',
  grade: 1,
  title: 'Who is Here?',
  icon: '🔍',
  prereq: [],
  skills: ['read-who'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['clue-tap', 'choose-text'],
  visuals: ['evidence-text'],
  vocab: ['cat', 'dog', 'park', 'tree', 'sat', 'ran', 'clue', 'sentence', 'who'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'A story tells who is here.',
      visual: {
        kind: 'evidence-text',
        title: 'Mimi the Cat',
        sentences: ['Mimi is a little cat.', 'Mimi sat by the tree.'],
      },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Tap the sentence that tells who.',
      visual: {
        kind: 'evidence-text',
        title: 'At the Park',
        sentences: [
          'The sun was warm.',
          'Budi kicked a red ball.',
          'The ball went far.',
        ],
      },
      action: 'tap-clue',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'The name tells who is in the story.',
      visual: {
        kind: 'evidence-text',
        title: 'Who is here?',
        sentences: ['Ana has a blue bag.'],
      },
      action: 'watch',
      caption: 'Ana',
    },
  ],

  rules: [
    {
      type: 'clue-tap',
      skill: 'read-who',
      params: { s: [0, 4] },
      answer: () => 0, // kalimat pertama yang menyebut nama tokoh
      text: () => 'Which sentence tells WHO is in the story?',
      visual: (p) => {
        const stories = [
          {
            title: 'In the Garden',
            sentences: ['Siti sits in the green garden.', 'The sun is warm and bright.'],
          },
          {
            title: 'At the Pond',
            sentences: ['Kiki the frog jumps on a leaf.', 'The water is cool and blue.'],
          },
          {
            title: 'In the Room',
            sentences: ['Rudi reads a big story book.', 'The clock ticks on the wall.'],
          },
          {
            title: 'Under the Tree',
            sentences: ['Timi the squirrel eats nuts.', 'The tall oak tree has green leaves.'],
          },
          {
            title: 'By the River',
            sentences: ['Boni the duck waddles in mud.', 'The river water flows smoothly.'],
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
      skill: 'read-who',
      params: { c: [0, 4] },
      answer: () => 0,
      text: (p) => {
        const stories = [
          'Koko the puppy barks at a butterfly.',
          'Dewi puts red apples into a basket.',
          'Leo the lion sleeps under a big tree.',
          'Milo the monkey swings from branch to branch.',
          'Rina waters yellow sunflowers in the morning.',
        ];
        return `${stories[p.c as number]} Who is in the story?`;
      },
      options: (p) => {
        const optionsList = [
          ['Koko the puppy', 'A butterfly', 'A flower', 'The tree'],
          ['Dewi', 'Apples', 'A basket', 'The park'],
          ['Leo the lion', 'A tree', 'A stone', 'The sun'],
          ['Milo the monkey', 'A branch', 'Leaves', 'The ground'],
          ['Rina', 'Sunflowers', 'The morning', 'Water'],
        ];
        return optionsList[p.c as number] ?? ['Tokoh', 'Benda', 'Tempat', 'Lain'];
      },
    },
  ],
};
