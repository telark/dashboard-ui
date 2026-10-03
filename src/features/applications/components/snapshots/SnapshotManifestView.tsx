import React, { memo, useMemo, useState } from 'react';
import {
  CopyOutlined,
  DownOutlined,
  FileSearchOutlined,
  InboxOutlined,
  RightOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { Button, Segmented, Tooltip, App as AntdApp } from 'antd';
import { dump } from 'js-yaml';
import { DEFAULT_COLORS } from '../../../../constants';
import { FancySpinner } from '../../../../components/animation';
import { APPLICATIONS_UI } from '../../constants';
import { APPLICATION_MANIFEST_VIEW } from '../../constants/sectionLayout';
import IdeManifestCodeBlock from '../details/IdeManifestCodeBlock';
import { IDE_MANIFEST_THEME } from '../details/ideManifestTheme';
import { getManifestViewPayload, isManifestDocumentArray } from '../details/manifestDisplay';
import { getManifestErrorCopy } from '../../utils/manifestError';
import type { SnapshotManifestState } from '../../models';

const V = APPLICATION_MANIFEST_VIEW;
const UI = APPLICATIONS_UI.SECTIONS.SNAPSHOTS;

const MANIFEST_LANGUAGE = {
  JSON: 'json',
  YAML: 'yaml',
} as const;

type ManifestLanguage = (typeof MANIFEST_LANGUAGE)[keyof typeof MANIFEST_LANGUAGE];

function useManifestTexts(data: unknown | null | undefined): {
  jsonText: string;
  yamlText: string;
} {
  return useMemo(() => {
    const viewPayload = data != null ? getManifestViewPayload(data) : undefined;
    if (viewPayload === undefined) {
      return { jsonText: '', yamlText: '' };
    }

    let jsonText = '';
    try {
      jsonText = JSON.stringify(viewPayload, null, 2);
    } catch {
      jsonText = String(viewPayload);
    }

    let yamlText = '';
    try {
      if (isManifestDocumentArray(viewPayload)) {
        const docs = viewPayload
          .map((doc) => dump(doc, { noRefs: true }).trimEnd())
          .filter((s) => s.length > 0);

        yamlText = docs.length === 0 ? '' : `${docs.join('\n---\n')}\n`;
      } else {
        yamlText = dump(viewPayload, { noRefs: true });
      }
    } catch {
      yamlText = '';
    }

    return { jsonText, yamlText };
  }, [data]);
}

/** Loading / error / empty share the reader's shell so the frame never jumps. */
const ManifestShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      gap: V.STATE_GAP_PX,
      padding: V.STATE_PADDING,
      minHeight: V.CODE_MIN_HEIGHT_PX,
      background: IDE_MANIFEST_THEME.bg,
      border: `1px solid ${IDE_MANIFEST_THEME.border}`,
      borderTop: 'none',
      borderBottomLeftRadius: V.RADIUS_PX,
      borderBottomRightRadius: V.RADIUS_PX,
    }}
  >
    {children}
  </div>
);

const ManifestState: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  /** Raw transport error; shown only if the user asks for it. */
  detail?: string;
}> = ({ icon, title, description, detail }) => {
  const [detailOpen, setDetailOpen] = useState(false);

  return (
    <ManifestShell>
      <span style={{ fontSize: V.STATE_ICON_SIZE_PX, color: DEFAULT_COLORS.ICON_SECONDARY }}>
        {icon}
      </span>
      <span
        style={{
          fontSize: V.STATE_TITLE_FONT_SIZE_PX,
          fontWeight: 700,
          color: DEFAULT_COLORS.TEXT_PRIMARY,
        }}
      >
        {title}
      </span>
      <span
        style={{
          fontSize: V.STATE_TEXT_FONT_SIZE_PX,
          color: DEFAULT_COLORS.TEXT_MUTED,
          maxWidth: V.STATE_MAX_WIDTH_PX,
          lineHeight: 1.5,
        }}
      >
        {description}
      </span>
      {detail ? (
        <div style={{ maxWidth: V.STATE_MAX_WIDTH_PX, width: '100%' }}>
          <button
            type="button"
            onClick={() => setDetailOpen((prev) => !prev)}
            aria-expanded={detailOpen}
            style={{
              all: 'unset',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              fontSize: V.STATE_TEXT_FONT_SIZE_PX,
              color: DEFAULT_COLORS.TEXT_MUTED,
            }}
          >
            {detailOpen ? <DownOutlined /> : <RightOutlined />}
            <span>{detailOpen ? UI.MANIFEST_HIDE_DETAILS : UI.MANIFEST_SHOW_DETAILS}</span>
          </button>
          {detailOpen ? (
            <div
              style={{
                marginTop: V.STATE_GAP_PX,
                padding: V.DETAIL_PADDING,
                borderRadius: V.DETAIL_RADIUS_PX,
                background: IDE_MANIFEST_THEME.headerBg,
                border: `1px solid ${IDE_MANIFEST_THEME.border}`,
                color: DEFAULT_COLORS.TEXT_MUTED,
                fontSize: V.STATE_TEXT_FONT_SIZE_PX,
                textAlign: 'left',
                maxHeight: V.DETAIL_MAX_HEIGHT_PX,
                overflow: 'auto',
                overflowWrap: 'anywhere',
              }}
            >
              {detail}
            </div>
          ) : null}
        </div>
      ) : null}
    </ManifestShell>
  );
};

