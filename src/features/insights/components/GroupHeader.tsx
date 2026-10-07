import React, { memo } from 'react';
import { Tag } from 'antd';
import { DownOutlined, RightOutlined } from '@ant-design/icons';
import { DEFAULT_COLORS, Icons, STATUS_COLORS, TAG_CLASS, getPillColor } from '../../../constants';
import { INSIGHTS_UI as T } from '../constants/texts';
import { INSIGHT_KIND_LABELS, INSIGHT_SEVERITY_LABELS } from '../constants/insights';
import type {
  InsightGroup,
  InsightGroupBy,
  InsightKind,
  InsightGroupItem,
  InsightSeverity,
} from '../models';

const SEVERITIES_DESC: InsightSeverity[] = ['critical', 'warning', 'info'];

const nameStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: DEFAULT_COLORS.TEXT_PRIMARY,
};
const mutedStyle: React.CSSProperties = { fontSize: 12, color: DEFAULT_COLORS.TEXT_MUTED };
// Gives way first and ellipsizes, so many namespaces never push the counts or widen the table.
const namespacesStyle: React.CSSProperties = {
  ...mutedStyle,
  minWidth: 0,
  flexShrink: 100000,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};
// react-icons SVGs sit on the text baseline unless their box is a line-height-0 flex item.
const iconStyle: React.CSSProperties = {
  display: 'inline-flex',
  lineHeight: 0,
  fontSize: 13,
  color: DEFAULT_COLORS.TEXT_MUTED,
};

const GroupName: React.FC<{ groupBy: InsightGroupBy; group: InsightGroup }> = ({
  groupBy,
  group,
}) => {
  if (groupBy === 'category') {
    return (
      <span style={nameStyle}>{INSIGHT_KIND_LABELS[group.key as InsightKind] ?? group.key}</span>
    );
  }
  if (groupBy !== 'app') return <span style={nameStyle}>{group.key}</span>;
  const namespaces = [...group.namespaces].sort().join(T.PAGE.GROUP_NAMESPACES_SEPARATOR);
  return (
    <>
      <span style={iconStyle}>
        <Icons.Application />
      </span>
      <span style={nameStyle}>{group.key.slice(group.key.indexOf('/') + 1)}</span>
      <span style={namespacesStyle} title={namespaces}>
        {namespaces}
      </span>
    </>
  );
};

interface Props {
  item: InsightGroupItem;
  groupBy: InsightGroupBy;
}

// Clicking the row toggles the group. Width 0 keeps the header out of the table's max-content
// measure (like TitleCell in InsightsTable), so it spans the columns instead of setting them.
const GroupHeader: React.FC<Props> = memo(({ item, groupBy }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '4px 0',
      width: 0,
      minWidth: '100%',
    }}
  >
    {item.collapsed ? (
      <RightOutlined style={{ color: DEFAULT_COLORS.TEXT_MUTED, fontSize: 11 }} />
    ) : (
      <DownOutlined style={{ color: DEFAULT_COLORS.TEXT_MUTED, fontSize: 11 }} />
    )}
    <GroupName groupBy={groupBy} group={item.group} />
    <span style={mutedStyle}>
      {(item.group.total === 1 ? T.PAGE.GROUP_TOTAL.one : T.PAGE.GROUP_TOTAL.other).replace(
        '{count}',
        String(item.group.total),
      )}
    </span>
    {SEVERITIES_DESC.filter((s) => item.group.bySeverity[s]).map((s) => (
      <Tag
        key={s}
        color={getPillColor(STATUS_COLORS.INSIGHT_SEVERITY[s])}
        className={`${TAG_CLASS.MEDIUM} ${TAG_CLASS.AS_IS}`}
      >
        {`${INSIGHT_SEVERITY_LABELS[s]} ${item.group.bySeverity[s]}`}
      </Tag>
    ))}
  </div>
));
GroupHeader.displayName = 'InsightGroupHeader';

export default GroupHeader;
