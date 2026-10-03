import React, { memo, useMemo, useState } from 'react';
import { Tooltip } from 'antd';
import { DEFAULT_COLORS } from '../../../../constants';
import { APPLICATION_RESOURCE_GRAPH } from '../../constants/sectionLayout';
import { getResourceKindVisual } from '../../utils/resourceKindVisual';
import type { ApplicationResourceRef } from '../../models';

const G = APPLICATION_RESOURCE_GRAPH;
const FULL_TURN = Math.PI * 2;
const QUARTER_TURN = Math.PI / 2;

interface Point {
  x: number;
  y: number;
}

interface KindNodeLayout {
  kind: string;
  resources: ApplicationResourceRef[];
  /** Where the pill's inner edge sits — its own size never shifts this point. */
  anchor: Point;
  edgeStart: Point;
  /** Anchors the pill so it hangs away from the center instead of straddling the ring. */
  transform: string;
}

const pointOnCircle = (origin: Point, angle: number, radius: number): Point => ({
  x: origin.x + Math.cos(angle) * radius,
  y: origin.y + Math.sin(angle) * radius,
});

const anchorTransform = (angle: number): string => {
  const cos = Math.cos(angle);
  if (Math.abs(cos) < G.VERTICAL_ANCHOR_THRESHOLD) {
    return Math.sin(angle) < 0 ? 'translate(-50%, -100%)' : 'translate(-50%, 0)';
  }
  return cos > 0 ? 'translate(0, -50%)' : 'translate(-100%, -50%)';
};

const useGraphLayout = (groups: [string, ApplicationResourceRef[]][]) =>
  useMemo(() => {
    const radius = Math.max(
      G.RING_RADIUS_MIN_PX,
      groups.length * G.RING_RADIUS_PER_KIND_PX + G.RING_RADIUS_MIN_PX / 2,
    );
    const width = (radius + G.CANVAS_PADDING_X_PX) * 2;
    const height = (radius + G.CANVAS_PADDING_Y_PX) * 2;
    const center: Point = { x: width / 2, y: height / 2 };
    // Edges begin on the center node's rim, so nothing shows through underneath it.
    const centerEdge = G.CENTER_SIZE_PX / 2;

    const kinds: KindNodeLayout[] = groups.map(([kind, resources], index) => {
      // Start at the top and walk clockwise, so ordering is stable across renders.
      const angle = (index / groups.length) * FULL_TURN - QUARTER_TURN;
      return {
        kind,
        resources,
        // The edge runs right up to the anchor, which is the pill's inner edge.
        anchor: pointOnCircle(center, angle, radius),
        edgeStart: pointOnCircle(center, angle, centerEdge),
        transform: anchorTransform(angle),
      };
    });

    return { width, height, kinds };
  }, [groups]);

const buildKindTooltip = (resources: ApplicationResourceRef[]): string => {
  const names = resources.slice(0, G.TOOLTIP_NAME_LIMIT).map((r) => `${r.name} · ${r.namespace}`);
  const remaining = resources.length - names.length;
  return remaining > 0 ? [...names, `+${remaining} more`].join('\n') : names.join('\n');
};

interface ApplicationResourceGraphProps {
  applicationName: string;
  groups: [string, ApplicationResourceRef[]][];
}