export interface SnapshotManifestViewProps {
  /** Snapshot identity, shown in the reader header. */
  title: string;
  manifestState: SnapshotManifestState | undefined;
}

const SnapshotManifestView: React.FC<SnapshotManifestViewProps> = memo(
  ({ title, manifestState }) => {
    const { message } = AntdApp.useApp();
    const [language, setLanguage] = useState<ManifestLanguage>(MANIFEST_LANGUAGE.JSON);
    const { jsonText, yamlText } = useManifestTexts(manifestState?.data ?? null);

    const code = language === MANIFEST_LANGUAGE.JSON ? jsonText : yamlText;

    const handleCopy = (): void => {
      if (!code) return;
      navigator.clipboard.writeText(code).then(
        () => message.success(UI.MANIFEST_COPIED),
        () => message.error(UI.MANIFEST_COPY_FAILED),
      );
    };

    let body: React.ReactElement;
    if (manifestState?.loading) {
      body = (
        <ManifestShell>
          <span
            style={{
              color: DEFAULT_COLORS.TEXT_MUTED,
              fontSize: V.STATE_TEXT_FONT_SIZE_PX,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <FancySpinner size={V.STATE_TEXT_FONT_SIZE_PX} /> {UI.MANIFEST_LOADING}
          </span>
        </ManifestShell>
      );
    } else if (manifestState?.error) {
      // The API layer surfaces the raw transport message; translate it for the reader.
      const errorCopy = getManifestErrorCopy(manifestState.error);
      body = (
        <ManifestState
          icon={errorCopy.notFound ? <FileSearchOutlined /> : <WarningOutlined />}
          title={errorCopy.title}
          description={errorCopy.description}
          detail={errorCopy.detail}
        />
      );
    } else if (!code) {
      body = (
        <ManifestState
          icon={<InboxOutlined />}
          title={UI.MANIFEST_EMPTY_TITLE}
          description={UI.MANIFEST_EMPTY_DESCRIPTION}
        />
      );
    } else {
      body = (
        <IdeManifestCodeBlock
          code={code}
          language={language}
          containerMaxHeight={V.CODE_MAX_HEIGHT}
          flatTop
        />
      );
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Header strip carries the switch and copy, so the code block itself needs
            no room reserved for a floating button. */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: V.HEADER_GAP_PX,
            padding: V.HEADER_PADDING,
            background: IDE_MANIFEST_THEME.headerBg,
            border: `1px solid ${IDE_MANIFEST_THEME.border}`,
            borderTopLeftRadius: V.RADIUS_PX,
            borderTopRightRadius: V.RADIUS_PX,
            minWidth: 0,
          }}
        >
          <span
            style={{
              flex: 1,
              minWidth: 0,
              fontSize: V.TITLE_FONT_SIZE_PX,
              fontWeight: 600,
              color: DEFAULT_COLORS.TEXT_PRIMARY,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {title.length > 0 ? title : UI.MANIFEST_MODAL_TITLE}
          </span>
          <Segmented<ManifestLanguage>
            size="small"
            value={language}
            onChange={setLanguage}
            options={[
              { value: MANIFEST_LANGUAGE.JSON, label: UI.MANIFEST_TAB_JSON },
              { value: MANIFEST_LANGUAGE.YAML, label: UI.MANIFEST_TAB_YAML },
            ]}
          />
          <Tooltip title={UI.MANIFEST_COPY_TOOLTIP}>
            <Button
              type="text"
              size="small"
              icon={<CopyOutlined />}
              onClick={handleCopy}
              disabled={!code}
              aria-label={UI.MANIFEST_COPY_TOOLTIP}
              style={{ color: IDE_MANIFEST_THEME.copyButton }}
            />
          </Tooltip>
        </div>
        {body}
      </div>
    );
  },
);

SnapshotManifestView.displayName = 'SnapshotManifestView';

export default SnapshotManifestView;
