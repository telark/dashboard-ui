export interface TabButtonStyleOptions {
  active: boolean;
  hovered: boolean;
}

export interface TabButtonStyleValues {
  active: string;
  hovered: string;
  default: string;
}

export const getTabButtonStyle = (
  options: TabButtonStyleOptions,
  values: TabButtonStyleValues,
): string => {
  if (options.active) {
    return values.active;
  }
  if (options.hovered) {
    return values.hovered;
  }
  return values.default;
};

export const getTabButtonBackground = (active: boolean, hovered: boolean): string => {
  return getTabButtonStyle(
    { active, hovered },
    {
      active: '#fff',
      hovered: 'rgba(32,201,151,0.08)',
      default: 'transparent',
    },
  );
};

export const getTabButtonColor = (
  active: boolean,
  hovered: boolean,
  hoverColor?: string,
): string => {
  return getTabButtonStyle(
    { active, hovered },
    {
      active: '#0B1F33',
      hovered: hoverColor || '#20C997',
      default: '#6b7280',
    },
  );
};
