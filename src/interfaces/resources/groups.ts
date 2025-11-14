export interface Group {
  id: string;
  name: string;
  description: string;
  category: string;
  createdAt: string;
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
  onGroupsChange?: (next: Group[]) => void;
}

