import React, { memo, useCallback, useMemo, useState } from 'react';
import { Button, Checkbox, Dropdown, Tooltip } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  HistoryOutlined,
  MoreOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_COLORS, APP_ROUTES } from '../../../../../../constants';
import type { Application, SyncStatusValue } from '../../../models';
import { APPLICATIONS_UI } from '../../../constants';
import RowTag from '../../../../../../components/display/table/RowTag';
import FancySpinner from '../../../../../../components/animation/FancySpinner';
import TimeAgo from '../../../../../../components/display/time/TimeAgo';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../../../../store';
import { deleteApplicationThunk } from '../../../store';
import { getApplicationHealthAccentColor } from '../../../utils/healthVisual';
import { forceSyncApplication } from '../../../utils/management/sync';
import ApplicationDeleteModal from '../../delete/ApplicationDeleteModal';
import {
  usePermission,
  ACTION_PERMISSIONS,
} from '../../../../../../features/auth/hooks/permissions/permissionEngine';

interface ApplicationCardHeaderProps {
  application: Application;
  primaryNamespace: string;
  onEditApplication: (application: Application) => void;
  bulkMode?: boolean;
  selected?: boolean;
  onToggleSelect?: (name: string, checked: boolean) => void;
}

const SYNC_TAG_CONFIG: Record<
  SyncStatusValue,
  { bg: string; color: string; icon: React.ReactNode; label: string }
> = {
  syncing: {
    bg: DEFAULT_COLORS.CHIP_CUSTOM_BG,
    color: DEFAULT_COLORS.TEXT_MUTED,
    icon: <FancySpinner size={12} ringThickness={2} color={DEFAULT_COLORS.TEXT_MUTED} />,
    label: APPLICATIONS_UI.CARD.SYNC_STATUS.SYNCING,
  },
  success: {
    bg: '#dcfce7',
    color: '#166534',
    icon: <CheckCircleOutlined style={{ fontSize: 11 }} />,
    label: APPLICATIONS_UI.CARD.SYNC_STATUS.SUCCESS,
  },
  failed: {
    bg: '#fee2e2',
    color: '#991b1b',
    icon: <CloseCircleOutlined style={{ fontSize: 11 }} />,
    label: APPLICATIONS_UI.CARD.SYNC_STATUS.FAILED,
  },
};

