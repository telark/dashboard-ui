import React from 'react';
import { Pagination } from 'antd';
import ResourceRowItem from './ResourceRowItem';
import { ResourcesListProps } from '../../../interfaces/grouper';

const ResourcesList: React.FC<ResourcesListProps> = React.memo(
  ({
    resources,
    selectedResources,
    onSelectResource,
    currentPage,
    pageSize,
    totalResources,
    onPageChange,
  }) => {
    const showPagination = totalResources > pageSize;

    return (
      <>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {resources.map((resource) => {
            const isSelected = selectedResources.has(resource.name);
            return (
              <ResourceRowItem
                key={resource.name}
                resource={resource}
                isSelected={isSelected}
                onSelect={(checked) => onSelectResource(resource.name, checked)}
              />
            );
          })}
        </div>

        {showPagination && (
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={totalResources}
              onChange={onPageChange}
            />
          </div>
        )}
      </>
    );
  },
);

ResourcesList.displayName = 'ResourcesList';
export default ResourcesList;

