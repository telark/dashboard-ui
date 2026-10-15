import React from 'react';
import AnimationWrapper from '../slide-out/AnimationWrapper';
import { VIEW } from '../../../../constants/layout/panels';
import ViewPanelHeader from './ViewPanelHeader';
import ViewPanelDetails from './ViewPanelDetails';
import ViewPanelTabs from './ViewPanelTabs';
import type { ViewPanelProps } from './types';

const DEFAULT_WIDTH = 500;
const ViewPanel: React.FC<ViewPanelProps> = ({
  open,
  onClose,
  title,
  icon,
  name,
  description,
  width = DEFAULT_WIDTH,
  details = [],
  actions,
  tabs,
}) => {
  return (
    <AnimationWrapper
      open={open}
      onClose={onClose}
      title={title}
      width={width}
      toolbarActions={actions}
    >
      <div style={VIEW.CONTAINER}>
        <ViewPanelHeader icon={icon} name={name} description={description} />
        {tabs ? (
          <ViewPanelTabs details={details} tabs={tabs} />
        ) : (
          <ViewPanelDetails details={details} />
        )}
      </div>
    </AnimationWrapper>
  );
};

export default ViewPanel;
