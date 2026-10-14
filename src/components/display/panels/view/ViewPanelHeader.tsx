import React from 'react';
import { VIEW } from '../../../../constants/layout/panels';
import { avatarRingStyle } from '../../avatars/avatarRing';
import type { ViewPanelHeaderProps } from './types';

const ViewPanelHeader: React.FC<ViewPanelHeaderProps> = ({ icon, name, description }) => (
  <div style={VIEW.HEADER}>
    {icon != null && <div style={avatarRingStyle(VIEW.ICON_SIZE)}>{icon}</div>}
    <div style={VIEW.NAME_STACK}>
      <h3 style={VIEW.TITLE}>{name}</h3>
      {description && <p style={VIEW.DESCRIPTION}>{description}</p>}
    </div>
  </div>
);

export default ViewPanelHeader;
