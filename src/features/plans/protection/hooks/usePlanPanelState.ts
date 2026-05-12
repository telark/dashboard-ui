import { useCallback, useState } from 'react';
import { Form } from 'antd';
import type { ProtectionPlan } from '../models';
import type { FormValues } from '../components/create';

export const usePlanPanelState = () => {
  const [createPanelOpen, setCreatePanelOpen] = useState(false);
  const [editPanelOpen, setEditPanelOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<ProtectionPlan | null>(null);
  const [createForm] = Form.useForm<FormValues>();
  const [editForm] = Form.useForm<FormValues>();

  const openCreatePanel = useCallback(() => setCreatePanelOpen(true), []);

  const closeCreatePanel = useCallback(() => {
    setCreatePanelOpen(false);
    createForm.resetFields();
  }, [createForm]);

  const openEditPanel = useCallback((plan: ProtectionPlan) => {
    setEditingPlan(plan);
    setEditPanelOpen(true);
  }, []);

  const closeEditPanel = useCallback(() => {
    setEditPanelOpen(false);
    setEditingPlan(null);
    editForm.resetFields();
  }, [editForm]);

  return {
    createPanelOpen,
    editPanelOpen,
    editingPlan,
    createForm,
    editForm,
    openCreatePanel,
    closeCreatePanel,
    openEditPanel,
    closeEditPanel,
  };
};
