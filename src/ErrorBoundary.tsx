import { Component, ErrorInfo, ReactNode } from 'react';
import { Button, Typography } from 'antd';
import { ReloadOutlined, BugOutlined } from '@ant-design/icons';
import { DEFAULT_COLORS, STORE_MESSAGES } from './constants';
import { isDevelopment } from './utils/helpers/env';
import logger from './logging';

const { Title, Text } = Typography;

interface State {
  hasError: boolean;
  error?: Error;
}

interface Props {
  children: ReactNode;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    logger.error(STORE_MESSAGES.ERROR_BOUNDARY, error, errorInfo);
  }

  handleReload = () => {
    globalThis.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            zIndex: 9999,
          }}
        >
          <div style={{ textAlign: 'center', maxWidth: 600, width: '100%' }}>
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #ff6b6b, #ee5a52)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                boxShadow: '0 8px 20px rgba(255,107,107,0.3)',
              }}
            >
              <BugOutlined
                style={{
                  fontSize: 32,
                  color: '#ffffff',
                }}
              />
            </div>

            <Title
              level={2}
              style={{
                margin: '0 0 16px',
                color: '#2c3e50',
                fontWeight: 700,
              }}
            >
              Oops! Something went wrong
            </Title>

            {isDevelopment() && this.state.error && (
              <div
                style={{
                  background: '#f8f9fa',
                  border: '1px solid #e9ecef',
                  borderRadius: 8,
                  margin: '0 0 24px',
                  textAlign: 'left',
                  padding: '16px',
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
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
                icon={<ReloadOutlined />}
                onClick={this.handleReload}
                style={{
                  background: DEFAULT_COLORS.SUCCESS,
                  border: 'none',
                  padding: '0 24px',
                  fontWeight: 600,
                }}
              >
                Reload Page
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
