import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

interface UseViewPageOptions<T> {
  data: T[];
  findById: (id: string, data: T[]) => T | undefined;
  createConfig: (item: T) => any;
}

export const useViewPage = <T>({ data, findById, createConfig }: UseViewPageOptions<T>) => {
  const { id } = useParams<{ id: string }>();

  const item = useMemo(() => {
    if (!id) return undefined;
    return findById(id, data);
  }, [id, data, findById]);

  const config = useMemo(() => {
    if (!item) return null;
    return createConfig(item);
  }, [item, createConfig]);

  return {
    id,
    item,
    config,
    notFound: !item || !config,
  };
};
