import React from 'react';
import { Button, Typography, Card } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { WORKLOADS_PAGE_CONSTANTS } from '../../../constants/pages/workloads';

const { Title, Text } = Typography;

interface ErrorProps {
  isInCooldown?: boolean;
  cooldownTime?: number;
  isRetrying?: boolean;
  retryCount?: number;
  nextRetryIn?: number;
  onCancel?: () => void;
  onRetry?: () => void;
}

const Error: React.FC<ErrorProps> = React.memo(({
  isInCooldown = false,
  cooldownTime = 0,
  isRetrying = false,
  retryCount = 0,
  nextRetryIn = 0,
  onCancel,
  onRetry,
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  return (
    <div style={WORKLOADS_PAGE_CONSTANTS.LAYOUT.ERROR_CONTAINER}>
      <Card style={WORKLOADS_PAGE_CONSTANTS.LAYOUT.ERROR_CONTENT}>
        <div style={{ textAlign: 'center' }}>
          <div style={WORKLOADS_PAGE_CONSTANTS.LAYOUT.EMPTY_ICON}>
            <ReloadOutlined />
          </div>
          
          <Title level={3} style={{ color: WORKLOADS_PAGE_CONSTANTS.COLORS.WARNING, marginBottom: 8 }}>
            {WORKLOADS_PAGE_CONSTANTS.MESSAGES.CONNECTION_PROBLEM}
          </Title>
          
          <Text style={{ color: WORKLOADS_PAGE_CONSTANTS.COLORS.TEXT_SECONDARY, marginBottom: 16, display: 'block' }}>
            {isInCooldown 
              ? WORKLOADS_PAGE_CONSTANTS.MESSAGES.ERROR_COOLDOWN
              : WORKLOADS_PAGE_CONSTANTS.MESSAGES.ERROR_RETRYING
            }
          </Text>

          {isRetrying && (
            <div style={{ marginBottom: 16 }}>
              <Text style={{ color: WORKLOADS_PAGE_CONSTANTS.COLORS.TEXT_MUTED }}>
                {WORKLOADS_PAGE_CONSTANTS.MESSAGES.ATTEMPT_COUNT
                  .replace('{current}', retryCount.toString())
                  .replace('{max}', WORKLOADS_PAGE_CONSTANTS.RETRY.MAX_ATTEMPTS.toString())
                }
              </Text>
            </div>
          )}

          {isInCooldown && cooldownTime > 0 && (
            <div style={{ marginBottom: 16 }}>
              <Text style={{ color: WORKLOADS_PAGE_CONSTANTS.COLORS.TEXT_MUTED }}>
                {WORKLOADS_PAGE_CONSTANTS.MESSAGES.COOLDOWN_DESCRIPTION
                  .replace('{seconds}', formatTime(cooldownTime))
                }
              </Text>
            </div>
          )}

          {nextRetryIn > 0 && !isInCooldown && (
            <div style={{ marginBottom: 16 }}>
              <Text style={{ color: WORKLOADS_PAGE_CONSTANTS.COLORS.TEXT_MUTED }}>
                {WORKLOADS_PAGE_CONSTANTS.MESSAGES.NEXT_RETRY
                  .replace('{seconds}', formatTime(nextRetryIn))
                }
              </Text>
            </div>
          )}

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            {onRetry && (
              <Button 
                type="primary" 
                icon={<ReloadOutlined />} 
                onClick={onRetry}
                disabled={isRetrying || isInCooldown}
              >
                {WORKLOADS_PAGE_CONSTANTS.MESSAGES.REFRESH}
              </Button>
            )}
            
            {onCancel && (isRetrying || isInCooldown) && (
              <Button onClick={onCancel}>
                {WORKLOADS_PAGE_CONSTANTS.MESSAGES.CANCEL}
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
});

Error.displayName = 'Error';

export default Error;
