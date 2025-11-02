export interface LabeledInputProps {
    name: string;
    label: string;
    placeholder?: string;
    required?: boolean;
    rules?: any[];
    marginBottom?: number;
    allowClear?: boolean;
}

export interface LabeledSelectProps {
    name: string;
    label: string;
    options: Array<{ label: string; value: string }>;
    placeholder?: string;
    required?: boolean;
    rules?: any[];
    marginBottom?: number;
    allowClear?: boolean;
    mode?: 'multiple' | 'tags';
}