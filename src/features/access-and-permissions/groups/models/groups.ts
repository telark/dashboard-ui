export interface Group {
  id: string;
  name: string;
  description: string;
  categoryID: string;
  creationDate: string;
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
