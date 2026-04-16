import React, { memo, useMemo } from 'react';
import { Button, Collapse } from 'antd';
import yaml from 'js-yaml';
import { DEFAULT_COLORS } from '../../../../../constants';
import { CONNECTIVITY_CONSTANTS } from '../../../../../constants/pages/connectivity';
import TimeAgo from '../../../../../components/display/time/TimeAgo';
import type { ApplicationSnapshotSummary, SnapshotManifestState } from '../../models';
import IdeManifestCodeBlock from '../details/IdeManifestCodeBlock';
import { getManifestViewPayload, isManifestDocumentArray } from '../details/manifestDisplay';
import MutedText from '../details/MutedText';
import { diffLines } from './lineDiff';

type QuickStyleMap = Record<number, React.CSSProperties>;
type DimMap = Record<number, boolean>;

function toYamlText(data: unknown | null | undefined): string {
  const viewPayload = data != null ? getManifestViewPayload(data) : undefined;
  if (viewPayload === undefined) return '';
  try {
    if (isManifestDocumentArray(viewPayload)) {
      const docs = viewPayload
        .map((doc) => yaml.dump(doc, { noRefs: true }).trimEnd())
        .filter((s) => s.length > 0);
      return docs.length === 0 ? '' : `${docs.join('\n---\n')}\n`;
    }
    return yaml.dump(viewPayload, { noRefs: true });
  } catch {
    return '';
  }
}

function splitYamlDocuments(text: string): string[] {
  const raw = (text || '').trimEnd();
  if (!raw) return [];
  return raw.split(/\n---\n/g);
}

function buildStyleMaps(
  leftText: string,
  rightText: string,
): {
  left: { styles: QuickStyleMap; dimmed: DimMap };
  right: { styles: QuickStyleMap; dimmed: DimMap };
} {
  const leftLines = leftText.split('\n');
  const rightLines = rightText.split('\n');
  const ops = diffLines(leftLines, rightLines);
  const leftStyles: QuickStyleMap = {};
  const rightStyles: QuickStyleMap = {};
  const leftDimmed: DimMap = {};
  const rightDimmed: DimMap = {};

  const addBg = `${DEFAULT_COLORS.SUCCESS}18`;
  const delBg = `${DEFAULT_COLORS.DANGER}18`;
  const chgBg = `${CONNECTIVITY_CONSTANTS.COLORS.WARNING}18`;

  let li = 0;
  let ri = 0;
  for (let i = 0; i < ops.length; i++) {
    const op = ops[i];
    const next = ops[i + 1];
    if (op.t === 'equal') {
      leftDimmed[li] = true;
      rightDimmed[ri] = true;
      li++;
      ri++;
      continue;
    }
    if (op.t === 'del' && next?.t === 'add') {
      leftStyles[li] = { background: chgBg, borderRadius: 4, paddingLeft: 6, paddingRight: 6 };
      rightStyles[ri] = { background: chgBg, borderRadius: 4, paddingLeft: 6, paddingRight: 6 };
      li++;
      ri++;
      i++;
      continue;
    }
    if (op.t === 'del') {
      leftStyles[li] = { background: delBg, borderRadius: 4, paddingLeft: 6, paddingRight: 6 };
      li++;
      continue;
    }
    rightStyles[ri] = { background: addBg, borderRadius: 4, paddingLeft: 6, paddingRight: 6 };
    ri++;
  }

  return {
    left: { styles: leftStyles, dimmed: leftDimmed },
    right: { styles: rightStyles, dimmed: rightDimmed },
  };
}

function ColumnHeader(props: { label: string; takenAt?: string | null }) {
  const { label, takenAt } = props;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ fontSize: 13, fontWeight: 800, color: DEFAULT_COLORS.TEXT_PRIMARY }}>
        {label}
      </div>
      <div style={{ fontSize: 12, fontWeight: 500, color: DEFAULT_COLORS.TEXT_MUTED }}>
        {takenAt ? <TimeAgo date={takenAt} /> : <MutedText value="—" />}
      </div>
    </div>
  );
}

function YamlDocs(props: { text: string; styles: QuickStyleMap; dimmed: DimMap }) {
  const { text, styles, dimmed } = props;
  const docs = useMemo(() => splitYamlDocuments(text), [text]);
  if (docs.length === 0) {
    return (
      <div style={{ paddingTop: 4 }}>
        <MutedText value="—" />
      </div>
    );
  }
  return (
    <Collapse
      bordered={false}
      defaultActiveKey={docs.map((_, i) => String(i))}
      items={docs.map((doc, i) => ({
        key: String(i),
        label: `Document ${i + 1}`,
        children: (
          <IdeManifestCodeBlock
            code={`${doc}\n`}
            language="yaml"
            scrollInside={false}
            lineStyles={styles}
            lineDimmed={dimmed}
          />
        ),
      }))}
    />
  );
}

export interface SnapshotCompareViewProps {
  left: ApplicationSnapshotSummary;
  right: ApplicationSnapshotSummary;
  leftState: SnapshotManifestState | undefined;
  rightState: SnapshotManifestState | undefined;
  onBack: () => void;
}

const SnapshotCompareView: React.FC<SnapshotCompareViewProps> = memo(
  ({ left, right, leftState, rightState, onBack }) => {
    const leftYaml = useMemo(() => toYamlText(leftState?.data ?? null), [leftState?.data]);
    const rightYaml = useMemo(() => toYamlText(rightState?.data ?? null), [rightState?.data]);
    const diff = useMemo(() => buildStyleMaps(leftYaml, rightYaml), [leftYaml, rightYaml]);

    const header = (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
        }}
      >
        <Button type="default" onClick={onBack}>
          Back
        </Button>
      </div>
    );

    const bodyFor = (
      state: SnapshotManifestState | undefined,
      yamlText: string,
      side: 'left' | 'right',
    ) => {
      if (state?.loading) return <MutedText value="Loading manifest…" />;
      if (state?.error) {
        return <div style={{ color: DEFAULT_COLORS.DANGER, fontSize: 13 }}>{state.error}</div>;
      }
      const maps = side === 'left' ? diff.left : diff.right;
      return <YamlDocs text={yamlText} styles={maps.styles} dimmed={maps.dimmed} />;
    };

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          width: '100%',
          minHeight: 0,
        }}
      >
        {header}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 12,
            width: '100%',
            minHeight: 0,
          }}
        >
          <div
            style={{
              minWidth: 0,
              border: `1px solid ${DEFAULT_COLORS.BORDER_LIGHT}`,
              borderRadius: 10,
              padding: 10,
            }}
          >
            <ColumnHeader label={`Generation ${left.generation}`} takenAt={left.takenAt} />
            <div style={{ marginTop: 10 }}>{bodyFor(leftState, leftYaml, 'left')}</div>
          </div>
          <div
            style={{
              minWidth: 0,
              border: `1px solid ${DEFAULT_COLORS.BORDER_LIGHT}`,
              borderRadius: 10,
              padding: 10,
            }}
          >
            <ColumnHeader label={`Generation ${right.generation}`} takenAt={right.takenAt} />
            <div style={{ marginTop: 10 }}>{bodyFor(rightState, rightYaml, 'right')}</div>
          </div>
        </div>
      </div>
    );
  },
);

SnapshotCompareView.displayName = 'SnapshotCompareView';

export default SnapshotCompareView;
