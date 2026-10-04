import type { ContentModule } from '../types';

export const pushAndPull: ContentModule = {
  id: 's1-u8-m1',
  unitId: 's1-u8',
  grade: 1,
  title: 'Push and Pull',
  icon: '🚪',
  prereq: ['s1-u7-m1'],
  skills: ['sci-push-pull'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['clue-tap', 'choose-text'],
  visuals: ['evidence-text'],
  vocab: ['move', 'pull', 'bring'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'A push moves a box away.',
      visual: {
        kind: 'evidence-text',
        title: 'Away it goes',
        sentences: ['Hands press on the box.', 'The box slides away.'],
      },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Look at the picture.',
      visual: {
        kind: 'evidence-text',
        title: 'Which way',
        sentences: ['See the hands.', 'See which way the thing goes.'],
      },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'A pull brings it to you.',
      visual: {
        kind: 'evidence-text',
        title: 'Two moves',
        sentences: ['A push sends it away. A pull brings it closer.'],
      },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'clue-tap',
      skill: 'sci-push-pull',
      params: { s: [0, 4] },
      answer: () => 1,
      text: () => 'Which sentence shows the push or pull?',
      visual: (p) => {
        const stories = [
          {
            title: 'The door',
            sentences: ['Rudi stands by the door.', 'He pushes the door away from him.'],
          },
          {
            title: 'The wagon',
            sentences: ['The wagon has a handle.', 'Lina pulls the wagon toward her.'],
          },
          {
            title: 'The swing',
            sentences: ['Ana sits on the swing.', 'Dad gives the swing a push.'],
          },
          {
            title: 'The drawer',
            sentences: ['The drawer is shut.', 'Siti pulls the drawer open.'],
          },
          {
            title: 'The cart',
            sentences: ['The cart is full.', 'Budi pushes the cart across the room.'],
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
      skill: 'sci-push-pull',
      params: { c: [0, 4] },
      answer: () => 0,
      text: (p) => {
        const stories = [
          'Hands press the box and it slides away. What is that?',
          'You tug the wagon toward you. What is that?',
          'Dad sends the swing forward. What did he do?',
          'Siti tugs the drawer toward her body. What is that?',
          'Budi presses the cart and it rolls off. What is that?',
        ];
        return stories[p.c as number] ?? '';
      },
      options: (p) => {
        const list = [
          ['A push', 'A pull', 'A melt', 'A swim'],
          ['A pull', 'A push', 'A hop', 'A fly'],
          ['A push', 'A pull', 'A smell', 'A root'],
          ['A pull', 'A push', 'A night', 'A cloud'],
          ['A push', 'A pull', 'A flower', 'A whisper'],
        ];
        return list[p.c as number] ?? ['A', 'B', 'C', 'D'];
      },
    },
  ],
};
