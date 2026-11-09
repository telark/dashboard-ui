import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderApp, clickButton } from '../../../../test';
import { buildWorkloadUsage } from '../../../../test/factories/applications';
import { goToPage } from '../../../../test/helpers/menus';
import { APPLICATIONS_UI } from '../../constants';
import { APPLICATION_WORKLOAD_METRICS } from '../../constants/sectionLayout';
import type { ApplicationWorkloadUsage } from '../../models';
import ApplicationWorkloadMetrics from './ApplicationWorkloadMetrics';

const WM = APPLICATIONS_UI.SECTIONS.WORKLOAD_METRICS;
const M = APPLICATION_WORKLOAD_METRICS;

const renderMetrics = (workloads: ApplicationWorkloadUsage[]) =>
  renderApp(<ApplicationWorkloadMetrics workloads={workloads} />);

const openInstances = async () => {
  const workload = buildWorkloadUsage();
  const { user } = renderMetrics([workload]);
  await clickButton(user, WM.INSTANCES_TITLE);
  return { user, pod: workload.usage.resources.usagePerInstance[0] };
};

describe('workload metrics', () => {
  it('shows live usage meters next to the workload', () => {
    renderMetrics([buildWorkloadUsage({ resourceName: 'checkout' })]);

    expect(screen.getByText('checkout')).toBeInTheDocument();
    expect(screen.getByText(WM.CPU_ABBREV)).toBeInTheDocument();
    expect(screen.getByText(WM.MEMORY_ABBREV)).toBeInTheDocument();
  });

  it('says when usage is not available', () => {
    const workload = buildWorkloadUsage();
    workload.usage.available = false;

    renderMetrics([workload]);

    expect(screen.getByText(WM.USAGE_EMPTY)).toBeInTheDocument();
  });

  it('opens the pods and containers of a workload', async () => {
    const { pod } = await openInstances();

    expect(await screen.findByText(WM.CONTAINERS_LABEL)).toBeInTheDocument();
    expect(screen.getByText(pod.name)).toBeInTheDocument();
    expect(screen.getByText(pod.containers[0].name)).toBeInTheDocument();
  });

  it('collapses the containers of a pod', async () => {
    const { user, pod } = await openInstances();

    await clickButton(user, new RegExp(WM.CONTAINERS_LABEL));

    expect(screen.queryByText(pod.containers[0].name)).not.toBeInTheDocument();
  });

  it('pages through more workloads than fit on one page', async () => {
    const workloads = Array.from({ length: M.PAGE_SIZE + 1 }, (_, index) =>
      buildWorkloadUsage({ resourceName: `workload-${index}` }),
    );
    const { user } = renderMetrics(workloads);

    expect(screen.queryByText(`workload-${M.PAGE_SIZE}`)).not.toBeInTheDocument();
    await goToPage(user, 2);

    expect(await screen.findByText(`workload-${M.PAGE_SIZE}`)).toBeInTheDocument();
  });
});
