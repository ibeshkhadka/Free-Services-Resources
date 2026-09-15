import React from 'react';

import { toneOf } from './categoryTone';

interface IconTileProps {
  /** Emoji/symbol or the first letters of a name */
  glyph: string;
  size?: 'sm' | 'md' | 'lg';
  /** Category color name — tints the tile with that hue */
  color?: string;
}

const sizes = {
  sm: 'h-8 w-8 text-xs rounded-md',
  md: 'h-10 w-10 text-sm rounded-md',
  lg: 'h-14 w-14 text-xl rounded-lg',
} as const;

/** Monogram tile — one implementation instead of three divergent ones. */
export const IconTile: React.FC<IconTileProps> = ({ glyph, size = 'md', color }) => {
  const tone = color ? toneOf(color) : null;
  return (
    <div
      aria-hidden="true"
      className={`flex shrink-0 select-none items-center justify-center font-medium ${
        tone ? `${tone.bg} ${tone.text}` : 'border border-hairline bg-surface text-ink'
      } ${sizes[size]}`}
    >
      {glyph}
    </div>
  );
};
