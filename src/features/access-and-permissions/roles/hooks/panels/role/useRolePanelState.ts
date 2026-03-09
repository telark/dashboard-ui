import { useState, useCallback } from 'react';
import { Form } from 'antd';
import type { Role } from '../../../models';
import type { RoleFormValues } from '../../../models';

export interface UseRolePanelStateReturn {
  createPanelOpen: boolean;
  editPanelOpen: boolean;
  viewPanelOpen: boolean;
  viewingRole: Role | null;
  editingRole: Role | null;
  createForm: ReturnType<typeof Form.useForm<RoleFormValues>>[0];
  editForm: ReturnType<typeof Form.useForm<RoleFormValues>>[0];
  openCreatePanel: () => void;
  closeCreatePanel: () => void;
  openEditPanel: (role: Role) => void;
  closeEditPanel: () => void;
  openViewPanel: (role: Role) => void;
  closeViewPanel: () => void;
}

export const useRolePanelState = (): UseRolePanelStateReturn => {
  const [createPanelOpen, setCreatePanelOpen] = useState(false);
  const [editPanelOpen, setEditPanelOpen] = useState(false);
  const [viewPanelOpen, setViewPanelOpen] = useState(false);
  const [viewingRole, setViewingRole] = useState<Role | null>(null);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [createForm] = Form.useForm<RoleFormValues>();
  const [editForm] = Form.useForm<RoleFormValues>();

  const openCreatePanel = useCallback(() => setCreatePanelOpen(true), []);

  const closeCreatePanel = useCallback(() => {
    setCreatePanelOpen(false);
    createForm.resetFields();
  }, [createForm]);

  const openEditPanel = useCallback((role: Role) => {
    setEditingRole(role);
    setEditPanelOpen(true);
  }, []);

  const closeEditPanel = useCallback(() => {
    setEditPanelOpen(false);
    setEditingRole(null);
    editForm.resetFields();
  }, [editForm]);

  const openViewPanel = useCallback((role: Role) => {
    setViewingRole(role);
    setViewPanelOpen(true);
  }, []);

  const closeViewPanel = useCallback(() => {
    setViewPanelOpen(false);
    setViewingRole(null);
  }, []);

  return {
    createPanelOpen,
    editPanelOpen,
    viewPanelOpen,
    viewingRole,
    editingRole,
    createForm,
    editForm,
    openCreatePanel,
    closeCreatePanel,
    openEditPanel,
    closeEditPanel,
    openViewPanel,
    closeViewPanel,
  };
};
