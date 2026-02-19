export const EMOJIS = ['🧸', '🐶', '🍎', '🚗', '🎈', '🌈', '🧩', '🦋', '⭐', '🍪'];

export interface ShapeChoice {
  id: string;
  name: string;
  emoji: string;
  hint: string;
}

export const SHAPE_CHOICES: ShapeChoice[] = [
  { id: 'triangle', name: 'Triangle', emoji: '🔺', hint: '3 sides' },
  { id: 'rectangle', name: 'Rectangle', emoji: '▭', hint: '4 sides' },
  { id: 'square', name: 'Square', emoji: '🟦', hint: '4 equal sides' },
];

export const MATH_ICONS = {
  PLUS: '+',
  MINUS: '−',
  EQUALS: '=',
};
