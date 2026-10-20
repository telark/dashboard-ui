import React, { memo, useCallback, useState } from 'react';
import { Button, Empty, Typography } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  DEFAULT_COLORS,
  DOCS_LINKS,
  EMPTY_ACTION_STYLE,
  EMPTY_CLASS,
  Icons,
} from '../../../../constants';
import { LIST_PAGE } from '../../../../constants/shared/pages';
import { PageContainer } from '../../../../components/shared';
import type { AppDispatch } from '../../../../store';
import { APPLICATIONS_CONSTANTS, APPLICATIONS_UI, DISCOVERY_SETTINGS_ROUTE } from '../../constants';
import { DiscoveryStatusBar } from '../../components';
import { loadApplicationsSilent } from '../../utils/management/state';

const ApplicationIcon = Icons.Application;
const M = APPLICATIONS_CONSTANTS.MESSAGES;

interface EmptyProps {
  // Applications hidden by the excluded namespaces; above zero, they explain the empty page.
  excludedCount: number;
  onCheckAgain: () => Promise<void>;
}

// Sits in the page frame with the discovery status, so the page can tell waiting from a label or
// namespace problem. No toolbar: with no applications, search and filters have nothing to act on.
const ApplicationsMainEmpty: React.FC<EmptyProps> = memo(({ excludedCount, onCheckAgain }) => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(false);
  const [checked, setChecked] = useState(false);

  const handleCycleComplete = useCallback(() => void loadApplicationsSilent(dispatch), [dispatch]);
  const openSettings = () => navigate(DISCOVERY_SETTINGS_ROUTE);
  const checkAgain = async () => {
    setChecking(true);
    try {
      await onCheckAgain();
      setChecked(true);
    } finally {
      setChecking(false);
    }
  };

  return (
    <PageContainer
      title={APPLICATIONS_UI.HEADER_TITLE}
      subtitle={APPLICATIONS_UI.HEADER_SUBTITLE}
      gap={LIST_PAGE.CONTENT_GAP_PX}
    >
      <DiscoveryStatusBar onCycleComplete={handleCycleComplete} />
      {excludedCount > 0 ? (
        <Empty
          className={EMPTY_CLASS.PAGE}
          image={<ApplicationIcon size={32} />}
          description={
            <Typography.Title level={2}>{M.ALL_EXCLUDED(excludedCount)}</Typography.Title>
          }
        >
          <Button type="primary" onClick={openSettings} style={EMPTY_ACTION_STYLE}>
            {M.OPEN_DISCOVERY_SETTINGS}
          </Button>
        </Empty>
      ) : (
        <Empty
          className={EMPTY_CLASS.PAGE}
          image={<ApplicationIcon size={32} />}
          description={
            <>
              <Typography.Title level={2}>{M.NO_APPLICATIONS_TITLE}</Typography.Title>
              <Typography.Text>{M.NO_APPLICATIONS_DESCRIPTION}</Typography.Text>
              <div style={{ marginTop: 16, maxWidth: 360, textAlign: 'left' }}>
                <Typography.Text strong>{M.HELP_TITLE}</Typography.Text>
                <ul style={{ margin: '4px 0 0', paddingLeft: 18 }}>
                  <li>{M.HELP_LABELS}</li>
                  <li>{M.HELP_EXCLUDED}</li>
                </ul>
              </div>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 16,
              }}
            >
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                loading={checking}
                onClick={checkAgain}
                style={EMPTY_ACTION_STYLE}
              >
                {M.CHECK_AGAIN}
              </Button>
              <Link to={DISCOVERY_SETTINGS_ROUTE} style={{ color: DEFAULT_COLORS.SUCCESS }}>
                {M.OPEN_DISCOVERY_SETTINGS}
              </Link>
              <Typography.Link
                href={DOCS_LINKS.DISCOVERY.HREF}
                target="_blank"
                rel="noopener noreferrer"
              >
                {DOCS_LINKS.DISCOVERY.LABEL}
              </Typography.Link>
            </div>
            {checked ? <Typography.Text type="secondary">{M.LAST_CHECKED}</Typography.Text> : null}
          </div>
        </Empty>
      )}
    </PageContainer>
  );
});

ApplicationsMainEmpty.displayName = 'ApplicationsMainEmpty';

export default ApplicationsMainEmpty;
