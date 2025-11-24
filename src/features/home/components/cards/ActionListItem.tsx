import React from 'react';
import { RightOutlined } from '@ant-design/icons';
import { DEFAULT_COLORS, CARD_CONFIGS, CARD_COLORS } from '../../../../constants';

export interface ActionListItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const ActionListItem: React.FC<ActionListItemProps> = ({ icon, label, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        border: 'none',
        background: 'transparent',
        padding: CARD_CONFIGS.ACTION_LIST_ITEM.PADDING,
        borderRadius: CARD_CONFIGS.ACTION_LIST_ITEM.BORDER_RADIUS,
        display: 'flex',
        alignItems: 'center',
        gap: CARD_CONFIGS.ACTION_LIST_ITEM.GAP,
        cursor: 'pointer',
      }}
    >
      <div
        style={{
          width: CARD_CONFIGS.ACTION_LIST_ITEM.ICON_SIZE,
          height: CARD_CONFIGS.ACTION_LIST_ITEM.ICON_SIZE,
          borderRadius: CARD_CONFIGS.ACTION_LIST_ITEM.ICON_BORDER_RADIUS,
          background: active
            ? CARD_COLORS.ICON.BACKGROUND_ACTIVE
            : CARD_COLORS.ICON.BACKGROUND_INACTIVE,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: DEFAULT_COLORS.SUCCESS,
          fontSize: CARD_CONFIGS.ACTION_LIST_ITEM.ICON_FONT_SIZE,
        }}
      >
        {icon}
      </div>
      <div
        style={{
          flex: 1,
          textAlign: 'left',
          color: active ? CARD_COLORS.TEXT.PRIMARY : CARD_COLORS.TEXT.SECONDARY,
          fontWeight: 700,
        }}
      >
        {label}
      </div>
      <RightOutlined
        style={{
          color: CARD_COLORS.TEXT.ARROW,
          fontSize: CARD_CONFIGS.ACTION_LIST_ITEM.ARROW_FONT_SIZE,
        }}
      />
    </button>
  );
};

export default ActionListItem;

