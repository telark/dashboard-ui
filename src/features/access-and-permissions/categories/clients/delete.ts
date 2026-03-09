import { Client, exporterApiClient } from '../../../../api/index';
import logger from '../../../../logging';
import { Endpoints } from '../../../../constants';
import { CATEGORIES_CONSTANTS } from '../constants';

export const deleteCategory = async (id: string): Promise<void> => {
  try {
    await Client<unknown>(
      exporterApiClient,
      Endpoints.CATEGORIES.DELETE_BY_ID(id).path,
      {
        method: Endpoints.CATEGORIES.DELETE_BY_ID(id).method,
      },
    );
  } catch (error) {
    logger.error(
      CATEGORIES_CONSTANTS.ERROR_MESSAGES.CLIENT.DELETE_CATEGORY_FAILED(id),
      error,
    );
    throw error;
  }
};
