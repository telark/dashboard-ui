import React, { memo } from 'react';
import { SETTINGS_CONSTANTS } from '../../constants';
import PasskeysCard from './components/PasskeysCard';
import ActiveSessionsCard from './components/ActiveSessionsCard';

const { CONTENT } = SETTINGS_CONSTANTS;

interface SecuritySectionContentProps {
  onManagePasskeysClick?: () => void;
}

const SecuritySectionContent: React.FC<SecuritySectionContentProps> = memo(
  ({ onManagePasskeysClick }) => (
    <>
      <PasskeysCard onManagePasskeysClick={onManagePasskeysClick} />
      <div style={{ marginTop: CONTENT.GAP_BETWEEN_CARDS }}>
        <ActiveSessionsCard />
      </div>
    </>
  ),
);

SecuritySectionContent.displayName = 'SecuritySectionContent';

export default SecuritySectionContent;
