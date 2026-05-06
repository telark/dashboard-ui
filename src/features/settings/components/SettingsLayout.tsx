import React, { memo } from 'react';
import { DEFAULT_COLORS } from '../../../constants';
import { PAGE_CONTENT_LAYOUT } from '../../../constants/shared/pages';

const { HEADER_OFFSET_PX, PADDING_TOP_PX, PADDING_HORIZONTAL_AND_BOTTOM_PX } = PAGE_CONTENT_LAYOUT;
const CONTENT_PADDING = `${PADDING_TOP_PX - HEADER_OFFSET_PX}px ${PADDING_HORIZONTAL_AND_BOTTOM_PX}px ${PADDING_HORIZONTAL_AND_BOTTOM_PX}px`;

interface SettingsLayoutProps {
  children: React.ReactNode;
}

const SettingsLayout: React.FC<SettingsLayoutProps> = memo(({ children }) => (
  <div
    style={{
      minHeight: '100vh',
      background: DEFAULT_COLORS.BACKGROUND_WHITE,
      display: 'flex',
      flexDirection: 'column',
      paddingTop: HEADER_OFFSET_PX,
    }}
  >
    <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
      <main
        style={{
          flex: 1,
          minWidth: 0,
          overflow: 'auto',
        }}
      >
        <div
          style={{
            background: DEFAULT_COLORS.BACKGROUND_WHITE,
            padding: CONTENT_PADDING,
            boxSizing: 'border-box',
            width: '100%',
          }}
        >
          {children}
        </div>
      </main>
    </div>
  </div>
));

SettingsLayout.displayName = 'SettingsLayout';

export default SettingsLayout;
