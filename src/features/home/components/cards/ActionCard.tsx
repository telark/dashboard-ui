import React, { useState, useCallback, useMemo } from 'react';
import { RightOutlined, ClockCircleOutlined } from '@ant-design/icons';
import {
  DEFAULT_COLORS,
  CARD_CONFIGS,
  CARD_COLORS,
  CARD_TRANSITIONS,
  CARD_EFFECTS,
} from '../../../../constants';

export interface ActionCardProps {
  title: string;
  description?: string;
  icon: React.ReactNode;
  onClick?: () => void;
  rightLabel?: string;
  footerTag?: string;
  footerBg?: string;
  footerTextColor?: string;
}

const ActionCard: React.FC<ActionCardProps> = ({
  title,
  description,
  icon,
  onClick,
  rightLabel,
  footerTag,
  footerBg,
  footerTextColor,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  const cardStyle = useMemo(
    () => ({
      background: CARD_COLORS.BACKGROUND.GRADIENT,
      border: `1px solid ${CARD_COLORS.BORDER.DEFAULT}`,
      borderRadius: CARD_CONFIGS.ACTION_CARD.BORDER_RADIUS,
      padding: CARD_CONFIGS.ACTION_CARD.PADDING,
      cursor: 'pointer',
      transition: CARD_TRANSITIONS.CARD,
      boxShadow: isHovered ? CARD_COLORS.SHADOW.HOVER : CARD_COLORS.SHADOW.DEFAULT,
      transform: isHovered ? CARD_EFFECTS.HOVER_TRANSFORM : 'translateY(0)',
      width: '100%',
      textAlign: 'left' as const,
      display: 'flex',
      flexDirection: 'column' as const,
      gap: CARD_CONFIGS.ACTION_CARD.GAP.MAIN,
    }),
    [isHovered],
  );

  return (
    <button
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={cardStyle}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div
          style={{ display: 'flex', alignItems: 'center', gap: CARD_CONFIGS.ACTION_CARD.GAP.MAIN }}
        >
          <div
            style={{
              width: CARD_CONFIGS.ACTION_CARD.ICON_SIZE,
              height: CARD_CONFIGS.ACTION_CARD.ICON_SIZE,
              borderRadius: '50%',
              background: CARD_COLORS.ICON.BACKGROUND,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: CARD_CONFIGS.ACTION_CARD.ICON_FONT_SIZE,
              color: DEFAULT_COLORS.SUCCESS,
              boxShadow: CARD_COLORS.ICON.SHADOW_EXTENDED,
            }}
          >
            {icon}
          </div>
          <div style={{ textAlign: 'left' }}>
            <div
              style={{
                fontSize: CARD_CONFIGS.ACTION_CARD.TITLE_FONT_SIZE,
                color: CARD_COLORS.TEXT.PRIMARY,
                fontWeight: 700,
                whiteSpace: 'nowrap',
              }}
            >
              {title}
            </div>
            {description ? (
              <div
                style={{
                  fontSize: CARD_CONFIGS.ACTION_CARD.DESCRIPTION_FONT_SIZE,
                  color: CARD_COLORS.TEXT.SECONDARY,
                  marginTop: 2,
                }}
              >
                {description}
              </div>
            ) : null}
          </div>
        </div>
        <div
          style={{ display: 'flex', alignItems: 'center', gap: CARD_CONFIGS.ACTION_CARD.GAP.RIGHT }}
        >
          {rightLabel ? (
            <div style={{ color: CARD_COLORS.TEXT.SECONDARY, fontSize: 13, whiteSpace: 'nowrap' }}>
              {rightLabel}
            </div>
          ) : null}
          <div
            style={{
              width: CARD_CONFIGS.ACTION_CARD.RIGHT_ICON_SIZE,
              height: CARD_CONFIGS.ACTION_CARD.RIGHT_ICON_SIZE,
              borderRadius: '50%',
              background: isHovered ? DEFAULT_COLORS.SUCCESS : '#F3F6F9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isHovered ? '#FFFFFF' : CARD_COLORS.TEXT.SECONDARY,
              transition: CARD_TRANSITIONS.HOVER,
            }}
          >
            <RightOutlined
              style={{
                fontSize: CARD_CONFIGS.ACTION_CARD.ARROW_FONT_SIZE,
                transform: isHovered
                  ? CARD_EFFECTS.ARROW_TRANSLATE
                  : CARD_EFFECTS.ARROW_TRANSLATE_NORMAL,
              }}
            />
          </div>
        </div>
      </div>
      {footerTag ? (
        <div
          style={{
            marginTop: 8,
            alignSelf: 'flex-start',
            background:
              footerBg ||
              'linear-gradient(180deg, rgba(32,201,151,0.12) 0%, rgba(32,201,151,0.18) 100%)',
            color: footerTextColor || DEFAULT_COLORS.SUCCESS,
            padding: CARD_CONFIGS.ACTION_CARD.FOOTER_PADDING,
            borderRadius: 999,
            fontSize: CARD_CONFIGS.ACTION_CARD.FOOTER_FONT_SIZE,
            display: 'inline-flex',
            alignItems: 'center',
            gap: CARD_CONFIGS.ACTION_CARD.FOOTER_GAP,
          }}
        >
          <ClockCircleOutlined style={{ fontSize: CARD_CONFIGS.ACTION_CARD.FOOTER_ICON_SIZE }} />
          {footerTag}
        </div>
      ) : null}
    </button>
  );
};

export default React.memo(ActionCard);
