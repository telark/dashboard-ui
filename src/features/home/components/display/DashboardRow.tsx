import React, { memo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_COLORS, TIME_FORMATS, FONT_WEIGHT, MOTION } from '../../../../constants';
import TimeAgo from '../../../../components/display/time/TimeAgo';
import {
  HOME_DASHBOARD_LAYOUT as L,
  HOME_DASHBOARD_STYLES as S,
  HOME_DASHBOARD_TEXTS as T,
} from '../../constants/dashboard';
import type { DashboardRowItem } from '../../models';
import StatusDot from './StatusDot';

interface DashboardRowProps extends Omit<DashboardRowItem, 'key'> {
  // Meta and time on the title's line, for a box that also shows a headline.
  inline?: boolean;
}

const DashboardRow: React.FC<DashboardRowProps> = memo(
  ({ dotColor, title, meta, time, to, inline = false }) => {
    const navigate = useNavigate();
    const [hovered, setHovered] = useState(false);
    const interactive = Boolean(to);
    const open = () => {
      if (to) navigate(to);
    };
    const details =
      meta || time ? (
        <>
          {meta}
          {meta && time ? T.META_SEPARATOR : null}
          {time ? <TimeAgo date={time} formatString={TIME_FORMATS.DATE_TIME} /> : null}
        </>
      ) : null;

    return (
      <div
        role={interactive ? 'button' : undefined}
        tabIndex={interactive ? 0 : undefined}
        onClick={open}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            open();
          }
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        // 120ms: the row's hover fade sits below FAST_MS.
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: L.ROW_GAP_PX,
          padding: L.ROW_PADDING,
          borderRadius: L.ROW_RADIUS_PX,
          cursor: interactive ? 'pointer' : 'default',
          background:
            interactive && hovered ? DEFAULT_COLORS.SURFACE_ELEVATED_HOVER : 'transparent',
          transition: `background 120ms ${MOTION.EASE}`,
        }}
      >
        <StatusDot color={dotColor} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            title={inline ? title : undefined}
            style={{
              ...S.ELLIPSIS,
              fontSize: L.ROW_TITLE_FONT_SIZE_PX,
              fontWeight: FONT_WEIGHT.SEMIBOLD,
              color: DEFAULT_COLORS.TEXT_PRIMARY,
            }}
          >
            {title}
            {inline && details ? (
              <span style={{ ...S.MUTED_TEXT, fontWeight: FONT_WEIGHT.REGULAR }}>
                {T.META_SEPARATOR}
                {details}
              </span>
            ) : null}
          </div>
          {!inline && details ? (
            <div style={{ ...S.MUTED_TEXT, ...S.ELLIPSIS }}>{details}</div>
          ) : null}
        </div>
      </div>
    );
  },
);

DashboardRow.displayName = 'DashboardRow';

export default DashboardRow;
