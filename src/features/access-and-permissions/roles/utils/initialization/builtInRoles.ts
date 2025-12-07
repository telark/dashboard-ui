import { fetchCategoriesByScope, createCategory } from '../../../categories/clients';
import { createRole, fetchRoles } from '../../clients';
import { CATEGORIES_CONSTANTS } from '../../../categories/constants';
import { BUILT_IN_ROLES, ROLES_CONSTANTS } from '../../constants';
import logger from '../../../../../logging';
import type { Category } from '../../../categories/models';
import type { Role, RoleFormData } from '../../models';

let initializationLock: Promise<void> | null = null;

const getErrorMessage = (error: unknown): string => {
  return error instanceof Error ? error.message : String(error);
};

const isDuplicateError = (errorMessage: string): boolean => {
  return errorMessage.includes('already exists') || errorMessage.includes('409');
};

const isNotFoundError = (errorMessage: string): boolean => {
  return errorMessage.includes('404') || errorMessage.includes('Not Found');
};

const findPlatformCategory = (categories: Category[]): Category | undefined => {
  return categories.find(
    (cat) => cat.name.toLowerCase() === ROLES_CONSTANTS.PLATFORM_CATEGORY_NAME.toLowerCase(),
  );
};

const getPlatformCategoryId = async (): Promise<string | null> => {
  try {
    const response = await fetchCategoriesByScope(CATEGORIES_CONSTANTS.SCOPES.ROLES, true);
    const categories = response?.data?.items || [];
    const platformCategory = findPlatformCategory(categories);
    if (platformCategory) {
      return platformCategory.id;
    }
    return null;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    if (isNotFoundError(errorMessage)) {
      return null;
    }
    throw error;
  }
};

const createPlatformCategory = async (): Promise<string | null> => {
  const categoryData = {
    name: ROLES_CONSTANTS.PLATFORM_CATEGORY_NAME,
    scope: CATEGORIES_CONSTANTS.SCOPES.ROLES,
    type: CATEGORIES_CONSTANTS.TYPES.BUILT_IN,
  };

  try {
    const response = await createCategory(categoryData);
    if (response?.data?.id) {
      return response.data.id;
    }
    logger.error(ROLES_CONSTANTS.LOGS.PLATFORM_CATEGORY_CREATE_FAILED);
    return null;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    if (isDuplicateError(errorMessage)) {
      const categoryId = await getPlatformCategoryId();
      if (categoryId) {
        return categoryId;
      }
    }
    logger.error(ROLES_CONSTANTS.LOGS.PLATFORM_CATEGORY_ENSURE_FAILED, error);
    return null;
  }
};

const ensurePlatformCategory = async (): Promise<string | null> => {
  const existingId = await getPlatformCategoryId();
  if (existingId) {
    return existingId;
  }

  try {
    return await createPlatformCategory();
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    if (isNotFoundError(errorMessage)) {
      return await createPlatformCategory();
    }
    logger.error(ROLES_CONSTANTS.LOGS.PLATFORM_CATEGORY_ENSURE_FAILED, error);
    return null;
  }
};

const getExistingBuiltInRoleNames = async (): Promise<Set<string>> => {
  const existingRoles = await fetchRoles(true);
  const roleNames = new Set<string>();

  const roles = existingRoles?.data?.items || [];
  roles.forEach((role: Role) => {
    if (role.type === ROLES_CONSTANTS.VALUES.ROLE_TYPE_BUILT_IN) {
      roleNames.add(role.name.toLowerCase());
    }
  });

  return roleNames;
};

const createRoleSafely = async (role: RoleFormData): Promise<void> => {
  try {
    await createRole(role);
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    if (isDuplicateError(errorMessage)) {
      return;
    }
    logger.error(ROLES_CONSTANTS.LOGS.ROLE_CREATE_FAILED(role.name), error);
    throw error;
  }
};

const performInitialization = async (): Promise<void> => {
  const platformCategoryId = await ensurePlatformCategory();
  if (!platformCategoryId) {
    logger.error(ROLES_CONSTANTS.LOGS.PLATFORM_CATEGORY_ID_MISSING);
    return;
  }

  const existingRoleNames = await getExistingBuiltInRoleNames();
  const rolesToCreate = BUILT_IN_ROLES.filter(
    (role) => !existingRoleNames.has(role.name.toLowerCase()),
  ).map((role) => ({
    ...role,
    categoryID: platformCategoryId,
  }));

  if (rolesToCreate.length === 0) {
    return;
  }

  const createPromises = rolesToCreate.map((role) => createRoleSafely(role));
  await Promise.allSettled(createPromises);
};

export const initializeBuiltInRoles = async (): Promise<void> => {
  if (initializationLock) {
    return initializationLock;
  }

  const initializationPromise = (async () => {
    try {
      await performInitialization();
    } finally {
      initializationLock = null;
    }
  })();

  initializationLock = initializationPromise;
  return initializationPromise;
};
