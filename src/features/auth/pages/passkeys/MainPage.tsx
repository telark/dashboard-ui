import React, { useEffect, useState, useMemo, useCallback, startTransition } from 'react';
import { App } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { PASSKEYS_CONSTANTS as PPC } from '../../constants/passkeys';
import { AUTH_ERROR_MESSAGES } from '../../constants';
import { isDevelopment } from '../../../../utils/helpers/env';
import logger from '../../../../logging';
import { AppDispatch } from '../../../../store';
import { fetchAllPasskeysThunk } from '../../store/thunks/fetchThunks';
import {
  selectPasskeys,
  selectPasskeyLoading,
  selectPasskeyLoaded,
  selectPasskeyError,
} from '../../store/selectors/passkeySelectors';
import { usePasskeyPanelState, usePasskeyActions, useEnrollLink } from '../../hooks';
import { usePasskeyListPageConfig } from '../../hooks/passkeys/usePasskeyListPageConfig';
import { sortPasskeys } from '../../components/passkeys/list/utils';
import type { Passkey } from '../../models/passkeys';
import PasskeysEmptyPage from './PasskeysEmptyPage';
import PasskeysListPage from './PasskeysListPage';
import { PasskeyPanel, EnrollLinkModal } from '../../components';
import { ActionConfirmModal } from '../../../../components/display/modal';
import FullPageLoader from '../../../../components/display/views/FullPageLoader';

const MainPage: React.FC = () => {
  const { message } = App.useApp();
  const dispatch: AppDispatch = useDispatch();
  const passkeys = useSelector(selectPasskeys);
  const loading = useSelector(selectPasskeyLoading);
  const loaded = useSelector(selectPasskeyLoaded);
  const error = useSelector(selectPasskeyError);

  const [searchTerm, setSearchTerm] = useState('');
  const [lastFetchError, setLastFetchError] = useState<string | null>(null);
  const [sortOrder] = useState<'asc' | 'desc'>('desc');
  const [pendingDelete, setPendingDelete] = useState<Passkey | null>(null);
  const [deleting, setDeleting] = useState(false);

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

  const { submitting, handleDelete, handleCreate, handleUpdate } = usePasskeyActions(openEditPanel);
  const { enrollUrl, enrollLoading, createLink, clearLink } = useEnrollLink();

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
  }, [error, loading, lastFetchError, message]);

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

  const isLastPasskey = passkeys.length === 1;
  const pendingName = pendingDelete?.deviceName || '';
  const [beforeName, afterName] = (
    isLastPasskey
      ? PPC.LABELS.FORCE_DELETE_MODAL_CONTENT(pendingName)
      : PPC.LABELS.DELETE_MODAL_CONTENT(pendingName)
  ).split(pendingName);

  const deletePending = useCallback(async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await handleDelete(pendingDelete, isLastPasskey);
    } catch {
      // Error handled by handleDelete
    } finally {
      setDeleting(false);
    }
  }, [pendingDelete, isLastPasskey, handleDelete]);

  const filteredAndSortedPasskeys = useMemo(() => {
    const filtered = searchTerm
      ? passkeys.filter((p) => p.deviceName?.toLowerCase().includes(searchTerm.toLowerCase()))
      : passkeys;
    return sortPasskeys(filtered, 'creationTimestamp', sortOrder);
  }, [passkeys, searchTerm, sortOrder]);

  const pageConfig = usePasskeyListPageConfig({
    searchValue: searchTerm,
    onSearchChange: setSearchTerm,
    onCreatePasskeyClick: openCreatePanel,
    onEnrollLinkClick: createLink,
    enrollLinkLoading: enrollLoading,
  });

  const shouldShowEmpty = useMemo(
    () => Array.isArray(passkeys) && passkeys.length === 0 && !error && loaded,
    [passkeys, error, loaded],
  );

  if (!loaded && passkeys.length === 0 && !error) return <FullPageLoader />;

  if (shouldShowEmpty) {
    return (
      <>
        <PasskeysEmptyPage onCreatePasskeyClick={openCreatePanel} />
        {isPanelOpen && (
          <PasskeyPanel
            open={isPanelOpen}
            onClose={closePanel}
            isEditMode={false}
            selectedPasskey={null}
            passkeys={passkeys}
            submitting={submitting}
            onSubmit={handlePanelSubmit}
            form={form}
            formSyncKey={formSyncKey}
          />
        )}
      </>
    );
  }

  const refetchPasskeys = (): void => {
    dispatch(fetchAllPasskeysThunk());
  };

  const augmentedPageConfig = {
    ...pageConfig,
    loading,
    error,
    onRetry: refetchPasskeys,
  };

  return (
    <>
      <PasskeysListPage
        pageConfig={augmentedPageConfig}
        passkeys={filteredAndSortedPasskeys}
        allPasskeys={passkeys}
        searchTerm={searchTerm}
        onEdit={openEditPanel}
        onConfirmDelete={setPendingDelete}
        panelOpen={isPanelOpen}
        isEditMode={isEditMode}
        selectedPasskey={selectedPasskey}
        onClosePanel={closePanel}
        form={form}
        formSyncKey={formSyncKey}
        submitting={submitting}
        onSubmit={handlePanelSubmit}
      />
      <EnrollLinkModal url={enrollUrl} onClose={clearLink} />
      <ActionConfirmModal
        open={pendingDelete !== null}
        onClose={() => setPendingDelete(null)}
        onConfirm={deletePending}
        title={isLastPasskey ? PPC.LABELS.FORCE_DELETE_MODAL_TITLE : PPC.LABELS.DELETE_MODAL_TITLE}
        action="delete"
        resourceName={pendingName}
        customMessage={
          <div style={{ whiteSpace: 'pre-line' }}>
            {beforeName}
            <strong>{pendingName}</strong>
            {afterName}
          </div>
        }
        confirmText={isLastPasskey ? PPC.LABELS.FORCE_DELETE_MODAL_OK : PPC.LABELS.DELETE_MODAL_OK}
        loading={deleting}
        getContainer={() => document.body}
      />
    </>
  );
};

export default MainPage;
