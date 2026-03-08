import React from 'react';
import { VIEW } from '../../../../constants/layout/panels';
import type { ViewPanelDetailsProps } from './types';

const ViewPanelDetails: React.FC<ViewPanelDetailsProps> = ({ details = [] }) => {
  if (details.length === 0) return null;

  return (
    <div style={VIEW.DETAILS.CONTAINER}>
      {details.map((row) => (
        <div key={row.label} style={VIEW.DETAILS.ROW}>
          <span style={VIEW.DETAILS.LABEL}>{row.label}</span>
          <div style={VIEW.DETAILS.VALUE}>{row.value}</div>
        </div>
      ))}
    </div>
  );
};

export default ViewPanelDetails;
