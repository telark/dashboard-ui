import React, { startTransition, useEffect, useState } from 'react';
import { PANEL_PREWARM } from '../../../../constants';

// Renders the panel theme's common controls once, offscreen, when the app is idle, so the first
// panel opened on a page doesn't generate their styles (antd CSS-in-JS) while it slides in.
const PanelThemePrewarm: React.FC = () => {
  const [Controls, setControls] = useState<React.FC | null>(null);
  useEffect(() => {
    let canceled = false;
    // Their own chunk, loaded before the render: a transition that suspended on it would hold
    // back the page's deferred renders. The transition yields to input instead of one long task.
    const warmUp = () => {
      import('./PanelThemeControls')
        .then(({ default: loaded }) => {
          if (!canceled) startTransition(() => setControls(() => loaded));
        })
        .catch(() => undefined);
    };
    if (typeof requestIdleCallback !== 'function') {
      const timer = setTimeout(warmUp, PANEL_PREWARM.FALLBACK_DELAY_MS);
      return () => {
        canceled = true;
        clearTimeout(timer);
      };
    }
    const id = requestIdleCallback(warmUp, { timeout: PANEL_PREWARM.IDLE_TIMEOUT_MS });
    return () => {
      canceled = true;
      cancelIdleCallback(id);
    };
  }, []);

  return Controls ? <Controls /> : null;
};

export default PanelThemePrewarm;
