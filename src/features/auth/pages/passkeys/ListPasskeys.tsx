import React, { useEffect, useState, useMemo, useCallback, startTransition } from 'react';
import { App, message } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { PASSKEYS_CONSTANTS as PPC } from '../../constants/passkeys';
import { Toolbar } from '../../../../components/display/toolbar';
import { PasskeyPanel, PasskeyCard } from '../../components';
import { AUTH_ERROR_MESSAGES } from '../../constants';
import { isDevelopment } from '../../../../utils/helpers/env';
import logger from '../../../../logging';
import { AppDispatch } from '../../../../store';
import { fetchAllPasskeysThunk } from '../../store/thunks/fetchThunks';
import {
  selectPasskeys,
  selectPasskeyLoading,
  selectPasskeyError,
} from '../../store/selectors/passkeySelectors';
import { usePasskeyPanelState, usePasskeyActions } from '../../hooks';
import { usePasskeyListConfig } from '../../config/passkeyListConfig';
import { sortPasskeys } from '../../components/passkeys/list/utils';
import type { Passkey } from '../../models/passkeys';
import { DEFAULT_COLORS } from '../../../../constants';

const INNER_CONTAINER_STYLE: React.CSSProperties = {
  background: '#fff',
  minHeight: '100vh',
  padding: '100px 48px 48px',
  marginTop: 0,
  width: '100%',
  boxSizing: 'border-box',
};

