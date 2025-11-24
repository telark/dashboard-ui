import React from 'react';
import { Button } from 'antd';
import { FancySpinner } from '../../animation';
import { CONNECTIVITY_CONSTANTS } from '../../../constants/pages/connectivity';

interface ReachabilityErrorViewProps {
  isInCooldown: boolean;
  cooldownTime: number;
  retryCount: number;
  nextRetryIn: number;
  onCancel: () => void;
}

const ReachabilityErrorView: React.FC<ReachabilityErrorViewProps> = React.memo(
  ({ isInCooldown, cooldownTime, retryCount, nextRetryIn, onCancel }) => {
    const formatTime = (ms: number) => Math.ceil(ms / 1000);
    const progressPercentage =
      ((CONNECTIVITY_CONSTANTS.COOLDOWN.DURATION_MS - cooldownTime) /
        CONNECTIVITY_CONSTANTS.COOLDOWN.DURATION_MS) *
      100;

    return (
      <div style={CONNECTIVITY_CONSTANTS.LAYOUT.ERROR_CONTAINER}>
        <div style={CONNECTIVITY_CONSTANTS.LAYOUT.ERROR_CONTENT}>
          <div
            style={{
              fontSize: 24,
              fontWeight: 600,
              color: CONNECTIVITY_CONSTANTS.COLORS.TEXT_PRIMARY,
              marginBottom: 16,
            }}
          >
            {CONNECTIVITY_CONSTANTS.MESSAGES.CONNECTION_PROBLEM}
          </div>

          <div
            style={{
              fontSize: 16,
              color: CONNECTIVITY_CONSTANTS.COLORS.TEXT_SECONDARY,
              marginBottom: 32,
              lineHeight: 1.6,
            }}
          >
            {isInCooldown
              ? CONNECTIVITY_CONSTANTS.MESSAGES.ERROR_COOLDOWN
              : CONNECTIVITY_CONSTANTS.MESSAGES.ERROR_RETRYING}
          </div>

          <div style={{ textAlign: 'center' }}>
            {isInCooldown ? (
              <>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 600,
                    color: CONNECTIVITY_CONSTANTS.COLORS.WARNING,
                    marginBottom: 12,
                  }}
                >
                  {CONNECTIVITY_CONSTANTS.MESSAGES.COOLDOWN_TITLE}
                </div>

                <div
                  style={{
                    fontSize: 14,
                    color: CONNECTIVITY_CONSTANTS.COLORS.TEXT_MUTED,
                    marginBottom: 16,
                  }}
                >
                  {CONNECTIVITY_CONSTANTS.MESSAGES.COOLDOWN_DESCRIPTION.replace(
                    '{seconds}',
                    formatTime(cooldownTime).toString(),
                  )}
                </div>

                <div style={CONNECTIVITY_CONSTANTS.LAYOUT.PROGRESS_BAR_CONTAINER}>
                  <div
                    style={{
                      ...CONNECTIVITY_CONSTANTS.LAYOUT.PROGRESS_BAR_FILL,
                      width: `${progressPercentage}%`,
                    }}
                  />
                </div>
              </>
            ) : (
              <>
                <FancySpinner label={CONNECTIVITY_CONSTANTS.MESSAGES.RETRYING} showLabel={true} />
                <div
                  style={{
                    marginTop: 12,
                    color: CONNECTIVITY_CONSTANTS.COLORS.TEXT_MUTED,
                    fontSize: 14,
                  }}
                >
                  {CONNECTIVITY_CONSTANTS.MESSAGES.ATTEMPT_COUNT.replace(
                    '{current}',
                    retryCount.toString(),
                  ).replace('{max}', CONNECTIVITY_CONSTANTS.RETRY.MAX_ATTEMPTS.toString())}
                  {nextRetryIn > 0 && (
                    <div>
                      {CONNECTIVITY_CONSTANTS.MESSAGES.NEXT_RETRY.replace(
                        '{seconds}',
                        formatTime(nextRetryIn).toString(),
                      )}
                    </div>
                  )}
                </div>
              </>
            )}

            <Button type="text" onClick={onCancel} style={{ marginTop: 8 }}>
              {CONNECTIVITY_CONSTANTS.MESSAGES.CANCEL}
            </Button>
          </div>
        </div>
      </div>
    );
  },
);

ReachabilityErrorView.displayName = 'ReachabilityErrorView';

export default ReachabilityErrorView;
