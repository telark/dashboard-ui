import React, { memo, useState } from 'react';
import { DownOutlined, RightOutlined } from '@ant-design/icons';
import { Pagination, Tooltip } from 'antd';
import { DEFAULT_COLORS } from '../../../../../constants';
import { PAGINATION_DEFAULTS } from '../../../../../components/display/table/constants';
import RowTag from '../../../../../components/display/table/RowTag';
import TimeAgo from '../../../../../components/display/time/TimeAgo';
import { APPLICATIONS_UI } from '../../constants';
import {
  APPLICATION_SECTION_LAYOUT,
  APPLICATION_WORKLOAD_METRICS,
} from '../../constants/sectionLayout';
import {
  formatBytes,
  formatMillicores,
  parseCpuToMillicores,
  parseMemoryToBytes,
} from '../../utils/k8sQuantity';
import MutedText from './MutedText';
import WorkloadUsageMeter from './WorkloadUsageMeter';
import type { ApplicationWorkloadUsage, ApplicationWorkloadUsagePerInstance } from '../../models';

const M = APPLICATION_WORKLOAD_METRICS;
const WM = APPLICATIONS_UI.SECTIONS.WORKLOAD_METRICS;

/** `cpu · mem`, rendered identically for pods and containers so they compare at a glance. */
const UsageValue: React.FC<{ cpu: string; memory: string; strong?: boolean }> = ({
  cpu,
  memory,
  strong = false,
}) => (
  <span
    style={{
      flexShrink: 0,
      fontSize: M.LABEL_FONT_SIZE_PX,
      fontWeight: strong ? 700 : 500,
      color: strong ? DEFAULT_COLORS.TEXT_PRIMARY : DEFAULT_COLORS.TEXT_MUTED,
      whiteSpace: 'nowrap',
    }}
  >
    {cpu} {WM.CPU_ABBREV} {WM.MID_DOT} {memory} {WM.MEMORY_ABBREV}
  </span>
);

