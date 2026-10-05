import type { ContentModule } from '../types';

export const howToFollowSteps: ContentModule = {
  id: 'r3-u1-m1',
  unitId: 'r3-u1',
  grade: 3,
  title: 'Follow the Steps',
  icon: '📋',
  prereq: [],
  skills: ['read-instructions'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['clue-tap', 'choose-text'],
  visuals: ['evidence-text'],
  vocab: ['recipe', 'instructions', 'step', 'mix', 'bake', 'prepare', 'caution', 'before', 'last'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Informational texts give clear step-by-step directions.',
      visual: {
        kind: 'evidence-text',
        title: 'Banana Smoothie Steps',
        sentences: [
          'Step 1: Peel one ripe banana.',
          'Step 2: Add half cup of milk.',
          'Step 3: Blend for thirty seconds.',
        ],
      },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Tap the step before the last one.',
      visual: {
        kind: 'evidence-text',
        title: 'Fruit Cup',
        sentences: [
          'Wash the apple in clean water.',
          'Cut the apple into small pieces.',
          'Put the pieces in a cup.',
        ],
      },
      action: 'tap-clue',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'Ingredients tell what you need; steps tell what to do.',
      visual: {
        kind: 'evidence-text',
        title: 'Recipe Anatomy',
        sentences: ['Ingredients: list of items. Directions: list of actions.'],
      },
      action: 'watch',
      caption: 'items ➔ actions',
    },
  ],

  rules: [
    {
      type: 'clue-tap',
      skill: 'read-instructions',
      params: { s: [0, 7] },
      answer: () => 1, // kalimat kedua adalah langkah aksi yang ditanyakan
      text: () => 'Which sentence tells what to do BEFORE the final step?',
      visual: (p) => {
        const stories = [
          {
            title: 'Planting Seeds',
            sentences: ['First poke a shallow hole in soil.', 'Drop two seeds gently inside.', 'Pat the soil down and water lightly.'],
          },
          {
            title: 'Paper Airplane',
            sentences: ['Fold the paper sheet in half lengthwise.', 'Crease both top corners into center triangles.', 'Fold wings down flat.'],
          },
          {
            title: 'Washing Hands',
            sentences: ['Turn on the warm water tap.', 'Lather hands with soap for twenty seconds.', 'Rinse clean and dry with paper towel.'],
          },
          {
            title: 'Making Lemonade',
            sentences: ['Squeeze three juicy lemons into a pitcher.', 'Stir in two spoonfuls of sugar until dissolved.', 'Pour cold water and ice cubes.'],
          },
          {
            title: 'Cleaning Paint Brushes',
            sentences: ['Wipe excess wet paint onto scrap paper.', 'Swirl bristles in warm soapy water bowl.', 'Lay flat on clean towel to dry.'],
          },
          {
            title: 'Boiling Eggs',
            sentences: ['Set the eggs in a pot of water.', 'Heat the pot until the water boils.', 'Cool the eggs, then peel the shells.'],
          },
          {
            title: 'Brushing Teeth',
            sentences: ['Put toothpaste on the brush.', 'Brush every tooth in small circles.', 'Rinse and put the brush away.'],
          },
          {
            title: 'Mailing a Letter',
            sentences: ['Write the address on the envelope.', 'Stick a stamp on the top corner.', 'Drop the letter in the mailbox.'],
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
      skill: 'read-instructions',
      params: { c: [0, 7] },
      answer: () => 0,
      text: (p) => {
        const stories = [
          'Step 1: Preheat oven. Step 2: Mix batter. Step 3: Pour into pan. Step 4: Bake 20 minutes. What must you do right AFTER mixing batter?',
          'Step 1: Put on socks. Step 2: Slide feet into sneakers. Step 3: Tie laces in a knot. What happens right BEFORE tying laces?',
          'Step 1: Cut cardboard shapes. Step 2: Glue them together. Step 3: Let glue dry. Step 4: Paint colors. When should you paint colors?',
          'Step 1: Turn off power switch. Step 2: Unplug cord from wall. Step 3: Clean dust with cloth. What is the very FIRST safety rule?',
          'Step 1: Scoop two spoons of tea leaves. Step 2: Pour boiling water. Step 3: Steep for 4 minutes. How long do you steep the tea?',
          'Step 1: Put the eggs in water. Step 2: Heat until boiling. Step 3: Peel the shells. What happens right AFTER the water boils?',
          'Step 1: Write the address. Step 2: Stick the stamp. Step 3: Mail the letter. What must you do BEFORE the stamp?',
          'Step 1: Add toothpaste. Step 2: Brush in circles. Step 3: Rinse. What is the last step?',
        ];
        return stories[p.c as number] ?? '';
      },
      options: (p) => {
        const list = [
          ['Pour into pan', 'Bake 20 minutes', 'Preheat oven', 'Wash the bowl'],
          ['Slide feet into sneakers', 'Tie laces', 'Take off socks', 'Run outside'],
          ['After the glue is dry', 'Before cutting shapes', 'While gluing', 'First thing'],
          ['Turn off power switch', 'Plug in cord', 'Wipe with water', 'Check the fuse'],
          ['For 4 minutes', 'For 1 minute', 'For 20 minutes', 'All afternoon'],
          ['Peel the shells', 'Put the eggs in water', 'Throw the pot away', 'Add sugar'],
          ['Write the address', 'Mail the letter', 'Stick the stamp', 'Buy a new pen'],
          ['Rinse', 'Add toothpaste', 'Brush in circles', 'Open the tap first'],
        ];
        return list[p.c as number] ?? ['A', 'B', 'C', 'D'];
      },
    },
  ],
};
