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
  selectPasskeyError,
} from '../../store/selectors/passkeySelectors';
import { usePasskeyPanelState, usePasskeyActions, useEnrollLink } from '../../hooks';
import { usePasskeyListPageConfig } from '../../hooks/passkeys/usePasskeyListPageConfig';
import { sortPasskeys } from '../../components/passkeys/list/utils';
import type { Passkey } from '../../models/passkeys';
import PasskeysEmptyPage from './PasskeysEmptyPage';
import PasskeysListPage from './PasskeysListPage';
import type { PasskeyBreadcrumbItem } from './PasskeysListPage';
import { PasskeyPanel, EnrollLinkModal } from '../../components';

export interface PasskeysMainPageProps {
  /** When provided (e.g. embedded in Settings), show breadcrumb in title. */
  breadcrumbItems?: PasskeyBreadcrumbItem[];
  /** When true, parent renders breadcrumb; list page hides title block (fixed position in Settings). */
  embedInSettings?: boolean;
}

const MainPage: React.FC<PasskeysMainPageProps> = ({ breadcrumbItems, embedInSettings }) => {
  const { modal, message } = App.useApp();
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
    () => Array.isArray(passkeys) && passkeys.length === 0 && !error,
    [passkeys, error],
  );

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
        onConfirmDelete={confirmDelete}
        panelOpen={isPanelOpen}
        isEditMode={isEditMode}
        selectedPasskey={selectedPasskey}
        onClosePanel={closePanel}
        form={form}
        formSyncKey={formSyncKey}
        submitting={submitting}
        onSubmit={handlePanelSubmit}
        breadcrumbItems={embedInSettings ? undefined : breadcrumbItems}
        hideTitle={embedInSettings}
      />
      <EnrollLinkModal url={enrollUrl} onClose={clearLink} />
    </>
  );
};

export default MainPage;
