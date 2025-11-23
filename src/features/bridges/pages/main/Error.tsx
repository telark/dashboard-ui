import React from 'react';
import { Button } from 'antd';
import { FancySpinner } from '../../../../components/shared';
import { BRIDGES_CONSTANTS } from '../../constants';

interface BridgeMainErrorProps {
  isInCooldown: boolean;
  cooldownTime: number;
  retryCount: number;
  nextRetryIn: number;
  onCancel: () => void;
}

const BridgeMainError: React.FC<BridgeMainErrorProps> = React.memo(
  ({ isInCooldown, cooldownTime, retryCount, nextRetryIn, onCancel }) => {
    const formatTime = (ms: number) => Math.ceil(ms / 1000);
    const progressPercentage =
      ((BRIDGES_CONSTANTS.COOLDOWN.DURATION_MS - cooldownTime) /
        BRIDGES_CONSTANTS.COOLDOWN.DURATION_MS) *
      100;

    return (
      <div style={BRIDGES_CONSTANTS.LAYOUT.ERROR_CONTAINER}>
        <div style={BRIDGES_CONSTANTS.LAYOUT.ERROR_CONTENT}>
          <div
            style={{
              fontSize: 24,
              fontWeight: 600,
              color: BRIDGES_CONSTANTS.COLORS.TEXT_PRIMARY,
              marginBottom: 16,
            }}
          >
            {BRIDGES_CONSTANTS.MESSAGES.CONNECTION_PROBLEM}
          </div>

          <div
            style={{
              fontSize: 16,
              color: BRIDGES_CONSTANTS.COLORS.TEXT_SECONDARY,
              marginBottom: 32,
              lineHeight: 1.6,
            }}
          >
            {isInCooldown
              ? BRIDGES_CONSTANTS.MESSAGES.ERROR_COOLDOWN
              : BRIDGES_CONSTANTS.MESSAGES.ERROR_RETRYING}
          </div>

          <div style={{ textAlign: 'center' }}>
            {isInCooldown ? (
              <>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 600,
                    color: BRIDGES_CONSTANTS.COLORS.WARNING,
                    marginBottom: 12,
                  }}
                >
                  {BRIDGES_CONSTANTS.MESSAGES.COOLDOWN_TITLE}
                </div>

                <div
                  style={{
                    fontSize: 14,
                    color: BRIDGES_CONSTANTS.COLORS.TEXT_MUTED,
                    marginBottom: 16,
                  }}
                >
                  {BRIDGES_CONSTANTS.MESSAGES.COOLDOWN_DESCRIPTION.replace(
                    '{seconds}',
                    formatTime(cooldownTime).toString(),
                  )}
                </div>

                <div style={BRIDGES_CONSTANTS.LAYOUT.PROGRESS_BAR_CONTAINER}>
                  <div
                    style={{
                      ...BRIDGES_CONSTANTS.LAYOUT.PROGRESS_BAR_FILL,
                      width: `${progressPercentage}%`,
                    }}
                  />
                </div>
              </>
            ) : (
              <>
                <FancySpinner label={BRIDGES_CONSTANTS.MESSAGES.RETRYING} showLabel={true} />
                <div
                  style={{
                    marginTop: 12,
                    color: BRIDGES_CONSTANTS.COLORS.TEXT_MUTED,
                    fontSize: 14,
                  }}
                >
                  {BRIDGES_CONSTANTS.MESSAGES.ATTEMPT_COUNT.replace(
                    '{current}',
                    retryCount.toString(),
                  ).replace('{max}', '5')}
                  {nextRetryIn > 0 && (
                    <div>
                      {BRIDGES_CONSTANTS.MESSAGES.NEXT_RETRY.replace(
                        '{seconds}',
                        formatTime(nextRetryIn).toString(),
                      )}
                    </div>
                  )}
                </div>
              </>
            )}

            <Button type="text" onClick={onCancel} style={{ marginTop: 8 }}>
              {BRIDGES_CONSTANTS.MESSAGES.CANCEL}
            </Button>
          </div>
        </div>
      </div>
    );
  },
);

BridgeMainError.displayName = 'BridgeMainError';

export default BridgeMainError;
