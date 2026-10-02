import React, { memo } from 'react';
import { Toolbar } from '../../../../components/display/toolbar';
import { PasskeyPanel, PasskeyCard, InsecureContextAlert } from '../../components';
import { isWebAuthnSupported } from '../../utils/webauthn/core';
import { DEFAULT_COLORS } from '../../../../constants';
import type { PasskeyListPageConfig } from '../../hooks/passkeys/usePasskeyListPageConfig';
import type { Passkey } from '../../models/passkeys';
import type { FormInstance } from 'antd';
import type { PasskeyPanelFormValues } from '../../hooks/passkeys/passkeyPanelState';

const CONTAINER_STYLE: React.CSSProperties = {
  background: 'transparent',
  minHeight: 'auto',
  padding: 0,
  marginTop: 0,
  width: '100%',
  boxSizing: 'border-box',
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
    const emptyMessage = searchTerm
      ? 'No passkeys match your search.'
      : 'No passkeys yet. Add one to get started.';

    return (
      <div>
        <div style={CONTAINER_STYLE}>
          {!isWebAuthnSupported() && <InsecureContextAlert />}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
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
