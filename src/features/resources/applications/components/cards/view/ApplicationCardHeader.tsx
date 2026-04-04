import React, { memo, useCallback, useState } from 'react';
import { Button, Dropdown, Modal } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  HistoryOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_COLORS, APP_ROUTES } from '../../../../../../constants';
import type { Application } from '../../../models';
import { APPLICATIONS_UI } from '../../../constants';
import RowTag from '../../../../../../components/display/table/RowTag';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../../../../../store';
import { deleteApplicationThunk } from '../../../store';
import { getApplicationHealthAccentColor } from '../../../utils/healthVisual';

interface ApplicationCardHeaderProps {
  application: Application;
  onEditApplication: (application: Application) => void;
}

const ApplicationCardHeader: React.FC<ApplicationCardHeaderProps> = memo(
  ({ application, onEditApplication }) => {
    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();
    const [menuOpen, setMenuOpen] = useState(false);

    const accent = getApplicationHealthAccentColor(application.health?.status);
    const statusText = application.health?.status || APPLICATIONS_UI.FALLBACKS.UNKNOWN;

    const detailsPath = APP_ROUTES.APPLICATION_DETAILS.replace(':name', application.name);

    const handleMenuClick = useCallback(
      (info: { key: string; domEvent: React.MouseEvent | React.KeyboardEvent }) => {
        info.domEvent.stopPropagation();
        if (info.key === 'view') {
          navigate(detailsPath);
          return;
        }
        if (info.key === 'edit') {
          setMenuOpen(false);
          onEditApplication(application);
          return;
        }
        if (info.key === 'rollbacks') {
          navigate(`${detailsPath}#snapshots`);
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
      [application, dispatch, detailsPath, navigate, onEditApplication],
    );

    const hasInsightRow = Boolean(application.insights?.category || application.insights?.role);

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
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '1px 8px',
                borderRadius: 999,
                fontSize: 11,
                fontWeight: 600,
                background: accent,
                color: DEFAULT_COLORS.BACKGROUND_WHITE,
                lineHeight: 1.45,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: DEFAULT_COLORS.BACKGROUND_WHITE,
                  opacity: 0.95,
                  flexShrink: 0,
                }}
                aria-hidden
              />
              {statusText}
            </span>
          </div>
          <p
            style={{
              margin: '4px 0 0',
              fontSize: 12,
              fontWeight: 500,
              color: DEFAULT_COLORS.TEXT_MUTED,
              lineHeight: 1.3,
              wordBreak: 'break-word',
            }}
          >
            {application.name}
          </p>
          {hasInsightRow ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
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
        <Dropdown
          trigger={['click']}
          placement="bottomRight"
          open={menuOpen}
          onOpenChange={setMenuOpen}
          menu={{
            items: [
              { key: 'view', label: APPLICATIONS_UI.CARD.ACTIONS.VIEW, icon: <EyeOutlined /> },
              { key: 'edit', label: APPLICATIONS_UI.CARD.ACTIONS.EDIT, icon: <EditOutlined /> },
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
            style={{
              color: menuOpen ? DEFAULT_COLORS.TEXT_PRIMARY : DEFAULT_COLORS.ICON_SECONDARY,
              flexShrink: 0,
            }}
          />
        </Dropdown>
      </div>
    );
  },
);

ApplicationCardHeader.displayName = 'ApplicationCardHeader';

export default ApplicationCardHeader;
