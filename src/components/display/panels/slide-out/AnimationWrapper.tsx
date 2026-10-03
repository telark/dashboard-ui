import React from 'react';
import { ConfigProvider, theme } from 'antd';
import type { AnimationWrapperProps } from '../../../../interfaces/layout/panels';
import { useScrollLock } from '../../../../hooks/panel';
import {
  PANEL_SURFACE_CLASS,
  PANEL_MAX_WIDTH,
  PANEL_THEME_TOKENS,
  SELECT_THEME,
  SLIDE_OUT,
} from '../../../../constants';
import TopPanelToolbar from './TopPanelToolbar';
import { PanelFooter, PanelHeader } from '../shared';

const AnimationWrapper: React.FC<AnimationWrapperProps> = React.memo(
  ({
    open,
    onClose,
    title,
    children,
    width = 480,
    offsetX = 0,
    toolbarActions,
    headerExtra,
    footer,
  }) => {
    useScrollLock(open);

    if (!open) return null;

    return (
      <ConfigProvider
        theme={{
          algorithm: theme.defaultAlgorithm,
          token: PANEL_THEME_TOKENS,
          components: { Select: SELECT_THEME },
        }}
      >
        <div onClick={onClose} style={SLIDE_OUT.BACKDROP} />
        <div
          className={PANEL_SURFACE_CLASS}
          style={{
            ...SLIDE_OUT.PANEL,
            width: width,
            maxWidth: PANEL_MAX_WIDTH,
            transform: offsetX ? `translateX(-${offsetX}px)` : undefined,
            transition: 'transform 0.3s ease, width 0.3s ease',
            willChange: 'transform',
          }}
        >
          <PanelHeader
            title={title}
            onClose={onClose}
            extra={
              <>
                {headerExtra}
                <TopPanelToolbar actions={toolbarActions} />
              </>
            }
          />

          <div style={footer ? SLIDE_OUT.CONTENT_ABOVE_FOOTER : SLIDE_OUT.CONTENT}>{children}</div>
          {footer && <PanelFooter {...footer} />}
        </div>

        <style>
          {SLIDE_OUT.KEYFRAMES.SLIDE_IN_RIGHT}
          {SLIDE_OUT.KEYFRAMES.FADE_IN}
        </style>
      </ConfigProvider>
    );
  },
);

AnimationWrapper.displayName = 'AnimationWrapper';

export default AnimationWrapper;