const ListPasskeys: React.FC = () => {
  const { modal } = App.useApp();
  const dispatch: AppDispatch = useDispatch();
  const passkeys = useSelector(selectPasskeys);
  const loading = useSelector(selectPasskeyLoading);
  const error = useSelector(selectPasskeyError);

  const [searchTerm, setSearchTerm] = useState('');
  const [lastFetchError, setLastFetchError] = useState<string | null>(null);
  const [sortOrder] = useState<'asc' | 'desc'>('desc');

  const {
    isPanelOpen,
    isEditMode,
    selectedPasskey,
    openCreatePanel,
    openEditPanel,
    closePanel,
    form,
    formSyncKey,
  } = usePasskeyPanelState();

  const { submitting, handleDelete, handleCreate, handleUpdate } =
    usePasskeyActions(openEditPanel);

  useEffect(() => {
    dispatch(fetchAllPasskeysThunk());
  }, [dispatch]);

  useEffect(() => {
    if (error && !loading) {
      const isMutationError =
        error === AUTH_ERROR_MESSAGES.PASSKEY_ALREADY_EXISTS ||
        error === AUTH_ERROR_MESSAGES.CREATE_PASSKEY_FAILED ||
        error === AUTH_ERROR_MESSAGES.UPDATE_PASSKEY_FAILED ||
        error === AUTH_ERROR_MESSAGES.DELETE_PASSKEY_FAILED;

      if (!isMutationError && error !== lastFetchError) {
        message.error(AUTH_ERROR_MESSAGES.FETCH_PASSKEYS_FAILED);
        if (isDevelopment()) {
          logger.error(PPC.LOGS.FAILED_TO_LOAD_PASSKEYS, error);
        }
        startTransition(() => {
          setLastFetchError(error);
        });
      }
    }
  }, [error, loading, lastFetchError]);

  const handlePanelSubmit = useCallback(
    async (values: Record<string, unknown>) => {
      if (isEditMode) {
        await handleUpdate(values, selectedPasskey);
      } else {
        await handleCreate(values);
      }
    },
    [isEditMode, selectedPasskey, handleUpdate, handleCreate],
  );

  const confirmDelete = useCallback(
    (record: Passkey) => {
      const isLastPasskey = passkeys.length === 1;
      const passkeyName = record?.deviceName || '';
      const contentText = isLastPasskey
        ? PPC.LABELS.FORCE_DELETE_MODAL_CONTENT(passkeyName)
        : PPC.LABELS.DELETE_MODAL_CONTENT(passkeyName);

      const parts = contentText.split(passkeyName);
      const content = (
        <div style={{ whiteSpace: 'pre-line' }}>
          {parts[0]}
          <strong>{passkeyName}</strong>
          {parts[1]}
        </div>
      );

      modal.confirm({
        title: isLastPasskey ? PPC.LABELS.FORCE_DELETE_MODAL_TITLE : PPC.LABELS.DELETE_MODAL_TITLE,
        content,
        okText: isLastPasskey ? PPC.LABELS.FORCE_DELETE_MODAL_OK : PPC.LABELS.DELETE_MODAL_OK,
        okButtonProps: { danger: true },
        icon: null,
        onOk: async () => {
          try {
            await handleDelete(record, isLastPasskey);
          } catch {
            // Error handled by handleDelete
          }
        },
      });
    },
    [passkeys.length, modal, handleDelete],
  );

  const filteredAndSortedPasskeys = useMemo(() => {
    const filtered = searchTerm
      ? passkeys.filter((p) =>
          p.deviceName?.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      : passkeys;
    return sortPasskeys(filtered, 'creationTimestamp', sortOrder);
  }, [passkeys, searchTerm, sortOrder]);

  const toolbarConfig = usePasskeyListConfig({
    onAddPasskeyClick: openCreatePanel,
    searchValue: searchTerm,
    onSearchChange: setSearchTerm,
  });

  const titleBlock = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <h1
        style={{
          fontSize: 28,
          fontWeight: 700,
          color: '#0B1F33',
          margin: 0,
          padding: 0,
          lineHeight: 1.2,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        {PPC.LABELS.BREADCRUMBS.PASSKEYS}
      </h1>
      <p
        style={{
          fontSize: 14,
          fontWeight: 400,
          color: '#64748b',
          margin: 0,
          marginTop: 0,
          padding: 0,
          lineHeight: 1.2,
          fontFamily: "'Roboto Condensed', sans-serif",
        }}
      >
        {PPC.LABELS.HEADER_SUBTITLE}
      </p>
    </div>
  );

  if (loading) {
    return (
      <div style={{ background: DEFAULT_COLORS.BACKGROUND_WHITE, minHeight: '100vh' }}>
        <div style={INNER_CONTAINER_STYLE}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {titleBlock}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'flex-end', minHeight: '60px' }}>
              <div />
              <Toolbar config={toolbarConfig} />
            </div>
            <div style={{ color: DEFAULT_COLORS.TEXT_MUTED }}>Loading passkeys...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: DEFAULT_COLORS.BACKGROUND_WHITE, minHeight: '100vh' }}>
      <div style={INNER_CONTAINER_STYLE}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {titleBlock}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            alignItems: 'flex-end',
            minHeight: '60px',
            width: '100%',
          }}
        >
          <div />
          <Toolbar config={toolbarConfig} />
        </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: 24,
            }}
          >
            {filteredAndSortedPasskeys.length === 0 ? (
              <div
                style={{
                  gridColumn: '1 / -1',
                  padding: 48,
                  textAlign: 'center',
                  color: DEFAULT_COLORS.TEXT_MUTED,
                  fontSize: 14,
                }}
              >
                {searchTerm ? 'No passkeys match your search.' : 'No passkeys yet. Add one to get started.'}
              </div>
            ) : (
              filteredAndSortedPasskeys.map((passkey) => (
                <PasskeyCard
                  key={passkey.credentialId ?? passkey.id}
                  passkey={passkey}
                  onEdit={openEditPanel}
                  onDelete={confirmDelete}
                />
              ))
            )}
          </div>
        </div>
      </div>

      <PasskeyPanel
        open={isPanelOpen}
        onClose={closePanel}
        isEditMode={isEditMode}
        selectedPasskey={selectedPasskey}
        passkeys={passkeys}
        submitting={submitting}
        onSubmit={handlePanelSubmit}
        form={form}
        formSyncKey={formSyncKey}
      />
    </div>
  );
};

export default ListPasskeys;
