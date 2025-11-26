import { Client, exporterApiClient } from '../../../../api/index';
import logger from '../../../../logging';
import { Endpoints, HTTP_HEADERS, HEADER_VALUES } from '../../../../constants';
import type { CategoryListResponse, CategoryResponse } from '../models';
import { CATEGORIES_CONSTANTS } from '../constants';

export const fetchCategoriesByScope = async (scope: string, silent = false) => {
  try {
    const config = silent
      ? {
          headers: { [HTTP_HEADERS.CUSTOM.SILENT_NETWORK]: HEADER_VALUES.SILENT_NETWORK },
        }
      : {};
    return await Client<CategoryListResponse>(
      exporterApiClient,
      Endpoints.CATEGORIES.GET_BY_SCOPE(scope).path,
      {
        ...config,
        method: Endpoints.CATEGORIES.GET_BY_SCOPE(scope).method,
      },
    );
  } catch (error) {
    if (!silent) {
      logger.error(
        CATEGORIES_CONSTANTS.ERROR_MESSAGES.CLIENT.FETCH_CATEGORIES_BY_SCOPE_FAILED(scope),
        error,
      );
    }
    throw error;
  }
};

export const fetchAllCategories = async (silent = false) => {
  try {
    const config = silent
      ? {
          headers: { [HTTP_HEADERS.CUSTOM.SILENT_NETWORK]: HEADER_VALUES.SILENT_NETWORK },
        }
      : {};
    return await Client<CategoryListResponse>(
      exporterApiClient,
      Endpoints.CATEGORIES.GET_ALL.path,
      {
        ...config,
        method: Endpoints.CATEGORIES.GET_ALL.method,
      },
    );
  } catch (error) {
    if (!silent) {
      logger.error(CATEGORIES_CONSTANTS.ERROR_MESSAGES.CLIENT.FETCH_ALL_CATEGORIES_FAILED, error);
    }
    throw error;
  }
};

export const fetchCategoryById = async (id: string, silent = false) => {
  try {
    const config = silent
      ? {
          headers: { [HTTP_HEADERS.CUSTOM.SILENT_NETWORK]: HEADER_VALUES.SILENT_NETWORK },
        }
      : {};
    return await Client<CategoryResponse>(
      exporterApiClient,
      Endpoints.CATEGORIES.GET_BY_ID(id).path,
      {
        ...config,
        method: Endpoints.CATEGORIES.GET_BY_ID(id).method,
      },
    );
  } catch (error) {
    if (!silent) {
      logger.error(
        CATEGORIES_CONSTANTS.ERROR_MESSAGES.CLIENT.FETCH_CATEGORY_BY_ID_FAILED(id),
        error,
      );
    }
    throw error;
  }
};
