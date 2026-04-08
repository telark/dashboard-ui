import React, { memo, useCallback, useMemo, useState } from 'react';
import { Button, Dropdown, Modal } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  HistoryOutlined,
  MoreOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_COLORS, APP_ROUTES } from '../../../../../../constants';
import type { Application } from '../../../models';
import { APPLICATIONS_UI } from '../../../constants';
import RowTag from '../../../../../../components/display/table/RowTag';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../../../../store';
import { deleteApplicationThunk } from '../../../store';
import { getApplicationHealthAccentColor } from '../../../utils/healthVisual';
import { forceSyncApplication } from '../../../utils/management/sync';

interface ApplicationCardHeaderProps {
  application: Application;
  primaryNamespace: string;
  onEditApplication: (application: Application) => void;
}

const ApplicationCardHeader: React.FC<ApplicationCardHeaderProps> = memo(
  ({ application, primaryNamespace, onEditApplication }) => {
    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();
    const isSyncing = useSelector((s: RootState) => Boolean(s.applications.syncing?.[application.name]));
    const [menuOpen, setMenuOpen] = useState(false);

    const accent = getApplicationHealthAccentColor(application.health?.status);
    const statusText = application.health?.status || APPLICATIONS_UI.FALLBACKS.UNKNOWN;

    const detailsPath = APP_ROUTES.APPLICATION_DETAILS.replace(':name', application.name);

    const handleMenuClick = useCallback(
      (info: { key: string; domEvent: React.MouseEvent | React.KeyboardEvent }) => {
        info.domEvent.stopPropagation();
        if (isSyncing && (info.key === 'edit' || info.key === 'delete' || info.key === 'forceSync')) {
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
          Modal.confirm({
            title: APPLICATIONS_UI.CARD.ACTIONS.DELETE_CONFIRM_TITLE,
            content: APPLICATIONS_UI.CARD.ACTIONS.DELETE_CONFIRM_CONTENT,
            okText: APPLICATIONS_UI.CARD.ACTIONS.DELETE,
            okType: 'danger',
            cancelText: APPLICATIONS_UI.CARD.ACTIONS.CANCEL,
            onOk: () =>
              dispatch(deleteApplicationThunk(application.name))
                .unwrap()
                .then(() => {
                  navigate(APP_ROUTES.APPLICATIONS);
                })
                .catch(() => undefined),
          });
        }
      },
      [application, dispatch, detailsPath, isSyncing, navigate, onEditApplication],
    );

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

    return (
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
            style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8, rowGap: 6 }}
          >
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
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
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
                {
                  key: 'forceSync',
                  label: APPLICATIONS_UI.CARD.ACTIONS.FORCE_SYNC,
                  icon: <SyncOutlined />,
                  disabled: isSyncing,
                },
                {
                  key: 'edit',
                  label: APPLICATIONS_UI.CARD.ACTIONS.EDIT,
                  icon: <EditOutlined />,
                  disabled: isSyncing,
                },
                {
                  key: 'rollbacks',
                  label: APPLICATIONS_UI.CARD.ACTIONS.MANAGE_ROLLBACKS,
                  icon: <HistoryOutlined />,
                },
                { type: 'divider' },
                {
                  key: 'delete',
                  label: APPLICATIONS_UI.CARD.ACTIONS.DELETE,
                  icon: <DeleteOutlined />,
                  danger: true,
                  disabled: isSyncing,
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
              style={menuButtonStyle}
            />
          </Dropdown>
        </div>
      </div>
    );
  },
);

ApplicationCardHeader.displayName = 'ApplicationCardHeader';

export default ApplicationCardHeader;
