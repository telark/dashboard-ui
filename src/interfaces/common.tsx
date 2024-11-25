export interface LoadingButtonInterface {
    action: string;
    loading?: boolean;
    loadingLabel: string,
    onClick: () => void;
    icon: React.ReactNode;
    color?: string;
    disabled?: boolean;
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

export interface HistoryRecord {
    event: string;
    status: string;
    creationTime: string;
}