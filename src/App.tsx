import React, { useState } from 'react';
import { Layout, message, App as AntdApp, ConfigProvider, theme } from 'antd';
import { BrowserRouter as Router, useLocation, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AiOutlineSafety } from 'react-icons/ai';
import Sidebar from './components/layout/sidebar/Sidebar';
import Header from './components/layout/header/Header';
import ErrorBoundary from './ErrorBoundary';
import { SessionExpiredModal } from './features/auth/components';
import EmptyState from './components/display/views/EmptyState';
import 'antd/dist/reset.css';
import { DEFAULT_COLORS, APP_CONFIGS, APP_ROUTES } from './constants';
import AppRoutes from './routes/AppRoutes';
import { hasSessionToken, useSessionExpirationCheck } from './features/auth/utils';
import { useInitializePermissions } from './features/auth/hooks';
import { selectPermissionsState } from './features/auth/store/selectors/permissionsSelectors';
import { AUTH_PERMISSIONS_LABELS, PERMISSION_GATE_BYPASS_PATHS } from './features/auth/constants';

message.config({ top: APP_CONFIGS.MESSAGE.TOP, maxCount: APP_CONFIGS.MESSAGE.MAX_COUNT });

const AppContent: React.FC = () => {
  const location = useLocation();
  const isAuthRoute =
    location.pathname === APP_ROUTES.LOGIN ||
    location.pathname === APP_ROUTES.REGISTER ||
    location.pathname === APP_ROUTES.GOOGLE_CALLBACK;
  const isAuthenticated = hasSessionToken();
  const [showSessionExpiredModal, setShowSessionExpiredModal] = useState(false);
  const { ready: permissionsReady, userID, roles } = useSelector(selectPermissionsState);
  const isBypassPath = PERMISSION_GATE_BYPASS_PATHS.includes(location.pathname);
  const noPermissions =
    permissionsReady &&
    userID !== null &&
    !isBypassPath &&
    (roles.length === 0 || roles.every((r) => r.isExpired));

  // Check session expiration as background task when authenticated
  useSessionExpirationCheck({
    isAuthenticated,
    isAuthRoute,
    onSessionExpired: () => setShowSessionExpiredModal(true),
  });

  // Initialize user permissions when authenticated
  useInitializePermissions(isAuthenticated);

  const renderMainContent = () => {
    if (isAuthRoute) {
      return <AppRoutes />;
    }

    if (isAuthenticated) {
      return (
        <Layout style={{ minHeight: APP_CONFIGS.LAYOUT.MIN_HEIGHT }}>
          <Sidebar />
          <Layout
            style={{
              marginLeft: APP_CONFIGS.LAYOUT.MARGIN_LEFT,
              height: APP_CONFIGS.LAYOUT.HEIGHT,
              transition: APP_CONFIGS.LAYOUT.TRANSITION,
              background: DEFAULT_COLORS.PAGE_BG,
            }}
          >
            <Header />
            {noPermissions ? (
              <EmptyState
                icon={<AiOutlineSafety size={32} style={{ color: DEFAULT_COLORS.ICON_MUTED }} />}
                title={AUTH_PERMISSIONS_LABELS.NO_PERMISSIONS_TITLE}
                description={AUTH_PERMISSIONS_LABELS.NO_PERMISSIONS_DESCRIPTION}
              />
            ) : (
              <AppRoutes />
            )}
          </Layout>
        </Layout>
      );
    }
    return <Navigate to={APP_ROUTES.LOGIN} state={{ from: location }} replace />;
  };

  return (
    <AntdApp>
      {renderMainContent()}
      <SessionExpiredModal
        open={showSessionExpiredModal}
        onClose={() => setShowSessionExpiredModal(false)}
      />
    </AntdApp>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ConfigProvider
        theme={{
          cssVar: { key: 'telark' },
          hashed: false,
          algorithm: theme.darkAlgorithm,
          token: {
            colorPrimary: DEFAULT_COLORS.SUCCESS,
            colorBgBase: DEFAULT_COLORS.PAGE_BG,
            colorTextBase: DEFAULT_COLORS.TEXT_PRIMARY,
            colorBgContainer: DEFAULT_COLORS.BACKGROUND_WHITE,
            colorBgLayout: DEFAULT_COLORS.PAGE_BG,
            colorBorder: DEFAULT_COLORS.BORDER_DEFAULT,
          },
          components: {
            // The dark algorithm derives a near-white disabled text colour, which
            // vanishes on these white surfaces, so it is pinned to a grey instead.
            Dropdown: {
              colorBgElevated: DEFAULT_COLORS.SURFACE_WHITE,
              colorText: DEFAULT_COLORS.TEXT_ON_SURFACE,
              controlItemBgHover: DEFAULT_COLORS.SURFACE_HOVER,
              colorTextDisabled: DEFAULT_COLORS.TEXT_ON_SURFACE_DISABLED,
              controlItemBgActiveDisabled: DEFAULT_COLORS.SURFACE_WHITE,
            },
            Select: {
              colorBgElevated: DEFAULT_COLORS.SURFACE_WHITE,
              optionSelectedBg: DEFAULT_COLORS.SURFACE_WHITE,
              controlItemBgHover: DEFAULT_COLORS.SURFACE_HOVER,
              colorTextDisabled: DEFAULT_COLORS.TEXT_ON_SURFACE_DISABLED,
              multipleItemBg: DEFAULT_COLORS.SURFACE_WHITE,
              multipleItemBorderColor: DEFAULT_COLORS.SURFACE_BORDER,
              optionSelectedColor: DEFAULT_COLORS.TEXT_ON_SURFACE,
              activeBorderColor: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
              hoverBorderColor: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
              activeOutlineColor: 'transparent',
            },
            DatePicker: {
              colorBgElevated: DEFAULT_COLORS.SURFACE_WHITE,
              colorText: DEFAULT_COLORS.TEXT_ON_SURFACE,
              colorTextDisabled: DEFAULT_COLORS.TEXT_ON_SURFACE_DISABLED,
            },
            Tooltip: {
              colorBgSpotlight: DEFAULT_COLORS.SURFACE_WHITE,
              colorTextLightSolid: DEFAULT_COLORS.TEXT_ON_SURFACE,
            },
            // Modals join the light overlay family (panels, dropdowns, popovers)
            // rather than blending into the dark page behind them.
            Modal: {
              contentBg: DEFAULT_COLORS.SURFACE_WHITE,
              headerBg: DEFAULT_COLORS.SURFACE_WHITE,
              footerBg: DEFAULT_COLORS.SURFACE_WHITE,
              titleColor: DEFAULT_COLORS.TEXT_ON_SURFACE,
              colorText: DEFAULT_COLORS.TEXT_ON_SURFACE,
              colorIcon: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
              colorIconHover: DEFAULT_COLORS.TEXT_ON_SURFACE,
              colorTextDescription: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
              colorSplit: DEFAULT_COLORS.SURFACE_BORDER_LIGHT,
            },
            // Date hovers (TimeAgo) render as Popovers, not Tooltips.
            Popover: {
              colorBgElevated: DEFAULT_COLORS.SURFACE_WHITE,
              colorText: DEFAULT_COLORS.TEXT_ON_SURFACE,
              colorTextHeading: DEFAULT_COLORS.TEXT_ON_SURFACE,
            },
            Button: {
              primaryShadow: 'none',
              dangerShadow: 'none',
              defaultShadow: 'none',
            },
            Checkbox: {
              colorPrimary: DEFAULT_COLORS.SUCCESS,
              colorPrimaryHover: DEFAULT_COLORS.SUCCESS,
              colorPrimaryBorder: DEFAULT_COLORS.SUCCESS,
            },
            // Selected option reads as a white box with dark text; unselected labels
            // stay white so they hold up on the dark surfaces behind them.
            Segmented: {
              itemSelectedBg: DEFAULT_COLORS.SURFACE_WHITE,
              itemSelectedColor: DEFAULT_COLORS.TEXT_ON_SURFACE,
              itemColor: DEFAULT_COLORS.TEXT_PRIMARY,
              itemHoverColor: DEFAULT_COLORS.TEXT_PRIMARY,
            },
          },
        }}
      >
        <Router>
          <AppContent />
        </Router>
      </ConfigProvider>
    </ErrorBoundary>
  );
};

export default App;
