import React from 'react';
import { Button } from 'antd';
import { FancySpinner } from '../../animation';
import { CONNECTIVITY_CONSTANTS } from '../../../constants/pages/connectivity';
import { FONT_SIZE, FONT_WEIGHT, LINE_HEIGHT, SPACING } from '../../../constants';

interface ReachabilityErrorViewProps {
  retryCount: number;
  nextRetryIn: number;
  onCancel: () => void;
}

const ReachabilityErrorView: React.FC<ReachabilityErrorViewProps> = React.memo(
  ({ retryCount, nextRetryIn, onCancel }) => {
    const formatTime = (ms: number) => Math.ceil(ms / 1000);

    return (
      <div style={CONNECTIVITY_CONSTANTS.LAYOUT.ERROR_CONTAINER}>
        <div style={CONNECTIVITY_CONSTANTS.LAYOUT.ERROR_CONTENT}>
          <div
            style={{
              fontSize: FONT_SIZE.H2,
              fontWeight: FONT_WEIGHT.SEMIBOLD,
              color: CONNECTIVITY_CONSTANTS.COLORS.TEXT_PRIMARY,
              marginBottom: SPACING.LG,
            }}
          >
            {CONNECTIVITY_CONSTANTS.MESSAGES.CONNECTION_PROBLEM}
          </div>

          <div
            style={{
              fontSize: FONT_SIZE.LG,
              color: CONNECTIVITY_CONSTANTS.COLORS.TEXT_SECONDARY,
              marginBottom: SPACING.XXXL,
              lineHeight: LINE_HEIGHT.LOOSE,
            }}
          >
            {CONNECTIVITY_CONSTANTS.MESSAGES.ERROR_RETRYING}
          </div>

          <div style={{ textAlign: 'center' }}>
            <FancySpinner label={CONNECTIVITY_CONSTANTS.MESSAGES.RETRYING} showLabel={true} />
            <div
              style={{
                marginTop: SPACING.MD,
                color: CONNECTIVITY_CONSTANTS.COLORS.TEXT_MUTED,
                fontSize: FONT_SIZE.BASE,
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

            <Button type="text" onClick={onCancel} style={{ marginTop: SPACING.SM }}>
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
