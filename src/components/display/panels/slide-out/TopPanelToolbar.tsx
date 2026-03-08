import React from 'react';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { TopPanelToolbarActions } from '../../../../interfaces/layout/panels';
import { SLIDE_OUT } from '../../../../constants';

interface TopPanelToolbarProps {
  actions?: TopPanelToolbarActions;
}

const TopPanelToolbar: React.FC<TopPanelToolbarProps> = ({ actions }) => {
  if (!actions || (!actions.onEdit && !actions.onDelete)) {
    return null;
  }

  return (
    <div style={SLIDE_OUT.TOOLBAR}>
      {actions.onEdit && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            actions.onEdit?.();
          }}
          style={SLIDE_OUT.TOOLBAR_BUTTON}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = SLIDE_OUT.TOOLBAR_BUTTON_HOVER_COLOR;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = SLIDE_OUT.TOOLBAR_BUTTON_DEFAULT_COLOR;
          }}
          title="Edit"
        >
          <EditOutlined />
        </button>
      )}
      {actions.onDelete && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            actions.onDelete?.();
          }}
          style={SLIDE_OUT.TOOLBAR_BUTTON}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = SLIDE_OUT.TOOLBAR_BUTTON_HOVER_COLOR;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = SLIDE_OUT.TOOLBAR_BUTTON_DEFAULT_COLOR;
          }}
          title="Delete"
        >
          <DeleteOutlined />
        </button>
      )}
    </div>
  );
};

export default TopPanelToolbar;
