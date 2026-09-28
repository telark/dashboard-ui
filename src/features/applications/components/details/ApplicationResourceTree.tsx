import React, { memo, useState } from 'react';
import { DEFAULT_COLORS } from '../../../../constants';
import { APPLICATION_RESOURCE_TREE } from '../../constants/sectionLayout';
import { getResourceKindVisual } from '../../utils/resourceKindVisual';
import type { ApplicationResourceRef } from '../../models';

const T = APPLICATION_RESOURCE_TREE;

interface BranchProps {
  isLast: boolean;
  children: React.ReactNode;
}

/** Draws the spine + elbow that connect a node to its parent. */
const Branch: React.FC<BranchProps> = ({ isLast, children }) => (
  <div style={{ position: 'relative', paddingLeft: T.INDENT_PX }}>
    <div
      style={{
        position: 'absolute',
        left: T.SPINE_X_PX,
        top: 0,
        // The last child's spine stops at its own elbow instead of running on.
        height: isLast ? T.ROW_CENTER_PX : '100%',
        width: T.LINE_WIDTH_PX,
        background: DEFAULT_COLORS.BORDER_ELEVATED,
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: T.SPINE_X_PX,
        top: T.ROW_CENTER_PX,
        width: T.ELBOW_WIDTH_PX,
        height: T.LINE_WIDTH_PX,
        background: DEFAULT_COLORS.BORDER_ELEVATED,
      }}
    />
    {children}
  </div>
);

const ResourceLeaf: React.FC<{ resource: ApplicationResourceRef; isLast: boolean }> = ({
  resource,
  isLast,
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Branch isLast={isLast}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: T.NODE_GAP_PX,
          padding: T.NODE_PADDING,
          borderRadius: T.ICON_RADIUS_PX,
          background: hovered ? DEFAULT_COLORS.SURFACE_ELEVATED_HOVER : 'transparent',
          transition: 'background 150ms ease',
          minWidth: 0,
        }}
      >
        <span
          style={{
            width: T.LEAF_DOT_SIZE_PX,
            height: T.LEAF_DOT_SIZE_PX,
            borderRadius: '50%',
            background: DEFAULT_COLORS.ICON_SECONDARY,
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontSize: T.LEAF_FONT_SIZE_PX,
            color: DEFAULT_COLORS.TEXT_PRIMARY,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {resource.name}
        </span>
        <span
          style={{
            fontSize: T.COUNT_FONT_SIZE_PX,
            color: DEFAULT_COLORS.TEXT_MUTED,
            flexShrink: 0,
          }}
        >
          {resource.namespace}
        </span>
      </div>
    </Branch>
  );
};

const KindNode: React.FC<{
  kind: string;
  resources: ApplicationResourceRef[];
  isLast: boolean;
}> = ({ kind, resources, isLast }) => {
  const visual = getResourceKindVisual(kind);
  const KindIcon = visual.Icon;

  return (
    <Branch isLast={isLast}>
      <div style={{ display: 'flex', alignItems: 'center', gap: T.NODE_GAP_PX, height: 30 }}>
        <span
          style={{
            width: T.KIND_ICON_SIZE_PX,
            height: T.KIND_ICON_SIZE_PX,
            borderRadius: T.ICON_RADIUS_PX,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: DEFAULT_COLORS.SUCCESS,
            flexShrink: 0,
          }}
        >
          <KindIcon
            style={{ fontSize: T.ICON_GLYPH_SIZE_PX, color: DEFAULT_COLORS.TEXT_ON_SURFACE }}
          />
        </span>
        <span
          style={{
            fontSize: T.KIND_FONT_SIZE_PX,
            fontWeight: 700,
            color: DEFAULT_COLORS.TEXT_PRIMARY,
          }}
        >
          {kind}
        </span>
        <span style={{ fontSize: T.COUNT_FONT_SIZE_PX, color: DEFAULT_COLORS.TEXT_MUTED }}>
          {resources.length}
        </span>
      </div>
      <div style={{ display: 'grid', rowGap: T.ROW_GAP_PX }}>
        {resources.map((resource, index) => (
          <ResourceLeaf
            key={`${resource.namespace}:${resource.kind}:${resource.name}`}
            resource={resource}
            isLast={index === resources.length - 1}
          />
        ))}
      </div>
    </Branch>
  );
};

interface ApplicationResourceTreeProps {
  applicationName: string;
  groups: [string, ApplicationResourceRef[]][];
}

const ApplicationResourceTree: React.FC<ApplicationResourceTreeProps> = memo(
  ({ applicationName, groups }) => (
    <div>
      {/* Indented onto the spine, so the structure line runs from under the name. */}
      <div style={{ display: 'flex', alignItems: 'center', height: 30, paddingLeft: T.SPINE_X_PX }}>
        <span
          style={{
            fontSize: T.ROOT_FONT_SIZE_PX,
            fontWeight: 700,
            color: DEFAULT_COLORS.TEXT_PRIMARY,
          }}
        >
          {applicationName}
        </span>
      </div>
      <div style={{ display: 'grid', rowGap: T.ROW_GAP_PX }}>
        {groups.map(([kind, resources], index) => (
          <KindNode
            key={kind}
            kind={kind}
            resources={resources}
            isLast={index === groups.length - 1}
          />
        ))}
      </div>
    </div>
  ),
);

ApplicationResourceTree.displayName = 'ApplicationResourceTree';

export default ApplicationResourceTree;
