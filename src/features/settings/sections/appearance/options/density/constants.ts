/** Density preview–only constants; shared density values stay in appearance/constants. */
export const DENSITY_PREVIEW_KEYFRAMES = `
  @keyframes densityPreviewFadeIn {
    from { opacity: 0; transform: translateY(-4px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

export const DENSITY_PREVIEW_BOX = {
  WIDTH: 144,
  HEIGHT: 160,
} as const;

export const DENSITY_PREVIEW_SAMPLES = {
  names: ['Alex M.', 'Jordan L.'],
  roles: ['Admin', 'Editor'],
} as const;

export const PREVIEW_ROW_COUNT = DENSITY_PREVIEW_SAMPLES.names.length;
