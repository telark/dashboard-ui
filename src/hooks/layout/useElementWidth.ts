import { startTransition, useCallback, useState } from 'react';

// The sidebar changes the space a toolbar has without changing the viewport, so
// width has to be measured on the element rather than through a media query.
export const useElementWidth = <T extends HTMLElement>() => {
  const [width, setWidth] = useState(0);

  // A callback ref measures whenever the element attaches, also one mounted behind a loader.
  // It runs in the commit, so the first paint already uses the real width.
  const ref = useCallback((element: T | null) => {
    if (!element) return;
    const measure = () => {
      const next = element.getBoundingClientRect().width;
      // A hidden (display: none) tab reports 0; keeping the last width lets it reappear already laid out.
      if (next > 0) setWidth(next);
    };
    measure();
    // A sliding sidebar resizes every frame: as a transition, those renders yield to the frames.
    const observer = new ResizeObserver(() => startTransition(measure));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { ref, width };
};
