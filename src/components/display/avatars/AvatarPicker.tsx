import React, { useState, useEffect, useRef, useCallback, startTransition } from 'react';
import { createAvatar, type Style } from '@dicebear/core';
import { Avatar, Grid } from 'antd';
import {
  AVATAR_PICKER_TEXT,
  PROFILE_AVATAR_SIZE,
  BUTTON_TEXTS,
  DEFAULT_COLORS,
  MODAL_CHROME,
  UNSTYLED_BUTTON,
  MOTION,
  SPACING,
} from '../../../constants';
import { FancySpinner } from '../../animation';
import { BaseModal } from '../modal';
import { avatarRingStyle } from './avatarRing';
import ActionButtons from '../buttons/ActionButtons';
import type { UserAvatar } from '../../../features/access-and-permissions/users/models';
import logger from '../../../logging';

const { useBreakpoint } = Grid;

interface AvatarPickerProps {
  value?: UserAvatar;
  onChange?: (avatar: UserAvatar) => void;
  /** Renders the control that opens the picker; receives the open callback. */
  trigger: (openModal: () => void) => React.ReactNode;
  /** Modal confirm button label. Defaults to "Select". */
  okText?: string;
}

interface AvatarStyle {
  name: string;
  style: Style<object>;
}

// Every @dicebear/* package installed in package.json — the picker used to
// import only 5 of these 12, so 7 installed styles were unreachable here even
// though UserAvatar.tsx already knew how to render them.
const loadAvatarStyles = async (): Promise<AvatarStyle[]> => {
  const [
    avataaarsStyle,
    adventurerStyle,
    bigSmileStyle,
    botttsStyle,
    funEmojiStyle,
    identiconStyle,
    loreleiStyle,
    micahStyle,
    miniavsStyle,
    personasStyle,
  ] = await Promise.all([
    import('@dicebear/avataaars'),
    import('@dicebear/adventurer'),
    import('@dicebear/big-smile'),
    import('@dicebear/bottts'),
    import('@dicebear/fun-emoji'),
    import('@dicebear/identicon'),
    import('@dicebear/lorelei'),
    import('@dicebear/micah'),
    import('@dicebear/miniavs'),
    import('@dicebear/personas'),
  ]);

  return [
    { name: 'avataaars', style: avataaarsStyle },
    { name: 'adventurer', style: adventurerStyle },
    { name: 'big-smile', style: bigSmileStyle },
    { name: 'bottts', style: botttsStyle },
    { name: 'fun-emoji', style: funEmojiStyle },
    { name: 'identicon', style: identiconStyle },
    { name: 'lorelei', style: loreleiStyle },
    { name: 'micah', style: micahStyle },
    { name: 'miniavs', style: miniavsStyle },
    { name: 'personas', style: personasStyle },
  ];
};

const GRID_COLUMNS = 5;
const AVATAR_SIZE = PROFILE_AVATAR_SIZE;
const AVATAR_GAP = 12;

interface AvatarOption {
  key: string;
  style: string;
  seed: string;
}

