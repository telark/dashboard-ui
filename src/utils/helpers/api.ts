import { HTTP_STATUS, UTILS_TEXTS } from '../../constants';
import { ApiResponse } from '../../interfaces/http';

export const extractItemsFromResponse = <T>(data: unknown): T[] => {
  const response = data as ApiResponse<T> | null | undefined;
  if (response?.status !== HTTP_STATUS.SUCCESS || !response?.data) {
    throw new Error(UTILS_TEXTS.ERRORS.INVALID_DATA_FORMAT);
  }

  return Array.isArray(response.data.items) ? response.data.items : [];
};
