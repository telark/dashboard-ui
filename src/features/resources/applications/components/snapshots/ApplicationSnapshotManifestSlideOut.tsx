import React, { memo, useMemo, useState } from 'react';
import { CodeOutlined, CopyOutlined, FileTextOutlined, LoadingOutlined } from '@ant-design/icons';
import { Button, Tooltip, App as AntdApp } from 'antd';
import yaml from 'js-yaml';
import { SlideOutPanel } from '../../../../../components/display/panels/slide-out';
import { ToggleButton } from '../../../../../components/display/buttons';
import { DEFAULT_COLORS } from '../../../../../constants';
import { APPLICATIONS_UI } from '../../constants';
import IdeManifestCodeBlock from '../details/IdeManifestCodeBlock';
import { IDE_MANIFEST_THEME } from '../details/ideManifestTheme';
import { getManifestViewPayload, isManifestDocumentArray } from '../details/manifestDisplay';
import MutedText from '../details/MutedText';
import type { SnapshotManifestState } from '../../models';

const MANIFEST_PANEL_WIDTH = 720;

export interface ApplicationSnapshotManifestSlideOutProps {
  open: boolean;
  manifestKey: string | null;
  onClose: () => void;
  title: string;
  manifestState: SnapshotManifestState | undefined;
}

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
          .map((doc) => yaml.dump(doc, { noRefs: true }).trimEnd())
          .filter((s) => s.length > 0);
        yamlText = docs.length === 0 ? '' : `${docs.join('\n---\n')}\n`;
      } else {
        yamlText = yaml.dump(viewPayload, { noRefs: true });
      }
    } catch {
      yamlText = '';
    }
    return { jsonText, yamlText };
  }, [data]);
}

function ManifestSlideOutInner(props: {
  activeTab: 'json' | 'yaml';
  onTabChange: (t: 'json' | 'yaml') => void;
  jsonText: string;
  yamlText: string;
  manifestState: SnapshotManifestState | undefined;
  onCopy: () => void;
}) {
  const { activeTab, onTabChange, jsonText, yamlText, manifestState, onCopy } = props;
  const ui = APPLICATIONS_UI.SECTIONS.SNAPSHOTS;
  const canCopy = activeTab === 'json' ? jsonText.length > 0 : yamlText.length > 0;

  let body: React.ReactElement;
  if (manifestState?.loading) {
    body = (
      <div
        style={{
          color: DEFAULT_COLORS.TEXT_MUTED,
          fontSize: 13,
          display: 'flex',
          gap: 8,
          padding: '36px 12px 12px',
          background: IDE_MANIFEST_THEME.bg,
          borderRadius: 8,
          border: `1px solid ${IDE_MANIFEST_THEME.border}`,
        }}
      >
        <LoadingOutlined /> {ui.MANIFEST_LOADING}
      </div>
    );
  } else if (manifestState?.error) {
    body = (
      <div
        style={{
          color: DEFAULT_COLORS.DANGER,
          fontSize: 13,
          padding: '36px 12px 12px',
          background: IDE_MANIFEST_THEME.bg,
          borderRadius: 8,
          border: `1px solid ${IDE_MANIFEST_THEME.border}`,
        }}
      >
        {manifestState.error}
      </div>
    );
  } else if (activeTab === 'yaml' && !yamlText) {
    body = (
      <div
        style={{
          padding: '36px 12px 12px',
          background: IDE_MANIFEST_THEME.bg,
          borderRadius: 8,
          border: `1px solid ${IDE_MANIFEST_THEME.border}`,
        }}
      >
        <MutedText value={APPLICATIONS_UI.FALLBACKS.EMPTY} />
      </div>
    );
  } else if (activeTab === 'yaml') {
    body = <IdeManifestCodeBlock code={yamlText} language="yaml" scrollInside={false} />;
  } else {
    body = <IdeManifestCodeBlock code={jsonText} language="json" scrollInside={false} />;
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        width: '100%',
        minHeight: 0,
        flex: 1,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          flexShrink: 0,
          flexWrap: 'wrap',
        }}
      >
        <ToggleButton
          variant="neutral"
          active={activeTab === 'json'}
          onClick={() => onTabChange('json')}
          label={ui.MANIFEST_TAB_JSON}
          icon={<FileTextOutlined />}
        />
        <ToggleButton
          variant="neutral"
          active={activeTab === 'yaml'}
          onClick={() => onTabChange('yaml')}
          label={ui.MANIFEST_TAB_YAML}
          icon={<CodeOutlined />}
        />
      </div>
      <div
        style={{
          position: 'relative',
          flex: 1,
          minHeight: 200,
          minWidth: 0,
          maxHeight: 'calc(100vh - 220px)',
          overflow: 'auto',
          paddingTop: 4,
        }}
      >
        <Tooltip title={ui.MANIFEST_COPY_TOOLTIP}>
          <Button
            type="text"
            size="small"
            icon={<CopyOutlined />}
            onClick={onCopy}
            disabled={!canCopy}
            aria-label={ui.MANIFEST_COPY_TOOLTIP}
            style={{
              position: 'absolute',
              top: 8,
              right: 10,
              zIndex: 2,
              color: activeTab === 'yaml' ? IDE_MANIFEST_THEME.copyButton : undefined,
            }}
          />
        </Tooltip>
        <div style={{ paddingTop: 36 }}>{body}</div>
      </div>
    </div>
  );
}

const ApplicationSnapshotManifestSlideOut: React.FC<ApplicationSnapshotManifestSlideOutProps> =
  memo(({ open, manifestKey, onClose, title, manifestState }) => {
    const ui = APPLICATIONS_UI.SECTIONS.SNAPSHOTS;

    return (
      <SlideOutPanel
        open={open}
        onClose={onClose}
        title={title.length > 0 ? title : APPLICATIONS_UI.FALLBACKS.EMPTY}
        subtitle={ui.MANIFEST_PANEL_SUBTITLE}
        width={MANIFEST_PANEL_WIDTH}
        contentOnly
        formContent={
          <ManifestSlideOutWithTabs key={manifestKey ?? 'closed'} manifestState={manifestState} />
        }
      />
    );
  });

function ManifestSlideOutWithTabs(props: { manifestState: SnapshotManifestState | undefined }) {
  const { message } = AntdApp.useApp();
  const [activeTab, setActiveTab] = useState<'json' | 'yaml'>('json');
  const { jsonText, yamlText } = useManifestTexts(props.manifestState?.data ?? null);

  const handleCopy = (): void => {
    const text = activeTab === 'json' ? jsonText : yamlText;
    if (!text) return;
    const snapUi = APPLICATIONS_UI.SECTIONS.SNAPSHOTS;
    navigator.clipboard.writeText(text).then(
      () => message.success(snapUi.MANIFEST_COPIED),
      () => message.error(snapUi.MANIFEST_COPY_FAILED),
    );
  };

  return (
    <ManifestSlideOutInner
      activeTab={activeTab}
      onTabChange={setActiveTab}
      jsonText={jsonText}
      yamlText={yamlText}
      manifestState={props.manifestState}
      onCopy={handleCopy}
    />
  );
}

ApplicationSnapshotManifestSlideOut.displayName = 'ApplicationSnapshotManifestSlideOut';

export default ApplicationSnapshotManifestSlideOut;
