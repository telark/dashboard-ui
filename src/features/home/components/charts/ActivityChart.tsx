import React, { memo, useEffect, useMemo, useRef } from 'react';
import { Area } from '@ant-design/plots';
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

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;
    let frame = 0;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => chartRef.current?.triggerResize());
    });
    observer.observe(container);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [chartRef]);

  return containerRef;
};

// Stacked smooth areas per day, one curve per series.
const ActivityChart: React.FC<ActivityChartData> = memo(({ data, colors }) => {
  const chartRef = useRef<ChartHandle>(null);
  const containerRef = useContainerResize(chartRef);

  const config = useMemo(
    () => ({
      data,
      autoFit: true,
      theme: CHART_THEME,
      xField: 'date',
      yField: 'count',
      colorField: 'series',
      shapeField: 'smooth',
      stack: true,
      scale: { color: colors, y: { nice: true } },
      style: { fillOpacity: C.AREA_FILL_OPACITY },
      line: { style: { lineWidth: C.LINE_WIDTH_PX } },
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
      interaction: { tooltip: { css: CHART_TOOLTIP_CSS } },
      animate: { enter: { type: 'pathIn', duration: C.ANIMATION_MS } },
    }),
    [data, colors],
  );

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      <Area {...config} ref={chartRef} />
    </div>
  );
});

ActivityChart.displayName = 'ActivityChart';

export default ActivityChart;
