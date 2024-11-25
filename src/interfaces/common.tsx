export interface MetricInterface {
    label: string;
    value: number;
}

export interface HistoryRecord {
    event: string;
    status: string;
    creationTime: string;
}