import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DEFAULT_COLORS } from '../../../../../constants';
import { renderApp } from '../../../../../test';
import { buildPlan } from '../../../../../test/factories/plans';
import { noop } from '../../../../../utils/helpers/noop';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../../constants/protectionPlans';
import type { ProtectionPlan } from '../../models';
import PlanStatusBand from './PlanStatusBand';

describe('plan status band', () => {
  it.each<[ProtectionPlan['phase'], boolean]>([
    ['active', true],
    ['canceled', false],
  ])('draws the %s pill like the plan card', async (phase, filled) => {
    renderApp(<PlanStatusBand plan={buildPlan({ phase })} notInForce={0} onJumpToHealth={noop} />);

    const pill = await screen.findByText(PPC.LABELS.PHASE_LABELS[phase]);

    expect(pill.style.color === DEFAULT_COLORS.TEXT_MUTED).toBe(!filled);
    expect(pill.style.backgroundColor !== '').toBe(filled);
  });
});
