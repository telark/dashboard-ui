import type React from 'react';

export interface StatCellProps {
  label: string;
  value: React.ReactNode;
  accent?: string;
}

export interface CardStatusPillProps {
  label: React.ReactNode;
  accent: string;
}

export interface CardChipItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  accent: string;
  title?: string;
  /** Shown in a tooltip on hover, in place of the native title. */
  tooltip?: string;
}

export type CardChipProps = Omit<CardChipItem, 'key'>;

export interface CardChipSectionProps {
  label: string;
  items: CardChipItem[];
  emptyText: string;
}
