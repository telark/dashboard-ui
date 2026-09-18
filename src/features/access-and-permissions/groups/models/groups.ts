export interface Group {
  id: string;
  assignedUsersIDs: string[];
  assignedRolesIDs?: string[];
  name: string;
  description: string;
  categoryID: string;
  creationDate: string;
  lastUpdateDate?: string;
  createdBy?: string;
  lastUpdatedBy?: string;
}

export interface GroupsState {
  groups: Group[];
  details: Group | null;
  loading: boolean;
  error: string | null;
  deletingIds: string[];
}

export type GroupFormData = Omit<Group, 'id' | 'creationDate' | 'lastUpdateDate'> & {
  createdBy?: string;
  lastUpdatedBy?: string;
};

export interface GroupPanelProps {
  open: boolean;
  onClose: () => void;
  form: ReturnType<typeof import('antd').Form.useForm<GroupFormData>>[0];
  editingGroup?: Group | null;
}
