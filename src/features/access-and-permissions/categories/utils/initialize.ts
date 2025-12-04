import { fetchCategoriesByScope, createCategory } from '../clients';
import { CATEGORIES_CONSTANTS } from '../constants';
import logger from '../../../../logging';

export const initializeBuiltInCategories = async (scope: string): Promise<void> => {
  try {
    const existingCategories = await fetchCategoriesByScope(scope, true);

    if (
      existingCategories &&
      existingCategories.data &&
      existingCategories.data.items &&
      existingCategories.data.items.length > 0
    ) {
      return;
    }

    let categoriesToCreate;
    if (scope === CATEGORIES_CONSTANTS.SCOPES.GROUPS) {
      categoriesToCreate = CATEGORIES_CONSTANTS.BUILT_IN_GROUPS_CAT;
    } else if (scope === CATEGORIES_CONSTANTS.SCOPES.ROLES) {
      categoriesToCreate = CATEGORIES_CONSTANTS.BUILT_IN_ROLES_CAT;
    } else {
      logger.warn(CATEGORIES_CONSTANTS.LOGS.NO_BUILT_IN_CATEGORIES(scope));
      return;
    }

    logger.info(
      CATEGORIES_CONSTANTS.LOGS.INITIALIZING_CATEGORIES(categoriesToCreate.length, scope),
    );

    const createPromises = categoriesToCreate.map((category) => createCategory(category));

    await Promise.allSettled(createPromises);

    logger.info(CATEGORIES_CONSTANTS.LOGS.INITIALIZATION_SUCCESS(scope));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    if (errorMessage.includes('404') || errorMessage.includes('Not Found')) {
      logger.info(CATEGORIES_CONSTANTS.LOGS.NO_CATEGORIES_FOUND(scope));
      try {
        let categoriesToCreate;
        if (scope === CATEGORIES_CONSTANTS.SCOPES.GROUPS) {
          categoriesToCreate = CATEGORIES_CONSTANTS.BUILT_IN_GROUPS_CAT;
        } else if (scope === CATEGORIES_CONSTANTS.SCOPES.ROLES) {
          categoriesToCreate = CATEGORIES_CONSTANTS.BUILT_IN_ROLES_CAT;
        } else {
          logger.warn(CATEGORIES_CONSTANTS.LOGS.NO_BUILT_IN_CATEGORIES(scope));
          return;
        }

        const createPromises = categoriesToCreate.map((category) => createCategory(category));
        await Promise.allSettled(createPromises);
        logger.info(CATEGORIES_CONSTANTS.LOGS.INITIALIZATION_SUCCESS(scope));
      } catch (createError) {
        logger.error(CATEGORIES_CONSTANTS.LOGS.CREATE_CATEGORIES_FAILED(scope), createError);
        throw createError;
      }
    } else {
      logger.error(CATEGORIES_CONSTANTS.LOGS.INITIALIZATION_FAILED(scope), error);
      throw error;
    }
  }
};
