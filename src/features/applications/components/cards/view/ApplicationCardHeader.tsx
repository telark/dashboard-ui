import React, { memo, useCallback, useState } from 'react';
import { App as AntdApp, Button, Checkbox, Dropdown, Tooltip } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClearOutlined,
  EditOutlined,
  EyeOutlined,
  HistoryOutlined,
  MoreOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import {
  APP_ROUTES,
  CARD_ASIDE_STYLE,
  CARD_HEADER_STYLE,
  CARD_IDENTITY_STYLE,
  CARD_LAYOUT,
  CARD_TAG_ROW_STYLE,
  CARD_TITLE_COLUMN_STYLE,
  CARD_TITLE_STYLE,
  DEFAULT_COLORS,
  TRUNCATE_STYLE,
  getCardMenuButtonStyle,
  getPillSurface,
} from '../../../../../constants';
import type { Application, SyncStatusValue } from '../../../models';
import {
  APPLICATION_CARD,
  APPLICATION_HEALTH_ACCENT,
  APPLICATIONS_UI,
  SYNC_STATUS_VALUE,
} from '../../../constants';
import RowTag from '../../../../../components/display/table/RowTag';
import { CardStatusPill } from '../../../../../components/display/card';
import FancySpinner from '../../../../../components/animation/FancySpinner';
import TimeAgo from '../../../../../components/display/time/TimeAgo';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../../../store';
import { resetApplicationThunk } from '../../../store';
import { forceSyncApplication } from '../../../utils/management/sync';
import ApplicationResetModal from '../../reset/ApplicationResetModal';
import {
  usePermission,
  ACTION_PERMISSIONS,
} from '../../../../auth/hooks/permissions/permissionEngine';

interface ApplicationCardHeaderProps {
  application: Application;
  onEditApplication: (application: Application) => void;
  bulkMode?: boolean;
  selected?: boolean;
  onToggleSelect?: (name: string, checked: boolean) => void;
}

const SYNC_TAG_CONFIG: Record<
  SyncStatusValue,
  { accent?: string; icon: React.ReactNode; label: string }
> = {
  syncing: {
    icon: <FancySpinner size={12} ringThickness={2} color={DEFAULT_COLORS.PILL_TEXT} />,
    label: APPLICATIONS_UI.CARD.SYNC_STATUS.SYNCING,
  },
  success: {
    accent: DEFAULT_COLORS.SUCCESS,
    icon: <CheckCircleOutlined style={{ fontSize: 11 }} />,
    label: APPLICATIONS_UI.CARD.SYNC_STATUS.SUCCESS,
  },
  failed: {
    accent: DEFAULT_COLORS.DANGER,
    icon: <CloseCircleOutlined style={{ fontSize: 11 }} />,
    label: APPLICATIONS_UI.CARD.SYNC_STATUS.FAILED,
  },
};

