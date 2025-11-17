import { HTTP_STATUS, UTILS_TEXTS } from '../../constants';
import { ApiResponse } from '../../interfaces/http';

export const extractItemsFromResponse = <T = any>(
  data: ApiResponse<T> | any | null | undefined,
): T[] => {
  if (data?.status !== HTTP_STATUS.SUCCESS || !data?.data) {
    throw new Error(UTILS_TEXTS.ERRORS.INVALID_DATA_FORMAT);
  }

  const items = Array.isArray(data.data.items) ? data.data.items : [];
  if (items.length === 0) return [];

  return items;
};
