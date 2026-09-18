import React, { useMemo, useState, useEffect, useRef, useCallback, startTransition } from 'react';
import { createAvatar, type Style } from '@dicebear/core';
import { Avatar, Grid, Modal, Spin } from 'antd';
import { DEFAULT_COLORS } from '../../../constants';
import type { UserAvatar } from '../../../features/access-and-permissions/users/models';
import logger from '../../../logging';

const { useBreakpoint } = Grid;

interface AvatarPickerProps {
  value?: UserAvatar;
  onChange?: (avatar: UserAvatar) => void;
  size?: number;
  /** When provided, renders this instead of the default button; receives openModal callback. */
  trigger?: (openModal: () => void) => React.ReactNode;
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
const AVATAR_SIZE = 50;
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
    size: AVATAR_SIZE,
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

  let borderColor: string;
  if (isSelected) {
    borderColor = DEFAULT_COLORS.SUCCESS;
  } else if (isHovered) {
    borderColor = DEFAULT_COLORS.SUCCESS;
  } else {
    borderColor = '#d9d9d9';
  }

  let backgroundColor: string;
  if (isSelected) {
    backgroundColor = 'rgba(32, 201, 151, 0.1)';
  } else if (isHovered) {
    backgroundColor = 'rgba(32, 201, 151, 0.05)';
  } else {
    backgroundColor = 'transparent';
  }

  return (
    <button
      type="button"
      onClick={() => onSelect(option.key)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label={`Select ${option.style} avatar style`}
      style={{
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s',
        background: 'transparent',
        border: 'none',
        padding: 0,
        outline: 'none',
      }}
    >
      <div
        style={{
          width: AVATAR_SIZE + 4,
          height: AVATAR_SIZE + 4,
          borderRadius: '50%',
          border: `2px solid ${borderColor}`,
          backgroundColor,
          padding: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s',
        }}
      >
        <Avatar src={previewUrl || undefined} size={AVATAR_SIZE} style={{ border: 'none' }} />
      </div>
    </button>
  );
};

interface ModalFooterProps {
  OkBtn: React.ComponentType;
}

const renderModalFooter = (_: unknown, { OkBtn }: ModalFooterProps) => (
  <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
    <OkBtn />
  </div>
);

const AvatarPicker: React.FC<AvatarPickerProps> = ({
  value,
  onChange,
  size = 40,
  trigger: triggerRender,
  okText = 'Select',
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

  // Use ref to store preview URLs - they never change once generated
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

  const previewAvatar = useMemo(() => {
    if (value && avatarStyles.length > 0) {
      const styleConfig = avatarStyles.find((s) => s.name === value.style);
      if (styleConfig) {
        const avatar = createAvatar(styleConfig.style, {
          seed: value.seed,
          size: size * 2,
        });
        return avatar.toDataUri();
      }
    }
    return null;
  }, [value, size, avatarStyles]);

  const columns = screens.xs ? 4 : GRID_COLUMNS;

  return (
    <>
      {triggerRender != null ? (
        triggerRender(openModal)
      ) : (
        <button
          type="button"
          onClick={openModal}
          aria-label="Choose avatar"
          style={{
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            border: '2px solid transparent',
            padding: 3,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            background:
              'linear-gradient(135deg, rgba(32, 201, 151, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
            outline: 'none',
            boxShadow: previewAvatar
              ? '0 4px 12px rgba(32, 201, 151, 0.15), inset 0 0 0 1px rgba(255, 255, 255, 0.1)'
              : '0 2px 8px rgba(0, 0, 0, 0.08)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = previewAvatar
              ? '0 6px 16px rgba(32, 201, 151, 0.25), inset 0 0 0 1px rgba(255, 255, 255, 0.2)'
              : '0 4px 12px rgba(0, 0, 0, 0.12)';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = previewAvatar
              ? '0 4px 12px rgba(32, 201, 151, 0.15), inset 0 0 0 1px rgba(255, 255, 255, 0.1)'
              : '0 2px 8px rgba(0, 0, 0, 0.08)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <Avatar
            src={previewAvatar}
            size={size}
            style={{
              border: 'none',
              boxShadow: previewAvatar
                ? '0 2px 8px rgba(0, 0, 0, 0.1), inset 0 0 20px rgba(255, 255, 255, 0.3)'
                : 'none',
              filter: previewAvatar ? 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))' : 'none',
            }}
          />
        </button>
      )}

      <Modal
        title="Choose Avatar"
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={handleConfirm}
        okText={okText}
        okButtonProps={{
          disabled: !selectedOptionKey || selectedOptionKey === findOptionKey(value),
          style: {
            backgroundColor: DEFAULT_COLORS.SUCCESS,
            borderColor: DEFAULT_COLORS.SUCCESS,
          },
        }}
        footer={renderModalFooter}
        width={480}
      >
        {isLoadingStyles ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
            <Spin size="large" />
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${columns}, 1fr)`,
              gap: AVATAR_GAP,
              padding: '8px 0',
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
      </Modal>
    </>
  );
};

export default AvatarPicker;
