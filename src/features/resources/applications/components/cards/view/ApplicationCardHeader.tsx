import React, { memo, useCallback } from 'react';
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
import { CONNECTIVITY_CONSTANTS } from '../../../../../../constants/pages/connectivity';
import RowTag from '../../../../../../components/display/table/RowTag';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../../../../../store';
import { deleteApplicationThunk } from '../../../store';

interface ApplicationCardHeaderProps {
  application: Application;
}

const ApplicationCardHeader: React.FC<ApplicationCardHeaderProps> = memo(({ application }) => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  const healthBackground = (() => {
    const status = (application.health?.status || '').toLowerCase();
    if (status === 'healthy') return DEFAULT_COLORS.SUCCESS;
    if (status === 'degraded') return CONNECTIVITY_CONSTANTS.COLORS.WARNING;
    if (status === 'down') return DEFAULT_COLORS.DANGER;
    return DEFAULT_COLORS.TEXT_MUTED;
  })();

  const detailsPath = APP_ROUTES.APPLICATION_DETAILS.replace(':name', application.name);
  const editPath = APP_ROUTES.APPLICATION_EDIT.replace(':name', application.name);

  const handleMenuClick = useCallback(
    (info: { key: string; domEvent: React.MouseEvent | React.KeyboardEvent }) => {
      info.domEvent.stopPropagation();
      if (info.key === 'view') {
        navigate(detailsPath);
        return;
      }
      if (info.key === 'edit') {
        navigate(editPath);
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
    [application.name, dispatch, detailsPath, editPath, navigate],
  );

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
        marginBottom:
          application.insights?.category || application.insights?.role || application.managed?.chart ? 12 : 16,
      }}
    >
      <div style={{ minWidth: 0, flex: 1 }}>
        <h3
          style={{
            margin: 0,
            fontSize: 15,
            fontWeight: 600,
            color: DEFAULT_COLORS.TEXT_PRIMARY,
          }}
        >
          {application.displayName || application.name}
        </h3>
        <p
          style={{
            margin: 0,
            fontSize: 14,
            fontWeight: 400,
            color: DEFAULT_COLORS.TEXT_MUTED,
            lineHeight: 1.2,
            fontFamily: "'Roboto Condensed', sans-serif",
            wordBreak: 'break-word',
          }}
        >
          {application.name}
        </p>
        {application.insights?.category || application.insights?.role || application.managed?.chart ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
            {application.insights?.category ? (
              <RowTag
                text={application.insights.category}
                background={DEFAULT_COLORS.CHIP_CUSTOM_BG}
                color={DEFAULT_COLORS.CHIP_CUSTOM_TEXT}
              />
            ) : null}
            {application.insights?.role ? (
              <RowTag
                text={application.insights.role}
                background={DEFAULT_COLORS.CHIP_CUSTOM_BG}
                color={DEFAULT_COLORS.CHIP_CUSTOM_TEXT}
              />
            ) : null}
            {application.managed?.chart ? (
              <RowTag
                text={`${application.managed.chart}${
                  application.managed.version ? `@${application.managed.version}` : ''
                }`}
                background={DEFAULT_COLORS.CHIP_CUSTOM_BG}
                color={DEFAULT_COLORS.CHIP_CUSTOM_TEXT}
              />
            ) : null}
          </div>
        ) : null}
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          flexShrink: 0,
        }}
      >
        <span
          style={{
            padding: '2px 10px',
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 600,
            background: healthBackground,
            color: '#ffffff',
          }}
        >
          {application.health?.status || APPLICATIONS_UI.FALLBACKS.UNKNOWN}
        </span>
        <Dropdown
          trigger={['click']}
          placement="bottomRight"
          menu={{
            items: [
              {
                key: 'view',
                label: APPLICATIONS_UI.CARD.ACTIONS.VIEW,
                icon: <EyeOutlined />,
              },
              {
                key: 'edit',
                label: APPLICATIONS_UI.CARD.ACTIONS.EDIT,
                icon: <EditOutlined />,
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
          />
        </Dropdown>
      </div>
    </div>
  );
});

ApplicationCardHeader.displayName = 'ApplicationCardHeader';

export default ApplicationCardHeader;
