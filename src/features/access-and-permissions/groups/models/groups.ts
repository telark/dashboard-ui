export interface Group {
  id: string;
  assignedUsersIDs: string[];
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
}

export interface GroupsTableProps {
  groups: Group[];
  onView?: (group: Group) => void;
  onEdit?: (group: Group) => void;
}

export type GroupFormData = Omit<Group, 'id' | 'creationDate'>;