const ApplicationResourceGraph: React.FC<ApplicationResourceGraphProps> = memo(
  ({ applicationName, groups }) => {
    const { width, height, kinds } = useGraphLayout(groups);
    const [activeKind, setActiveKind] = useState<string | null>(null);

    const isDimmed = (kind: string) => activeKind !== null && activeKind !== kind;

    return (
      <div style={{ width: '100%', overflowX: 'auto' }}>
        <div style={{ position: 'relative', width, height, margin: '0 auto' }}>
          <svg width={width} height={height} style={{ position: 'absolute', inset: 0 }}>
            {kinds.map((node) => (
              <g key={node.kind} opacity={isDimmed(node.kind) ? G.DIM_OPACITY : 1}>
                <line
                  x1={node.edgeStart.x}
                  y1={node.edgeStart.y}
                  x2={node.anchor.x}
                  y2={node.anchor.y}
                  stroke={DEFAULT_COLORS.BORDER_ELEVATED}
                  strokeWidth={G.EDGE_WIDTH_PX}
                />
              </g>
            ))}
          </svg>

          <Tooltip title={applicationName}>
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: G.CENTER_SIZE_PX,
                height: G.CENTER_SIZE_PX,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: G.CENTER_PADDING_PX,
                background: DEFAULT_COLORS.SURFACE_ELEVATED,
                border: `${G.EDGE_WIDTH_PX}px solid ${DEFAULT_COLORS.SUCCESS}`,
                boxSizing: 'border-box',
                cursor: 'default',
              }}
            >
              <span
                style={{
                  fontSize: G.CENTER_FONT_SIZE_PX,
                  fontWeight: 700,
                  lineHeight: G.CENTER_LINE_HEIGHT,
                  color: DEFAULT_COLORS.TEXT_PRIMARY,
                  textAlign: 'center',
                  overflow: 'hidden',
                  overflowWrap: 'anywhere',
                  // Long names clip to three lines; the tooltip carries the full value.
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 3,
                }}
              >
                {applicationName}
              </span>
            </div>
          </Tooltip>

          {kinds.map((node) => {
            const visual = getResourceKindVisual(node.kind);
            const KindIcon = visual.Icon;
            return (
              <Tooltip
                key={node.kind}
                title={
                  <span style={{ whiteSpace: 'pre-line' }}>{buildKindTooltip(node.resources)}</span>
                }
              >
                <div
                  onMouseEnter={() => setActiveKind(node.kind)}
                  onMouseLeave={() => setActiveKind(null)}
                  style={{
                    position: 'absolute',
                    left: node.anchor.x,
                    top: node.anchor.y,
                    transform: node.transform,
                    display: 'flex',
                    alignItems: 'center',
                    gap: G.KIND_NODE_GAP_PX,
                    padding: G.KIND_NODE_PADDING,
                    borderRadius: G.KIND_NODE_RADIUS_PX,
                    background: DEFAULT_COLORS.SURFACE_ELEVATED,
                    border: `${G.EDGE_WIDTH_PX}px solid ${DEFAULT_COLORS.BORDER_ELEVATED}`,
                    cursor: 'default',
                    opacity: isDimmed(node.kind) ? G.DIM_OPACITY : 1,
                    transition: 'opacity 150ms ease',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <span
                    style={{
                      width: G.KIND_ICON_SIZE_PX,
                      height: G.KIND_ICON_SIZE_PX,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: DEFAULT_COLORS.SUCCESS,
                      flexShrink: 0,
                    }}
                  >
                    <KindIcon
                      style={{
                        fontSize: G.KIND_GLYPH_SIZE_PX,
                        color: DEFAULT_COLORS.TEXT_ON_SURFACE,
                      }}
                    />
                  </span>
                  <span
                    style={{
                      fontSize: G.KIND_FONT_SIZE_PX,
                      fontWeight: 700,
                      color: DEFAULT_COLORS.TEXT_PRIMARY,
                    }}
                  >
                    {node.kind}
                  </span>
                  <span
                    style={{
                      fontSize: G.KIND_COUNT_FONT_SIZE_PX,
                      color: DEFAULT_COLORS.TEXT_MUTED,
                    }}
                  >
                    {node.resources.length}
                  </span>
                </div>
              </Tooltip>
            );
          })}

          {/* Painted after the pills so the dot straddles the edge instead of being clipped by it. */}
          {kinds.map((node) => (
            <div
              key={node.kind}
              style={{
                position: 'absolute',
                left: node.anchor.x,
                top: node.anchor.y,
                transform: 'translate(-50%, -50%)',
                width: G.CONNECTOR_DOT_SIZE_PX,
                height: G.CONNECTOR_DOT_SIZE_PX,
                borderRadius: '50%',
                background: DEFAULT_COLORS.ICON_SECONDARY,
                opacity: isDimmed(node.kind) ? G.DIM_OPACITY : 1,
                transition: 'opacity 150ms ease',
                pointerEvents: 'none',
              }}
            />
          ))}
        </div>
      </div>
    );
  },
);

ApplicationResourceGraph.displayName = 'ApplicationResourceGraph';

export default ApplicationResourceGraph;
