import React from 'react';
import { ACTION_CONFIRM_MODAL } from '../../../../constants';

interface ActionTitleProps {
  title: string;
}

const ActionTitle: React.FC<ActionTitleProps> = ({ title }) => {
  return (
    <h3
      style={{
        margin: ACTION_CONFIRM_MODAL.TITLE.MARGIN_TOP,
        fontSize: ACTION_CONFIRM_MODAL.TITLE.FONT_SIZE,
        fontWeight: ACTION_CONFIRM_MODAL.TITLE.FONT_WEIGHT,
        color: ACTION_CONFIRM_MODAL.TITLE.COLOR,
        textAlign: 'center',
      }}
    >
      {title}
    </h3>
  );
};

export default ActionTitle;
