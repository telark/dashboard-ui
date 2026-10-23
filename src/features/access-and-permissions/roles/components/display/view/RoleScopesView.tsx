import React, { useCallback, useMemo, useState } from 'react';
import { Tag } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { AiOutlineStop } from 'react-icons/ai';
import {
  DEFAULT_COLORS,
  HAIRLINE,
  SLIDE_OUT,
  TAG_CLASS,
  getPillSurface,
  FONT_SIZE,
  FONT_WEIGHT,
  MOTION,
  SPACING,
} from '../../../../../../constants';
import { ROLES_CONSTANTS as RC, denyRuleSentence } from '../../../constants';
import type { ScopesPermissionsProps } from '../../../models';

const DENIED_TEXT = getPillSurface(DEFAULT_COLORS.DANGER).background;

const SCOPE_CARD_STYLE = {
  // Off scale, kept exact: gap 10 (SM to MD).
  list: { display: 'flex', flexDirection: 'column' as const, gap: 10 },
  // Off scale, kept exact: borderRadius 10 (MD to LG).
  card: {
    border: HAIRLINE.SURFACE_BORDER_LIGHT,
    borderRadius: 10,
    overflow: 'hidden' as const,
  },
  // Off scale, kept exact: padding 14 (MD to LG).
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.SM,
    padding: `${SPACING.MD}px 14px`,
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
    fontSize: FONT_SIZE.XS,
    color: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
    transition: `transform ${MOTION.BASE_MS}ms`,
  },
  name: {
    fontSize: FONT_SIZE.BASE,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
    color: DEFAULT_COLORS.TEXT_ON_SURFACE,
  },
  meta: { display: 'flex', alignItems: 'center', gap: SPACING.SM, flexShrink: 0 },
  deniedCount: { fontSize: FONT_SIZE.SM, fontWeight: FONT_WEIGHT.SEMIBOLD, color: DENIED_TEXT },
  // Off scale, kept exact: padding 10 (SM to MD), padding 14 (MD to LG).
  denied: {
    listStyle: 'none' as const,
    margin: SPACING.NONE,
    padding: '10px 14px',
    borderTop: HAIRLINE.SURFACE_BORDER_LIGHT,
    background: DEFAULT_COLORS.SURFACE_SUBTLE,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: SPACING.SM,
  },
  deniedRule: {
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.SM,
    fontSize: FONT_SIZE.MD,
    fontWeight: FONT_WEIGHT.MEDIUM,
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
