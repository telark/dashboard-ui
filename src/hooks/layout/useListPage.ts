import { useState } from 'react';
import { App as AntdApp } from 'antd';

interface UseListPageOptions<T> {
  initialData: T[];
  onCreate: (data: Record<string, any>) => Promise<T>;
  successMessage: (name: string) => string;
}

export const useListPage = <T>({
  initialData,
  onCreate,
  successMessage,
}: UseListPageOptions<T>) => {
  const { message } = AntdApp.useApp();
  const [items, setItems] = useState<T[]>(initialData);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreate = async (itemData: Record<string, any>) => {
    const newItem = await onCreate(itemData);
    message.success(successMessage((itemData as any).name || 'Item'));
    setItems([...items, newItem]);
    setIsCreateModalOpen(false);
  };

  return {
    items,
    setItems,
    isCreateModalOpen,
    setIsCreateModalOpen,
    handleCreate,
  };
};
