import { Client, exporterApiClient } from '../../../../api/index';
import logger from '../../../../logging';
import { Endpoints } from '../../../../constants';
import type { Category, CategoryResponse } from '../models';
import { CATEGORIES_CONSTANTS } from '../constants';

export const createCategory = async (category: Omit<Category, 'id' | 'creationDate'>) => {
  try {
    const categoryData = {
      ...category,
    };
    return await Client<CategoryResponse>(exporterApiClient, Endpoints.CATEGORIES.CREATE.path, {
      method: Endpoints.CATEGORIES.CREATE.method,
      data: categoryData,
    });
  } catch (error) {
    logger.error(
      CATEGORIES_CONSTANTS.ERROR_MESSAGES.CLIENT.CREATE_CATEGORY_FAILED(category.name),
      error,
    );
    throw error;
  }
};
