import React from 'react';
import { Popover } from 'antd';
import { EyeOutlined, SyncOutlined, DeleteOutlined } from '@ant-design/icons';
import { FancySpinner } from '../../shared';
import { GROUPER_CARD_STYLES, ICON_HOVER_EFFECTS, FANCY_SPINNER_CONFIG } from '../../../constants/cards/grouper';
import { UI } from '../../../constants/ui';
import { DEFAULT_COLORS } from '../../../constants/colors';

interface GrouperCardActionsProps {
  isSyncingEffective: boolean;
  statusStyle: {
    color: string;
    borderColor: string;
    icon: React.ReactElement;
  };
  onView: () => void;
  onSync: () => void;
  onDelete: () => void;
}

export const createGrouperCardActions = ({
  isSyncingEffective,
  statusStyle,
  onView,
  onSync,
  onDelete,
}: GrouperCardActionsProps): React.ReactNode[] => {
  const handleViewMouseOver = (e: React.MouseEvent<HTMLElement>) => {
    ICON_HOVER_EFFECTS.onMouseOver(e, statusStyle.color);
  };

  const handleViewMouseOut = (e: React.MouseEvent<HTMLElement>) => {
    ICON_HOVER_EFFECTS.onMouseOut(e);
  };

  const handleSyncMouseOver = (e: React.MouseEvent<HTMLElement>) => {
    ICON_HOVER_EFFECTS.onMouseOver(e, statusStyle.color);
  };

  const handleSyncMouseOut = (e: React.MouseEvent<HTMLElement>) => {
    ICON_HOVER_EFFECTS.onMouseOut(e);
  };

  const handleDeleteMouseOver = (e: React.MouseEvent<HTMLElement>) => {
    ICON_HOVER_EFFECTS.onMouseOver(e, statusStyle.color);
  };

  const handleDeleteMouseOut = (e: React.MouseEvent<HTMLElement>) => {
    ICON_HOVER_EFFECTS.onMouseOut(e, DEFAULT_COLORS.DANGER);
  };

  return [
    <Popover key="view-pop" content={UI.CARD.POPOVER.VIEW} trigger="hover">
      <EyeOutlined
        key="view"
        style={GROUPER_CARD_STYLES.actionIcon}
        onClick={onView}
        onMouseOver={handleViewMouseOver}
        onMouseOut={handleViewMouseOut}
      />
    </Popover>,
    <Popover key="sync-pop" content={UI.CARD.POPOVER.SYNC} trigger="hover">
      <span
        onClick={isSyncingEffective ? undefined : onSync}
        style={{
          ...GROUPER_CARD_STYLES.syncIconContainer,
          cursor: isSyncingEffective ? 'default' : 'pointer',
        }}
      >
        {isSyncingEffective ? (
          <FancySpinner
            showLabel={FANCY_SPINNER_CONFIG.SHOW_LABEL}
            size={FANCY_SPINNER_CONFIG.SIZE}
            ringThickness={FANCY_SPINNER_CONFIG.RING_THICKNESS}
          />
        ) : (
          <SyncOutlined
            key="sync"
            style={GROUPER_CARD_STYLES.actionIcon}
            onMouseOver={handleSyncMouseOver}
            onMouseOut={handleSyncMouseOut}
          />
        )}
      </span>
    </Popover>,
    <Popover key="delete-pop" content={UI.CARD.POPOVER.DELETE} trigger="hover">
      <DeleteOutlined
        key="delete"
        style={GROUPER_CARD_STYLES.deleteIcon}
        onClick={onDelete}
        onMouseOver={handleDeleteMouseOver}
        onMouseOut={handleDeleteMouseOut}
      />
    </Popover>,
  ];
};

const GrouperCardActions: React.FC<GrouperCardActionsProps> = React.memo((props) => {
  return <>{createGrouperCardActions(props)}</>;
});

GrouperCardActions.displayName = 'GrouperCardActions';

export default GrouperCardActions;
