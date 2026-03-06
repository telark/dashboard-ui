import { useState, useCallback } from 'react';
import { Form } from 'antd';
import type { User, CreateUserFormValues } from '../../../models';

interface UseUserPanelStateReturn {
  createPanelOpen: boolean;
  editPanelOpen: boolean;
  viewPanelOpen: boolean;
  manageRolePanelOpen: boolean;
  manageGroupPanelOpen: boolean;
  viewingUser: User | null;
  editingUser: User | null;
  managingRoleUser: User | null;
  managingGroupUser: User | null;
  createForm: ReturnType<typeof Form.useForm<CreateUserFormValues>>[0];
  editForm: ReturnType<typeof Form.useForm<CreateUserFormValues>>[0];
  openCreatePanel: () => void;
  closeCreatePanel: () => void;
  openEditPanel: (user: User) => void;
  closeEditPanel: () => void;
  openViewPanel: (user: User) => void;
  closeViewPanel: () => void;
  openManageRolePanel: (user: User) => void;
  closeManageRolePanel: () => void;
  openManageGroupPanel: (user: User) => void;
  closeManageGroupPanel: () => void;
}

export const useUserPanelState = (): UseUserPanelStateReturn => {
  const [createPanelOpen, setCreatePanelOpen] = useState(false);
  const [editPanelOpen, setEditPanelOpen] = useState(false);
  const [viewPanelOpen, setViewPanelOpen] = useState(false);
  const [manageRolePanelOpen, setManageRolePanelOpen] = useState(false);
  const [manageGroupPanelOpen, setManageGroupPanelOpen] = useState(false);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [managingRoleUser, setManagingRoleUser] = useState<User | null>(null);
  const [managingGroupUser, setManagingGroupUser] = useState<User | null>(null);
  const [createForm] = Form.useForm<CreateUserFormValues>();
  const [editForm] = Form.useForm<CreateUserFormValues>();

  const openCreatePanel = useCallback(() => setCreatePanelOpen(true), []);

  const closeCreatePanel = useCallback(() => {
    setCreatePanelOpen(false);
    createForm.resetFields();
  }, [createForm]);

  const openEditPanel = useCallback((user: User) => {
    setEditingUser(user);
    setEditPanelOpen(true);
  }, []);

  const closeEditPanel = useCallback(() => {
    setEditPanelOpen(false);
    setEditingUser(null);
    editForm.resetFields();
  }, [editForm]);

  const openViewPanel = useCallback((user: User) => {
    setViewingUser(user);
    setViewPanelOpen(true);
  }, []);

  const closeViewPanel = useCallback(() => {
    setViewPanelOpen(false);
    setViewingUser(null);
  }, []);

  const openManageRolePanel = useCallback((user: User) => {
    setManagingRoleUser(user);
    setManageRolePanelOpen(true);
  }, []);

  const closeManageRolePanel = useCallback(() => {
    setManageRolePanelOpen(false);
    setManagingRoleUser(null);
  }, []);

  const openManageGroupPanel = useCallback((user: User) => {
    setManagingGroupUser(user);
    setManageGroupPanelOpen(true);
  }, []);

  const closeManageGroupPanel = useCallback(() => {
    setManageGroupPanelOpen(false);
    setManagingGroupUser(null);
  }, []);

  return {
    createPanelOpen,
    editPanelOpen,
    viewPanelOpen,
    manageRolePanelOpen,
    manageGroupPanelOpen,
    viewingUser,
    editingUser,
    managingRoleUser,
    managingGroupUser,
    createForm,
    editForm,
    openCreatePanel,
    closeCreatePanel,
    openEditPanel,
    closeEditPanel,
    openViewPanel,
    closeViewPanel,
    openManageRolePanel,
    closeManageRolePanel,
    openManageGroupPanel,
    closeManageGroupPanel,
  };
};
