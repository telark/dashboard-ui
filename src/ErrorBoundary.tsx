import { Component, ErrorInfo, ReactNode } from 'react';
import { Button, Typography } from 'antd';
import { ReloadOutlined, BugOutlined } from '@ant-design/icons';
import {
  DEFAULT_COLORS,
  HAIRLINE,
  MONOSPACE_CLASS,
  STORE_MESSAGES,
  withAlpha,
  Z_INDEX,
  FONT_SIZE,
  FONT_WEIGHT,
  RADIUS,
  SPACING,
} from './constants';
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
            background: DEFAULT_COLORS.SURFACE_WHITE,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: SPACING.XL,
            zIndex: Z_INDEX.APP_ERROR,
          }}
        >
          <div style={{ textAlign: 'center', maxWidth: 600, width: '100%' }}>
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: DEFAULT_COLORS.DANGER,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: `0 auto ${SPACING.XXL}px`,
                boxShadow: `0 8px 20px ${withAlpha(DEFAULT_COLORS.DANGER, 0.3)}`,
              }}
            >
              <BugOutlined
                style={{
                  // Off scale, kept exact: fontSize 32 (above H1).
                  fontSize: 32,
                  color: DEFAULT_COLORS.PILL_TEXT,
                }}
              />
            </div>

            <Title
              level={2}
              style={{
                margin: `0 0 ${SPACING.LG}px`,
                color: DEFAULT_COLORS.TEXT_ON_SURFACE,
                fontWeight: FONT_WEIGHT.BOLD,
              }}
            >
              Oops! Something went wrong
            </Title>

            {isDevelopment() && this.state.error && (
              <div
                style={{
                  background: DEFAULT_COLORS.SURFACE_SUBTLE,
                  border: HAIRLINE.SURFACE_BORDER_LIGHT,
                  borderRadius: RADIUS.MD,
                  margin: `0 0 ${SPACING.XXL}px`,
                  textAlign: 'left',
                  padding: SPACING.LG,
                }}
              >
                <Text
                  className={MONOSPACE_CLASS}
                  style={{
                    fontSize: FONT_SIZE.SM,
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
                onClick={this.handleReload}
                style={{
                  background: DEFAULT_COLORS.SUCCESS,
                  border: 'none',
                  padding: `0 ${SPACING.XXL}px`,
                  fontWeight: FONT_WEIGHT.SEMIBOLD,
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
