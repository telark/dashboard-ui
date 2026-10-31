import type { Rule } from 'antd/es/form';

// Control characters and format characters (zero-width, bidi marks, BOM).
const INVISIBLE = /[\p{Cc}\p{Cf}]/gu;
const INVISIBLE_KEEP_LINES = /(?![\t\n\r])[\p{Cc}\p{Cf}]/gu;

interface InputGuardOptions {
  /** The message for an empty or whitespace-only value; omit for an optional field. */
  required?: string;
  /** A text area: keeps line breaks and tabs, and shows the count. */
  multiline?: boolean;
}

// One typed field's guards: `normalize` and `rules` go on its Form.Item (or `normalize` in its
// onChange), `input` on the Input or TextArea, whose maxLength stops typing and cuts a paste.
export const inputGuard = (
  max: number,
  { required, multiline = false }: InputGuardOptions = {},
) => {
  const rules: Rule[] = required ? [{ required: true, whitespace: true, message: required }] : [];
  return {
    normalize: (value: string) => value.replace(multiline ? INVISIBLE_KEEP_LINES : INVISIBLE, ''),
    rules,
    input: { maxLength: max, showCount: multiline },
  };
};
