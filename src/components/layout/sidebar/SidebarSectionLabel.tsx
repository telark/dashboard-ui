import { memo } from 'react';
import { SECTION_LAYOUT, SIDEBAR_LAYOUT, getSidebarLabelFade } from '../../../constants';

interface SidebarSectionLabelProps {
  label: string;
  isCollapsed: boolean;
}

// Mounted in both states and as tall in each, so a toggle never moves the items under it.
const SidebarSectionLabel = memo(({ label, isCollapsed }: SidebarSectionLabelProps) => (
  <div
    style={{
      ...SIDEBAR_LAYOUT.SECTION_LABEL,
      position: 'relative',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
    }}
  >
    <span style={getSidebarLabelFade(isCollapsed)}>{label}</span>
    <span
      aria-hidden
      style={{
        position: 'absolute',
        top: '50%',
        left: SIDEBAR_LAYOUT.SECTION_RULE.LEFT,
        width: SIDEBAR_LAYOUT.SECTION_RULE.WIDTH,
        borderTop: SECTION_LAYOUT.SUBTLE_DIVIDER,
        ...getSidebarLabelFade(!isCollapsed),
      }}
    />
  </div>
));

SidebarSectionLabel.displayName = 'SidebarSectionLabel';

export default SidebarSectionLabel;
