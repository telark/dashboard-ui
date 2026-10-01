import { useEffect } from 'react';

// Read by fixed full-width chrome (the header) so it keeps its width while a panel is open.
export const SCROLL_LOCK_GUTTER_VAR = '--scroll-lock-gutter';

// Panels can stack (a panel over a panel): only the first lock applies, only the last releases.
let locks = 0;

// html reserves a stable scrollbar gutter (styles/index.css) so opening a panel never shifts the
// page, but no fixed element can paint into that gutter: panels and their backdrop stopped short
// of the screen's edge. While locked, the gutter becomes body padding of the same width instead,
// so the page keeps its place and the panel reaches the real edge.
const lock = (): void => {
  locks += 1;
  if (locks > 1) return;
  const root = document.documentElement;
  // clientWidth ignores the reserved gutter (it reads the full viewport), the root's box doesn't.
  const gutter = `${window.innerWidth - root.getBoundingClientRect().width}px`;
  root.style.scrollbarGutter = 'auto';
  root.style.setProperty(SCROLL_LOCK_GUTTER_VAR, gutter);
  document.body.style.overflow = 'hidden';
  document.body.style.paddingRight = gutter;
};

const unlock = (): void => {
  locks -= 1;
  if (locks > 0) return;
  const root = document.documentElement;
  root.style.scrollbarGutter = '';
  root.style.removeProperty(SCROLL_LOCK_GUTTER_VAR);
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
};

export const useBodyOverflow = (isOpen: boolean): void => {
  useEffect(() => {
    if (!isOpen) return undefined;
    lock();
    return unlock;
  }, [isOpen]);
};
