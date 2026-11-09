import type { ComponentProps } from 'react';
import { screen } from '@testing-library/react';
import { Checkbox } from 'antd';
import { describe, expect, it, vi } from 'vitest';
import { renderApp } from '../../../test';
import SelectableListItem from './SelectableListItem';

describe('selectable list item', () => {
  const renderItem = (props: Partial<ComponentProps<typeof SelectableListItem>> = {}) => {
    const onChange = vi.fn();
    const view = renderApp(
      <Checkbox.Group onChange={onChange}>
        <SelectableListItem
          value="role-1"
          name="release_reviewer"
          description="Reviews releases"
          {...props}
        />
      </Checkbox.Group>,
    );
    return { ...view, onChange };
  };

  it('selects its value when picked', async () => {
    const { user, onChange } = renderItem();

    expect(screen.getByText('Reviews releases')).toBeInTheDocument();
    await user.click(screen.getByRole('checkbox', { name: /release_reviewer/ }));

    expect(onChange).toHaveBeenCalledWith(['role-1']);
  });

  it('cannot be picked while disabled and says why', () => {
    renderItem({ disabled: true, disabledReason: 'Locked by policy' });

    expect(screen.getByRole('checkbox', { hidden: true })).toBeDisabled();
    expect(screen.getByText('Locked by policy')).toBeInTheDocument();
  });

  it('renders custom content below the name', () => {
    renderItem({ customContent: <span>Custom row</span> });

    expect(screen.getByText('Custom row')).toBeInTheDocument();
    expect(screen.getByText('release_reviewer')).toBeInTheDocument();
  });
});
