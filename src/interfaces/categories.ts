export interface Category {
  id: string;
  name: string;
  description: string;
  usedBy: string[];
  type: string;
  createdAt: string;
}

export interface CategoriesTableProps {
  categories: Category[];
  onView?: (cat: Category) => void;
  onEdit?: (cat: Category) => void;
  onCategoriesChange?: (next: Category[]) => void;
}
