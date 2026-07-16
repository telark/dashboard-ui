import { useCallback, useEffect, useRef, useState } from 'react';

// The sidebar changes the space a toolbar has without changing the viewport, so
// width has to be measured on the element rather than through a media query.
export const useElementWidth = <T extends HTMLElement>() => {
  const ref = useRef<T | null>(null);
  const [width, setWidth] = useState(0);

  const measure = useCallback((element: T) => {
    setWidth(element.getBoundingClientRect().width);
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(() => measure(element));
    observer.observe(element);
    return () => observer.disconnect();
  }, [measure]);

  return { ref, width };
};
