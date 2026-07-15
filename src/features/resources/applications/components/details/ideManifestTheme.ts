/**
 * Editor chrome for manifest JSON/YAML. The shell (bg/border/gutter) follows the
 * app's dark surfaces so the reader belongs to this product; only the syntax
 * tokens stay VS Code Dark Modern–inspired, since those hues carry meaning.
 */
export const IDE_MANIFEST_THEME = {
  bg: '#111827',
  border: '#2a3648',
  gutterText: '#4b5563',
  headerBg: '#161f2e',
  text: '#d4d4d4',
  key: '#9cdcfe',
  string: '#ce9178',
  number: '#b5cea8',
  keyword: '#569cd6',
  punct: '#d4d4d4',
  comment: '#6a9955',
  copyButton: '#c8c8c8',
} as const;
