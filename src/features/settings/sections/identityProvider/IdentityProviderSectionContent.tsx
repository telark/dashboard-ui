import React, { memo } from 'react';
import OIDCSection from './OIDCSection';

const IdentityProviderSectionContent: React.FC = memo(() => <OIDCSection />);

IdentityProviderSectionContent.displayName = 'IdentityProviderSectionContent';

export default IdentityProviderSectionContent;
