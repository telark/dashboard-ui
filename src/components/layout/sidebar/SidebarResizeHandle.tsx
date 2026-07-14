import React, { memo, useCallback, useEffect, useState } from 'react';
import { SIDEBAR_LAYOUT } from '../../../constants';

interface SidebarResizeHandleProps {
  onResize: (width: number) => void;
  onDraggingChange: (dragging: boolean) => void;
}

const SidebarResizeHandle: React.FC<SidebarResizeHandleProps> = memo(
  ({ onResize, onDraggingChange }) => {
    const [dragging, setDragging] = useState(false);
    const handle = SIDEBAR_LAYOUT.RESIZE_HANDLE;

    useEffect(() => {
      onDraggingChange(dragging);
    }, [dragging, onDraggingChange]);

    useEffect(() => {
      if (!dragging) return;

      const handleMouseMove = (e: MouseEvent) => {
        onResize(e.clientX);
      };
      const handleMouseUp = () => {
        setDragging(false);
      };

      // The cursor must survive leaving the handle while a drag is in flight.
      document.body.style.cursor = handle.CURSOR;
      document.body.style.userSelect = 'none';
      globalThis.addEventListener('mousemove', handleMouseMove);
      globalThis.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        globalThis.removeEventListener('mousemove', handleMouseMove);
        globalThis.removeEventListener('mouseup', handleMouseUp);
      };
    }, [dragging, handle.CURSOR, onResize]);

    const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragging(true);
    }, []);

    return (
      <div
        role="separator"
        aria-orientation="vertical"
        aria-label={handle.ARIA_LABEL}
        onMouseDown={handleMouseDown}
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: handle.WIDTH,
          cursor: handle.CURSOR,
          zIndex: 2,
        }}
      />
    );
  },
);

SidebarResizeHandle.displayName = 'SidebarResizeHandle';

export default SidebarResizeHandle;