// One picker option = one {style, seed} look. The first 5 seeds are the
// original ones, kept byte-for-byte so avatars users already saved still
// resolve to the same picture. miniavs/open-peeps/pixel-art dropped from the
// last row (disliked) in favor of a second/third look at the styles that
// already read well, rather than covering every installed style for its own sake.
const AVATAR_OPTIONS: AvatarOption[] = [
  { key: 'avataaars-1', style: 'avataaars', seed: 'seed-avataaars-001' },
  { key: 'adventurer-1', style: 'adventurer', seed: 'seed-adventurer-002' },
  { key: 'lorelei-1', style: 'lorelei', seed: 'seed-lorelei-003' },
  { key: 'micah-1', style: 'micah', seed: 'seed-micah-004' },
  { key: 'personas-1', style: 'personas', seed: 'seed-personas-005' },
  { key: 'personas-2', style: 'personas', seed: 'seed-personas-105' },
  { key: 'big-smile-1', style: 'big-smile', seed: 'seed-big-smile-006' },
  { key: 'big-smile-2', style: 'big-smile', seed: 'seed-big-smile-106' },
  { key: 'bottts-1', style: 'bottts', seed: 'seed-bottts-007' },
  { key: 'bottts-2', style: 'bottts', seed: 'seed-bottts-107' },
  { key: 'fun-emoji-1', style: 'fun-emoji', seed: 'seed-fun-emoji-008' },
  { key: 'fun-emoji-2', style: 'fun-emoji', seed: 'seed-fun-emoji-108' },
  { key: 'identicon-1', style: 'identicon', seed: 'seed-identicon-009' },
  { key: 'identicon-2', style: 'identicon', seed: 'seed-identicon-109' },
  { key: 'miniavs-1', style: 'miniavs', seed: 'seed-miniavs-010' },
  { key: 'avataaars-2', style: 'avataaars', seed: 'seed-avataaars-101' },
  { key: 'adventurer-2', style: 'adventurer', seed: 'seed-adventurer-102' },
  { key: 'lorelei-2', style: 'lorelei', seed: 'seed-lorelei-103' },
  { key: 'micah-2', style: 'micah', seed: 'seed-micah-104' },
  { key: 'personas-3', style: 'personas', seed: 'seed-personas-205' },
];

const findOptionKey = (value: UserAvatar | undefined): string | null => {
  if (!value) return null;
  const exact = AVATAR_OPTIONS.find((o) => o.style === value.style && o.seed === value.seed);
  if (exact) return exact.key;
  // A seed saved before this picker existed (or from another client) won't
  // match one of the curated seeds above — fall back to that style's first option.
  return AVATAR_OPTIONS.find((o) => o.style === value.style)?.key ?? null;
};

const generatePreviewUrl = (
  option: AvatarOption,
  styleModule: Style<object>,
  previewUrlsRef: React.MutableRefObject<Record<string, string>>,
): string => {
  if (previewUrlsRef.current[option.key]) {
    return previewUrlsRef.current[option.key];
  }
  const avatar = createAvatar(styleModule, {
    seed: option.seed,
    size: AVATAR_SIZE * 2,
  });
  const url = avatar.toDataUri();
  previewUrlsRef.current[option.key] = url;
  return url;
};

const generatePreviewUrls = (
  styles: AvatarStyle[],
  previewUrlsRef: React.MutableRefObject<Record<string, string>>,
): Record<string, string> => {
  const stylesByName = new Map(styles.map((s) => [s.name, s.style]));
  const newPreviewUrls: Record<string, string> = {};
  AVATAR_OPTIONS.forEach((option) => {
    const styleModule = stylesByName.get(option.style);
    if (styleModule) {
      newPreviewUrls[option.key] = generatePreviewUrl(option, styleModule, previewUrlsRef);
    }
  });
  return newPreviewUrls;
};

interface AvatarItemProps {
  option: AvatarOption;
  isSelected: boolean;
  previewUrl?: string;
  onSelect: (optionKey: string) => void;
}

