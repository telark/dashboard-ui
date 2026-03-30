import React, { memo, useState } from 'react';
import {
  CameraOutlined,
  CopyOutlined,
  EyeOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { Button, Modal, Tooltip } from 'antd';
import yaml from 'js-yaml';
import { DEFAULT_COLORS } from '../../../../../constants';
import SettingsCard from '../../../../settings/components/SettingsCard';
import { APPLICATIONS_UI } from '../../constants';
import TabButton from '../../../../../components/display/buttons/TabButton';
import ApplicationSectionEmptyState from '../../components/display/ApplicationSectionEmptyState';
import MutedText from '../../components/details/MutedText';
import {
  getManifestViewPayload,
  isManifestDocumentArray,
} from '../../components/details/manifestDisplay';
import IdeManifestCodeBlock from '../../components/details/IdeManifestCodeBlock';
import { IDE_MANIFEST_THEME } from '../../components/details/ideManifestTheme';
import type { ApplicationSnapshotSummary, SnapshotManifestState } from '../../models';

export interface ApplicationSnapshotsProps {
  snapshots: ApplicationSnapshotSummary[];
  loading: boolean;
  error: string | null;
  snapshotManifests: Record<string, SnapshotManifestState>;
  onViewManifest: (snapshotId: string) => void;
}

const ApplicationSnapshots: React.FC<ApplicationSnapshotsProps> = memo(
  ({ snapshots, loading, error, snapshotManifests, onViewManifest }) => {
    const [activeSnapshotId, setActiveSnapshotId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'json' | 'yaml'>('json');

    const manifestState = activeSnapshotId ? snapshotManifests[activeSnapshotId] : undefined;

    const viewPayload = manifestState?.data ? getManifestViewPayload(manifestState.data) : undefined;

    const jsonText = (() => {
      if (viewPayload === undefined) return '';
      try {
        return JSON.stringify(viewPayload, null, 2);
      } catch {
        return String(viewPayload);
      }
    })();

    const yamlText = (() => {
      if (viewPayload === undefined) return '';
      try {
        if (isManifestDocumentArray(viewPayload)) {
          const docs = viewPayload
            .map((doc) => yaml.dump(doc, { noRefs: true }).trimEnd())
            .filter((s) => s.length > 0);
          if (docs.length === 0) return '';
          return `${docs.join('\n---\n')}\n`;
        }
        return yaml.dump(viewPayload, { noRefs: true });
      } catch {
        return '';
      }
    })();

    const openManifest = (snapshotId: string) => {
      setActiveSnapshotId(snapshotId);
      setActiveTab('json');
      onViewManifest(snapshotId);
    };

    const handleCopy = async () => {
      const text = activeTab === 'json' ? jsonText : yamlText;
      if (!text) return;
      await navigator.clipboard.writeText(text);
    };

    return (
      <SettingsCard
        title={APPLICATIONS_UI.SECTIONS.SNAPSHOTS.TITLE}
        description={APPLICATIONS_UI.SECTIONS.SNAPSHOTS.DESCRIPTION}
      >
        {loading ? (
          <div style={{ display: 'grid', rowGap: 10 }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  height: 44,
                  borderRadius: 8,
                  border: `1px solid ${DEFAULT_COLORS.BORDER_LIGHT}`,
                  background: DEFAULT_COLORS.BACKGROUND_LIGHT,
                }}
              />
            ))}
          </div>
        ) : error ? (
          <div style={{ fontSize: 13, color: DEFAULT_COLORS.DANGER }}>{error}</div>
        ) : snapshots.length === 0 ? (
          <ApplicationSectionEmptyState
            icon={<CameraOutlined style={{ fontSize: 24 }} />}
            title={APPLICATIONS_UI.SECTIONS.SNAPSHOTS.EMPTY_TITLE}
            description={APPLICATIONS_UI.SECTIONS.SNAPSHOTS.EMPTY_DESCRIPTION}
          />
        ) : (
          <div>
            {snapshots.map((s, idx) => {
              const showDivider = idx < snapshots.length - 1;
              const truncatedId =
                s.id.length > 24 ? `${s.id.slice(0, 10)}…${s.id.slice(-10)}` : s.id;
              return (
                <div
                  key={s.id}
                  style={{
                    paddingTop: idx === 0 ? 0 : 10,
                    paddingBottom: 10,
                    borderBottom: showDivider ? `1px solid ${DEFAULT_COLORS.BORDER_LIGHT}` : 'none',
                  }}
                >
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        marginTop: 5,
                        flexShrink: 0,
                        background: DEFAULT_COLORS.TEXT_MUTED,
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, color: DEFAULT_COLORS.TEXT_PRIMARY, lineHeight: 1.4 }}>
                        <span style={{ color: DEFAULT_COLORS.TEXT_MUTED, fontSize: 12, fontWeight: 700 }}>
                          ID
                        </span>{' '}
                        <Tooltip title={s.id}>
                          <span style={{ fontWeight: 700 }}>{truncatedId}</span>
                        </Tooltip>
                        <span style={{ color: DEFAULT_COLORS.TEXT_MUTED }}> · </span>
                        <span style={{ color: DEFAULT_COLORS.TEXT_MUTED }}>Size</span>{' '}
                        <span style={{ fontWeight: 600 }}>{s.size}</span>
                        <span style={{ color: DEFAULT_COLORS.TEXT_MUTED }}> · </span>
                        <span style={{ color: DEFAULT_COLORS.TEXT_MUTED }}>Consumed</span>{' '}
                        <span style={{ fontWeight: 600 }}>{s.consumed}</span>
                      </div>
                      {(s.pvcTotal || s.pvcAvailable) && (
                        <div style={{ fontSize: 12, color: DEFAULT_COLORS.TEXT_MUTED, marginTop: 4 }}>
                          {s.pvcAvailable ? `Available ${s.pvcAvailable}` : null}
                          {s.pvcAvailable && s.pvcTotal ? ' · ' : null}
                          {s.pvcTotal ? `Total ${s.pvcTotal}` : null}
                        </div>
                      )}
                    </div>
                    <Button
                      type="text"
                      size="small"
                      icon={<EyeOutlined />}
                      onClick={() => openManifest(s.id)}
                    >
                      View Manifest
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <Modal
          open={activeSnapshotId != null}
          title="Manifest"
          footer={null}
          onCancel={() => setActiveSnapshotId(null)}
          width={760}
        >
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <TabButton label="JSON" active={activeTab === 'json'} onClick={() => setActiveTab('json')} />
            <TabButton label="YAML" active={activeTab === 'yaml'} onClick={() => setActiveTab('yaml')} />
          </div>
          <div style={{ position: 'relative' }}>
            <Button
              type="text"
              size="small"
              icon={<CopyOutlined />}
              onClick={() => void handleCopy()}
              style={{
                position: 'absolute',
                top: 8,
                right: 12,
                zIndex: 2,
                color: activeTab === 'yaml' ? IDE_MANIFEST_THEME.copyButton : undefined,
              }}
              disabled={!activeSnapshotId || !(activeTab === 'json' ? jsonText : yamlText)}
            >
              Copy
            </Button>
            {!activeSnapshotId ? null : manifestState?.loading ? (
              activeTab === 'yaml' ? (
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
                  <LoadingOutlined /> Loading…
                </div>
              ) : (
                <div
                  style={{
                    color: DEFAULT_COLORS.TEXT_MUTED,
                    fontSize: 13,
                    display: 'flex',
                    gap: 8,
                    padding: '36px 12px 12px',
                    borderRadius: 10,
                    border: `1px solid ${DEFAULT_COLORS.BORDER_LIGHT}`,
                    background: DEFAULT_COLORS.BACKGROUND_LIGHT,
                  }}
                >
                  <LoadingOutlined /> Loading…
                </div>
              )
            ) : manifestState?.error ? (
              activeTab === 'yaml' ? (
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
              ) : (
                <div
                  style={{
                    color: DEFAULT_COLORS.DANGER,
                    fontSize: 13,
                    padding: '36px 12px 12px',
                    borderRadius: 10,
                    border: `1px solid ${DEFAULT_COLORS.BORDER_LIGHT}`,
                    background: DEFAULT_COLORS.BACKGROUND_LIGHT,
                  }}
                >
                  {manifestState.error}
                </div>
              )
            ) : activeTab === 'yaml' && !yamlText ? (
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
            ) : (
              activeTab === 'yaml' ? (
                <IdeManifestCodeBlock code={yamlText} language="yaml" />
              ) : (
                <div
                  style={{
                    border: `1px solid ${DEFAULT_COLORS.BORDER_LIGHT}`,
                    borderRadius: 10,
                    background: DEFAULT_COLORS.BACKGROUND_LIGHT,
                    padding: 12,
                  }}
                >
                  <pre
                    style={{
                      margin: 0,
                      fontSize: 12,
                      lineHeight: 1.5,
                      color: DEFAULT_COLORS.TEXT_PRIMARY,
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      fontFamily: 'monospace',
                      paddingTop: 28,
                    }}
                  >
                    {jsonText}
                  </pre>
                </div>
              )
            )}
          </div>
        </Modal>
      </SettingsCard>
    );
  },
);

ApplicationSnapshots.displayName = 'ApplicationSnapshots';

export default ApplicationSnapshots;

