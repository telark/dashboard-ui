export interface LoadingButtonInterface {
    action: string;
    loading?: boolean;
    loadingLabel: string,
    onClick: () => void;
    icon: React.ReactNode;
    color?: string;
    disabled?: boolean;
}

export interface ResourcesInterface {
    resources: ResourceRowInterface[];
}

export interface ResourceRowInterface {
    name: string; 
    lastSync: string;
    kind: string; 
    status: 'Active' | 'Inactive'; 
}

export interface GeneralInfoInterface {
    name: string;
    creationTime: string;
    lastUpdateTime: string;
    status: string;
}

export interface ButtonInterface {
    text: string;
    icon: React.ReactNode;
    active?: boolean;
    hoverIcon?: React.ReactNode;
    route: string;
}

export interface MetricInterface {
    label: string;
    value: number;
}

export interface HistoryInterface {
    Records: Record[];
}

export interface Record {
    event: string;
    status: string;
    creationTime: string;
}