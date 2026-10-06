import React, { memo, useMemo } from 'react';
import { MONOSPACE_CLASS } from '../../../../constants';
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

function tokenizeJson(input: string): Array<{ t: JsonTok; s: string }> {
  const out: Array<{ t: JsonTok; s: string }> = [];
  const stack: Array<'object' | 'array'> = [];
  let i = 0;
  let prevSig: '{' | '}' | '[' | ']' | ':' | ',' | '"' | null = null;

  while (i < input.length) {
    const c = input[i];
    if (c === ' ' || c === '\n' || c === '\r' || c === '\t') {
      let j = i;
      while (j < input.length && /[ \n\r\t]/.test(input[j])) j++;
      out.push({ t: 'text', s: input.slice(i, j) });
      i = j;
      continue;
    }
    if (c === '"') {
      const isKey =
        stack.length > 0 &&
        stack[stack.length - 1] === 'object' &&
        (prevSig === '{' || prevSig === ',');
      const end = readJsonStringEnd(input, i);
      const str = input.slice(i, end);
      out.push({ t: isKey ? 'key' : 'string', s: str });
      prevSig = '"';
      i = end;
      continue;
    }
    if (c === '{') {
      stack.push('object');
      out.push({ t: 'punct', s: c });
      prevSig = '{';
      i++;
      continue;
    }
    if (c === '}') {
      stack.pop();
      out.push({ t: 'punct', s: c });
      prevSig = '}';
      i++;
      continue;
    }
    if (c === '[') {
      stack.push('array');
      out.push({ t: 'punct', s: c });
      prevSig = '[';
      i++;
      continue;
    }
    if (c === ']') {
      stack.pop();
      out.push({ t: 'punct', s: c });
      prevSig = ']';
      i++;
      continue;
    }
    if (c === ':' || c === ',') {
      out.push({ t: 'punct', s: c });
      prevSig = c;
      i++;
      continue;
    }
    if (/[-0-9]/.test(c)) {
      let j = i;
      while (j < input.length && /[0-9.eE+-]/.test(input[j])) j++;
      out.push({ t: 'number', s: input.slice(i, j) });
      i = j;
      continue;
    }
    if (input.startsWith('true', i)) {
      out.push({ t: 'keyword', s: 'true' });
      i += 4;
      continue;
    }
    if (input.startsWith('false', i)) {
      out.push({ t: 'keyword', s: 'false' });
      i += 5;
      continue;
    }
    if (input.startsWith('null', i)) {
      out.push({ t: 'keyword', s: 'null' });
      i += 4;
      continue;
    }
    out.push({ t: 'text', s: c });
    i++;
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

function highlightYamlValue(value: string, key: number): React.ReactNode {
  if (value === '') return null;
  const nodes: React.ReactNode[] = [];
  let i = 0;
  let part = 0;
  while (i < value.length) {
    const ch = value[i];
    if (ch === '"') {
      let j = i + 1;
      while (j < value.length) {
        if (value[j] === '\\') {
          j += 2;
          continue;
        }
        if (value[j] === '"') break;
        j++;
      }
      const slice = j < value.length ? value.slice(i, j + 1) : value.slice(i);
      nodes.push(
        <span key={`v-${key}-${part++}`} style={{ color: IDE.string }}>
          {slice}
        </span>,
      );
      i = j < value.length ? j + 1 : value.length;
      continue;
    }
    if (ch === "'") {
      const end = value.indexOf("'", i + 1);
      const slice = end === -1 ? value.slice(i) : value.slice(i, end + 1);
      nodes.push(
        <span key={`v-${key}-${part++}`} style={{ color: IDE.string }}>
          {slice}
        </span>,
      );
      i = end === -1 ? value.length : end + 1;
      continue;
    }
    const tail = value.slice(i);
    const kw = tail.match(/^(\b(?:true|false|null|yes|no|on|off)\b)/);
    if (kw) {
      nodes.push(
        <span key={`v-${key}-${part++}`} style={{ color: IDE.keyword }}>
          {kw[1]}
        </span>,
      );
      i += kw[1].length;
      continue;
    }
    const num = tail.match(/^([-+]?\d*\.?\d+(?:[eE][-+]?\d+)?)/);
    if (num) {
      nodes.push(
        <span key={`v-${key}-${part++}`} style={{ color: IDE.number }}>
          {num[1]}
        </span>,
      );
      i += num[1].length;
      continue;
    }
    const nextSpecial = tail.search(/["']|\b(?:true|false|null|yes|no|on|off)\b|[-+]?\d/);
    if (nextSpecial <= 0) {
      nodes.push(
        <span key={`v-${key}-${part++}`} style={{ color: IDE.text }}>
          {tail}
        </span>,
      );
      break;
    }
    if (nextSpecial > 0) {
      nodes.push(
        <span key={`v-${key}-${part++}`} style={{ color: IDE.text }}>
          {tail.slice(0, nextSpecial)}
        </span>,
      );
      i += nextSpecial;
    }
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
    const m = /^(\s*)([^:]+):\s*(.*)$/.exec(line);
    if (!m) {
      return (
        <span key={key} style={{ color: IDE.text }}>
          {line}
          {lineIdx < lines.length - 1 ? '\n' : ''}
        </span>
      );
    }
    const [, indent, yamlKey, rest] = m;
    const hasSpaceAfterColon = line.includes(':') && rest.length > 0 && /^ /.test(rest);
    const valueTrim = hasSpaceAfterColon ? rest.slice(1) : rest;
    return (
      <span key={key}>
        <span style={{ color: IDE.text }}>{indent}</span>
        <span style={{ color: IDE.key }}>{yamlKey}</span>
        <span style={{ color: IDE.punct }}>:</span>
        {hasSpaceAfterColon ? <span style={{ color: IDE.text }}> </span> : null}
        {highlightYamlValue(valueTrim, lineIdx)}
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
  /** When false, the block does not scroll; an outer panel scrolls instead. */
  scrollInside?: boolean;
  lineStyles?: Record<number, React.CSSProperties>;
  lineDimmed?: Record<number, boolean>;
  /** Squares off the top when the block sits under its own header strip. */
  flatTop?: boolean;
}

const IdeManifestCodeBlock: React.FC<IdeManifestCodeBlockProps> = memo(
  ({
    code,
    language,
    containerMaxHeight = 'min(60vh, 480px)',
    scrollInside = true,
    lineStyles,
    lineDimmed,
    flatTop = false,
  }) => {
    const highlighted = useMemo(() => {
      if (language === 'json') {
        return tokenizeJson(code).map((tok, idx) => (
          <span key={`j-${idx}`} style={{ color: colorForJsonToken(tok.t) }}>
            {tok.s}
          </span>
        ));
      }
      return renderYamlHighlighted(code);
    }, [code, language]);

    const highlightedLines = useMemo(() => {
      if (language !== 'yaml') return null;
      const lines = code.split('\n');
      return lines.map((line, lineIdx) => {
        if (/^\s*#/.test(line)) {
          return (
            <span key={`yl-${lineIdx}`} style={{ color: IDE.comment }}>
              {line}
            </span>
          );
        }
        const m = /^(\s*)([^:]+):\s*(.*)$/.exec(line);
        if (!m) {
          return (
            <span key={`yl-${lineIdx}`} style={{ color: IDE.text }}>
              {line}
            </span>
          );
        }
        const [, indent, yamlKey, rest] = m;
        const hasSpaceAfterColon = line.includes(':') && rest.length > 0 && /^ /.test(rest);
        const valueTrim = hasSpaceAfterColon ? rest.slice(1) : rest;
        return (
          <span key={`yl-${lineIdx}`}>
            <span style={{ color: IDE.text }}>{indent}</span>
            <span style={{ color: IDE.key }}>{yamlKey}</span>
            <span style={{ color: IDE.punct }}>:</span>
            {hasSpaceAfterColon ? <span style={{ color: IDE.text }}> </span> : null}
            {highlightYamlValue(valueTrim, lineIdx)}
          </span>
        );
      });
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
          maxHeight: scrollInside ? containerMaxHeight : 'none',
          overflow: scrollInside ? 'auto' : 'visible',
          fontSize: APPLICATION_MANIFEST_VIEW.CODE_FONT_SIZE_PX,
          lineHeight: APPLICATION_MANIFEST_VIEW.CODE_LINE_HEIGHT,
          letterSpacing: 0.015,
        }}
      >
        <pre
          style={{
            margin: 0,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            color: IDE.text,
          }}
        >
          {highlightedLines && (lineStyles || lineDimmed) ? (
            <span style={{ display: 'block' }}>
              {highlightedLines.map((node, idx) => (
                <span
                  key={`dl-${idx}`}
                  style={{
                    display: 'block',
                    background: lineStyles?.[idx]?.background,
                    borderRadius: lineStyles?.[idx]?.borderRadius,
                    paddingLeft: lineStyles?.[idx]?.paddingLeft,
                    paddingRight: lineStyles?.[idx]?.paddingRight,
                    opacity: lineDimmed?.[idx] ? 0.55 : 1,
                  }}
                >
                  {node}
                </span>
              ))}
            </span>
          ) : (
            highlighted
          )}
        </pre>
      </div>
    );
  },
);

IdeManifestCodeBlock.displayName = 'IdeManifestCodeBlock';

export default IdeManifestCodeBlock;
