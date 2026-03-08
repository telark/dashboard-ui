import { useState, useCallback } from 'react';
import { Form } from 'antd';
import type { Group } from '../../models';
import type { GroupFormData } from '../../models';

interface UseGroupPanelStateReturn {
  createPanelOpen: boolean;
  editPanelOpen: boolean;
  viewPanelOpen: boolean;
  attachRolePanelOpen: boolean;
  attachMemberPanelOpen: boolean;
  viewingGroup: Group | null;
  editingGroup: Group | null;
  attachingRoleGroup: Group | null;
  attachingMemberGroup: Group | null;
  createForm: ReturnType<typeof Form.useForm<GroupFormData>>[0];
  editForm: ReturnType<typeof Form.useForm<GroupFormData>>[0];
  openCreatePanel: () => void;
  closeCreatePanel: () => void;
  openEditPanel: (group: Group) => void;
  closeEditPanel: () => void;
  openViewPanel: (group: Group) => void;
  closeViewPanel: () => void;
  openAttachRolePanel: (group: Group) => void;
  closeAttachRolePanel: () => void;
  openAttachMemberPanel: (group: Group) => void;
  closeAttachMemberPanel: () => void;
}

export const useGroupPanelState = (): UseGroupPanelStateReturn => {
  const [createPanelOpen, setCreatePanelOpen] = useState(false);
  const [editPanelOpen, setEditPanelOpen] = useState(false);
  const [viewPanelOpen, setViewPanelOpen] = useState(false);
  const [attachRolePanelOpen, setAttachRolePanelOpen] = useState(false);
  const [attachMemberPanelOpen, setAttachMemberPanelOpen] = useState(false);
  const [viewingGroup, setViewingGroup] = useState<Group | null>(null);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [attachingRoleGroup, setAttachingRoleGroup] = useState<Group | null>(null);
  const [attachingMemberGroup, setAttachingMemberGroup] = useState<Group | null>(null);
  const [createForm] = Form.useForm<GroupFormData>();
  const [editForm] = Form.useForm<GroupFormData>();

  const openCreatePanel = useCallback(() => {
    setCreatePanelOpen(true);
  }, []);

  const closeCreatePanel = useCallback(() => {
    setCreatePanelOpen(false);
    createForm.resetFields();
  }, [createForm]);

  const openEditPanel = useCallback((group: Group) => {
    setEditingGroup(group);
    setEditPanelOpen(true);
  }, []);

  const closeEditPanel = useCallback(() => {
    setEditPanelOpen(false);
    setEditingGroup(null);
    editForm.resetFields();
  }, [editForm]);

  const openViewPanel = useCallback((group: Group) => {
    setViewingGroup(group);
    setViewPanelOpen(true);
  }, []);

  const closeViewPanel = useCallback(() => {
    setViewPanelOpen(false);
    setViewingGroup(null);
  }, []);

  const openAttachRolePanel = useCallback((group: Group) => {
    setAttachingRoleGroup(group);
    setAttachRolePanelOpen(true);
  }, []);

  const closeAttachRolePanel = useCallback(() => {
    setAttachRolePanelOpen(false);
    setAttachingRoleGroup(null);
  }, []);

  const openAttachMemberPanel = useCallback((group: Group) => {
    setAttachingMemberGroup(group);
    setAttachMemberPanelOpen(true);
  }, []);

  const closeAttachMemberPanel = useCallback(() => {
    setAttachMemberPanelOpen(false);
    setAttachingMemberGroup(null);
  }, []);

  return {
    createPanelOpen,
    editPanelOpen,
    viewPanelOpen,
    attachRolePanelOpen,
    attachMemberPanelOpen,
    viewingGroup,
    editingGroup,
    attachingRoleGroup,
    attachingMemberGroup,
    createForm,
    editForm,
    openCreatePanel,
    closeCreatePanel,
    openEditPanel,
    closeEditPanel,
    openViewPanel,
    closeViewPanel,
    openAttachRolePanel,
    closeAttachRolePanel,
    openAttachMemberPanel,
    closeAttachMemberPanel,
  };
};
