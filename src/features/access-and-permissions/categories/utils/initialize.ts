import { fetchCategoriesByScope, createCategory } from '../clients';
import { CATEGORIES_CONSTANTS } from '../constants';
import logger from '../../../../logging';
import type { Category } from '../models';

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

const getBuiltInCategoriesForScope = (
  scope: string,
): ReadonlyArray<Omit<Category, 'id' | 'creationDate'>> | null => {
  if (scope === CATEGORIES_CONSTANTS.SCOPES.GROUPS) {
    return CATEGORIES_CONSTANTS.BUILT_IN_GROUPS_CAT;
  }
  if (scope === CATEGORIES_CONSTANTS.SCOPES.ROLES) {
    return CATEGORIES_CONSTANTS.BUILT_IN_ROLES_CAT;
  }
  logger.warn(CATEGORIES_CONSTANTS.LOGS.NO_BUILT_IN_CATEGORIES(scope));
  return null;
};

const createCategorySafely = async (
  category: Omit<Category, 'id' | 'creationDate'>,
): Promise<void> => {
  try {
    await createCategory(category);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes('already exists') || errorMessage.includes('409')) {
      return;
    }
    logger.error(`Failed to create category "${category.name}":`, error);
    throw error;
  }
};

const getExistingCategoryNames = async (scope: string): Promise<Set<string>> => {
  try {
    const existingCategoriesResponse = await fetchCategoriesByScope(scope, true);
    const existingCategories = existingCategoriesResponse?.data?.items || [];
    return new Set(existingCategories.map((cat) => cat.name.toLowerCase()));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    if (errorMessage.includes('404') || errorMessage.includes('Not Found')) {
      return new Set();
    }
    throw error;
  }
};

const filterCategoriesToCreate = (
  builtInCategories: ReadonlyArray<Omit<Category, 'id' | 'creationDate'>>,
  existingCategoryNames: Set<string>,
): Array<Omit<Category, 'id' | 'creationDate'>> => {
  return builtInCategories.filter(
    (category) => !existingCategoryNames.has(category.name.toLowerCase()),
  );
};

const createCategories = async (
  categories: ReadonlyArray<Omit<Category, 'id' | 'creationDate'>>,
  scope: string,
): Promise<void> => {
  if (categories.length === 0) {
    logger.info(CATEGORIES_CONSTANTS.LOGS.CATEGORIES_ALREADY_EXIST(scope));
    return;
  }

  logger.info(CATEGORIES_CONSTANTS.LOGS.INITIALIZING_CATEGORIES(categories.length, scope));

  const createPromises = categories.map((category) => createCategorySafely(category));
  await Promise.allSettled(createPromises);

  logger.info(CATEGORIES_CONSTANTS.LOGS.INITIALIZATION_SUCCESS(scope));
};

const performInitialization = async (scope: string): Promise<void> => {
  const builtInCategories = getBuiltInCategoriesForScope(scope);
  if (!builtInCategories) {
    return;
  }

  try {
    const existingCategoryNames = await getExistingCategoryNames(scope);
    const categoriesToCreate = filterCategoriesToCreate(builtInCategories, existingCategoryNames);
    await createCategories(categoriesToCreate, scope);
  } catch (error) {
    logger.error(CATEGORIES_CONSTANTS.LOGS.INITIALIZATION_FAILED(scope), error);
    throw error;
  }
};
