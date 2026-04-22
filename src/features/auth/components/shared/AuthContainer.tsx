/*
 * Responsive layout breakpoints:
 *   ≥992px  (lg) — 2-column split: 45% brand panel | 55% auth
 *   768–992px (md) — compact top banner + full-width auth card
 *   <768px (sm/xs) — banner hidden; auth card centered, full width
 */
import React from 'react';
import { Row, Col, Grid } from 'antd';

const { useBreakpoint } = Grid;

const DOT_GRID_BG = `
  radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px),
  linear-gradient(145deg, #0f172a 0%, #1a2744 55%, #0c1f3a 100%)
`.trim();

interface AuthContainerProps {
  children: React.ReactNode;
  leftPanel?: React.ReactNode;
  compactBanner?: React.ReactNode;
}

export const AuthContainer: React.FC<AuthContainerProps> = ({
  children,
  leftPanel,
  compactBanner,
}) => {
  const screens = useBreakpoint();
  const showLeftPanel = !!leftPanel && !!screens.lg;
  const showBanner = !!compactBanner && !!screens.md && !screens.lg;

  if (leftPanel) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--auth-right-bg, #f8fafc)',
        }}
      >
        {showBanner && (
          <div
            style={{
              background: 'linear-gradient(90deg, #0f172a 0%, #1a2744 100%)',
              padding: '14px 24px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {compactBanner}
          </div>
        )}
        <Row style={{ flex: 1 }}>
          {showLeftPanel && (
            <Col
              lg={11}
              style={{
                backgroundImage: DOT_GRID_BG,
                backgroundSize: '20px 20px, 100% 100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '48px',
                minHeight: '100vh',
                position: 'relative',
              }}
            >
              {leftPanel}
            </Col>
          )}
          <Col
            xs={24}
            lg={showLeftPanel ? 13 : 24}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--auth-right-bg, #f8fafc)',
              padding: '40px 20px',
              minHeight: showBanner ? 'calc(100vh - 52px)' : '100vh',
            }}
          >
            {children}
          </Col>
        </Row>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'var(--auth-right-bg, #f8fafc)',
        padding: '20px',
      }}
    >
      {children}
    </div>
  );
};
