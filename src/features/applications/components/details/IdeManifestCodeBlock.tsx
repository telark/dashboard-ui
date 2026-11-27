import React, { memo, useMemo } from 'react';
import { MONOSPACE_CLASS, SPACING } from '../../../../constants';
import { APPLICATION_MANIFEST_VIEW } from '../../constants/sectionLayout';
import { IDE_MANIFEST_THEME as IDE } from './ideManifestTheme';

function readJsonStringEnd(input: string, start: number): number {
  let j = start + 1;
  while (j < input.length) {
    if (input[j] === '\\') {
      j += 2;
      continue;
    }
    if (input[j] === '"') return j + 1;
    j++;
  }
  return input.length;
}

type JsonTok = 'text' | 'key' | 'string' | 'number' | 'keyword' | 'punct';
// `at` is the token's offset in the input, so it also keys its span.
type JsonToken = { t: JsonTok; s: string; at: number };
type JsonState = { stack: Array<'object' | 'array'>; prevSig: string | null };

const JSON_KEYWORDS = ['true', 'false', 'null'];

const runEnd = (input: string, i: number, char: RegExp): number => {
  let j = i;
  while (j < input.length && char.test(input[j])) j++;
  return j;
};

// A string is a key when it opens an object entry: right after `{` or `,` inside an object.
function readJsonString(input: string, i: number, state: JsonState): JsonToken {
  const isKey = state.stack.at(-1) === 'object' && (state.prevSig === '{' || state.prevSig === ',');
  state.prevSig = '"';
  return { t: isKey ? 'key' : 'string', s: input.slice(i, readJsonStringEnd(input, i)), at: i };
}

function readJsonPunct(c: string, i: number, state: JsonState): JsonToken {
  if (c === '{') state.stack.push('object');
  else if (c === '[') state.stack.push('array');
  else if (c === '}' || c === ']') state.stack.pop();
  state.prevSig = c;
  return { t: 'punct', s: c, at: i };
}

function readJsonToken(input: string, i: number, state: JsonState): JsonToken {
  const c = input[i];
  if (/[ \n\r\t]/.test(c))
    return { t: 'text', s: input.slice(i, runEnd(input, i, /[ \n\r\t]/)), at: i };
  if (c === '"') return readJsonString(input, i, state);
  if ('{}[]:,'.includes(c)) return readJsonPunct(c, i, state);
  if (/[-0-9]/.test(c))
    return { t: 'number', s: input.slice(i, runEnd(input, i, /[0-9.eE+-]/)), at: i };
  const keyword = JSON_KEYWORDS.find((k) => input.startsWith(k, i));
  return { t: keyword ? 'keyword' : 'text', s: keyword ?? c, at: i };
}

function tokenizeJson(input: string): JsonToken[] {
  const out: JsonToken[] = [];
  const state: JsonState = { stack: [], prevSig: null };
  let i = 0;
  while (i < input.length) {
    const tok = readJsonToken(input, i, state);
    out.push(tok);
    i += tok.s.length;
  }
  return out;
}

function colorForJsonToken(t: JsonTok): string {
  switch (t) {
    case 'key':
      return IDE.key;
    case 'string':
      return IDE.string;
    case 'number':
      return IDE.number;
    case 'keyword':
      return IDE.keyword;
    case 'punct':
      return IDE.punct;
    default:
      return IDE.text;
  }
}

