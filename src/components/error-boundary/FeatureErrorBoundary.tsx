import React from 'react';
import { Component, ErrorInfo, ReactNode } from 'react';
import { Button, ConfigProvider, Typography } from 'antd';
import { ReloadOutlined, BugOutlined, HomeOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DEFAULT_COLORS,
  FEATURE_ERROR_BOUNDARY_TEXT as T,
  HAIRLINE,
  MONOSPACE_CLASS,
  OVERLAY_THEME,
  PANEL_SURFACE_CLASS,
  STORE_MESSAGES,
  withAlpha,
  FONT_SIZE,
  FONT_WEIGHT,
  RADIUS,
  SPACING,
} from '../../constants';
import { APP_ROUTES, Z_INDEX } from '../../constants';
import { isDevelopment } from '../../utils/helpers/env';
import logger from '../../logging';

const { Title, Text } = Typography;

interface State {
  hasError: boolean;
  error?: Error;
}

interface Props {
  children: ReactNode;
  featureName?: string;
  onReset?: () => void;
}

// A light surface over the dark page, so it takes the panel theme like BaseModal does.
const ErrorSurface: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ConfigProvider theme={OVERLAY_THEME}>
    <div
      className={PANEL_SURFACE_CLASS}
      style={{
        // Off scale, kept exact: padding 40 (above XXXL).
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: `40px ${SPACING.XL}px`,
        background: DEFAULT_COLORS.SURFACE_WHITE,
        zIndex: Z_INDEX.SECTION_OVERLAY,
        overflow: 'auto',
      }}
    >
      {children}
    </div>
  </ConfigProvider>
);

class FeatureErrorBoundaryClass extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const featureContext = this.props.featureName ? `[${this.props.featureName}] ` : '';
    logger.error(`${featureContext}${STORE_MESSAGES.ERROR_BOUNDARY}`, error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorSurface>
          <div style={{ textAlign: 'center', maxWidth: 500, width: '100%' }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: DEFAULT_COLORS.DANGER,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: `0 auto ${SPACING.XXL}px`,
                boxShadow: `0 4px 12px ${withAlpha(DEFAULT_COLORS.DANGER, 0.2)}`,
              }}
            >
              <BugOutlined
                style={{
                  fontSize: FONT_SIZE.H2,
                  color: DEFAULT_COLORS.PILL_TEXT,
                }}
              />
            </div>

            <Title
              level={3}
              style={{
                margin: `0 0 ${SPACING.MD}px`,
                color: DEFAULT_COLORS.TEXT_ON_SURFACE,
                fontWeight: FONT_WEIGHT.SEMIBOLD,
              }}
            >
              {this.props.featureName ? T.TITLE(this.props.featureName) : T.TITLE_FALLBACK}
            </Title>

            <Text
              style={{
                display: 'block',
                marginBottom: SPACING.XXL,
                fontSize: FONT_SIZE.BASE,
                color: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
              }}
            >
              {T.DESCRIPTION}
            </Text>

            {isDevelopment() && this.state.error && (
              <div
                style={{
                  background: DEFAULT_COLORS.SURFACE_SUBTLE,
                  border: HAIRLINE.SURFACE_BORDER_LIGHT,
                  borderRadius: RADIUS.MD,
                  margin: `0 0 ${SPACING.XXL}px`,
                  textAlign: 'left',
                  padding: SPACING.MD,
                }}
              >
                <Text
                  className={MONOSPACE_CLASS}
                  style={{
                    fontSize: FONT_SIZE.XS,
                    color: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {this.state.error.toString()}
                </Text>
              </div>
            )}

            <div
              style={{
                display: 'flex',
                gap: SPACING.MD,
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={this.handleReset}
                style={{
                  background: DEFAULT_COLORS.SUCCESS,
                  border: 'none',
                }}
              >
                {T.TRY_AGAIN}
              </Button>
              <FeatureErrorBoundaryNavigateButton onReset={this.handleReset} />
            </div>
          </div>
        </ErrorSurface>
      );
    }

    return this.props.children;
  }
}

// Separate component to use hooks
const FeatureErrorBoundaryNavigateButton: React.FC<{ onReset: () => void }> = ({ onReset }) => {
  const navigate = useNavigate();
  // The boundary is keyed by pathname, so navigating to the current page would not reset it.
  const { pathname } = useLocation();

  return (
    <Button
      icon={<HomeOutlined />}
      onClick={() => (pathname === APP_ROUTES.HOME ? onReset() : navigate(APP_ROUTES.HOME))}
    >
      {T.GO_TO_DASHBOARD}
    </Button>
  );
};

const FeatureErrorBoundary: React.FC<Props> = (props) => {
  const location = useLocation();
  return (
    <div style={{ position: 'relative', height: '100%', width: '100%', minHeight: '100%' }}>
      <FeatureErrorBoundaryClass key={location.pathname} {...props} />
    </div>
  );
};

export default FeatureErrorBoundary;
