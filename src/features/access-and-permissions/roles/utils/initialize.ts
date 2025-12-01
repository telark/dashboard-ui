import { fetchCategoriesByScope, createCategory } from '../../categories/clients';
import { createRole } from '../clients';
import { CATEGORIES_CONSTANTS } from '../../categories/constants';
import { BUILT_IN_ROLES, ROLES_CONSTANTS } from '../constants';
import logger from '../../../../logging';
import type { Category } from '../../categories/models';

export const initializeBuiltInRoles = async (): Promise<void> => {
  try {
    // First, ensure the platform category exists
    const platformCategoryId = await ensurePlatformCategory();

    if (!platformCategoryId) {
      logger.error(ROLES_CONSTANTS.LOGS.PLATFORM_CATEGORY_ID_MISSING);
      return;
    }

    logger.info(ROLES_CONSTANTS.LOGS.INITIALIZING_ROLES);

    const rolesToCreate = BUILT_IN_ROLES.map((role) => ({
      ...role,
      categoryID: platformCategoryId,
    }));

    const createPromises = rolesToCreate.map((role) =>
      createRole(role).catch((error) => {
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (errorMessage.includes('already exists') || errorMessage.includes('409')) {
          logger.info(ROLES_CONSTANTS.LOGS.ROLE_ALREADY_EXISTS(role.name));
          return null;
        }
        logger.error(ROLES_CONSTANTS.LOGS.ROLE_CREATE_FAILED(role.name), error);
        throw error;
      }),
    );

    await Promise.allSettled(createPromises);

    logger.info(ROLES_CONSTANTS.LOGS.INITIALIZATION_SUCCESS);
  } catch (error) {
    logger.error(ROLES_CONSTANTS.LOGS.INITIALIZATION_FAILED, error);
    throw error;
  }
};

const ensurePlatformCategory = async (): Promise<string | null> => {
  try {
    const existingCategories = await fetchCategoriesByScope(
      CATEGORIES_CONSTANTS.SCOPES.ROLES,
      true,
    );

    if (
      existingCategories &&
      existingCategories.data &&
      existingCategories.data.items &&
      existingCategories.data.items.length > 0
    ) {
      const platformCategory = existingCategories.data.items.find(
        (cat: Category) => cat.name === ROLES_CONSTANTS.PLATFORM_CATEGORY_NAME,
      );

      if (platformCategory) {
        logger.info(ROLES_CONSTANTS.LOGS.PLATFORM_CATEGORY_ALREADY_EXISTS(platformCategory.id));
        return platformCategory.id;
      }
    }

    logger.info(ROLES_CONSTANTS.LOGS.CREATING_PLATFORM_CATEGORY);
    const categoryData = {
      name: ROLES_CONSTANTS.PLATFORM_CATEGORY_NAME,
      scope: CATEGORIES_CONSTANTS.SCOPES.ROLES,
      type: CATEGORIES_CONSTANTS.TYPES.BUILT_IN,
    };

    const response = await createCategory(categoryData);

    if (response && response.data && response.data.id) {
      logger.info(ROLES_CONSTANTS.LOGS.PLATFORM_CATEGORY_CREATED(response.data.id));
      return response.data.id;
    }

    logger.error(ROLES_CONSTANTS.LOGS.PLATFORM_CATEGORY_CREATE_FAILED);
    return null;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes('already exists') || errorMessage.includes('409')) {
      logger.info(ROLES_CONSTANTS.LOGS.PLATFORM_CATEGORY_ALREADY_EXISTS_FETCHING);
      try {
        const existingCategories = await fetchCategoriesByScope(
          CATEGORIES_CONSTANTS.SCOPES.ROLES,
          true,
        );
        if (
          existingCategories &&
          existingCategories.data &&
          existingCategories.data.items &&
          existingCategories.data.items.length > 0
        ) {
          const platformCategory = existingCategories.data.items.find(
            (cat: Category) => cat.name === ROLES_CONSTANTS.PLATFORM_CATEGORY_NAME,
          );
          if (platformCategory) {
            return platformCategory.id;
          }
        }
      } catch (fetchError) {
        logger.error(ROLES_CONSTANTS.LOGS.PLATFORM_CATEGORY_FETCH_FAILED, fetchError);
      }
    }
    logger.error(ROLES_CONSTANTS.LOGS.PLATFORM_CATEGORY_ENSURE_FAILED, error);
    return null;
  }
};
