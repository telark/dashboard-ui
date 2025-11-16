import React, { useMemo, useState, useEffect, useRef } from 'react';
import { createAvatar } from '@dicebear/core';
import { Avatar, Grid, Modal, Spin } from 'antd';
import { DEFAULT_COLORS } from '../../../../constants';
import type { UserAvatar } from '../../../../interfaces/resources/users';

const { useBreakpoint } = Grid;

interface AvatarPickerProps {
  value?: UserAvatar;
  onChange?: (avatar: UserAvatar) => void;
  size?: number;
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

const AvatarPicker: React.FC<AvatarPickerProps> = ({ value, onChange, size = 40 }) => {
  const screens = useBreakpoint();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(value?.style || null);
  const [avatarStyles, setAvatarStyles] = useState<AvatarStyle[]>([]);
  const [isLoadingStyles, setIsLoadingStyles] = useState(false);
  
  // Use ref to store preview URLs - they never change once generated
  const previewUrlsRef = useRef<Record<string, string>>({});

  useEffect(() => {
    if (isModalOpen && avatarStyles.length === 0) {
      setIsLoadingStyles(true);
      loadAvatarStyles()
        .then((styles) => {
          setAvatarStyles(styles);
          // Generate preview URLs using the fixed seeds - one unique seed per style
          styles.forEach((style) => {
            if (!previewUrlsRef.current[style.name]) {
              const seed = AVATAR_SEEDS[style.name];
              const avatar = createAvatar(style.style, {
                seed,
                size: AVATAR_SIZE,
              });
              previewUrlsRef.current[style.name] = avatar.toDataUri();
            }
          });
        })
        .catch((error) => {
          console.error('Failed to load avatar styles:', error);
        })
        .finally(() => {
          setIsLoadingStyles(false);
        });
    }
  }, [isModalOpen, avatarStyles.length]);

  const handleStyleSelect = (styleName: string) => {
    setSelectedStyle(styleName);
    // Don't generate seed yet - keep showing the same preview
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
      <div
        onClick={() => setIsModalOpen(true)}
        style={{
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          border: '2px solid #d9d9d9',
          padding: 2,
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#1890ff';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#d9d9d9';
        }}
      >
        <Avatar
          src={previewAvatar}
          size={size}
          style={{
            border: '1px solid #f0f0f0',
          }}
        />
      </div>

      <Modal
        title="Choose Avatar"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleConfirm}
        okText="Select"
        okButtonProps={{
          disabled: !selectedStyle,
          style: {
            backgroundColor: DEFAULT_COLORS.SUCCESS,
            borderColor: DEFAULT_COLORS.SUCCESS,
          },
        }}
        footer={(_, { OkBtn }) => (
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <OkBtn />
          </div>
        )}
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
            {avatarStyles.map((style) => {
              const isSelected = selectedStyle === style.name;
              // Always use the same preview URL - never change
              const previewUrl = previewUrlsRef.current[style.name] || '';

              return (
                <div
                  key={style.name}
                  onClick={() => handleStyleSelect(style.name)}
                  style={{
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s',
                  }}
                >
                  <div
                    style={{
                      width: AVATAR_SIZE + 4,
                      height: AVATAR_SIZE + 4,
                      borderRadius: '50%',
                      border: `2px solid ${isSelected ? DEFAULT_COLORS.SUCCESS : '#d9d9d9'}`,
                      backgroundColor: isSelected ? 'rgba(32, 201, 151, 0.1)' : 'transparent',
                      padding: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = DEFAULT_COLORS.SUCCESS;
                        e.currentTarget.style.backgroundColor = 'rgba(32, 201, 151, 0.05)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = '#d9d9d9';
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <Avatar src={previewUrl} size={AVATAR_SIZE} style={{ border: 'none' }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Modal>
    </>
  );
};

export default AvatarPicker;
