import React from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Tooltip } from 'antd';
import { LIST_TOOLBAR, TOOLBAR_CONTROL, getQuickFilterPillColors } from '../../../constants';

export interface CompactQuickFilterOption<K extends string> {
  key: K;
  label: string;
  accent: string;
}

interface CompactQuickFilterProps<K extends string> {
  options: CompactQuickFilterOption<K>[];
  active: K;
  title: string;
  icon: React.ReactNode;
  onChange: (next: K) => void;
}

// A row of quick-filter pills does not fit a compact toolbar, so it folds into
// one control whose accent keeps the active filter readable without its label.
const CompactQuickFilter = <K extends string>({
  options,
  active,
  title,
  icon,
  onChange,
}: CompactQuickFilterProps<K>): React.ReactElement => {
  const activeOption = options.find((option) => option.key === active) ?? options[0];
  const activeAccent = activeOption.accent;
  const fullTitle = `${title}: ${activeOption.label}`;
  return (
    <Dropdown
      trigger={['click']}
      menu={{
        selectedKeys: [active],
        items: options.map((option) => ({
          key: option.key,
          label: option.label,
          icon: (
            <span
              style={{
                display: 'inline-block',
                width: 8,
                height: 8,
                // The menu's icon slot would otherwise stretch the dot into an oval.
                minWidth: 8,
                flexShrink: 0,
                borderRadius: '50%',
                background: option.accent,
              }}
            />
          ),
        })),
        onClick: ({ key }) => {
          const next = options.find((option) => option.key === key);
          if (next) onChange(next.key);
        },
      }}
    >
      <Tooltip title={fullTitle}>
        <button
          type="button"
          aria-label={fullTitle}
          style={{
            all: 'unset',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 5,
            height: TOOLBAR_CONTROL.HEIGHT,
            boxSizing: 'border-box',
            padding: '0 8px',
            borderRadius: LIST_TOOLBAR.PILL_RADIUS_PX,
            ...getQuickFilterPillColors(activeAccent, true),
          }}
        >
          <span style={{ fontSize: 13, display: 'inline-flex' }}>{icon}</span>
          <DownOutlined style={{ fontSize: 9 }} />
        </button>
      </Tooltip>
    </Dropdown>
  );
};

export default CompactQuickFilter;
