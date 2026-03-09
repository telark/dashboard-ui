import { Client, exporterApiClient } from '../../../../api/index';
import logger from '../../../../logging';
import { Endpoints } from '../../../../constants';
import type { CategoryResponse } from '../models';
import { CATEGORIES_CONSTANTS } from '../constants';

export const updateCategory = async (
  id: string,
  data: { name: string },
): Promise<CategoryResponse> => {
  try {
    return await Client<CategoryResponse>(
      exporterApiClient,
      Endpoints.CATEGORIES.PATCH_BY_ID(id).path,
      {
        method: Endpoints.CATEGORIES.PATCH_BY_ID(id).method,
        data,
      },
    );
  } catch (error) {
    logger.error(
      CATEGORIES_CONSTANTS.ERROR_MESSAGES.CLIENT.UPDATE_CATEGORY_FAILED(id),
      error,
    );
    throw error;
  }
};
