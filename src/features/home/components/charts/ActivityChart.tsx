import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { Line } from '@ant-design/plots';
import { format } from 'date-fns';
import { DEFAULT_COLORS, TIME_FORMATS } from '../../../../constants';
import { HOME_CHART_LAYOUT as C, HOME_CHART_TEXTS as CT } from '../../constants/dashboard';
import type { ActivityChartData, ActivityDatum } from '../../models';
import { CHART_AXIS_LABEL, CHART_LEGEND, CHART_THEME, CHART_TOOLTIP_CSS } from '../../utils/charts';

// G2's autoFit only re-measures on the window's `resize` event, so a container that
// changes size without one — the sidebar collapsing/expanding, a grid reflow — leaves
// the chart stuck at its old size. Watch the container directly and force a refit.
type ChartHandle = { triggerResize: () => void } | null;

const useContainerResize = (chartRef: React.RefObject<ChartHandle>) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;
    let frame = 0;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => chartRef.current?.triggerResize());
    });
    observer.observe(container);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [chartRef]);

  return { containerRef, size };
};

// Overlaid smooth lines per series on one plot: no stacking, no fill, a distinct
// dash per series so curves stay tellable apart where they overlap.
const ActivityChart: React.FC<ActivityChartData> = memo(({ data, colors }) => {
  const chartRef = useRef<ChartHandle>(null);
  const { containerRef, size } = useContainerResize(chartRef);

  const config = useMemo(
    () => ({
      data,
      autoFit: true,
      theme: CHART_THEME,
      xField: 'date',
      yField: 'count',
      colorField: 'series',
      shapeField: 'smooth',
      scale: { color: colors, y: { nice: true } },
      style: {
        lineWidth: C.LINE_WIDTH_PX,
        lineDash: (d: ActivityDatum) =>
          C.LINE_DASHES[colors.domain.indexOf(d.series) % C.LINE_DASHES.length],
      },
      point: { sizeField: C.POINT_SIZE_PX, style: { fill: DEFAULT_COLORS.SURFACE_ELEVATED } },
      axis: {
        x: {
          ...CHART_AXIS_LABEL,
          labelAutoHide: true,
          labelFormatter: (date: Date) => format(date, CT.AXIS_DATE_FORMAT),
        },
        y: {
          ...CHART_AXIS_LABEL,
          tickFilter: (value: number) => Number.isInteger(value),
          grid: true,
          gridStroke: DEFAULT_COLORS.BORDER_ELEVATED,
          gridStrokeOpacity: 1,
          gridLineDash: C.GRID_DASH,
        },
      },
      legend: {
        color: { ...CHART_LEGEND, position: 'top', layout: { justifyContent: 'flex-end' } },
      },
      tooltip: { title: (d: ActivityDatum) => format(d.date, TIME_FORMATS.SHORT) },
      // G2 flips the tooltip against `bounding` in canvas coordinates; its default
      // bound is wider than the canvas, so the tooltip runs off the right edge.
      interaction: {
        tooltip: { css: CHART_TOOLTIP_CSS, bounding: { x: 0, y: 0, ...size } },
      },
      animate: { enter: { type: 'pathIn', duration: C.ANIMATION_MS } },
    }),
    [data, colors, size],
  );

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      <Line {...config} ref={chartRef} />
    </div>
  );
});

ActivityChart.displayName = 'ActivityChart';

export default ActivityChart;
