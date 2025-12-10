import React from 'react';
import { CloseOutlined } from '@ant-design/icons';
import type { AnimationWrapperProps } from '../../../../interfaces/layout/panels';
import { useBodyOverflow } from '../../../../hooks/panel';
import { SLIDE_OUT } from '../../../../constants';
import TopPanelToolbar from './TopPanelToolbar';

const AnimationWrapper: React.FC<AnimationWrapperProps> = React.memo(
  ({ open, onClose, title, subtitle, children, width = 480, toolbarActions }) => {
    useBodyOverflow(open);

    if (!open) return null;

    return (
      <>
        {/* Backdrop */}
        <div onClick={onClose} style={SLIDE_OUT.BACKDROP} />
        {/* Panel */}
        <div
          style={{
            ...SLIDE_OUT.PANEL,
            width: width,
          }}
        >
          {/* Header */}
          <div style={SLIDE_OUT.HEADER}>
            <div style={SLIDE_OUT.HEADER_CONTENT}>
              <div style={SLIDE_OUT.TITLE_CONTAINER}>
                <h2 style={SLIDE_OUT.TITLE}>{title}</h2>
                {subtitle && (
                  <p
                    style={{
                      margin: '4px 0 0 0',
                      fontSize: 14,
                      color: '#64748b',
                      fontWeight: 400,
                    }}
                  >
                    {subtitle}
                  </p>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <TopPanelToolbar actions={toolbarActions} />
                <button
                  type="button"
                  onClick={onClose}
                  style={SLIDE_OUT.CLOSE_BUTTON}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = SLIDE_OUT.CLOSE_BUTTON_HOVER_COLOR;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = SLIDE_OUT.CLOSE_BUTTON_DEFAULT_COLOR;
                  }}
                >
                  <CloseOutlined />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div style={SLIDE_OUT.CONTENT}>{children}</div>
        </div>

        <style>
          {SLIDE_OUT.KEYFRAMES.SLIDE_IN_RIGHT}
          {SLIDE_OUT.KEYFRAMES.FADE_IN}
        </style>
      </>
    );
  },
);

AnimationWrapper.displayName = 'AnimationWrapper';

export default AnimationWrapper;
