import React from 'react';
import type { AnimationWrapperProps } from '../../../../interfaces/layout/panels';
import { useBodyOverflow } from '../../../../hooks/panel';
import { SLIDE_OUT } from '../../../../constants';
import TopPanelToolbar from './TopPanelToolbar';
import { PanelHeader } from '../shared';

const AnimationWrapper: React.FC<AnimationWrapperProps> = React.memo(
  ({
    open,
    onClose,
    title,
    subtitle,
    children,
    width = 480,
    offsetX = 0,
    toolbarActions,
    headerExtra,
  }) => {
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
            transform: offsetX ? `translateX(-${offsetX}px)` : undefined,
            transition: 'transform 0.3s ease, width 0.3s ease',
            willChange: 'transform',
          }}
        >
          <PanelHeader
            title={title}
            subtitle={subtitle}
            onClose={onClose}
            extra={
              <>
                {headerExtra}
                <TopPanelToolbar actions={toolbarActions} />
              </>
            }
          />

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
