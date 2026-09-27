import type { ContentModule } from '../types';

export const characterFeelings: ContentModule = {
  id: 'r2-u3-m1',
  unitId: 'r2-u3',
  grade: 2,
  title: 'Character Feelings',
  icon: '🎭',
  prereq: ['r2-u2-m1'],
  skills: ['read-character-feelings'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['clue-tap', 'choose-text'],
  visuals: ['evidence-text'],
  vocab: ['proud', 'nervous', 'excited', 'disappointed', 'cheered', 'clenched'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Characters show feelings through actions.',
      visual: {
        kind: 'evidence-text',
        title: 'Spilled Juice',
        sentences: ['Siti dropped her orange juice glass.', 'She covered her face and sighed softly.'],
      },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Actions and words give clues to feelings.',
      visual: {
        kind: 'evidence-text',
        title: 'Action ➔ Emotion',
        sentences: [
          'Smiling and jumping = Excited!',
          'Trembling knees and quiet voice = Nervous.',
        ],
      },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Authors show emotions instead of just telling.',
      visual: {
        kind: 'evidence-text',
        title: 'Show, Don\'t Tell',
        sentences: ['Budi leaped into the air and cheered with two thumbs up!'],
      },
      action: 'watch',
      caption: 'cheered ➔ joyful',
    },
  ],

  rules: [
    {
      type: 'clue-tap',
      skill: 'read-character-feelings',
      params: { s: [0, 4] },
      answer: () => 1, // kalimat kedua memuat aksi penunjuk emosi
      text: () => 'Which sentence shows HOW the character feels?',
      visual: (p) => {
        const stories = [
          {
            title: 'Stage Time',
            sentences: ['The school play curtains opened wide.', 'Ana tapped her fidgeting fingers and swallowed nervously.'],
          },
          {
            title: 'Lost Toy',
            sentences: ['Rudi searched under the couch.', 'He slouched on the floor with teary eyes.'],
          },
          {
            title: 'Gold Medal',
            sentences: ['Timi crossed the finish line first.', 'He beamed with a giant grin and pumped his fists high.'],
          },
          {
            title: 'Thunderstorm',
            sentences: ['Lightning flashed bright outside.', 'Dewi pulled the heavy blanket up over her trembling chin.'],
          },
          {
            title: 'Puppy Gift',
            sentences: ['Dad carried a ribboned cardboard box.', 'Budi squealed in delight and bounced up and down.'],
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
      skill: 'read-character-feelings',
      params: { c: [0, 4] },
      answer: () => 0,
      text: (p) => {
        const stories = [
          'Dewi looked at her shiny spelling trophy on the desk and smiled warmly. How does Dewi feel?',
          'Leo bit his fingernails and paced back and forth in the waiting room. How does Leo feel?',
          'Budi stamped his foot, crossed his arms tight, and frowned at the broken robot. How does Budi feel?',
          'Mimi peeked around the tree, wagged her tail, and crept closer to the yarn ball. How does Mimi feel?',
          'Grandma closed her eyes, leaned back in the rocking chair, and breathed deeply. How does Grandma feel?',
        ];
        return stories[p.c as number] ?? '';
      },
      options: (p) => {
        const list = [
          ['Proud and accomplished', 'Sleepy and tired', 'Frightened and scared', 'Angry and upset'],
          ['Nervous or anxious', 'Joyful and laughing', 'Hungry', 'Bored'],
          ['Frustrated or angry', 'Excited', 'Peaceful', 'Shy'],
          ['Playful and curious', 'Sad', 'Terrified', 'Grumpy'],
          ['Relaxed and peaceful', 'Excited to dance', 'Worried', 'Curious'],
        ];
        return list[p.c as number] ?? ['A', 'B', 'C', 'D'];
      },
    },
  ],
};
