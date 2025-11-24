import React from 'react';
import { Button } from 'antd';
import { FancySpinner } from '../../../../../components/shared';
import { GROUPERS_CONSTANTS } from '../../constants';

interface GrouperMainErrorProps {
  isInCooldown: boolean;
  cooldownTime: number;
  retryCount: number;
  nextRetryIn: number;
  onCancel: () => void;
}

const GrouperMainError: React.FC<GrouperMainErrorProps> = React.memo(
  ({ isInCooldown, cooldownTime, retryCount, nextRetryIn, onCancel }) => {
    const formatTime = (ms: number) => Math.ceil(ms / 1000);
    const progressPercentage =
      ((GROUPERS_CONSTANTS.COOLDOWN.DURATION_MS - cooldownTime) /
        GROUPERS_CONSTANTS.COOLDOWN.DURATION_MS) *
      100;

    return (
      <div style={GROUPERS_CONSTANTS.LAYOUT.ERROR_CONTAINER}>
        <div style={GROUPERS_CONSTANTS.LAYOUT.ERROR_CONTENT}>
          <div
            style={{
              fontSize: 24,
              fontWeight: 600,
              color: GROUPERS_CONSTANTS.COLORS.TEXT_PRIMARY,
              marginBottom: 16,
            }}
          >
            {GROUPERS_CONSTANTS.MESSAGES.CONNECTION_PROBLEM}
          </div>

          <div
            style={{
              fontSize: 16,
              color: GROUPERS_CONSTANTS.COLORS.TEXT_SECONDARY,
              marginBottom: 32,
              lineHeight: 1.6,
            }}
          >
            {isInCooldown
              ? GROUPERS_CONSTANTS.MESSAGES.ERROR_COOLDOWN
              : GROUPERS_CONSTANTS.MESSAGES.ERROR_RETRYING}
          </div>

          <div style={{ textAlign: 'center' }}>
            {isInCooldown ? (
              <>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 600,
                    color: GROUPERS_CONSTANTS.COLORS.WARNING,
                    marginBottom: 12,
                  }}
                >
                  {GROUPERS_CONSTANTS.MESSAGES.COOLDOWN_TITLE}
                </div>

                <div
                  style={{
                    fontSize: 14,
                    color: GROUPERS_CONSTANTS.COLORS.TEXT_MUTED,
                    marginBottom: 16,
                  }}
                >
                  {GROUPERS_CONSTANTS.MESSAGES.COOLDOWN_DESCRIPTION.replace(
                    '{seconds}',
                    formatTime(cooldownTime).toString(),
                  )}
                </div>

                <div style={GROUPERS_CONSTANTS.LAYOUT.PROGRESS_BAR_CONTAINER}>
                  <div
                    style={{
                      ...GROUPERS_CONSTANTS.LAYOUT.PROGRESS_BAR_FILL,
                      width: `${progressPercentage}%`,
                    }}
                  />
                </div>
              </>
            ) : (
              <>
                <FancySpinner label={GROUPERS_CONSTANTS.MESSAGES.RETRYING} showLabel={true} />
                <div
                  style={{
                    marginTop: 12,
                    color: GROUPERS_CONSTANTS.COLORS.TEXT_MUTED,
                    fontSize: 14,
                  }}
                >
                  {GROUPERS_CONSTANTS.MESSAGES.ATTEMPT_COUNT.replace(
                    '{current}',
                    retryCount.toString(),
                  ).replace('{max}', '5')}
                  {nextRetryIn > 0 && (
                    <div>
                      {GROUPERS_CONSTANTS.MESSAGES.NEXT_RETRY.replace(
                        '{seconds}',
                        formatTime(nextRetryIn).toString(),
                      )}
                    </div>
                  )}
                </div>
              </>
            )}

            <Button type="text" onClick={onCancel} style={{ marginTop: 8 }}>
              {GROUPERS_CONSTANTS.MESSAGES.CANCEL}
            </Button>
          </div>
        </div>
      </div>
    );
  },
);

GrouperMainError.displayName = 'GrouperMainError';

export default GrouperMainError;
