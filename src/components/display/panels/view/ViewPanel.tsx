import React from 'react';
import AnimationWrapper from '../slide-out/AnimationWrapper';
import { VIEW } from '../../../../constants/layout/panels';
import ViewPanelHeader from './ViewPanelHeader';
import ViewPanelDetails from './ViewPanelDetails';
import type { ViewPanelProps } from './types';

const DEFAULT_WIDTH = 500;
const ViewPanel: React.FC<ViewPanelProps> = ({
  open,
  onClose,
  title,
  icon,
  name,
  description,
  avatars = [],
  overflowItems = [],
  width = DEFAULT_WIDTH,
  details = [],
}) => {
  return (
    <AnimationWrapper open={open} onClose={onClose} title={title} width={width}>
      <div style={VIEW.CONTAINER}>
        <ViewPanelHeader
          icon={icon}
          name={name}
          description={description}
          avatars={avatars}
          overflowItems={overflowItems}
        />
        <ViewPanelDetails details={details} />
      </div>
    </AnimationWrapper>
  );
};

export default ViewPanel;
