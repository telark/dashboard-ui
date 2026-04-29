import React from 'react';
import SettingsCard from './SettingsCard';
import { DEFAULT_COLORS } from '../../../constants';

interface SettingsNoPermissionsCardProps {
  description?: string;
}

const DEFAULT_DESCRIPTION = 'You do not have permission to manage this settings section.';

const SettingsNoPermissionsCard: React.FC<SettingsNoPermissionsCardProps> = ({
  description = DEFAULT_DESCRIPTION,
}) => (
  <SettingsCard title="No Permissions">
    <p style={{ margin: 0, fontSize: 14, color: DEFAULT_COLORS.TEXT_MUTED }}>{description}</p>
  </SettingsCard>
);

export default SettingsNoPermissionsCard;
