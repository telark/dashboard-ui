import type React from 'react';

export interface StatCellProps {
  label: string;
  value: React.ReactNode;
  accent?: string;
}

export interface CardIconChipProps {
  icon: React.ReactNode;
  accent: string;
}

export interface CardStatusPillProps {
  label: React.ReactNode;
  accent: string;
}

export interface CardChipItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  accent: string;
  title?: string;
}

export type CardChipProps = Omit<CardChipItem, 'key'>;

export interface CardChipSectionProps {
  label: string;
  items: CardChipItem[];
  emptyText: string;
}
