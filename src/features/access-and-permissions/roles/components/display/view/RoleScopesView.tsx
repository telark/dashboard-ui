import React, { useMemo } from 'react';
import { Popover, Tooltip } from 'antd';
import { AiOutlineStop } from 'react-icons/ai';
import { VIEW } from '../../../../../../constants/layout/panels';
import { DEFAULT_COLORS } from '../../../../../../constants';
import RowTag from '../../../../../../components/display/table/RowTag';
import { ROLES_CONSTANTS as RC } from '../../../constants';
import type { ScopesPermissionsProps } from '../../../models';

const RULES_POPOVER_STYLE = {
  content: { maxWidth: 280, padding: '10px 4px 4px' },
  list: {
    listStyle: 'none' as const,
    margin: 0,
    padding: 0,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 4,
  },
  listItem: {
    fontSize: 12,
    fontWeight: 500,
    color: DEFAULT_COLORS.TEXT_SECONDARY,
    padding: '4px 8px',
    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
    borderRadius: 8,
    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  listItemBullet: {
    width: 4,
    height: 4,
    borderRadius: '50%',
    background: DEFAULT_COLORS.TEXT_MUTED,
    flexShrink: 0,
  },
  rulesIcon: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 22,
    height: 22,
    borderRadius: 6,
    background: `${DEFAULT_COLORS.ERROR}18`,
    color: DEFAULT_COLORS.ERROR,
    cursor: 'pointer',
    marginLeft: 6,
    flexShrink: 0,
  },
} as const;

const DeniedRulesPopover: React.FC<{ rules: string[] }> = ({ rules }) => (
  <ul style={RULES_POPOVER_STYLE.list}>
    {rules.map((rule, index) => (
      <li key={`${rule}-${index}`} style={RULES_POPOVER_STYLE.listItem}>
        <span style={RULES_POPOVER_STYLE.listItemBullet} aria-hidden />
        {rule}
      </li>
    ))}
  </ul>
);

const RoleScopesView: React.FC<ScopesPermissionsProps> = ({ scopes }) => {
  const scopeRows = useMemo(() => {
    return RC.SCOPE.DEFAULT_AREAS.filter((area) => scopes[area.key]).map((area) => {
      const scopeValue = scopes[area.key];
      return { area, scopeValue };
    });
  }, [scopes]);

  if (scopeRows.length === 0) return null;

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 700,
    color: DEFAULT_COLORS.TEXT_PRIMARY,
    letterSpacing: 0.2,
    marginBottom: 4,
    display: 'block',
  };

  return (
    <div style={VIEW.DETAILS.CONTAINER}>
      <span style={sectionTitleStyle}>{RC.SCOPE.TITLE}</span>
      {scopeRows.map(({ area, scopeValue }) => {
        const hasRules = scopeValue.rules && scopeValue.rules.length > 0;
        return (
          <div key={area.key} style={VIEW.DETAILS.ROW}>
            <span style={VIEW.DETAILS.LABEL}>{area.label}</span>
            <div
              style={{
                ...VIEW.DETAILS.VALUE,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 0,
              }}
            >
              <RowTag
                text={scopeValue.level}
                background={DEFAULT_COLORS.CHIP_CUSTOM_BG}
                color={DEFAULT_COLORS.CHIP_CUSTOM_TEXT}
                fontSize={12}
              />
              {hasRules && (
                <Popover
                  trigger="click"
                  title={RC.SCOPE.RULES.DENY_LABEL}
                  content={<DeniedRulesPopover rules={scopeValue.rules ?? []} />}
                  styles={{ body: RULES_POPOVER_STYLE.content }}
                >
                  <Tooltip title={RC.SCOPE.RULES.VIEW_DENIED_TOOLTIP}>
                    <span
                      style={RULES_POPOVER_STYLE.rulesIcon}
                      role="button"
                      tabIndex={0}
                      aria-label={`View denied rules (${scopeValue.rules?.length ?? 0})`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') e.currentTarget.click();
                      }}
                    >
                      <AiOutlineStop size={14} />
                    </span>
                  </Tooltip>
                </Popover>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RoleScopesView;
