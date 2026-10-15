import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { ConfigProvider, theme } from 'antd';
import type { ThemeConfig } from 'antd';
import type { AnimationWrapperProps, PanelFooterProps } from '../../../../interfaces/layout/panels';
import { useScrollLock } from '../../../../hooks/panel';
import { useMediaQuery } from '../../../../hooks/layout';
import {
  PANEL_SURFACE_CLASS,
  PANEL_MAX_WIDTH,
  PANEL_PREWARM,
  PANEL_TABS_THEME,
  PANEL_THEME_TOKENS,
  SELECT_THEME,
  SIDEBAR_LAYOUT,
  SLIDE_OUT,
} from '../../../../constants';
import TopPanelToolbar from './TopPanelToolbar';
import { PanelFooter, PanelHeader } from '../shared';

// antd gives each provider its own css-var key by default; a fixed one lets every panel reuse the
// styles PanelThemePrewarm generates.
export const PANEL_THEME: ThemeConfig = {
  algorithm: theme.defaultAlgorithm,
  token: PANEL_THEME_TOKENS,
  components: { Select: SELECT_THEME, Tabs: PANEL_TABS_THEME },
  cssVar: { key: PANEL_PREWARM.CSS_VAR_KEY },
};

// React has already removed the closed panel: its frame goes back, inert, into the nearest
// ancestor still on screen (it keeps the styles it inherits there) to slide out. Only the header
// goes with it: antd drops the styles of the body's controls once they unmount. A still-connected
// panel is open (StrictMode re-runs effects without unmounting).
const playExit = (ancestors: HTMLElement[], backdrop: HTMLElement, panel: HTMLElement): void => {
  if (panel.isConnected) return;
  while (panel.childElementCount > 1) panel.lastElementChild?.remove();
  for (const el of [backdrop, panel]) {
    el.style.animation = 'none';
    el.style.pointerEvents = 'none';
  }
  (ancestors.find((el) => el.isConnected) ?? document.body).append(backdrop, panel);
  backdrop.animate(SLIDE_OUT.EXIT.BACKDROP, SLIDE_OUT.EXIT.TIMING);
  panel.animate(SLIDE_OUT.EXIT.PANEL, SLIDE_OUT.EXIT.TIMING).onfinish = () => {
    backdrop.remove();
    panel.remove();
  };
};

// Mounts with each open and renders a frame later: the panel paints and starts sliding on the
// click, and the costly body (and the footer that acts on it) renders while it slides.
const PanelBody: React.FC<{ children: React.ReactNode; footer?: PanelFooterProps }> = ({
  children,
  footer,
}) => {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    // The task after the frame paints. flushSync renders the body in one go there, so updates
    // landing meanwhile (data a panel fetches on open) can't interrupt and restart it.
    const id = requestAnimationFrame(() => {
      timer = setTimeout(() => flushSync(() => setShown(true)));
    });
    return () => {
      cancelAnimationFrame(id);
      clearTimeout(timer);
    };
  }, []);
  if (!shown) return null;
  return (
    <>
      <div style={SLIDE_OUT.CONTENT}>{children}</div>
      {footer && <PanelFooter {...footer} />}
    </>
  );
};

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
    const reduceMotion = useMediaQuery(SIDEBAR_LAYOUT.REDUCED_MOTION_QUERY);
    const backdropRef = useRef<HTMLDivElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
      const backdrop = backdropRef.current;
      const panel = panelRef.current;
      if (!open || reduceMotion || !backdrop || !panel) return undefined;
      const ancestors: HTMLElement[] = [];
      for (let el = panel.parentElement; el; el = el.parentElement) ancestors.push(el);
      return () => queueMicrotask(() => playExit(ancestors, backdrop, panel));
    }, [open, reduceMotion]);

    // Focus moves into the panel, so the next Tab reaches its header (the X), not the page behind,
    // and back to what opened it on close, unless focus has moved on elsewhere meanwhile.
    useEffect(() => {
      const panel = panelRef.current;
      if (!open || !panel) return undefined;
      const trigger = document.activeElement;
      panel.focus({ preventScroll: true });
      return () => {
        const active = document.activeElement;
        const lost = !active || active === document.body || panel.contains(active);
        if (lost && trigger instanceof HTMLElement && trigger.isConnected) {
          trigger.focus({ preventScroll: true });
        }
      };
    }, [open]);

    if (!open) return null;

    return (
      <ConfigProvider theme={PANEL_THEME}>
        <div ref={backdropRef} onClick={onClose} style={SLIDE_OUT.BACKDROP} />
        <div
          ref={panelRef}
          tabIndex={-1}
          className={PANEL_SURFACE_CLASS}
          style={{
            ...SLIDE_OUT.PANEL,
            ...(reduceMotion && SLIDE_OUT.NO_MOTION),
            // Clamped in the width itself, so the transition runs between the widths shown: a
            // max-width held the panel still, then stopped it dead, while the width ran past it.
            width: `min(${width}px, ${PANEL_MAX_WIDTH})`,
            transform: offsetX ? `translateX(-${offsetX}px)` : undefined,
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

          <PanelBody footer={footer}>{children}</PanelBody>
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
