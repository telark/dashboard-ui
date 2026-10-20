import React, { useCallback, useMemo, useState } from 'react';
import { Tag } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { AiOutlineStop } from 'react-icons/ai';
import { DEFAULT_COLORS, SLIDE_OUT, TAG_CLASS, getPillSurface } from '../../../../../../constants';
import { ROLES_CONSTANTS as RC, denyRuleSentence } from '../../../constants';
import type { ScopesPermissionsProps } from '../../../models';

const DENIED_TEXT = getPillSurface(DEFAULT_COLORS.DANGER).background;

const SCOPE_CARD_STYLE = {
  list: { display: 'flex', flexDirection: 'column' as const, gap: 10 },
  card: {
    border: `1px solid ${DEFAULT_COLORS.SURFACE_BORDER_LIGHT}`,
    borderRadius: 10,
    overflow: 'hidden' as const,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    padding: '12px 14px',
  },
  toggle: {
    width: '100%',
    boxSizing: 'border-box' as const,
    background: 'none',
    border: 'none',
    font: 'inherit',
    textAlign: 'left' as const,
    cursor: 'pointer',
  },
  // Every card keeps the chevron's slot, so the level pills line up whether or not a card folds.
  chevron: {
    width: 11,
    fontSize: 11,
    color: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
    transition: 'transform 0.2s',
  },
  name: { fontSize: 14, fontWeight: 600, color: DEFAULT_COLORS.TEXT_ON_SURFACE },
  meta: { display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 },
  deniedCount: { fontSize: 12, fontWeight: 600, color: DENIED_TEXT },
  denied: {
    listStyle: 'none' as const,
    margin: 0,
    padding: '10px 14px',
    borderTop: `1px solid ${DEFAULT_COLORS.SURFACE_BORDER_LIGHT}`,
    background: DEFAULT_COLORS.SURFACE_SUBTLE,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 8,
  },
  deniedRule: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 13,
    fontWeight: 500,
    color: DEFAULT_COLORS.TEXT_ON_SURFACE,
  },
} as const;

const RoleScopesView: React.FC<ScopesPermissionsProps> = ({ scopes }) => {
  const scopeRows = useMemo(
    () =>
      RC.SCOPE.DEFAULT_AREAS.filter((area) => scopes[area.key]).map((area) => {
        const { level, rules = [] } = scopes[area.key];
        return { area, level, denied: rules.map(denyRuleSentence) };
      }),
    [scopes],
  );

  // Denied lists start open; a header click folds one away.
  const [folded, setFolded] = useState<ReadonlySet<string>>(new Set());
  const toggle = useCallback(
    (key: string) =>
      setFolded((prev) => {
        const next = new Set(prev);
        if (!next.delete(key)) next.add(key);
        return next;
      }),
    [],
  );

  if (scopeRows.length === 0) return null;

  return (
    <div style={SCOPE_CARD_STYLE.list}>
      {scopeRows.map(({ area, level, denied }) => {
        const hasDenied = denied.length > 0;
        const open = hasDenied && !folded.has(area.key);
        const headerContent = (
          <>
            <span style={SCOPE_CARD_STYLE.name}>{area.label}</span>
            <span style={SCOPE_CARD_STYLE.meta}>
              {hasDenied && (
                <span style={SCOPE_CARD_STYLE.deniedCount}>
                  {RC.SCOPE.RULES.DENIED_COUNT(denied.length)}
                </span>
              )}
              <Tag className={TAG_CLASS.MEDIUM}>{level}</Tag>
              {hasDenied ? (
                <DownOutlined
                  aria-hidden
                  style={{
                    ...SCOPE_CARD_STYLE.chevron,
                    transform: open ? 'rotate(180deg)' : undefined,
                  }}
                />
              ) : (
                <span aria-hidden style={SCOPE_CARD_STYLE.chevron} />
              )}
            </span>
          </>
        );
        return (
          <div key={area.key} style={SCOPE_CARD_STYLE.card}>
            {hasDenied ? (
              <button
                type="button"
                className={SLIDE_OUT.HEADER_BUTTON_CLASS}
                aria-expanded={open}
                onClick={() => toggle(area.key)}
                style={{ ...SCOPE_CARD_STYLE.header, ...SCOPE_CARD_STYLE.toggle }}
              >
                {headerContent}
              </button>
            ) : (
              <div style={SCOPE_CARD_STYLE.header}>{headerContent}</div>
            )}
            {open && (
              <ul style={SCOPE_CARD_STYLE.denied} aria-label={RC.SCOPE.RULES.DENIED_LIST_LABEL}>
                {denied.map((label) => (
                  <li key={label} style={SCOPE_CARD_STYLE.deniedRule}>
                    <AiOutlineStop size={14} color={DENIED_TEXT} aria-hidden />
                    {label}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default RoleScopesView;
