import { useState, useCallback } from 'react';
import { Form } from 'antd';
import type { Group } from '../../models';
import type { GroupFormData } from '../../models';

interface UseGroupPanelStateReturn {
  createPanelOpen: boolean;
  editPanelOpen: boolean;
  editingGroup: Group | null;
  createForm: ReturnType<typeof Form.useForm<GroupFormData>>[0];
  editForm: ReturnType<typeof Form.useForm<GroupFormData>>[0];
  openCreatePanel: () => void;
  closeCreatePanel: () => void;
  openEditPanel: (group: Group) => void;
  closeEditPanel: () => void;
}

export const useGroupPanelState = (): UseGroupPanelStateReturn => {
  const [createPanelOpen, setCreatePanelOpen] = useState(false);
  const [editPanelOpen, setEditPanelOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
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

  return {
    createPanelOpen,
    editPanelOpen,
    editingGroup,
    createForm,
    editForm,
    openCreatePanel,
    closeCreatePanel,
    openEditPanel,
    closeEditPanel,
  };
};
