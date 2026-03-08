import React, { memo } from 'react';
import { Toolbar } from '../../../../components/display/toolbar';
import { PasskeyPanel, PasskeyCard } from '../../components';
import { DEFAULT_COLORS } from '../../../../constants';
import type { PasskeyListPageConfig } from '../../hooks/passkeys/usePasskeyListPageConfig';
import type { Passkey } from '../../models/passkeys';
import type { FormInstance } from 'antd';
import type { PasskeyPanelFormValues } from '../../hooks/passkeys/passkeyPanelState';

const CONTAINER_STYLE: React.CSSProperties = {
  background: DEFAULT_COLORS.BACKGROUND_WHITE,
  minHeight: '100vh',
  padding: '100px 48px 48px',
  marginTop: 0,
  width: '100%',
  boxSizing: 'border-box',
};

const TITLE_BLOCK_STYLE: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 0,
};

const TITLE_STYLE: React.CSSProperties = {
  fontSize: 28,
  fontWeight: 700,
  color: '#0B1F33',
  margin: 0,
  padding: 0,
  lineHeight: 1.2,
  display: 'flex',
  alignItems: 'center',
  gap: 8,
};

const SUBTITLE_STYLE: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 400,
  color: '#64748b',
  margin: 0,
  marginTop: 0,
  padding: 0,
  lineHeight: 1.2,
  fontFamily: "'Roboto Condensed', sans-serif",
};

const TOOLBAR_ROW_STYLE: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr auto',
  alignItems: 'flex-end',
  minHeight: 60,
  width: '100%',
};

const CARD_GRID_STYLE: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
  gap: 24,
};

const EMPTY_MESSAGE_STYLE: React.CSSProperties = {
  gridColumn: '1 / -1',
  padding: 48,
  textAlign: 'center',
  color: DEFAULT_COLORS.TEXT_MUTED,
  fontSize: 14,
};

export interface PasskeysListPageProps {
  pageConfig: PasskeyListPageConfig;
  passkeys: Passkey[];
  allPasskeys: Passkey[];
  searchTerm: string;
  onEdit: (passkey: Passkey) => void;
  onConfirmDelete: (passkey: Passkey) => void;
  panelOpen: boolean;
  isEditMode: boolean;
  selectedPasskey: Passkey | null;
  onClosePanel: () => void;
  form: FormInstance<PasskeyPanelFormValues>;
  formSyncKey: number;
  submitting: boolean;
  onSubmit: (values: Record<string, unknown>) => Promise<void>;
}

const PasskeysListPage: React.FC<PasskeysListPageProps> = memo(
  ({
    pageConfig,
    passkeys,
    allPasskeys,
    searchTerm,
    onEdit,
    onConfirmDelete,
    panelOpen,
    isEditMode,
    selectedPasskey,
    onClosePanel,
    form,
    formSyncKey,
    submitting,
    onSubmit,
  }) => {
    const emptyMessage =
      searchTerm ? 'No passkeys match your search.' : 'No passkeys yet. Add one to get started.';

    return (
      <div style={{ background: DEFAULT_COLORS.BACKGROUND_WHITE, minHeight: '100vh' }}>
        <div style={CONTAINER_STYLE}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div style={TITLE_BLOCK_STYLE}>
              <h1 style={TITLE_STYLE}>{pageConfig.title}</h1>
              <p style={SUBTITLE_STYLE}>{pageConfig.subtitle}</p>
            </div>

            <div style={TOOLBAR_ROW_STYLE}>
              <div />
              <Toolbar config={pageConfig.toolbarConfig} />
            </div>

            <div style={CARD_GRID_STYLE}>
              {passkeys.length === 0 ? (
                <div style={EMPTY_MESSAGE_STYLE}>{emptyMessage}</div>
              ) : (
                passkeys.map((passkey) => (
                  <PasskeyCard
                    key={passkey.credentialId ?? passkey.id}
                    passkey={passkey}
                    onEdit={onEdit}
                    onDelete={onConfirmDelete}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        <PasskeyPanel
          open={panelOpen}
          onClose={onClosePanel}
          isEditMode={isEditMode}
          selectedPasskey={selectedPasskey}
          passkeys={allPasskeys}
          submitting={submitting}
          onSubmit={onSubmit}
          form={form}
          formSyncKey={formSyncKey}
        />
      </div>
    );
  },
);

PasskeysListPage.displayName = 'PasskeysListPage';

export default PasskeysListPage;
