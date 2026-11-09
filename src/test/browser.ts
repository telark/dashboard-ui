import { vi } from 'vitest';

// Desktop width, so the app's measured toolbars and tables render their full layout by default.
const DEFAULT_LAYOUT_WIDTH_PX = 1280;
const DEFAULT_LAYOUT_HEIGHT_PX = 720;

let layoutWidth = DEFAULT_LAYOUT_WIDTH_PX;

/** Sets the width every element measures, to exercise compact layouts. */
export const setLayoutWidth = (widthPx: number): void => {
  layoutWidth = widthPx;
};

export const resetLayoutWidth = (): void => {
  layoutWidth = DEFAULT_LAYOUT_WIDTH_PX;
};

class ObserverStub {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn(() => []);
}

const matchMediaStub = (query: string): MediaQueryList => ({
  matches: false,
  media: query,
  onchange: null,
  addEventListener: () => undefined,
  removeEventListener: () => undefined,
  addListener: () => undefined,
  removeListener: () => undefined,
  dispatchEvent: () => false,
});

/** The browser APIs jsdom lacks and the app or antd call during render. */
export const installBrowserStubs = (): void => {
  const computedStyle = window.getComputedStyle.bind(window);
  // jsdom logs "not implemented" for the pseudo-element argument antd's scrollbar measure passes.
  window.getComputedStyle = (element: Element) => computedStyle(element);
  window.matchMedia = matchMediaStub;
  window.scrollTo = () => undefined;
  Element.prototype.scrollTo = () => undefined;
  Element.prototype.scrollIntoView = () => undefined;
  Element.prototype.getBoundingClientRect = function getBoundingClientRect() {
    return new DOMRect(0, 0, layoutWidth, DEFAULT_LAYOUT_HEIGHT_PX);
  };
  HTMLCanvasElement.prototype.getContext = () => null;
  // A closing slide-out panel animates its frame out, and jsdom has no Web Animations API.
  Element.prototype.animate = function animate() {
    const animation = { onfinish: null } as Animation;
    queueMicrotask(() => animation.onfinish?.call(animation, new Event('finish') as never));
    return animation;
  };
  // The app hands a downloaded blob to the browser through an object URL.
  URL.createObjectURL = () => 'blob:download';
  URL.revokeObjectURL = () => undefined;
  vi.stubGlobal('ResizeObserver', ObserverStub);
  vi.stubGlobal('IntersectionObserver', ObserverStub);
};