const ApplicationCardHeader: React.FC<ApplicationCardHeaderProps> = memo(
  ({ application, onEditApplication, bulkMode = false, selected = false, onToggleSelect }) => {
    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();
    const { message } = AntdApp.useApp();
    const syncingFlag = useSelector((s: RootState) =>
      Boolean(s.applications.syncing?.[application.name]),
    );
    const syncStatus = useSelector(
      (s: RootState) =>
        s.applications.syncStatus?.[application.name] as SyncStatusValue | undefined,
    );
    const isSyncing = syncingFlag || syncStatus === SYNC_STATUS_VALUE.SYNCING;
    const syncCompletedAt = useSelector(
      (s: RootState) => s.applications.syncCompletedAt?.[application.name],
    );
    const syncLastError = useSelector(
      (s: RootState) => s.applications.syncLastError?.[application.name],
    );
    const [menuOpen, setMenuOpen] = useState(false);
    const [resetModalOpen, setResetModalOpen] = useState(false);
    const [resetLoading, setResetLoading] = useState(false);

    const canEdit = usePermission(
      ACTION_PERMISSIONS.applications.edit.scope,
      ACTION_PERMISSIONS.applications.edit.level,
      ACTION_PERMISSIONS.applications.edit.deny,
    );
    const canForceSync = usePermission(
      ACTION_PERMISSIONS.applications.forceSync.scope,
      ACTION_PERMISSIONS.applications.forceSync.level,
      ACTION_PERMISSIONS.applications.forceSync.deny,
    );
    const canReset = usePermission(
      ACTION_PERMISSIONS.applications.delete.scope,
      ACTION_PERMISSIONS.applications.delete.level,
      ACTION_PERMISSIONS.applications.delete.deny,
    );

    const accent =
      APPLICATION_HEALTH_ACCENT[(application.health?.status ?? '').toLowerCase()] ??
      DEFAULT_COLORS.NEUTRAL;
    const statusText = application.health?.status || APPLICATIONS_UI.FALLBACKS.UNKNOWN;

    const detailsPath = APP_ROUTES.APPLICATION_DETAILS.replace(':name', application.name);

    const handleMenuClick = useCallback(
      (info: { key: string; domEvent: React.MouseEvent | React.KeyboardEvent }) => {
        info.domEvent.stopPropagation();
        if (
          isSyncing &&
          (info.key === 'edit' || info.key === 'reset' || info.key === 'forceSync')
        ) {
          return;
        }
        if (info.key === 'view') {
          navigate(detailsPath);
          return;
        }
        if (info.key === 'edit') {
          setMenuOpen(false);
          onEditApplication(application);
          return;
        }
        if (info.key === 'forceSync') {
          setMenuOpen(false);
          void forceSyncApplication(application.name).then((err) => {
            if (err) message.error(err);
          });
          return;
        }
        if (info.key === 'rollbacks') {
          navigate(detailsPath);
          return;
        }
        if (info.key === 'reset') {
          setMenuOpen(false);
          setResetModalOpen(true);
        }
      },
      [application, detailsPath, isSyncing, message, navigate, onEditApplication],
    );

    const handleConfirmReset = useCallback(async () => {
      setResetLoading(true);
      try {
        await dispatch(resetApplicationThunk(application.name)).unwrap();
        setResetModalOpen(false);
        navigate(APP_ROUTES.APPLICATIONS);
      } catch (err) {
        message.error(typeof err === 'string' ? err : APPLICATIONS_UI.CARD.ACTIONS.RESET_FAILED);
      } finally {
        setResetLoading(false);
      }
    }, [application.name, dispatch, message, navigate]);

    const descriptionText = String(application.description || '').trim();
    const labelWithTooltip = (text: string, tooltip: string | undefined) =>
      tooltip ? (
        <Tooltip title={tooltip}>
          <span>{text}</span>
        </Tooltip>
      ) : (
        text
      );
    const title = application.displayName || application.name;
    const namespaceNames = (application.namespaces?.items ?? []).map((item) => item.name);
    const shownNamespaces = namespaceNames.slice(0, CARD_LAYOUT.MAX_TARGET_TAGS);
    const hiddenNamespaces = namespaceNames.length - shownNamespaces.length;

    return (
      <>
        <div style={CARD_HEADER_STYLE}>
          <div style={CARD_IDENTITY_STYLE}>
            {bulkMode ? (
              <span
                style={{ display: 'inline-flex', alignItems: 'center' }}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
              >
                <Checkbox
                  checked={selected}
                  onChange={(e) => onToggleSelect?.(application.name, e.target.checked)}
                />
              </span>
            ) : null}
            <span style={CARD_TITLE_COLUMN_STYLE}>
              <span title={title} style={CARD_TITLE_STYLE}>
                {title}
              </span>
              {descriptionText && (
                <span
                  title={descriptionText}
                  style={{
                    ...TRUNCATE_STYLE,
                    fontSize: CARD_LAYOUT.META_FONT_SIZE_PX,
                    color: DEFAULT_COLORS.TEXT_MUTED,
                  }}
                >
                  {descriptionText}
                </span>
              )}
              <span style={CARD_TAG_ROW_STYLE}>
                {shownNamespaces.map((namespace) => (
                  <RowTag
                    key={namespace}
                    text={namespace}
                    capitalize={false}
                    fontSize={CARD_LAYOUT.TAG_FONT_SIZE_PX}
                    truncate
                  />
                ))}
                {hiddenNamespaces > 0 && (
                  <RowTag
                    text={APPLICATION_CARD.MORE(hiddenNamespaces)}
                    capitalize={false}
                    fontSize={CARD_LAYOUT.TAG_FONT_SIZE_PX}
                    truncate
                  />
                )}
                {syncStatus ? (
                  <Tooltip
                    title={syncStatus === 'failed' && syncLastError ? syncLastError : undefined}
                  >
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 5,
                        ...getPillSurface(SYNC_TAG_CONFIG[syncStatus].accent),
                        padding: '2px 10px',
                        borderRadius: 999,
                        fontWeight: 700,
                        fontSize: 11,
                        whiteSpace: 'nowrap',
                        maxWidth: '100%',
                        boxSizing: 'border-box',
                        overflow: 'hidden',
                      }}
                    >
                      {SYNC_TAG_CONFIG[syncStatus].icon}
                      <span>{SYNC_TAG_CONFIG[syncStatus].label}</span>
                      {!isSyncing && syncCompletedAt ? (
                        <span style={{ fontWeight: 500 }}>
                          · <TimeAgo date={syncCompletedAt} />
                        </span>
                      ) : null}
                    </span>
                  </Tooltip>
                ) : null}
              </span>
            </span>
          </div>
          <div style={CARD_ASIDE_STYLE}>
            <CardStatusPill label={statusText} accent={accent} />
            <Dropdown
              trigger={['click']}
              placement="bottomRight"
              open={menuOpen}
              onOpenChange={setMenuOpen}
              menu={{
                items: [
                  { key: 'view', label: APPLICATIONS_UI.CARD.ACTIONS.VIEW, icon: <EyeOutlined /> },
                  {
                    key: 'forceSync',
                    label: labelWithTooltip(
                      APPLICATIONS_UI.CARD.ACTIONS.FORCE_SYNC,
                      !canForceSync
                        ? APPLICATIONS_UI.CARD.ACTIONS.FORCE_SYNC_PERMISSION_DENIED_TOOLTIP
                        : isSyncing
                          ? APPLICATIONS_UI.CARD.ACTIONS.SYNC_DISABLED_TOOLTIP
                          : undefined,
                    ),
                    icon: <SyncOutlined />,
                    disabled: !canForceSync || isSyncing,
                  },
                  {
                    key: 'edit',
                    label: labelWithTooltip(
                      APPLICATIONS_UI.CARD.ACTIONS.EDIT,
                      !canEdit
                        ? APPLICATIONS_UI.CARD.ACTIONS.EDIT_PERMISSION_DENIED_TOOLTIP
                        : isSyncing
                          ? APPLICATIONS_UI.CARD.ACTIONS.SYNC_DISABLED_TOOLTIP
                          : undefined,
                    ),
                    icon: <EditOutlined />,
                    disabled: !canEdit || isSyncing,
                  },
                  {
                    key: 'rollbacks',
                    label: APPLICATIONS_UI.CARD.ACTIONS.MANAGE_ROLLBACKS,
                    icon: <HistoryOutlined />,
                  },
                  { type: 'divider' as const },
                  {
                    key: 'reset',
                    label: labelWithTooltip(
                      APPLICATIONS_UI.CARD.ACTIONS.RESET,
                      !canReset
                        ? APPLICATIONS_UI.CARD.ACTIONS.RESET_PERMISSION_DENIED_TOOLTIP
                        : isSyncing
                          ? APPLICATIONS_UI.CARD.ACTIONS.SYNC_DISABLED_TOOLTIP
                          : undefined,
                    ),
                    icon: <ClearOutlined />,
                    danger: true,
                    disabled: !canReset || isSyncing,
                  },
                ],
                onClick: handleMenuClick,
              }}
            >
              <Button
                type="text"
                shape="circle"
                icon={<MoreOutlined rotate={90} />}
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                }}
                style={getCardMenuButtonStyle(menuOpen)}
              />
            </Dropdown>
          </div>
        </div>
        <ApplicationResetModal
          open={resetModalOpen}
          onClose={() => setResetModalOpen(false)}
          onConfirm={handleConfirmReset}
          applicationNames={[application.name]}
          loading={resetLoading}
        />
      </>
    );
  },
);

ApplicationCardHeader.displayName = 'ApplicationCardHeader';

export default ApplicationCardHeader;
