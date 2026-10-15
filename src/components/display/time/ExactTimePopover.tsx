import React from 'react';
import { Popover } from 'antd';

interface ExactTimePopoverProps {
  exact: string;
  text: string;
}

// Focusable and labeled, so keyboard, touch and screen reader users get the absolute time too.
const ExactTimePopover: React.FC<ExactTimePopoverProps> = ({ exact, text }) => (
  <Popover content={exact} trigger={['hover', 'focus']}>
    <span tabIndex={0} aria-label={exact}>
      {text}
    </span>
  </Popover>
);

export default ExactTimePopover;
