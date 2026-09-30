import React from 'react';
import { Component, ErrorInfo, ReactNode } from 'react';
import { Button, Typography } from 'antd';
import { ReloadOutlined, BugOutlined, HomeOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DEFAULT_COLORS,
  FEATURE_ERROR_BOUNDARY_TEXT as T,
  STORE_MESSAGES,
  withAlpha,
} from '../../constants';
import { APP_ROUTES } from '../../constants';
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
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px',
            background: DEFAULT_COLORS.SURFACE_WHITE,
            zIndex: 10,
            overflow: 'auto',
          }}
        >
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
                margin: '0 auto 24px',
                boxShadow: `0 4px 12px ${withAlpha(DEFAULT_COLORS.DANGER, 0.2)}`,
              }}
            >
              <BugOutlined
                style={{
                  fontSize: 24,
                  color: DEFAULT_COLORS.PILL_TEXT,
                }}
              />
            </div>

            <Title
              level={3}
              style={{
                margin: '0 0 12px',
                color: DEFAULT_COLORS.TEXT_ON_SURFACE,
                fontWeight: 600,
              }}
            >
              {this.props.featureName ? T.TITLE(this.props.featureName) : T.TITLE_FALLBACK}
            </Title>

            <Text
              style={{
                display: 'block',
                marginBottom: 24,
                fontSize: 14,
                color: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
              }}
            >
              {T.DESCRIPTION}
            </Text>

            {isDevelopment() && this.state.error && (
              <div
                style={{
                  background: DEFAULT_COLORS.SURFACE_SUBTLE,
                  border: `1px solid ${DEFAULT_COLORS.SURFACE_BORDER_LIGHT}`,
                  borderRadius: 8,
                  margin: '0 0 24px',
                  textAlign: 'left',
                  padding: '12px',
                }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    color: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
                    fontFamily: 'monospace',
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
                gap: 12,
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <Button
                type="primary"
                size="middle"
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
        </div>
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
      size="middle"
      icon={<HomeOutlined />}
      onClick={() => (pathname === APP_ROUTES.HOME ? onReset() : navigate(APP_ROUTES.HOME))}
      style={{
        borderColor: DEFAULT_COLORS.SURFACE_BORDER,
      }}
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
