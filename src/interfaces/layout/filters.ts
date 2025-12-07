export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterSectionConfig {
  label: string;
  options: FilterOption[];
  selectedValue: string;
  onChange: (value: string) => void;
}
