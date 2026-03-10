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

/** When embedded in Settings (hideTitle), no extra padding or full-height so it aligns with Security layout. */
const EMBEDDED_CONTAINER_STYLE: React.CSSProperties = {
  background: 'transparent',
  minHeight: 'auto',
  padding: 0,
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

const BREADCRUMB_LINK_STYLE: React.CSSProperties = {
  background: 'none',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  color: '#64748b',
  fontSize: 28,
  fontWeight: 700,
  fontFamily: 'inherit',
  textDecoration: 'none',
};

/** Same shape as groups breadcrumb: label + optional onClick to go back (no route). */
export interface PasskeyBreadcrumbItem {
  label: string;
  onClick?: () => void;
}

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
  /** When provided (e.g. embedded in Settings), show breadcrumb as title instead of plain title. */
  breadcrumbItems?: PasskeyBreadcrumbItem[];
  /** When true, parent renders title/breadcrumb; hide this page's title block. */
  hideTitle?: boolean;
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
    breadcrumbItems,
    hideTitle,
  }) => {
    const emptyMessage = searchTerm
      ? 'No passkeys match your search.'
      : 'No passkeys yet. Add one to get started.';

    const titleContent =
      hideTitle === true
        ? null
        : breadcrumbItems && breadcrumbItems.length > 0
          ? (
              <>
                {breadcrumbItems.map((b, index) => (
                  <React.Fragment key={index}>
                    {index > 0 && <span style={{ color: '#64748b' }}> / </span>}
                    {b.onClick ? (
                      <button type="button" onClick={b.onClick} style={BREADCRUMB_LINK_STYLE}>
                        {b.label}
                      </button>
                    ) : (
                      <span style={{ color: '#0B1F33' }}>{b.label}</span>
                    )}
                  </React.Fragment>
                ))}
              </>
            )
          : pageConfig.title;

    const wrapperStyle: React.CSSProperties = hideTitle
      ? { background: 'transparent', minHeight: 'auto' }
      : { background: DEFAULT_COLORS.BACKGROUND_WHITE, minHeight: '100vh' };
    const containerStyle = hideTitle ? EMBEDDED_CONTAINER_STYLE : CONTAINER_STYLE;

    return (
      <div style={wrapperStyle}>
        <div style={containerStyle}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {!hideTitle && (
              <div style={TITLE_BLOCK_STYLE}>
                <h1 style={TITLE_STYLE}>{titleContent}</h1>
                <p style={SUBTITLE_STYLE}>{pageConfig.subtitle}</p>
              </div>
            )}

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
