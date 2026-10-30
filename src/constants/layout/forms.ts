import type { CSSProperties } from 'react';
import { FONT_SIZE } from './fonts';

// Every field error: antd's help line (the form config in App.tsx) and FieldError alike. The message
// keeps the surface's text color and a red X goes before it (antd.css): red text fails on the dark card.
// A field warning is the same line with an amber mark.
export const FIELD_ERROR = {
  CLASS: 'tk-field-error',
  WARNING_CLASS: 'tk-field-warning',
  STYLE: { color: 'var(--ant-color-text)', fontSize: FONT_SIZE.SM } satisfies CSSProperties,
} as const;
