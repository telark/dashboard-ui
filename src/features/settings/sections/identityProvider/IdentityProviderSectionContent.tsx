import React, { memo } from 'react';
import { SETTINGS_CONSTANTS } from '../../constants';
import OIDCSection from './OIDCSection';
import SelfRegistrationSection from './SelfRegistrationSection';

const { CONTENT } = SETTINGS_CONSTANTS;

const IdentityProviderSectionContent: React.FC = memo(() => (
  <>
    <OIDCSection />
    <div style={{ marginTop: CONTENT.GAP_BETWEEN_CARDS }}>
      <SelfRegistrationSection />
    </div>
  </>
));

IdentityProviderSectionContent.displayName = 'IdentityProviderSectionContent';

export default IdentityProviderSectionContent;
