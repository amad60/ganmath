/** Cerita ketuk-kalimat. `clue` adalah indeks sebelum urutan diacak di generator. */
export type ClueStory = {
  title: string;
  sentences: string[];
  clue: number;
  ask: string;
};

export function clueAnswer(stories: readonly ClueStory[], index: number): number {
  return stories[index]?.clue ?? 0;
}

export function clueAsk(stories: readonly ClueStory[], index: number): string {
  return stories[index]?.ask ?? '';
}

export function clueVisual(stories: readonly ClueStory[], index: number) {
  const story = stories[index] ?? stories[0];
  return {
    kind: 'evidence-text' as const,
    title: story?.title,
    sentences: [...(story?.sentences ?? [])],
  };
}