const AvatarItem: React.FC<AvatarItemProps> = ({ option, isSelected, previewUrl, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isSelected) {
      startTransition(() => {
        setIsHovered(false);
      });
    }
  }, [isSelected]);

  const handleMouseEnter = () => {
    if (!isSelected) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // The app's avatar ring: teal marks the pick, a neutral ring the rest (hover darkens it).
  let ringColor: string;
  if (isSelected) {
    ringColor = DEFAULT_COLORS.SUCCESS;
  } else if (isHovered) {
    ringColor = DEFAULT_COLORS.SURFACE_BORDER;
  } else {
    ringColor = DEFAULT_COLORS.SURFACE_BORDER_LIGHT;
  }

  return (
    <button
      type="button"
      onClick={() => onSelect(option.key)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label={`Select ${option.style} avatar style`}
      aria-pressed={isSelected}
      style={{
        ...UNSTYLED_BUTTON,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: `all ${MOTION.BASE_MS}ms`,
        outline: 'none',
      }}
    >
      <div
        style={{
          ...avatarRingStyle(AVATAR_SIZE, ringColor),
          transition: `border-color ${MOTION.BASE_MS}ms`,
        }}
      >
        <Avatar
          src={previewUrl || undefined}
          size={AVATAR_SIZE}
          style={{ border: 'none', flexShrink: 0 }}
        />
      </div>
    </button>
  );
};

const AvatarPicker: React.FC<AvatarPickerProps> = ({
  value,
  onChange,
  trigger,
  okText = BUTTON_TEXTS.SELECT,
}) => {
  const screens = useBreakpoint();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = useCallback(() => setIsModalOpen(true), []);
  const [selectedOptionKey, setSelectedOptionKey] = useState<string | null>(findOptionKey(value));
  const [avatarStyles, setAvatarStyles] = useState<AvatarStyle[]>([]);
  const [stylesLoadFailed, setStylesLoadFailed] = useState(false);
  const isLoadingStyles = isModalOpen && avatarStyles.length === 0 && !stylesLoadFailed;

  const [prevIsModalOpen, setPrevIsModalOpen] = useState(isModalOpen);
  if (prevIsModalOpen !== isModalOpen) {
    setPrevIsModalOpen(isModalOpen);
    if (isModalOpen) {
      setSelectedOptionKey(findOptionKey(value));
      setStylesLoadFailed(false);
    }
  }

  const previewUrlsRef = useRef<Record<string, string>>({});
  // Store preview URLs in state to avoid accessing ref during render
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isModalOpen || avatarStyles.length > 0) {
      return;
    }
    loadAvatarStyles()
      .then((styles) => {
        setAvatarStyles(styles);
        const newPreviewUrls = generatePreviewUrls(styles, previewUrlsRef);
        startTransition(() => {
          setPreviewUrls((prev) => ({ ...prev, ...newPreviewUrls }));
        });
      })
      .catch((error) => {
        logger.error('Failed to load avatar styles:', error);
        setStylesLoadFailed(true);
      });
  }, [isModalOpen, avatarStyles.length]);

  const handleOptionSelect = (optionKey: string) => {
    setSelectedOptionKey(optionKey);
  };

  const handleCancel = () => {
    setSelectedOptionKey(findOptionKey(value));
    setIsModalOpen(false);
  };

  const handleConfirm = () => {
    const selected = AVATAR_OPTIONS.find((o) => o.key === selectedOptionKey);
    if (onChange && selected) {
      onChange({
        style: selected.style,
        seed: selected.seed,
      });
      setIsModalOpen(false);
    }
  };

  const columns = screens.xs ? 4 : GRID_COLUMNS;

  return (
    <>
      {trigger(openModal)}

      <BaseModal
        open={isModalOpen}
        onCancel={handleCancel}
        title={AVATAR_PICKER_TEXT.TITLE}
        width={MODAL_CHROME.FRAME.WIDE_WIDTH}
        footer={
          <ActionButtons
            confirmText={okText}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            confirmDisabled={!selectedOptionKey || selectedOptionKey === findOptionKey(value)}
          />
        }
      >
        {isLoadingStyles ? (
          <div
            style={{
              // Off scale, kept exact: padding 40 (above XXXL).
              display: 'flex',
              justifyContent: 'center',
              padding: 40,
            }}
          >
            <FancySpinner />
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${columns}, 1fr)`,
              gap: AVATAR_GAP,
              width: '100%',
              padding: `${SPACING.SM}px 0`,
            }}
          >
            {AVATAR_OPTIONS.map((option) => (
              <AvatarItem
                key={option.key}
                option={option}
                isSelected={selectedOptionKey === option.key}
                previewUrl={previewUrls[option.key]}
                onSelect={handleOptionSelect}
              />
            ))}
          </div>
        )}
      </BaseModal>
    </>
  );
};

export default AvatarPicker;
