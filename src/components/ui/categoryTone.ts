interface Tone {
  text: string;
  bg: string;
  border: string;
}

/** Static class map so Tailwind can see every variant at build time. */
const tones: Record<string, Tone> = {
  emerald: { text: 'text-hue-emerald', bg: 'bg-hue-emerald-soft', border: 'border-hue-emerald' },
  indigo: { text: 'text-hue-indigo', bg: 'bg-hue-indigo-soft', border: 'border-hue-indigo' },
  purple: { text: 'text-hue-purple', bg: 'bg-hue-purple-soft', border: 'border-hue-purple' },
  amber: { text: 'text-hue-amber', bg: 'bg-hue-amber-soft', border: 'border-hue-amber' },
  blue: { text: 'text-hue-blue', bg: 'bg-hue-blue-soft', border: 'border-hue-blue' },
};

/** Map a Category.color to its tone; unknown/custom values fall back to blue. */
export const toneOf = (color?: string): Tone =>
  tones[(color || '').toLowerCase()] ?? tones.blue;

export const toneClasses = (color: string | undefined, kind: keyof Tone): string =>
  toneOf(color)[kind];
