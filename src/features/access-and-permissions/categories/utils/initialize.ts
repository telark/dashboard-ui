import { fetchCategoriesByScope, createCategory } from '../clients';
import { CATEGORIES_CONSTANTS } from '../constants';
import logger from '../../../../logging';


const initializationLocks = new Map<string, Promise<void>>();

export const initializeBuiltInCategories = async (scope: string): Promise<void> => {
  const existingLock = initializationLocks.get(scope);
  if (existingLock) {
    return existingLock;
  }

  const initializationPromise = (async () => {
    try {
      await performInitialization(scope);
    } finally {
      initializationLocks.delete(scope);
    }
  })();

  initializationLocks.set(scope, initializationPromise);

  return initializationPromise;
};

const performInitialization = async (scope: string): Promise<void> => {
  try {
    const existingCategoriesResponse = await fetchCategoriesByScope(scope, true);
    const existingCategories = existingCategoriesResponse?.data?.items || [];

    let builtInCategories;
    if (scope === CATEGORIES_CONSTANTS.SCOPES.GROUPS) {
      builtInCategories = CATEGORIES_CONSTANTS.BUILT_IN_GROUPS_CAT;
    } else if (scope === CATEGORIES_CONSTANTS.SCOPES.ROLES) {
      builtInCategories = CATEGORIES_CONSTANTS.BUILT_IN_ROLES_CAT;
    } else {
      logger.warn(CATEGORIES_CONSTANTS.LOGS.NO_BUILT_IN_CATEGORIES(scope));
      return;
    }

    // Create a Set of existing category names for quick lookup (case-insensitive)
    const existingCategoryNames = new Set(
      existingCategories.map((cat) => cat.name.toLowerCase()),
    );

    // Filter out categories that already exist by name
    const categoriesToCreate = builtInCategories.filter(
      (category) => !existingCategoryNames.has(category.name.toLowerCase()),
    );

    if (categoriesToCreate.length === 0) {
      logger.info(CATEGORIES_CONSTANTS.LOGS.CATEGORIES_ALREADY_EXIST(scope));
      return;
    }

    logger.info(
      CATEGORIES_CONSTANTS.LOGS.INITIALIZING_CATEGORIES(categoriesToCreate.length, scope),
    );

    // Create categories and handle duplicate errors gracefully
    const createPromises = categoriesToCreate.map((category) =>
      createCategory(category).catch((error) => {
        const errorMessage = error instanceof Error ? error.message : String(error);
        // If category already exists (409 conflict or similar), just log and continue
        if (
          errorMessage.includes('already exists') ||
          errorMessage.includes('409') ||
          errorMessage.includes('duplicate')
        ) {
          logger.info(`Category "${category.name}" already exists. Skipping creation.`);
          return null;
        }
        // For other errors, log and rethrow
        logger.error(`Failed to create category "${category.name}":`, error);
        throw error;
      }),
    );

    await Promise.allSettled(createPromises);

    logger.info(CATEGORIES_CONSTANTS.LOGS.INITIALIZATION_SUCCESS(scope));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    // Only handle 404/Not Found errors - other errors should be thrown
    if (errorMessage.includes('404') || errorMessage.includes('Not Found')) {
      logger.info(CATEGORIES_CONSTANTS.LOGS.NO_CATEGORIES_FOUND(scope));

      let builtInCategories;
      if (scope === CATEGORIES_CONSTANTS.SCOPES.GROUPS) {
        builtInCategories = CATEGORIES_CONSTANTS.BUILT_IN_GROUPS_CAT;
      } else if (scope === CATEGORIES_CONSTANTS.SCOPES.ROLES) {
        builtInCategories = CATEGORIES_CONSTANTS.BUILT_IN_ROLES_CAT;
      } else {
        logger.warn(CATEGORIES_CONSTANTS.LOGS.NO_BUILT_IN_CATEGORIES(scope));
        return;
      }

      // Create categories and handle duplicate errors gracefully
      const createPromises = builtInCategories.map((category) =>
        createCategory(category).catch((error) => {
          const errorMessage = error instanceof Error ? error.message : String(error);
          // If category already exists, just log and continue
          if (
            errorMessage.includes('already exists') ||
            errorMessage.includes('409') ||
            errorMessage.includes('duplicate')
          ) {
            logger.info(`Category "${category.name}" already exists. Skipping creation.`);
            return null;
          }
          logger.error(`Failed to create category "${category.name}":`, error);
          throw error;
        }),
      );

      await Promise.allSettled(createPromises);
      logger.info(CATEGORIES_CONSTANTS.LOGS.INITIALIZATION_SUCCESS(scope));
    } else {
      logger.error(CATEGORIES_CONSTANTS.LOGS.INITIALIZATION_FAILED(scope), error);
      throw error;
    }
  }
};
