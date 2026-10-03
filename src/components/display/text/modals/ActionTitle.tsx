import React from 'react';
import { MODAL_CHROME } from '../../../../constants';

interface ActionTitleProps {
  title: string;
}

const ActionTitle: React.FC<ActionTitleProps> = ({ title }) => {
  return <h3 style={MODAL_CHROME.TITLE}>{title}</h3>;
};

export default ActionTitle;
