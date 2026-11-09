import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderApp } from '../../../test';
import NumberInput from './NumberInput';

describe('number input', () => {
  it('reports the digits typed and shows its unit', async () => {
    const onChange = vi.fn();
    const { user } = renderApp(<NumberInput onChange={onChange} addonAfter="days" />);

    await user.type(screen.getByRole('spinbutton'), '12');

    expect(onChange).toHaveBeenLastCalledWith(12);
    expect(screen.getByText('days')).toBeInTheDocument();
  });

  it('ignores keys that are not digits', async () => {
    const onChange = vi.fn();
    const { user } = renderApp(<NumberInput onChange={onChange} />);

    await user.type(screen.getByRole('spinbutton'), 'abc');

    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('spinbutton')).toHaveValue('');
  });

  it('is read-only while disabled', () => {
    renderApp(<NumberInput value={7} disabled />);

    expect(screen.getByRole('spinbutton')).toBeDisabled();
  });
});