const ApplicationCardHeader: React.FC<ApplicationCardHeaderProps> = memo(
  ({
    application,
    primaryNamespace,
    onEditApplication,
    bulkMode = false,
    selected = false,
    onToggleSelect,
  }) => {
    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();
    const isSyncing = useSelector((s: RootState) =>
      Boolean(s.applications.syncing?.[application.name]),
    );
    const syncStatus = useSelector(
      (s: RootState) =>
        s.applications.syncStatus?.[application.name] as SyncStatusValue | undefined,
    );
    const syncCompletedAt = useSelector(
      (s: RootState) => s.applications.syncCompletedAt?.[application.name],
    );
    const [menuOpen, setMenuOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

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
    const canDelete = usePermission(
      ACTION_PERMISSIONS.applications.delete.scope,
      ACTION_PERMISSIONS.applications.delete.level,
      ACTION_PERMISSIONS.applications.delete.deny,
    );

    const accent = getApplicationHealthAccentColor(application.health?.status);
    const statusText = application.health?.status || APPLICATIONS_UI.FALLBACKS.UNKNOWN;

    const detailsPath = APP_ROUTES.APPLICATION_DETAILS.replace(':name', application.name);

    const handleMenuClick = useCallback(
      (info: { key: string; domEvent: React.MouseEvent | React.KeyboardEvent }) => {
        info.domEvent.stopPropagation();
        if (
          isSyncing &&
          (info.key === 'edit' || info.key === 'delete' || info.key === 'forceSync')
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
          forceSyncApplication(application.name).catch(() => undefined);
          return;
        }
        if (info.key === 'rollbacks') {
          navigate(detailsPath);
          return;
        }
        if (info.key === 'delete') {
          setMenuOpen(false);
          setDeleteModalOpen(true);
        }
      },
      [application, detailsPath, isSyncing, navigate, onEditApplication],
    );

    const handleConfirmDelete = useCallback(async () => {
      setDeleteLoading(true);
      try {
        await dispatch(deleteApplicationThunk(application.name)).unwrap();
        setDeleteModalOpen(false);
        navigate(APP_ROUTES.APPLICATIONS);
      } catch {
        return;
      } finally {
        setDeleteLoading(false);
      }
    }, [application.name, dispatch, navigate]);

    const menuButtonStyle = useMemo(
      () => ({
        color: menuOpen ? DEFAULT_COLORS.TEXT_PRIMARY : DEFAULT_COLORS.ICON_SECONDARY,
        flexShrink: 0,
        width: 30,
        height: 30,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        background: menuOpen ? DEFAULT_COLORS.BACKGROUND_HOVER : 'transparent',
        transition: 'background 120ms ease, color 120ms ease',
      }),
      [menuOpen],
    );

    const hasInsightRow = Boolean(application.insights?.category || application.insights?.role);
    const descriptionText = String(application.description || '').trim();
    const disabledLabel = (text: string, disabled: boolean) =>
      disabled ? (
        <Tooltip title={APPLICATIONS_UI.CARD.ACTIONS.SYNC_DISABLED_TOOLTIP}>
          <span>{text}</span>
        </Tooltip>
      ) : (
        text
      );
    const bulkTextIndent = 22;

    return (
      <>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 10,
          }}
        >
          <div style={{ minWidth: 0, flex: 1 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: bulkMode ? 6 : 8,
                rowGap: 6,
              }}
            >
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
              <h3
                style={{
                  margin: 0,
                  fontSize: 17,
                  fontWeight: 700,
                  color: DEFAULT_COLORS.TEXT_PRIMARY,
                  lineHeight: 1.25,
                }}
              >
                {application.displayName || application.name}
              </h3>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span
                  aria-hidden
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: accent,
                    boxShadow: `0 0 0 3px ${DEFAULT_COLORS.CHIP_CUSTOM_BG}`,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: DEFAULT_COLORS.TEXT_MUTED,
                    lineHeight: 1.2,
                    textTransform: 'capitalize',
                  }}
                >
                  {statusText}
                </span>
              </span>
            </div>
            <p
              style={{
                margin: '1px 0 0',
                paddingLeft: bulkMode ? bulkTextIndent : 0,
                fontSize: 12,
                fontWeight: 500,
                color: DEFAULT_COLORS.TEXT_MUTED,
                lineHeight: 1.3,
                wordBreak: 'break-word',
              }}
            >
              {descriptionText || application.name}
            </p>
            {hasInsightRow ? (
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 6,
                  marginTop: 6,
                  paddingLeft: bulkMode ? bulkTextIndent : 0,
                }}
              >
                {application.insights?.category ? (
                  <RowTag
                    text={application.insights.category}
                    background={DEFAULT_COLORS.CHIP_CUSTOM_BG}
                    color={DEFAULT_COLORS.CHIP_CUSTOM_TEXT}
                    fontSize={11}
                  />
                ) : null}
                {application.insights?.role ? (
                  <RowTag
                    text={application.insights.role}
                    background={DEFAULT_COLORS.CHIP_CUSTOM_BG}
                    color={DEFAULT_COLORS.CHIP_CUSTOM_TEXT}
                    fontSize={11}
                  />
                ) : null}
              </div>
            ) : null}
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            {syncStatus ? (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  background: SYNC_TAG_CONFIG[syncStatus].bg,
                  color: SYNC_TAG_CONFIG[syncStatus].color,
                  padding: '2px 10px',
                  borderRadius: 999,
                  fontWeight: 700,
                  fontSize: 11,
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
            ) : null}
            <RowTag
              text={primaryNamespace}
              background={DEFAULT_COLORS.CHIP_CUSTOM_BG}
              color={DEFAULT_COLORS.TEXT_MUTED}
              fontSize={11}
            />
            <Dropdown
              trigger={['click']}
              placement="bottomRight"
              open={menuOpen}
              onOpenChange={setMenuOpen}
              menu={{
                items: [
                  { key: 'view', label: APPLICATIONS_UI.CARD.ACTIONS.VIEW, icon: <EyeOutlined /> },
                  ...(canForceSync
                    ? [
                        {
                          key: 'forceSync',
                          label: disabledLabel(APPLICATIONS_UI.CARD.ACTIONS.FORCE_SYNC, isSyncing),
                          icon: <SyncOutlined />,
                          disabled: isSyncing,
                        },
                      ]
                    : []),
                  ...(canEdit
                    ? [
                        {
                          key: 'edit',
                          label: disabledLabel(APPLICATIONS_UI.CARD.ACTIONS.EDIT, isSyncing),
                          icon: <EditOutlined />,
                          disabled: isSyncing,
                        },
                      ]
                    : []),
                  {
                    key: 'rollbacks',
                    label: APPLICATIONS_UI.CARD.ACTIONS.MANAGE_ROLLBACKS,
                    icon: <HistoryOutlined />,
                  },
                  ...(canDelete
                    ? [
                        { type: 'divider' as const },
                        {
                          key: 'delete',
                          label: disabledLabel(APPLICATIONS_UI.CARD.ACTIONS.DELETE, isSyncing),
                          icon: <DeleteOutlined />,
                          danger: true,
                          disabled: isSyncing,
                        },
                      ]
                    : []),
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
                style={menuButtonStyle}
              />
            </Dropdown>
          </div>
        </div>
        <ApplicationDeleteModal
          open={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          applicationNames={[application.name]}
          loading={deleteLoading}
        />
      </>
    );
  },
);

ApplicationCardHeader.displayName = 'ApplicationCardHeader';

export default ApplicationCardHeader;