const PodBlock: React.FC<{ instance: ApplicationWorkloadUsagePerInstance }> = ({ instance }) => {
  const [containersOpen, setContainersOpen] = useState(true);
  const hasContainers = Boolean(instance.containers?.length);

  return (
    <div style={{ display: 'grid', rowGap: M.DETAIL_ROW_GAP_PX }}>
      {/* Pod line: labelled, with its total called out as a sum of the containers below. */}
      <div style={{ display: 'flex', alignItems: 'center', gap: M.HEADER_GAP_PX, minWidth: 0 }}>
        <RowTag text={WM.POD_LABEL} {...APPLICATION_SECTION_LAYOUT.RUNTIME_VALUE_ROW_TAG} />
        <span
          style={{
            fontSize: M.LABEL_FONT_SIZE_PX,
            fontWeight: 700,
            color: DEFAULT_COLORS.TEXT_PRIMARY,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {instance.name}
        </span>
        <span style={{ flex: 1 }} />
        <Tooltip title={WM.POD_TOTAL_TOOLTIP}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'help',
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: M.LABEL_FONT_SIZE_PX, color: DEFAULT_COLORS.TEXT_MUTED }}>
              {WM.POD_TOTAL_LABEL}
            </span>
            <UsageValue cpu={instance.totalCpu} memory={instance.totalMemory} strong />
          </span>
        </Tooltip>
      </div>

      {hasContainers ? (
        <div style={{ paddingLeft: M.CONTAINER_INDENT_PX, display: 'grid', rowGap: 2 }}>
          <button
            type="button"
            onClick={() => setContainersOpen((prev) => !prev)}
            aria-expanded={containersOpen}
            style={{
              all: 'unset',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              marginBottom: 2,
              fontSize: M.LABEL_FONT_SIZE_PX,
              color: DEFAULT_COLORS.TEXT_MUTED,
            }}
          >
            {containersOpen ? <DownOutlined /> : <RightOutlined />}
            <span>{WM.CONTAINERS_LABEL}</span>
          </button>
          {containersOpen
            ? instance.containers?.slice(0, M.MAX_CONTAINERS).map((container) => (
                <div
                  key={container.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: M.HEADER_GAP_PX,
                    minWidth: 0,
                  }}
                >
                  <span
                    style={{
                      width: M.CONTAINER_DOT_SIZE_PX,
                      height: M.CONTAINER_DOT_SIZE_PX,
                      borderRadius: '50%',
                      background: DEFAULT_COLORS.ICON_SECONDARY,
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontSize: M.LABEL_FONT_SIZE_PX,
                      color: DEFAULT_COLORS.TEXT_PRIMARY,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {container.name}
                  </span>
                  <span style={{ flex: 1 }} />
                  <UsageValue cpu={container.cpu} memory={container.memory} />
                </div>
              ))
            : null}
          {containersOpen && (instance.containers?.length ?? 0) > M.MAX_CONTAINERS ? (
            <span style={{ fontSize: M.LABEL_FONT_SIZE_PX, color: DEFAULT_COLORS.TEXT_MUTED }}>
              +{(instance.containers?.length ?? 0) - M.MAX_CONTAINERS} {WM.MORE_CONTAINERS_SUFFIX}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

const InstanceDetail: React.FC<{ workload: ApplicationWorkloadUsage }> = ({ workload }) => {
  const instances = workload.usage?.resources?.usagePerInstance ?? [];
  if (instances.length === 0) return null;

  return (
    <div
      style={{
        marginTop: M.METER_ROW_GAP_PX,
        paddingLeft: M.DETAIL_INDENT_PX,
        borderLeft: APPLICATION_SECTION_LAYOUT.SUBTLE_DIVIDER,
        display: 'grid',
        rowGap: M.POD_BLOCK_GAP_PX,
      }}
    >
      {instances.slice(0, M.MAX_INSTANCES).map((instance) => (
        <PodBlock key={instance.name} instance={instance} />
      ))}
      {instances.length > M.MAX_INSTANCES ? (
        <div style={{ fontSize: M.LABEL_FONT_SIZE_PX, color: DEFAULT_COLORS.TEXT_MUTED }}>
          {WM.SHOWING_FIRST_INSTANCES} {instances.length}.
        </div>
      ) : null}
    </div>
  );
};

const WorkloadRow: React.FC<{ workload: ApplicationWorkloadUsage }> = ({ workload }) => {
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);

  const { baseline, usage } = workload;
  const replicas = baseline?.replicas ?? 0;
  const usageAvailable = Boolean(usage?.available);
  const hasInstances = (usage?.resources?.usagePerInstance?.length ?? 0) > 0;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: M.ROW_PADDING,
        borderRadius: M.ROW_RADIUS_PX,
        border: APPLICATION_SECTION_LAYOUT.SUBTLE_DIVIDER,
        background: hovered ? DEFAULT_COLORS.SURFACE_ELEVATED_HOVER : 'transparent',
        transition: 'background 150ms ease',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: M.HEADER_GAP_PX,
          minWidth: 0,
        }}
      >
        <span
          style={{
            fontSize: M.NAME_FONT_SIZE_PX,
            fontWeight: 700,
            color: DEFAULT_COLORS.TEXT_PRIMARY,
            minWidth: 0,
          }}
        >
          {workload.resourceName}
        </span>
        <RowTag
          text={workload.resourceKind}
          {...APPLICATION_SECTION_LAYOUT.RUNTIME_VALUE_ROW_TAG}
        />
        <RowTag
          text={workload.namespace}
          capitalize={false}
          {...APPLICATION_SECTION_LAYOUT.RUNTIME_VALUE_ROW_TAG}
        />
        <span style={{ fontSize: M.LABEL_FONT_SIZE_PX, color: DEFAULT_COLORS.TEXT_MUTED }}>
          {replicas} {replicas === 1 ? WM.REPLICAS_SUFFIX.one : WM.REPLICAS_SUFFIX.other}
        </span>
        {usageAvailable && usage?.qos ? (
          <RowTag text={usage.qos} {...APPLICATION_SECTION_LAYOUT.RUNTIME_VALUE_ROW_TAG} />
        ) : null}

        <span style={{ flex: 1 }} />

        {usageAvailable && usage?.timestamp ? (
          <span style={{ fontSize: M.LABEL_FONT_SIZE_PX, color: DEFAULT_COLORS.TEXT_MUTED }}>
            <TimeAgo date={usage.timestamp} />
          </span>
        ) : null}
        {hasInstances ? (
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            aria-expanded={expanded}
            aria-label={WM.INSTANCES_TITLE}
            style={{
              all: 'unset',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              color: DEFAULT_COLORS.TEXT_MUTED,
              fontSize: M.LABEL_FONT_SIZE_PX,
            }}
          >
            {expanded ? <DownOutlined /> : <RightOutlined />}
          </button>
        ) : null}
      </div>

      {usageAvailable ? (
        <div style={{ display: 'grid', rowGap: M.METER_ROW_GAP_PX, marginTop: M.METER_ROW_GAP_PX }}>
          <WorkloadUsageMeter
            label={WM.CPU_ABBREV}
            used={parseCpuToMillicores(usage?.resources?.totalCpu)}
            request={parseCpuToMillicores(baseline?.requests?.cpu)}
            limit={parseCpuToMillicores(baseline?.limits?.cpu)}
            format={formatMillicores}
            rawUsed={usage?.resources?.totalCpu ?? ''}
          />
          <WorkloadUsageMeter
            label={WM.MEMORY_ABBREV}
            used={parseMemoryToBytes(usage?.resources?.totalMemory)}
            request={parseMemoryToBytes(baseline?.requests?.memory)}
            limit={parseMemoryToBytes(baseline?.limits?.memory)}
            format={formatBytes}
            rawUsed={usage?.resources?.totalMemory ?? ''}
          />
        </div>
      ) : (
        <div style={{ marginTop: M.METER_ROW_GAP_PX }}>
          <MutedText value={WM.USAGE_EMPTY} />
        </div>
      )}

      {expanded ? <InstanceDetail workload={workload} /> : null}
    </div>
  );
};

interface ApplicationWorkloadMetricsProps {
  workloads: ApplicationWorkloadUsage[];
}

const ApplicationWorkloadMetrics: React.FC<ApplicationWorkloadMetricsProps> = memo(
  ({ workloads }) => {
    const [currentPage, setCurrentPage] = useState(1);

    const pageStart = (currentPage - 1) * M.PAGE_SIZE;
    const pageWorkloads = workloads.slice(pageStart, pageStart + M.PAGE_SIZE);
    const rangeEnd = Math.min(pageStart + M.PAGE_SIZE, workloads.length);

    return (
      <div style={{ display: 'grid', rowGap: M.ROW_GAP_PX }}>
        {pageWorkloads.map((workload) => (
          <WorkloadRow
            key={`${workload.namespace}:${workload.resourceKind}:${workload.resourceName}`}
            workload={workload}
          />
        ))}
        {workloads.length > M.PAGE_SIZE ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: M.PAGINATION_GAP_PX,
              paddingTop: M.METER_ROW_GAP_PX,
            }}
          >
            <span style={{ fontSize: M.LABEL_FONT_SIZE_PX, color: DEFAULT_COLORS.TEXT_MUTED }}>
              {pageStart + 1}-{rangeEnd} of {workloads.length}
            </span>
            <Pagination
              className={PAGINATION_DEFAULTS.CLASS_NAME}
              size="small"
              current={currentPage}
              pageSize={M.PAGE_SIZE}
              total={workloads.length}
              onChange={setCurrentPage}
              showSizeChanger={false}
            />
          </div>
        ) : null}
      </div>
    );
  },
);

ApplicationWorkloadMetrics.displayName = 'ApplicationWorkloadMetrics';

export default ApplicationWorkloadMetrics;
