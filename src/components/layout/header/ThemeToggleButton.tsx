import React, { memo } from 'react';
import { Button, Tooltip } from 'antd';
import { MoonOutlined, SunOutlined } from '@ant-design/icons';
import { useResolvedTheme, useSaveThemePreference } from '../../../features/theme';
import { FONT_SIZE, HEADER_LAYOUT, type PageTheme } from '../../../constants';

const NEXT_THEME: Record<PageTheme, PageTheme> = { dark: 'light', light: 'dark' };
// Each icon shows the theme a click switches to.
const ICONS = { light: SunOutlined, dark: MoonOutlined } as const;

// Flips the page the user sees, so a System choice becomes an explicit one.
const ThemeToggleButton: React.FC = memo(() => {
  const next = NEXT_THEME[useResolvedTheme()];
  const saveThemePreference = useSaveThemePreference();
  const label = HEADER_LAYOUT.THEME_TOGGLE_LABELS[next];
  const Icon = ICONS[next];

  return (
    <Tooltip title={label}>
      <Button
        type="text"
        shape="circle"
        icon={<Icon style={{ fontSize: FONT_SIZE.XL }} />}
        onClick={() => saveThemePreference(next)}
        aria-label={label}
      />
    </Tooltip>
  );
});

ThemeToggleButton.displayName = 'ThemeToggleButton';

export default ThemeToggleButton;
