import React, { memo } from 'react';
import ApplicationPageLayout from '../../components/layout/ApplicationPageLayout';
import type { ApplicationBreadcrumbItem } from '../../components/layout/ApplicationPageLayout';

export interface ApplicationDetailsHeaderProps {
  breadcrumbItems: ApplicationBreadcrumbItem[];
  subtitle: string;
  children: React.ReactNode;
}

const ApplicationDetailsHeader: React.FC<ApplicationDetailsHeaderProps> = memo(
  ({ breadcrumbItems, subtitle, children }) => {
    return (
      <ApplicationPageLayout breadcrumbItems={breadcrumbItems} subtitle={subtitle}>
        {children}
      </ApplicationPageLayout>
    );
  },
);

ApplicationDetailsHeader.displayName = 'ApplicationDetailsHeader';

export default ApplicationDetailsHeader;

