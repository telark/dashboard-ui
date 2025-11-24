import React from 'react';
import { Button } from 'antd';
import { FancySpinner } from '../../../../../components/shared';
import { WORKLOADS_CONSTANTS } from '../../constants';

interface WorkloadMainErrorProps {
  isInCooldown: boolean;
  cooldownTime: number;
  retryCount: number;
  nextRetryIn: number;
  onCancel: () => void;
}

const WorkloadMainError: React.FC<WorkloadMainErrorProps> = React.memo(
  ({ isInCooldown, cooldownTime, retryCount, nextRetryIn, onCancel }) => {
    const formatTime = (ms: number) => Math.ceil(ms / 1000);
    const progressPercentage =
      ((WORKLOADS_CONSTANTS.COOLDOWN.DURATION_MS - cooldownTime) /
        WORKLOADS_CONSTANTS.COOLDOWN.DURATION_MS) *
      100;

    return (
      <div style={WORKLOADS_CONSTANTS.LAYOUT.ERROR_CONTAINER}>
        <div style={WORKLOADS_CONSTANTS.LAYOUT.ERROR_CONTENT}>
          <div
            style={{
              fontSize: 24,
              fontWeight: 600,
              color: WORKLOADS_CONSTANTS.COLORS.TEXT_PRIMARY,
              marginBottom: 16,
            }}
          >
            {WORKLOADS_CONSTANTS.MESSAGES.CONNECTION_PROBLEM}
          </div>

          <div
            style={{
              fontSize: 16,
              color: WORKLOADS_CONSTANTS.COLORS.TEXT_SECONDARY,
              marginBottom: 32,
              lineHeight: 1.6,
            }}
          >
            {isInCooldown
              ? WORKLOADS_CONSTANTS.MESSAGES.ERROR_COOLDOWN
              : WORKLOADS_CONSTANTS.MESSAGES.ERROR_RETRYING}
          </div>

          <div style={{ textAlign: 'center' }}>
            {isInCooldown ? (
              <>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 600,
                    color: WORKLOADS_CONSTANTS.COLORS.WARNING,
                    marginBottom: 12,
                  }}
                >
                  {WORKLOADS_CONSTANTS.MESSAGES.COOLDOWN_TITLE}
                </div>

                <div
                  style={{
                    fontSize: 14,
                    color: WORKLOADS_CONSTANTS.COLORS.TEXT_MUTED,
                    marginBottom: 16,
                  }}
                >
                  {WORKLOADS_CONSTANTS.MESSAGES.COOLDOWN_DESCRIPTION.replace(
                    '{seconds}',
                    formatTime(cooldownTime).toString(),
                  )}
                </div>

                <div style={WORKLOADS_CONSTANTS.LAYOUT.PROGRESS_BAR_CONTAINER}>
                  <div
                    style={{
                      ...WORKLOADS_CONSTANTS.LAYOUT.PROGRESS_BAR_FILL,
                      width: `${progressPercentage}%`,
                    }}
                  />
                </div>
              </>
            ) : (
              <>
                <FancySpinner label={WORKLOADS_CONSTANTS.MESSAGES.RETRYING} showLabel={true} />
                <div
                  style={{
                    marginTop: 12,
                    color: WORKLOADS_CONSTANTS.COLORS.TEXT_MUTED,
                    fontSize: 14,
                  }}
                >
                  {WORKLOADS_CONSTANTS.MESSAGES.ATTEMPT_COUNT.replace(
                    '{current}',
                    retryCount.toString(),
                  ).replace('{max}', '5')}
                  {nextRetryIn > 0 && (
                    <div>
                      {WORKLOADS_CONSTANTS.MESSAGES.NEXT_RETRY.replace(
                        '{seconds}',
                        formatTime(nextRetryIn).toString(),
                      )}
                    </div>
                  )}
                </div>
              </>
            )}

            <Button type="text" onClick={onCancel} style={{ marginTop: 8 }}>
              {WORKLOADS_CONSTANTS.MESSAGES.CANCEL}
            </Button>
          </div>
        </div>
      </div>
    );
  },
);

WorkloadMainError.displayName = 'WorkloadMainError';

export default WorkloadMainError;
