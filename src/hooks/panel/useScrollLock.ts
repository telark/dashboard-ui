import { useEffect } from 'react';
import { APP_CONFIGS } from '../../constants';

// Panels can stack (a panel over a panel): only the first lock applies, only the last releases.
let locks = 0;

// The page scrolls in the content pane, not the window. Its gutter is reserved (scrollbar-gutter:
// stable), so hiding its overflow while a panel is open neither shifts the page nor the panel.
const lock = (): void => {
  locks += 1;
  if (locks > 1) return;
  const pane = document.getElementById(APP_CONFIGS.LAYOUT.CONTENT_ID);
  if (pane) pane.style.overflowY = 'hidden';
};

const unlock = (): void => {
  locks -= 1;
  if (locks > 0) return;
  const pane = document.getElementById(APP_CONFIGS.LAYOUT.CONTENT_ID);
  if (pane) pane.style.overflowY = APP_CONFIGS.LAYOUT.CONTENT_OVERFLOW;
};

export const useScrollLock = (isOpen: boolean): void => {
  useEffect(() => {
    if (!isOpen) return undefined;
    lock();
    return unlock;
  }, [isOpen]);
};