const YAML_KEYWORD = /^(\b(?:true|false|null|yes|no|on|off)\b)/;
const YAML_NUMBER = /^([-+]?\d*\.?\d+(?:[eE][-+]?\d+)?)/;
const YAML_SPECIAL = /["']|\b(?:true|false|null|yes|no|on|off)\b|[-+]?\d/;

// Where the quoted string opening at `i` ends: after its closing quote, or at the end of the value.
function yamlQuotedEnd(value: string, i: number): number {
  if (value[i] === "'") {
    const end = value.indexOf("'", i + 1);
    return end === -1 ? value.length : end + 1;
  }
  let j = i + 1;
  while (j < value.length) {
    if (value[j] === '\\') {
      j += 2;
      continue;
    }
    if (value[j] === '"') return j + 1;
    j++;
  }
  return value.length;
}

// The next colored part of a YAML value: a quoted string, a keyword, a number, or plain text up to
// the next of those (the rest of the value when none follows).
function readYamlPart(value: string, i: number): { color: string; s: string } {
  const ch = value[i];
  if (ch === '"' || ch === "'") {
    return { color: IDE.string, s: value.slice(i, yamlQuotedEnd(value, i)) };
  }
  const tail = value.slice(i);
  const kw = YAML_KEYWORD.exec(tail);
  if (kw) return { color: IDE.keyword, s: kw[1] };
  const num = YAML_NUMBER.exec(tail);
  if (num) return { color: IDE.number, s: num[1] };
  const nextSpecial = tail.search(YAML_SPECIAL);
  return { color: IDE.text, s: nextSpecial > 0 ? tail.slice(0, nextSpecial) : tail };
}

function highlightYamlValue(value: string, key: number): React.ReactNode {
  if (value === '') return null;
  const nodes: React.ReactNode[] = [];
  let i = 0;
  while (i < value.length) {
    const { color, s } = readYamlPart(value, i);
    nodes.push(
      <span key={`v-${key}-${nodes.length}`} style={{ color }}>
        {s}
      </span>,
    );
    i += s.length;
  }
  return <>{nodes}</>;
}

function renderYamlHighlighted(code: string): React.ReactNode {
  const lines = code.split('\n');
  return lines.map((line, lineIdx) => {
    const key = `yl-${lineIdx}`;
    if (/^\s*#/.test(line)) {
      return (
        <span key={key} style={{ color: IDE.comment }}>
          {line}
          {lineIdx < lines.length - 1 ? '\n' : ''}
        </span>
      );
    }
    // Each part starts where the previous one can't match, so this stays linear; the `\s` key
    // keeps the old parse of an indented bare colon.
    const m = /^(\s*)([^:\s][^:]*|\s):(\s*)((?:\S.*)?)$/.exec(line);
    if (!m) {
      return (
        <span key={key} style={{ color: IDE.text }}>
          {line}
          {lineIdx < lines.length - 1 ? '\n' : ''}
        </span>
      );
    }
    const [, indent, yamlKey, gap, value] = m;
    return (
      <span key={key}>
        <span style={{ color: IDE.text }}>{indent}</span>
        <span style={{ color: IDE.key }}>{yamlKey}</span>
        <span style={{ color: IDE.punct }}>:</span>
        {gap ? <span style={{ color: IDE.text }}>{gap}</span> : null}
        {highlightYamlValue(value, lineIdx)}
        {lineIdx < lines.length - 1 ? '\n' : ''}
      </span>
    );
  });
}

export interface IdeManifestCodeBlockProps {
  code: string;
  language: 'json' | 'yaml';
  /** Override outer scroll container max-height (default fits modal-sized viewers). */
  containerMaxHeight?: string;
  /** Squares off the top when the block sits under its own header strip. */
  flatTop?: boolean;
}

const IdeManifestCodeBlock: React.FC<IdeManifestCodeBlockProps> = memo(
  ({ code, language, containerMaxHeight = 'min(60vh, 480px)', flatTop = false }) => {
    const highlighted = useMemo(() => {
      if (language === 'json') {
        return tokenizeJson(code).map((tok) => (
          <span key={`j-${tok.at}`} style={{ color: colorForJsonToken(tok.t) }}>
            {tok.s}
          </span>
        ));
      }
      return renderYamlHighlighted(code);
    }, [code, language]);

    return (
      <div
        // The class carries the monospace family: a global `#root *` rule sets
        // Geist with !important, which would otherwise win over an inline style.
        className={MONOSPACE_CLASS}
        style={{
          background: IDE.bg,
          border: `1px solid ${IDE.border}`,
          borderRadius: APPLICATION_MANIFEST_VIEW.RADIUS_PX,
          borderTopLeftRadius: flatTop ? 0 : undefined,
          borderTopRightRadius: flatTop ? 0 : undefined,
          borderTop: flatTop ? 'none' : undefined,
          padding: APPLICATION_MANIFEST_VIEW.CODE_PADDING,
          maxHeight: containerMaxHeight,
          overflow: 'auto',
          fontSize: APPLICATION_MANIFEST_VIEW.CODE_FONT_SIZE_PX,
          lineHeight: APPLICATION_MANIFEST_VIEW.CODE_LINE_HEIGHT,
          letterSpacing: 0.015,
        }}
      >
        <pre
          style={{
            margin: SPACING.NONE,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            color: IDE.text,
          }}
        >
          {highlighted}
        </pre>
      </div>
    );
  },
);

IdeManifestCodeBlock.displayName = 'IdeManifestCodeBlock';

export default IdeManifestCodeBlock;
