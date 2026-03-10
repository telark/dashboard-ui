import React, { useMemo, useState, useEffect, useRef, useCallback, startTransition } from 'react';
import { createAvatar } from '@dicebear/core';
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
  style: any;
}

const loadAvatarStyles = async (): Promise<AvatarStyle[]> => {
  const [avataaarsStyle, adventurerStyle, loreleiStyle, micahStyle, personasStyle] =
    await Promise.all([
      import('@dicebear/avataaars'),
      import('@dicebear/adventurer'),
      import('@dicebear/lorelei'),
      import('@dicebear/micah'),
      import('@dicebear/personas'),
    ]);

  return [
    { name: 'avataaars', style: avataaarsStyle },
    { name: 'adventurer', style: adventurerStyle },
    { name: 'lorelei', style: loreleiStyle },
    { name: 'micah', style: micahStyle },
    { name: 'personas', style: personasStyle },
  ];
};

const GRID_COLUMNS = 5;
const AVATAR_SIZE = 50;
const AVATAR_GAP = 12;

// Unique fixed seeds for each avatar style - one seed per style
const AVATAR_SEEDS: Record<string, string> = {
  avataaars: 'seed-avataaars-001',
  adventurer: 'seed-adventurer-002',
  lorelei: 'seed-lorelei-003',
  micah: 'seed-micah-004',
  personas: 'seed-personas-005',
};

const generatePreviewUrl = (
  style: AvatarStyle,
  previewUrlsRef: React.MutableRefObject<Record<string, string>>,
): string => {
  if (previewUrlsRef.current[style.name]) {
    return previewUrlsRef.current[style.name];
  }
  const seed = AVATAR_SEEDS[style.name];
  const avatar = createAvatar(style.style, {
    seed,
    size: AVATAR_SIZE,
  });
  const url = avatar.toDataUri();
  previewUrlsRef.current[style.name] = url;
  return url;
};

const generatePreviewUrls = (
  styles: AvatarStyle[],
  previewUrlsRef: React.MutableRefObject<Record<string, string>>,
): Record<string, string> => {
  const newPreviewUrls: Record<string, string> = {};
  styles.forEach((style) => {
    newPreviewUrls[style.name] = generatePreviewUrl(style, previewUrlsRef);
  });
  return newPreviewUrls;
};

interface AvatarItemProps {
  style: AvatarStyle;
  isSelected: boolean;
  previewUrl?: string;
  onSelect: (styleName: string) => void;
}

const AvatarItem: React.FC<AvatarItemProps> = ({ style, isSelected, previewUrl, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Clear hover state when selection changes
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
      onClick={() => onSelect(style.name)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label={`Select ${style.name} avatar style`}
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
  const [selectedStyle, setSelectedStyle] = useState<string | null>(value?.style || null);
  const [avatarStyles, setAvatarStyles] = useState<AvatarStyle[]>([]);
  const [isLoadingStyles, setIsLoadingStyles] = useState(false);

  // Use ref to store preview URLs - they never change once generated
  const previewUrlsRef = useRef<Record<string, string>>({});
  // Store preview URLs in state to avoid accessing ref during render
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});

  const handleLoadStyles = useCallback(async () => {
    startTransition(() => {
      setIsLoadingStyles(true);
    });

    try {
      const styles = await loadAvatarStyles();
      setAvatarStyles(styles);
      const newPreviewUrls = generatePreviewUrls(styles, previewUrlsRef);
      startTransition(() => {
        setPreviewUrls((prev) => ({ ...prev, ...newPreviewUrls }));
      });
    } catch (error) {
      logger.error('Failed to load avatar styles:', error);
    } finally {
      setIsLoadingStyles(false);
    }
  }, []);

  useEffect(() => {
    if (!isModalOpen || avatarStyles.length > 0) {
      return;
    }
    handleLoadStyles();
  }, [isModalOpen, avatarStyles.length, handleLoadStyles]);

  // Reset selectedStyle when modal opens to current value
  useEffect(() => {
    if (isModalOpen) {
      setSelectedStyle(value?.style || null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen]);

  const handleStyleSelect = (styleName: string) => {
    setSelectedStyle(styleName);
    // Don't generate seed yet - keep showing the same preview
  };

  const handleCancel = () => {
    setSelectedStyle(value?.style || null);
    setIsModalOpen(false);
  };

  const handleConfirm = () => {
    if (onChange && selectedStyle) {
      // Use the fixed seed for the selected style - one seed per avatar
      const seed = AVATAR_SEEDS[selectedStyle];
      onChange({
        style: selectedStyle,
        seed,
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
          disabled: !selectedStyle,
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
            {avatarStyles.map((style) => (
              <AvatarItem
                key={style.name}
                style={style}
                isSelected={selectedStyle === style.name}
                previewUrl={previewUrls[style.name]}
                onSelect={handleStyleSelect}
              />
            ))}
          </div>
        )}
      </Modal>
    </>
  );
};

export default AvatarPicker;
