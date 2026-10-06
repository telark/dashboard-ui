import React, { memo, useMemo, useState } from 'react';
import { ApartmentOutlined, ShareAltOutlined } from '@ant-design/icons';
import { Segmented, Tooltip } from 'antd';
import { DEFAULT_COLORS, EMPTY_VALUE } from '../../../../constants';
import SettingsCard from '../../../settings/components/SettingsCard';
import MutedText from './MutedText';
import ApplicationResourceGraph from './ApplicationResourceGraph';
import ApplicationResourceTree from './ApplicationResourceTree';
import { APPLICATIONS_UI } from '../../constants';
import {
  APPLICATION_RESOURCE_VIEW,
  type ApplicationResourceView,
} from '../../constants/sectionLayout';
import type { Application, ApplicationResourceRef } from '../../models';

const MAX_SHOWN = 50;

const ApplicationResourcesSection: React.FC<{ application: Application }> = memo(
  ({ application }) => {
    const [resourceView, setResourceView] = useState<ApplicationResourceView>(
      APPLICATION_RESOURCE_VIEW.GRAPH,
    );
    const resources = useMemo(() => application.resources || [], [application.resources]);

    const resourcesByKind = useMemo(() => {
      const shown = resources.slice(0, MAX_SHOWN);
      const map = new Map<string, ApplicationResourceRef[]>();
      for (const r of shown) {
        const g = map.get(r.kind) ?? [];
        g.push(r);
        map.set(r.kind, g);
      }
      return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
    }, [resources]);

    return (
      <SettingsCard
        collapsible
        title={APPLICATIONS_UI.SECTIONS.RESOURCES.TITLE}
        description={APPLICATIONS_UI.SECTIONS.RESOURCES.DESCRIPTION}
        headerAction={
          resources.length > 0 ? (
            <Segmented<ApplicationResourceView>
              size="small"
              value={resourceView}
              onChange={setResourceView}
              options={[
                {
                  value: APPLICATION_RESOURCE_VIEW.GRAPH,
                  icon: (
                    <Tooltip title={APPLICATIONS_UI.SECTIONS.RESOURCES.VIEW_GRAPH_TOOLTIP}>
                      <ShareAltOutlined />
                    </Tooltip>
                  ),
                },
                {
                  value: APPLICATION_RESOURCE_VIEW.TREE,
                  icon: (
                    <Tooltip title={APPLICATIONS_UI.SECTIONS.RESOURCES.VIEW_TREE_TOOLTIP}>
                      <ApartmentOutlined />
                    </Tooltip>
                  ),
                },
              ]}
            />
          ) : null
        }
      >
        {resources.length === 0 ? (
          <MutedText value={EMPTY_VALUE} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {resourceView === APPLICATION_RESOURCE_VIEW.GRAPH ? (
              <ApplicationResourceGraph
                applicationName={application.name}
                groups={resourcesByKind}
              />
            ) : (
              <ApplicationResourceTree
                applicationName={application.name}
                groups={resourcesByKind}
              />
            )}
            {resources.length > MAX_SHOWN ? (
              <div style={{ fontSize: 12, color: DEFAULT_COLORS.TEXT_MUTED }}>
                {APPLICATIONS_UI.SECTIONS.RESOURCES.SHOWING_FIRST} {MAX_SHOWN} of {resources.length}
                .
              </div>
            ) : null}
          </div>
        )}
      </SettingsCard>
    );
  },
);

ApplicationResourcesSection.displayName = 'ApplicationResourcesSection';

export default ApplicationResourcesSection;
