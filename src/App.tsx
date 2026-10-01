import React, { useEffect, useState } from 'react';
import { Layout, message, App as AntdApp, ConfigProvider, theme } from 'antd';
import { BrowserRouter as Router, useLocation, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Sidebar from './components/layout/sidebar/Sidebar';
import Header from './components/layout/header/Header';
import ErrorBoundary from './ErrorBoundary';
import { SessionExpiredModal } from './features/auth/components';
import 'antd/dist/reset.css';
import {
  BUTTON_CONFIGS,
  DEFAULT_COLORS,
  SELECT_THEME,
  APP_CONFIGS,
  APP_ROUTES,
  CONTROL_HEIGHT,
  CONTROL_RADIUS,
  CONTROL_FONT_SIZE,
} from './constants';
import AppRoutes from './routes/AppRoutes';
import { hasSessionToken, useSessionExpirationCheck } from './features/auth/utils';
import {
  ACTION_PERMISSIONS,
  useCrossTabLogout,
  useInitializePermissions,
  usePermission,
} from './features/auth/hooks';
import { ensureGlobalConfigThunk } from './features/globalconfig/store';
import type { AppDispatch } from './store';

message.config({ top: APP_CONFIGS.MESSAGE.TOP, maxCount: APP_CONFIGS.MESSAGE.MAX_COUNT });

const { view: viewSettings } = ACTION_PERMISSIONS.settings;

const AppContent: React.FC = () => {
  const location = useLocation();
  const isAuthRoute =
    location.pathname === APP_ROUTES.LOGIN ||
    location.pathname === APP_ROUTES.REGISTER ||
    location.pathname === APP_ROUTES.GOOGLE_CALLBACK;
  const isAuthenticated = hasSessionToken();
  const [showSessionExpiredModal, setShowSessionExpiredModal] = useState(false);

  useSessionExpirationCheck({
    isAuthenticated,
    isAuthRoute,
    onSessionExpired: () => setShowSessionExpiredModal(true),
  });

  useInitializePermissions(isAuthenticated);
  useCrossTabLogout();

  // GlobalConfig is a guarded resource (settings ReadOnly): fetching it without a
  // session or without that grant only earns a 401 or 403.
  const dispatch = useDispatch<AppDispatch>();
  const canViewSettings = usePermission(viewSettings.scope, viewSettings.level);
  useEffect(() => {
    if (isAuthenticated && canViewSettings) {
      dispatch(ensureGlobalConfigThunk());
    }
  }, [isAuthenticated, canViewSettings, dispatch]);

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
            <AppRoutes />
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
            // The single control box style: height, radius and font for every antd
            // Button/Input/Select/InputNumber/DatePicker. TOOLBAR_CONTROL feeds the
            // app's own buttons from the same constants. Do not restyle these locally.
            controlHeight: CONTROL_HEIGHT,
            borderRadius: CONTROL_RADIUS,
            fontSize: CONTROL_FONT_SIZE,
            colorPrimary: DEFAULT_COLORS.SUCCESS,
            colorError: DEFAULT_COLORS.DANGER,
            colorWarning: DEFAULT_COLORS.WARNING,
            colorBgBase: DEFAULT_COLORS.PAGE_BG,
            colorTextBase: DEFAULT_COLORS.TEXT_PRIMARY,
            colorBgContainer: DEFAULT_COLORS.PAGE_BG,
            colorBgLayout: DEFAULT_COLORS.PAGE_BG,
            colorBorder: DEFAULT_COLORS.BORDER_DEFAULT,
          },
          components: {
            // The dark algorithm derives a near-white disabled text color, which
            // vanishes on these white surfaces, so it is pinned to a gray instead.
            Dropdown: {
              colorBgElevated: DEFAULT_COLORS.SURFACE_WHITE,
              colorText: DEFAULT_COLORS.TEXT_ON_SURFACE,
              controlItemBgHover: DEFAULT_COLORS.SURFACE_HOVER,
              colorTextDisabled: DEFAULT_COLORS.TEXT_ON_SURFACE_DISABLED,
              controlItemBgActiveDisabled: DEFAULT_COLORS.SURFACE_WHITE,
            },
            Select: SELECT_THEME,
            // Focus ring matches Select: colorPrimary is the app green, which antd
            // would otherwise use for the active border and shadow.
            Input: {
              activeBorderColor: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
              hoverBorderColor: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
              activeShadow: 'none',
            },
            InputNumber: {
              activeBorderColor: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
              hoverBorderColor: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
              activeShadow: 'none',
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
            // Status icons (success/error/etc.) key off colorSuccess/colorError and
            // are untouched by this — only the toast surface and its text join the
            // light-surface family.
            Message: {
              contentBg: DEFAULT_COLORS.SURFACE_WHITE,
              colorText: DEFAULT_COLORS.TEXT_ON_SURFACE,
              // antd 6.6 renders the message text as the notice title.
              colorTextHeading: DEFAULT_COLORS.TEXT_ON_SURFACE,
            },
            // The dark algorithm tints row and header borders blue; rows take the
            // same muted hairline the rest of the dark surface uses.
            // Selection reads as the same green tint as a selected application card,
            // not a solid primary fill.
            Table: {
              borderColor: DEFAULT_COLORS.BORDER_SUBTLE,
              rowSelectedBg: DEFAULT_COLORS.SUCCESS_TINT,
              rowSelectedHoverBg: DEFAULT_COLORS.SUCCESS_TINT,
              rowHoverBg: DEFAULT_COLORS.HOVER_BG,
              // The horizontal scrollbar track is drawn from colorSplit, which the
              // dark algorithm also derives as blue.
              colorSplit: DEFAULT_COLORS.BORDER_SUBTLE,
              stickyScrollBarBg: DEFAULT_COLORS.BORDER_HOVER,
            },
            Button: {
              primaryColor: BUTTON_CONFIGS.PRIMARY_BUTTON.TEXT_COLOR,
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
