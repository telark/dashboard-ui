export interface GrouperState {
  groupers: any[];
  details: any | null;
  loading: boolean;
  error: string | null;
  syncing?: Record<string, boolean>;
}

export interface GrouperInterface {
  name: string;
  maintenance: Maintenance | null;
  status: 'Active' | 'Inactive';
  numberOfWorkloads: number;
  numberOfBridges: number;
  creationTime: string;
  lastUpdateTime: string;
  history: unknown[];
  workloads: unknown[];
  bridges: unknown[];
  sync: unknown | null;
  hasMaintenance?: boolean;
  syncName?: string; // API-facing name (fasid.name)
}

export interface Maintenance {
  name: string;
  status: string;
  deleteAction: string;
  updateAction: string;
}

export interface ResourceRowItemProps {
  resource: {
    name: string;
    lastSync: string;
    type: string;
    status: string;
    isBridge?: boolean;
    sourceType?: string;
    sourceName?: string;
  };
  isSelected: boolean;
  isSyncing?: boolean;
  onSelect: (checked: boolean) => void;
}

export interface ResourcesActionBarProps {
  selectedCount: number;
  hasSelection: boolean;
  allPageResourcesSelected: boolean;
  somePageResourcesSelected: boolean;
  isSyncing?: boolean;
  onSelectAll: (checked: boolean) => void;
  onView: () => void;
  onSync: () => void;
  onDelete: () => void;
}

export interface ResourcesListProps {
  resources: Resource[];
  selectedResources: Set<string>;
  onSelectResource: (resourceName: string, checked: boolean) => void;
  currentPage: number;
  pageSize: number;
  totalResources: number;
  onPageChange: (page: number) => void;
  isResourceSyncing?: (resourceName: string, resourceType: string, resource?: Resource) => boolean;
}

interface Resource {
  name: string;
  lastSync: string;
  type: string;
  status: string;
  isBridge?: boolean;
  sourceType?: string;
  sourceName?: string;
  syncName?: string;
}

export interface ResourceTagProps {
  type?: 'type' | 'status';
  value: string;
}
