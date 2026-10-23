// Inline transition timings. Panels keep their own curves in SLIDE_OUT.
export const MOTION = {
  FAST_MS: 150,
  BASE_MS: 200,
  SLOW_MS: 300,
  EASE: 'ease',
  EASE_OUT: 'ease-out',
  EASE_STANDARD: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const;
