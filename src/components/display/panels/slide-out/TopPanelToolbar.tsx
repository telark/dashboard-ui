import React from 'react';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { TopPanelToolbarActions } from '../../../../interfaces/layout/panels';
import { SLIDE_OUT } from '../../../../constants';

interface TopPanelToolbarProps {
  actions?: TopPanelToolbarActions;
}

interface ToolbarIconButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabledReason?: string;
}

// aria-disabled rather than disabled: a disabled button fires no hover, so its title never shows.
const ToolbarIconButton: React.FC<ToolbarIconButtonProps> = ({
  icon,
  label,
  onClick,
  disabledReason,
}) => (
  <button
    type="button"
    aria-disabled={Boolean(disabledReason)}
    aria-label={label}
    onClick={(e) => {
      e.stopPropagation();
      if (!disabledReason) onClick();
    }}
    style={{
      ...SLIDE_OUT.TOOLBAR_BUTTON,
      ...(disabledReason ? SLIDE_OUT.TOOLBAR_BUTTON_DISABLED : {}),
    }}
    onMouseEnter={(e) => {
      if (!disabledReason) e.currentTarget.style.color = SLIDE_OUT.TOOLBAR_BUTTON_HOVER_COLOR;
    }}
    onMouseLeave={(e) => {
      if (!disabledReason) e.currentTarget.style.color = SLIDE_OUT.TOOLBAR_BUTTON_DEFAULT_COLOR;
    }}
    title={disabledReason ?? label}
  >
    {icon}
  </button>
);

const TopPanelToolbar: React.FC<TopPanelToolbarProps> = ({ actions }) => {
  if (!actions || (!actions.onEdit && !actions.onDelete)) {
    return null;
  }

  return (
    <div style={SLIDE_OUT.TOOLBAR}>
      {actions.onEdit && (
        <ToolbarIconButton
          icon={<EditOutlined />}
          label={SLIDE_OUT.TOOLBAR_EDIT_LABEL}
          onClick={actions.onEdit}
          disabledReason={actions.editDisabledReason}
        />
      )}
      {actions.onDelete && (
        <ToolbarIconButton
          icon={<DeleteOutlined />}
          label={SLIDE_OUT.TOOLBAR_DELETE_LABEL}
          onClick={actions.onDelete}
          disabledReason={actions.deleteDisabledReason}
        />
      )}
    </div>
  );
};

export default TopPanelToolbar;
