import React from 'react';
import { Component, ErrorInfo, ReactNode } from 'react';
import { Button, Typography } from 'antd';
import { ReloadOutlined, BugOutlined, HomeOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { DEFAULT_COLORS, STORE_MESSAGES } from '../../constants';
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
            background: '#ffffff',
            zIndex: 10,
            overflow: 'auto',
          }}
        >
          <div style={{ textAlign: 'center', maxWidth: 500, width: '100%' }}>
            {/* Error Icon */}
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #ff6b6b, #ee5a52)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                boxShadow: '0 4px 12px rgba(255,107,107,0.2)',
              }}
            >
              <BugOutlined
                style={{
                  fontSize: 24,
                  color: '#ffffff',
                }}
              />
            </div>

            {/* Error Title */}
            <Title
              level={3}
              style={{
                margin: '0 0 12px',
                color: '#2c3e50',
                fontWeight: 600,
              }}
            >
              {this.props.featureName
                ? `Error in ${this.props.featureName}`
                : 'Something went wrong'}
            </Title>

            <Text
              type="secondary"
              style={{
                display: 'block',
                marginBottom: 24,
                fontSize: 14,
              }}
            >
              An error occurred while loading this section. You can try again or return to the
              dashboard.
            </Text>

            {/* Error Details (Development) */}
            {isDevelopment() && this.state.error && (
              <div
                style={{
                  background: '#f8f9fa',
                  border: '1px solid #e9ecef',
                  borderRadius: 8,
                  margin: '0 0 24px',
                  textAlign: 'left',
                  padding: '12px',
                }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    color: '#6c757d',
                    fontFamily: 'monospace',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {this.state.error.toString()}
                </Text>
              </div>
            )}

            {/* Action Buttons */}
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
                Try Again
              </Button>
              <FeatureErrorBoundaryNavigateButton />
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Separate component to use hooks
const FeatureErrorBoundaryNavigateButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Button
      size="middle"
      icon={<HomeOutlined />}
      onClick={() => navigate(APP_ROUTES.HOME)}
      style={{
        borderColor: '#d9d9d9',
      }}
    >
      Go to Dashboard
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
