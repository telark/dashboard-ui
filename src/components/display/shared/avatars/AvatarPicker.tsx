import React, { useMemo, useState } from 'react';
import { createAvatar } from '@dicebear/core';
import * as avatarStyles from '@dicebear/collection';
import { Avatar, Grid, Modal } from 'antd';
import type { UserAvatar } from '../../../../interfaces/users';

const { useBreakpoint } = Grid;

interface AvatarPickerProps {
  value?: UserAvatar;
  onChange?: (avatar: UserAvatar) => void;
  size?: number;
}

const AVATAR_STYLES = [
  { name: 'avataaars', style: avatarStyles.avataaars },
  { name: 'adventurer', style: avatarStyles.adventurer },
  { name: 'big-smile', style: avatarStyles.bigSmile },
  { name: 'bottts', style: avatarStyles.bottts },
  { name: 'fun-emoji', style: avatarStyles.funEmoji },
  { name: 'identicon', style: avatarStyles.identicon },
  { name: 'lorelei', style: avatarStyles.lorelei },
  { name: 'micah', style: avatarStyles.micah },
  { name: 'miniavs', style: avatarStyles.miniavs },
  { name: 'open-peeps', style: avatarStyles.openPeeps },
  { name: 'personas', style: avatarStyles.personas },
  { name: 'pixel-art', style: avatarStyles.pixelArt },
] as const;

const GRID_COLUMNS = 6;
const AVATAR_SIZE = 64;
const AVATAR_GAP = 12;

const AvatarPicker: React.FC<AvatarPickerProps> = ({ value, onChange, size = 40 }) => {
  const screens = useBreakpoint();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState(value?.style || 'avataaars');
  const [selectedSeed, setSelectedSeed] = useState(value?.seed || '');

  const currentAvatar = useMemo(() => {
    const styleConfig = AVATAR_STYLES.find((s) => s.name === selectedStyle);
    if (!styleConfig) return null;

    const seed = selectedSeed || Math.random().toString(36).substring(7);
    const avatar = createAvatar(styleConfig.style as any, {
      seed,
      size: AVATAR_SIZE,
    });

    return avatar.toDataUri();
  }, [selectedStyle, selectedSeed]);

  const handleStyleSelect = (styleName: string) => {
    setSelectedStyle(styleName);
    setSelectedSeed('');
  };

  const handleSeedChange = (newSeed: string) => {
    setSelectedSeed(newSeed);
  };

  const handleRandomize = () => {
    setSelectedSeed(Math.random().toString(36).substring(7));
  };

  const handleConfirm = () => {
    if (onChange && currentAvatar) {
      onChange({
        style: selectedStyle,
        seed: selectedSeed || Math.random().toString(36).substring(7),
      });
      setIsModalOpen(false);
    }
  };

  const previewAvatar = useMemo(() => {
    if (value) {
      const styleConfig = AVATAR_STYLES.find((s) => s.name === value.style);
      if (styleConfig) {
        const avatar = createAvatar(styleConfig.style as any, {
          seed: value.seed,
          size: size * 2,
        });
        return avatar.toDataUri();
      }
    }
    return currentAvatar;
  }, [value, currentAvatar, size]);

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
        okText="Confirm"
        cancelText="Cancel"
        width={600}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <div style={{ marginBottom: 8, fontWeight: 500 }}>Style</div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                gap: AVATAR_GAP,
                marginBottom: 16,
              }}
            >
              {AVATAR_STYLES.map((style) => {
                const isSelected = selectedStyle === style.name;
                const preview = createAvatar(style.style as any, {
                  seed: 'preview',
                  size: AVATAR_SIZE,
                }).toDataUri();

                return (
                  <div
                    key={style.name}
                    onClick={() => handleStyleSelect(style.name)}
                    style={{
                      cursor: 'pointer',
                      padding: 8,
                      borderRadius: 8,
                      border: `2px solid ${isSelected ? '#1890ff' : '#d9d9d9'}`,
                      backgroundColor: isSelected ? '#e6f7ff' : 'transparent',
                      transition: 'all 0.2s',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 4,
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = '#1890ff';
                        e.currentTarget.style.backgroundColor = '#f0f8ff';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = '#d9d9d9';
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <Avatar src={preview} size={AVATAR_SIZE} />
                    <span
                      style={{
                        fontSize: 10,
                        color: isSelected ? '#1890ff' : '#666',
                        textAlign: 'center',
                        textTransform: 'capitalize',
                      }}
                    >
                      {style.name.replace(/-/g, ' ')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <div style={{ marginBottom: 8, fontWeight: 500 }}>Customize</div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Enter seed or leave empty for random"
                value={selectedSeed}
                onChange={(e) => handleSeedChange(e.target.value)}
                style={{
                  flex: 1,
                  padding: '6px 12px',
                  border: '1px solid #d9d9d9',
                  borderRadius: 4,
                  fontSize: 14,
                }}
              />
              <button
                onClick={handleRandomize}
                style={{
                  padding: '6px 16px',
                  border: '1px solid #d9d9d9',
                  borderRadius: 4,
                  backgroundColor: '#fafafa',
                  cursor: 'pointer',
                  fontSize: 14,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f0f0f0';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#fafafa';
                }}
              >
                Random
              </button>
            </div>
          </div>

          <div>
            <div style={{ marginBottom: 8, fontWeight: 500 }}>Preview</div>
            <div style={{ display: 'flex', justifyContent: 'center', padding: 16 }}>
              <Avatar src={currentAvatar} size={120} />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AvatarPicker;

