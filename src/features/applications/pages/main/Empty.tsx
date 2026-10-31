import React, { memo, useCallback, useState } from 'react';
import { Button, Empty, Tooltip, Typography } from 'antd';
import { InfoCircleOutlined, QuestionCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  DEFAULT_COLORS,
  DOCS_LINKS,
  EMPTY_ACTION_STYLE,
  EMPTY_CLASS,
  Icons,
  MONOSPACE_CLASS,
  SECTION_LAYOUT,
  RADIUS,
  SPACING,
  FONT_SIZE,
  FONT_WEIGHT,
  UNSTYLED_BUTTON,
} from '../../../../constants';
import { LIST_PAGE } from '../../../../constants/shared/pages';
import { PageContainer } from '../../../../components/shared';
import { FancySpinner } from '../../../../components/animation';
import { Step, StepList } from '../../../../components/display/steps';
import type { AppDispatch } from '../../../../store';
import {
  APPLICATIONS_CONSTANTS,
  APPLICATIONS_UI,
  DISCOVERY_LABELS,
  DISCOVERY_LABELS_HINT,
  DISCOVERY_SETTINGS_ROUTE,
} from '../../constants';
import { DiscoveryStatusBar } from '../../components';
import { loadApplicationsSilent } from '../../utils/management/state';

const ApplicationIcon = Icons.Application;
const M = APPLICATIONS_CONSTANTS.MESSAGES;
const H = M.HELP_STEPS;

const helperStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: SPACING.S6,
  fontSize: FONT_SIZE.SM,
  color: DEFAULT_COLORS.TEXT_MUTED,
};

const iconTileStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 52,
  height: 52,
  borderRadius: RADIUS.LG,
  background: DEFAULT_COLORS.SURFACE_ELEVATED,
  border: SECTION_LAYOUT.SUBTLE_DIVIDER,
  color: DEFAULT_COLORS.SUCCESS,
};

// The help box matches the Home boxes: elevated surface, icon and title header, numbered steps.
const helpBoxStyle: React.CSSProperties = {
  boxSizing: 'border-box',
  width: '100%',
  maxWidth: 760,
  margin: '0 auto',
  padding: SPACING.LG,
  borderRadius: RADIUS.MD,
  background: DEFAULT_COLORS.SURFACE_ELEVATED,
  border: SECTION_LAYOUT.SUBTLE_DIVIDER,
};

// The label keys in monospace, the joining words ("with", "or") as text.
const labelKeys = DISCOVERY_LABELS.split(/(, or |, | with )/).map((part, i) =>
  i % 2 ? (
    part
  ) : (
    <span key={part} className={MONOSPACE_CLASS}>
      {part}
    </span>
  ),
);

const iconTile = (
  <span style={iconTileStyle}>
    <ApplicationIcon size={24} />
  </span>
);

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
          image={iconTile}
          description={
            <Typography.Title level={2}>{M.ALL_EXCLUDED(excludedCount)}</Typography.Title>
          }
        >
          <Button type="primary" onClick={openSettings} style={EMPTY_ACTION_STYLE}>
            {M.OPEN_DISCOVERY_SETTINGS}
          </Button>
        </Empty>
      ) : (
        <>
          <Empty
            className={EMPTY_CLASS.PAGE}
            image={iconTile}
            description={
              <>
                <Typography.Title level={2}>{M.NO_APPLICATIONS_TITLE}</Typography.Title>
                <Typography.Text>{M.NO_APPLICATIONS_DESCRIPTION}</Typography.Text>
              </>
            }
          />
          <section style={helpBoxStyle}>
            <header
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: `${SPACING.XS}px ${SPACING.MD}px`,
              }}
            >
              <span
                // 15: the help title sits between BASE and LG.
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: SPACING.S6,
                  fontSize: 15,
                  fontWeight: FONT_WEIGHT.SEMIBOLD,
                  color: DEFAULT_COLORS.TEXT_PRIMARY,
                }}
              >
                <QuestionCircleOutlined aria-hidden style={{ color: DEFAULT_COLORS.TEXT_MUTED }} />
                {M.HELP_TITLE}
              </span>
              <Typography.Link
                href={DOCS_LINKS.DISCOVERY.HREF}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: FONT_SIZE.MD }}
              >
                {DOCS_LINKS.DISCOVERY.LABEL}
              </Typography.Link>
            </header>
            <div style={{ marginTop: SPACING.MD }}>
              <StepList>
                <Step number={1} title={H.LABELS.TITLE}>
                  <span style={helperStyle}>
                    {H.LABELS.HELPER}
                    <Tooltip title={<span>{labelKeys}</span>}>
                      <InfoCircleOutlined tabIndex={0} aria-label={DISCOVERY_LABELS_HINT} />
                    </Tooltip>
                  </span>
                </Step>
                <Step number={2} title={H.NAMESPACE.TITLE}>
                  <span style={helperStyle}>{H.NAMESPACE.HELPER}</span>
                  <Link
                    to={DISCOVERY_SETTINGS_ROUTE}
                    style={{ color: DEFAULT_COLORS.SUCCESS, fontSize: FONT_SIZE.SM }}
                  >
                    {M.OPEN_DISCOVERY_SETTINGS}
                  </Link>
                </Step>
                <Step number={3} title={H.CHECK.TITLE} last>
                  <span style={helperStyle}>
                    {checked ? M.LAST_CHECKED : H.CHECK.HELPER}
                    <Tooltip title={M.CHECK_AGAIN}>
                      <button
                        type="button"
                        onClick={() => void checkAgain()}
                        disabled={checking}
                        aria-label={M.CHECK_AGAIN}
                        style={{
                          ...UNSTYLED_BUTTON,
                          display: 'inline-flex',
                          color: DEFAULT_COLORS.TEXT_MUTED,
                        }}
                      >
                        {checking ? (
                          <FancySpinner size={FONT_SIZE.SM} color={DEFAULT_COLORS.TEXT_MUTED} />
                        ) : (
                          <ReloadOutlined />
                        )}
                      </button>
                    </Tooltip>
                  </span>
                </Step>
              </StepList>
            </div>
          </section>
        </>
      )}
    </PageContainer>
  );
});

ApplicationsMainEmpty.displayName = 'ApplicationsMainEmpty';

export default ApplicationsMainEmpty;
