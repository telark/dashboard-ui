import React, { useEffect, useState } from 'react';
import { Layout, App as AntdApp, ConfigProvider, theme } from 'antd';
import { BrowserRouter as Router, useLocation, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Sidebar from './components/layout/sidebar/Sidebar';
import Header from './components/layout/header/Header';
import { FancySpinner } from './components/animation';
import PanelThemePrewarm from './components/display/panels/slide-out/PanelThemePrewarm';
import ErrorBoundary from './ErrorBoundary';
import { AccountSuspendedModal, SessionExpiredModal } from './features/auth/components';
import 'antd/dist/reset.css';
import {
  BUTTON_CONFIGS,
  DEFAULT_COLORS,
  SELECT_THEME,
  TAG_CLASS,
  FIELD_ERROR,
  DROPDOWN_EMPTY,
  TAG_STYLES,
  TAG_THEME,
  APP_CONFIGS,
  APP_ROUTES,
  CONTROL_HEIGHT,
  CONTROL_RADIUS,
  CONTROL_FONT_SIZE,
  FONT_FAMILY,
  FONT_SIZE,
  FORM_ITEM_GAP,
  FORM_LABEL_GAP,
  SELECT_LOADING_ICON_SIZE,
  SIDEBAR_LAYOUT,
} from './constants';
import { LIST_PAGE } from './constants/shared/pages';
import AppRoutes from './routes/AppRoutes';
import { useMediaQuery } from './hooks/layout';
import { isSignedIn, useSessionExpirationCheck } from './features/auth/utils';
import {
  ACTION_PERMISSIONS,
  useCrossTabLogout,
  useInitializePermissions,
  usePermission,
} from './features/auth/hooks';
import { ensureGlobalConfigThunk } from './features/globalconfig/store';
import { AttentionInsightsProvider } from './features/insights/hooks';
import type { AppDispatch } from './store';

const { view: viewSettings } = ACTION_PERMISSIONS.settings;

// The dark algorithm shifts every seed color, so the base colors get their exact tokens back.
const darkAlgorithm: typeof theme.darkAlgorithm = (seed) => ({
  ...theme.darkAlgorithm(seed),
  colorPrimary: seed.colorPrimary,
  colorSuccess: seed.colorSuccess,
  colorWarning: seed.colorWarning,
  colorError: seed.colorError,
  colorInfo: seed.colorInfo,
  colorLink: seed.colorLink,
});

const AppContent: React.FC = () => {
  const location = useLocation();
  const isAuthRoute =
    location.pathname === APP_ROUTES.LOGIN ||
    location.pathname === APP_ROUTES.REGISTER ||
    location.pathname === APP_ROUTES.GOOGLE_CALLBACK ||
    location.pathname === APP_ROUTES.BREAK_GLASS;
  const isAuthenticated = isSignedIn();
  const [showSessionExpiredModal, setShowSessionExpiredModal] = useState(false);
  const [duplicateSessionCookie, setDuplicateSessionCookie] = useState(false);
  const [showAccountSuspendedModal, setShowAccountSuspendedModal] = useState(false);
  // A suspended session is over: its checks and polling stop, and the modal's sign-out is the only way on.
  const isSessionLive = isAuthenticated && !showAccountSuspendedModal;
  const reduceMotion = useMediaQuery(SIDEBAR_LAYOUT.REDUCED_MOTION_QUERY);

  useSessionExpirationCheck({
    isAuthenticated: isSessionLive,
    isAuthRoute,
    onSessionExpired: (duplicateCookie) => {
      setDuplicateSessionCookie(duplicateCookie);
      setShowSessionExpiredModal(true);
    },
    onAccountSuspended: () => setShowAccountSuspendedModal(true),
  });

  useInitializePermissions(isSessionLive);
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
            id={APP_CONFIGS.LAYOUT.CONTENT_ID}
            style={{
              marginLeft: APP_CONFIGS.LAYOUT.MARGIN_LEFT,
              marginTop: APP_CONFIGS.LAYOUT.CONTENT_TOP,
              height: APP_CONFIGS.LAYOUT.CONTENT_HEIGHT,
              overflowY: APP_CONFIGS.LAYOUT.CONTENT_OVERFLOW,
              scrollbarGutter: APP_CONFIGS.LAYOUT.SCROLLBAR_GUTTER,
              transition: reduceMotion ? 'none' : APP_CONFIGS.LAYOUT.TRANSITION,
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
    <AntdApp message={{ top: APP_CONFIGS.MESSAGE.TOP, maxCount: APP_CONFIGS.MESSAGE.MAX_COUNT }}>
      <AttentionInsightsProvider active={isSessionLive && !isAuthRoute}>
        {renderMainContent()}
      </AttentionInsightsProvider>
      {isAuthenticated && !isAuthRoute ? <PanelThemePrewarm /> : null}
      <SessionExpiredModal
        open={showSessionExpiredModal}
        duplicateCookie={duplicateSessionCookie}
        onClose={() => setShowSessionExpiredModal(false)}
      />
      <AccountSuspendedModal
        open={showAccountSuspendedModal}
        onClose={() => setShowAccountSuspendedModal(false)}
      />
    </AntdApp>
  );
};

// Every dropdown without its own empty text says this, not antd's "No data" box.
const DROPDOWNS = new Set(['Select', 'TreeSelect', 'Cascader', 'AutoComplete']);
const renderEmpty = (componentName?: string) =>
  componentName && DROPDOWNS.has(componentName) ? DROPDOWN_EMPTY.DEFAULT : undefined;

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ConfigProvider
        // currentColor follows the button text: the default green vanishes on a primary button.
        button={{ loadingIcon: <FancySpinner size={CONTROL_FONT_SIZE} color="currentColor" /> }}
        select={{ loadingIcon: <FancySpinner size={SELECT_LOADING_ICON_SIZE} /> }}
        tag={{ variant: 'solid', className: TAG_CLASS.PILL, styles: TAG_STYLES }}
        renderEmpty={renderEmpty}
        form={{
          classNames: { helpItem: FIELD_ERROR.CLASS },
          styles: { helpItem: FIELD_ERROR.STYLE },
        }}
        theme={{
          cssVar: { key: 'telark' },
          hashed: false,
          algorithm: darkAlgorithm,
          token: {
            // The single control box style: height, radius and font for every antd
            // Button/Input/Select/InputNumber/DatePicker. TOOLBAR_CONTROL feeds the
            // app's own buttons from the same constants. Do not restyle these locally.
            controlHeight: CONTROL_HEIGHT,
            borderRadius: CONTROL_RADIUS,
            fontSize: CONTROL_FONT_SIZE,
            // Portals (tooltips, menus, popups, toasts) render outside #root's Geist rule.
            fontFamily: FONT_FAMILY,
            colorPrimary: DEFAULT_COLORS.SUCCESS,
            colorSuccess: DEFAULT_COLORS.SUCCESS,
            // No blue: antd's info Alerts and icons take the muted gray.
            colorInfo: DEFAULT_COLORS.TEXT_MUTED,
            // antd draws every keyboard focus ring in this color; its derived dark mint is 1.76:1 on the page.
            colorPrimaryBorder: DEFAULT_COLORS.TEXT_SECONDARY,
            // Every link in the app, antd's or a plain <a>, takes the brand green from here.
            colorLink: DEFAULT_COLORS.SUCCESS,
            colorLinkHover: DEFAULT_COLORS.SUCCESS_HOVER,
            colorLinkActive: DEFAULT_COLORS.SUCCESS_ACTIVE,
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
            // A selected item takes the Select option's look, not colorPrimary's green.
            Dropdown: {
              colorBgElevated: DEFAULT_COLORS.SURFACE_WHITE,
              colorText: DEFAULT_COLORS.TEXT_ON_SURFACE,
              controlItemBgHover: DEFAULT_COLORS.SURFACE_HOVER,
              colorTextDisabled: DEFAULT_COLORS.TEXT_ON_SURFACE_DISABLED,
              controlItemBgActiveDisabled: DEFAULT_COLORS.SURFACE_WHITE,
              colorPrimary: SELECT_THEME.optionSelectedColor,
              controlItemBgActive: SELECT_THEME.optionSelectedBg,
              controlItemBgActiveHover: SELECT_THEME.controlItemBgActiveHover,
            },
            Select: SELECT_THEME,
            Tag: TAG_THEME,
            Form: {
              itemMarginBottom: FORM_ITEM_GAP,
              labelFontSize: FONT_SIZE.MD,
              labelColor: DEFAULT_COLORS.TEXT_PRIMARY,
              verticalLabelPadding: `0 0 ${FORM_LABEL_GAP}px`,
            },
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
            // The toast surface and its text join the light-surface family. The success icon
            // takes the pressed green (3.2:1 on white), since the brand green is 2.1:1.
            Message: {
              colorSuccess: DEFAULT_COLORS.SUCCESS_ACTIVE,
              contentBg: DEFAULT_COLORS.SURFACE_WHITE,
              colorText: DEFAULT_COLORS.TEXT_ON_SURFACE,
              // antd 6.6 renders the message text as the notice title.
              colorTextHeading: DEFAULT_COLORS.TEXT_ON_SURFACE,
            },
            // The dark algorithm tints row and header borders blue; rows take the
            // same muted hairline the rest of the dark surface uses.
            // Selection is a neutral tint: teal means brand, primary action and success.
            Table: {
              borderColor: DEFAULT_COLORS.BORDER_SUBTLE,
              rowSelectedBg: DEFAULT_COLORS.NEUTRAL_TINT,
              rowSelectedHoverBg: DEFAULT_COLORS.NEUTRAL_TINT,
              rowHoverBg: DEFAULT_COLORS.HOVER_BG,
              // The horizontal scrollbar track is drawn from colorSplit, which the
              // dark algorithm also derives as blue.
              colorSplit: DEFAULT_COLORS.BORDER_SUBTLE,
              stickyScrollBarBg: DEFAULT_COLORS.BORDER_HOVER,
              selectionColumnWidth: LIST_PAGE.TABLE_SELECTION_COLUMN_WIDTH_PX,
              headerSplitColor: 'transparent',
            },
            // The current page is a selection, not a status: the selected quick filter's neutral fill.
            Pagination: {
              itemActiveBg: DEFAULT_COLORS.TEXT_MUTED,
              itemActiveColor: DEFAULT_COLORS.TEXT_ON_SURFACE,
              itemActiveColorHover: DEFAULT_COLORS.TEXT_ON_SURFACE,
            },
            Progress: { defaultColor: DEFAULT_COLORS.SUCCESS },
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
