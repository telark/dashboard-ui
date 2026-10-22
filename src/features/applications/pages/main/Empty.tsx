import React, { memo, useCallback, useState } from 'react';
import { Button, Empty, Typography } from 'antd';
import { QuestionCircleOutlined, ReloadOutlined } from '@ant-design/icons';
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
} from '../../../../constants';
import { LIST_PAGE } from '../../../../constants/shared/pages';
import { PageContainer } from '../../../../components/shared';
import type { AppDispatch } from '../../../../store';
import {
  APPLICATIONS_CONSTANTS,
  APPLICATIONS_UI,
  DISCOVERY_LABELS,
  DISCOVERY_SETTINGS_ROUTE,
} from '../../constants';
import { DiscoveryStatusBar } from '../../components';
import { loadApplicationsSilent } from '../../utils/management/state';

const ApplicationIcon = Icons.Application;
const M = APPLICATIONS_CONSTANTS.MESSAGES;

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
  maxWidth: 680,
  margin: '0 auto',
  padding: SPACING.LG,
  borderRadius: RADIUS.MD,
  background: DEFAULT_COLORS.SURFACE_ELEVATED,
  border: SECTION_LAYOUT.SUBTLE_DIVIDER,
};

const stepNumberStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  width: 20,
  height: 20,
  marginTop: SPACING.XXS,
  borderRadius: '50%',
  background: DEFAULT_COLORS.CHIP_CUSTOM_BG,
  color: DEFAULT_COLORS.TEXT_SECONDARY,
  fontSize: FONT_SIZE.SM,
  fontWeight: FONT_WEIGHT.SEMIBOLD,
};

// 10 and 1.8: the step list's gap and airy leading sit off the scales (between SM and MD, above LOOSE).
const stepStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 10,
  fontSize: FONT_SIZE.MD,
  lineHeight: 1.8,
  color: DEFAULT_COLORS.TEXT_SECONDARY,
};

// 1: the inline code chip's vertical padding sits below XXS.
const codeStyle: React.CSSProperties = {
  padding: `1px ${SPACING.S6}px`,
  borderRadius: RADIUS.XS,
  fontSize: FONT_SIZE.SM,
  whiteSpace: 'nowrap',
  background: DEFAULT_COLORS.CHIP_CUSTOM_BG,
  border: SECTION_LAYOUT.SUBTLE_DIVIDER,
  color: DEFAULT_COLORS.TEXT_SECONDARY,
};

// The label keys in monospace, the joining words ("with", "or") as text.
const labelKeys = DISCOVERY_LABELS.split(/(, or |, | with )/).map((part, i) =>
  i % 2 ? (
    part
  ) : (
    <code key={part} className={MONOSPACE_CLASS} style={codeStyle}>
      {part}
    </code>
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
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: SPACING.SM,
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
              {checked ? (
                <Typography.Text type="secondary">{M.LAST_CHECKED}</Typography.Text>
              ) : null}
            </div>
          </Empty>
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
            <ol
              style={{
                listStyle: 'none',
                margin: `${SPACING.MD}px 0 0`,
                padding: SPACING.NONE,
                display: 'flex',
                flexDirection: 'column',
                gap: SPACING.MD,
              }}
            >
              <li style={stepStyle}>
                <span aria-hidden style={stepNumberStyle}>
                  1
                </span>
                <span>
                  {M.HELP_LABELS_LEAD} {labelKeys}.
                </span>
              </li>
              <li style={stepStyle}>
                <span aria-hidden style={stepNumberStyle}>
                  2
                </span>
                <span
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
                >
                  {M.HELP_EXCLUDED}
                  <Link to={DISCOVERY_SETTINGS_ROUTE} style={{ color: DEFAULT_COLORS.SUCCESS }}>
                    {M.OPEN_DISCOVERY_SETTINGS}
                  </Link>
                </span>
              </li>
            </ol>
          </section>
        </>
      )}
    </PageContainer>
  );
});

ApplicationsMainEmpty.displayName = 'ApplicationsMainEmpty';

export default ApplicationsMainEmpty;
