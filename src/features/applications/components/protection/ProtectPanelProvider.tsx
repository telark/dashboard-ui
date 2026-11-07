import React, { createContext, useCallback, useContext } from 'react';
import { useStore } from 'react-redux';
import type { RootState } from '../../../../store';
import CreatePlanPanel from '../../../plans/protection/components/panels/CreatePlanPanel';
import { usePlanPanelState } from '../../../plans/protection/hooks/usePlanPanelState';
import { selectProtectionPlans } from '../../../plans/protection/store';
import { applicationPlanValues } from '../../../plans/protection/utils/planFormValues';

type ProtectTarget = Parameters<typeof applicationPlanValues>[0];

const ProtectPanelContext = createContext<(application: ProtectTarget) => void>(() => undefined);

export const useOpenProtectPanel = () => useContext(ProtectPanelContext);

// One create-plan panel for a page's Protect buttons. It can't live in a button, which unmounts
// once the new plan covers its app, and a card would also catch the panel's clicks.
const ProtectPanelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { createPanelOpen, createForm, openCreatePanel, closeCreatePanel } = usePlanPanelState();
  const store = useStore<RootState>();

  const openProtectPanel = useCallback(
    (application: ProtectTarget) => {
      const takenNames = selectProtectionPlans(store.getState()).map((plan) => plan.name);
      createForm.setFieldsValue(applicationPlanValues(application, takenNames));
      openCreatePanel();
    },
    [store, createForm, openCreatePanel],
  );

  return (
    <ProtectPanelContext.Provider value={openProtectPanel}>
      {children}
      <CreatePlanPanel open={createPanelOpen} onClose={closeCreatePanel} form={createForm} />
    </ProtectPanelContext.Provider>
  );
};

export default ProtectPanelProvider;
