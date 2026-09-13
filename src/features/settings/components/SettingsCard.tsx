import React, { memo, useState } from 'react';
import { UpOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { AnimatePresence, motion } from 'framer-motion';
import { SETTINGS_CONSTANTS } from '../constants';
import { DEFAULT_COLORS } from '../../../constants';

const { CONTENT } = SETTINGS_CONSTANTS;
const COLLAPSE = CONTENT.CARD_COLLAPSE;

interface SettingsCardProps {
  title: string;
  description?: string;
  headerStart?: React.ReactNode;
  headerAction?: React.ReactNode;
  /** Small tag rendered next to the title, e.g. an "Experimental" badge. */
  titleBadge?: React.ReactNode;
  /** Opt-in: existing callers keep a always-open card. */
  collapsible?: boolean;
  children: React.ReactNode;
}

const SettingsCard: React.FC<SettingsCardProps> = memo(
  ({
    title,
    description,
    headerStart,
    headerAction,
    titleBadge,
    collapsible = false,
    children,
  }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [hovered, setHovered] = useState(false);
    const hasDescription = description != null && description.length > 0;
    const showBody = !collapsible || !collapsed;
    const bodyGap = hasDescription || children ? (hasDescription ? 12 : 16) : 0;
    const headerStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 12,
      // Collapsible cards carry this gap inside the animated body instead, so it
      // collapses with the content rather than snapping to zero.
      marginBottom: collapsible ? 0 : bodyGap,
    };

    return (
      <div
        style={{
          background: DEFAULT_COLORS.SURFACE_ELEVATED,
          borderRadius: CONTENT.CARD_BORDER_RADIUS,
          padding: CONTENT.CARD_PADDING,
          border: `1px solid ${DEFAULT_COLORS.BORDER_ELEVATED}`,
        }}
      >
        <div style={headerStyle}>
          {headerStart != null ? <div style={{ flexShrink: 0 }}>{headerStart}</div> : null}
          <div style={{ minWidth: 0, flex: 1 }}>
            {title.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 8 }}>
                <h3
                  style={{
                    margin: 0,
                    fontSize: 15,
                    fontWeight: 600,
                    color: DEFAULT_COLORS.TEXT_PRIMARY,
                  }}
                >
                  {title}
                </h3>
                {titleBadge != null ? (
                  <span style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center' }}>
                    {titleBadge}
                  </span>
                ) : null}
              </div>
            )}
            {hasDescription && (
              <p
                style={{
                  // The negative pull is tuned for a bare <h3>'s leading; a
                  // titleBadge sits in the row as a real box with no such
                  // leading, so it needs a normal positive gap instead or the
                  // pull drags this text up under the badge.
                  margin:
                    title.length === 0
                      ? 0
                      : titleBadge != null
                        ? '1px 0 0'
                        : `${CONTENT.CARD_TITLE_TO_DESCRIPTION_GAP_PX}px 0 0`,
                  fontSize: 13,
                  color: DEFAULT_COLORS.TEXT_MUTED,
                  lineHeight: 1.5,
                }}
              >
                {description}
              </p>
            )}
          </div>
          {headerAction != null || collapsible ? (
            <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              {headerAction}
              {collapsible ? (
                <Tooltip title={collapsed ? COLLAPSE.EXPAND_LABEL : COLLAPSE.COLLAPSE_LABEL}>
                  <button
                    type="button"
                    onClick={() => setCollapsed((prev) => !prev)}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    aria-expanded={!collapsed}
                    aria-label={collapsed ? COLLAPSE.EXPAND_LABEL : COLLAPSE.COLLAPSE_LABEL}
                    style={{
                      all: 'unset',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: COLLAPSE.BUTTON_SIZE,
                      height: COLLAPSE.BUTTON_SIZE,
                      borderRadius: COLLAPSE.BORDER_RADIUS,
                      fontSize: COLLAPSE.ICON_SIZE,
                      color: hovered ? DEFAULT_COLORS.TEXT_PRIMARY : DEFAULT_COLORS.TEXT_MUTED,
                      transition: COLLAPSE.TRANSITION,
                    }}
                  >
                    <motion.span
                      style={{ display: 'inline-flex' }}
                      animate={{ rotate: collapsed ? COLLAPSE.ICON_ROTATION_DEG : 0 }}
                      transition={{
                        duration: COLLAPSE.ANIMATION_DURATION_S,
                        ease: COLLAPSE.ANIMATION_EASE,
                      }}
                    >
                      <UpOutlined />
                    </motion.span>
                  </button>
                </Tooltip>
              ) : null}
            </div>
          ) : null}
        </div>
        {collapsible ? (
          <AnimatePresence initial={false}>
            {showBody ? (
              <motion.div
                key="body"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{
                  duration: COLLAPSE.ANIMATION_DURATION_S,
                  ease: COLLAPSE.ANIMATION_EASE,
                }}
                // Children must clip while the height animates, or they spill past the card.
                style={{ overflow: 'hidden' }}
              >
                <div style={{ paddingTop: bodyGap }}>{children}</div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        ) : (
          children
        )}
      </div>
    );
  },
);

SettingsCard.displayName = 'SettingsCard';

export default SettingsCard;
