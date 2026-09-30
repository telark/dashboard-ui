import React, { useMemo } from 'react';
import { VIEW } from '../../../../../../constants/layout/panels';
import { DEFAULT_COLORS } from '../../../../../../constants';
import RowTag from '../../../../../../components/display/table/RowTag';
import { ROLES_CONSTANTS as RC } from '../../../constants';
import type { Role } from '../../../models';

const SECTION_TITLE_STYLE: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: DEFAULT_COLORS.TEXT_ON_SURFACE,
  letterSpacing: 0.2,
  marginBottom: 4,
  display: 'block',
};

const tagStyle = {
  fontSize: 12 as const,
};

interface RoleProtectionViewProps {
  role: Pick<Role, 'protection'> | null;
}

const PROTECTION_FIELDS: ReadonlyArray<{
  key: keyof NonNullable<Role['protection']>;
  label: string;
}> = [
  { key: 'preventDeletion', label: RC.PROTECTION.PREVENT_DELETION_LABEL },
  { key: 'preventModification', label: RC.PROTECTION.PREVENT_MODIFICATION_LABEL },
  { key: 'preventScopeChanges', label: RC.PROTECTION.PREVENT_SCOPE_CHANGES_LABEL },
  { key: 'lockName', label: RC.PROTECTION.LOCK_NAME_LABEL },
  { key: 'lockCategory', label: RC.PROTECTION.LOCK_CATEGORY_LABEL },
  { key: 'softDelete', label: RC.PROTECTION.SOFT_DELETE_LABEL },
];

const RoleProtectionView: React.FC<RoleProtectionViewProps> = ({ role }) => {
  const rows = useMemo(() => {
    const p = role?.protection;
    return PROTECTION_FIELDS.map(({ key, label }) => ({
      label,
      enabled: p?.[key] ?? false,
    }));
  }, [role?.protection]);

  return (
    <div style={VIEW.DETAILS.CONTAINER}>
      <span style={SECTION_TITLE_STYLE}>{RC.PROTECTION.TITLE}</span>
      {rows.map(({ label, enabled }) => (
        <div key={label} style={VIEW.DETAILS.ROW}>
          <span style={VIEW.DETAILS.LABEL}>{label}</span>
          <RowTag text={enabled ? 'Yes' : 'No'} fontSize={tagStyle.fontSize} />
        </div>
      ))}
    </div>
  );
};

export default RoleProtectionView;
