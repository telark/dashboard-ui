import type { RoleFormData } from '../models';
import { ROLES_CONSTANTS } from './roles';

const { PERMISSION_LEVEL, STATUS, VALUES } = ROLES_CONSTANTS;

export const BUILT_IN_ROLES: Omit<RoleFormData, 'id' | 'creationDate' | 'lastUpdateDate'>[] = [
  {
    name: 'ReadOnly',
    description: 'Can only view/explore resources in the scope',
    type: VALUES.ROLE_TYPE_BUILT_IN,
    categoryID: '', // Will be set during initialization with platform category ID
    scopesAndPermissions: [
      {
        scope: 'Workloads',
        level: PERMISSION_LEVEL.READ_ONLY,
      },
      {
        scope: 'Groupers',
        level: PERMISSION_LEVEL.READ_ONLY,
      },
      {
        scope: 'Bridges',
        level: PERMISSION_LEVEL.READ_ONLY,
      },
      {
        scope: 'Users',
        level: PERMISSION_LEVEL.READ_ONLY,
      },
      {
        scope: 'Groups',
        level: PERMISSION_LEVEL.READ_ONLY,
      },
      {
        scope: 'Roles',
        level: PERMISSION_LEVEL.READ_ONLY,
      },
      {
        scope: 'Policies',
        level: PERMISSION_LEVEL.READ_ONLY,
      },
    ],
    protection: {
      preventDeletion: true,
      preventModification: true,
      preventScopeChanges: true,
      lockName: true,
      lockCategory: true,
      softDelete: false,
    },
    status: STATUS.ACTIVE,
    validity: {
      type: ROLES_CONSTANTS.VALIDITY_TYPES.PERMANENT,
    },
    assignedTo: {
      groupIDs: [],
      userIDs: [],
    },
  },
  {
    name: 'Contributor',
    description: 'Can modify/create resources but cannot manage access',
    type: VALUES.ROLE_TYPE_BUILT_IN,
    categoryID: '', // Will be set during initialization with platform category ID
    scopesAndPermissions: [
      {
        scope: 'Workloads',
        level: PERMISSION_LEVEL.CONTRIBUTOR,
      },
      {
        scope: 'Groupers',
        level: PERMISSION_LEVEL.CONTRIBUTOR,
      },
      {
        scope: 'Bridges',
        level: PERMISSION_LEVEL.CONTRIBUTOR,
      },
      {
        scope: 'Users',
        level: PERMISSION_LEVEL.READ_ONLY,
      },
      {
        scope: 'Groups',
        level: PERMISSION_LEVEL.READ_ONLY,
      },
      {
        scope: 'Roles',
        level: PERMISSION_LEVEL.READ_ONLY,
      },
      {
        scope: 'Policies',
        level: PERMISSION_LEVEL.CONTRIBUTOR,
      },
    ],
    protection: {
      preventDeletion: true,
      preventModification: true,
      preventScopeChanges: true,
      lockName: true,
      lockCategory: true,
      softDelete: false,
    },
    status: STATUS.ACTIVE,
    validity: {
      type: ROLES_CONSTANTS.VALIDITY_TYPES.PERMANENT,
    },
    assignedTo: {
      groupIDs: [],
      userIDs: [],
    },
  },
  {
    name: 'Owner',
    description: 'Full control of resources and can assign roles within the scope',
    type: VALUES.ROLE_TYPE_BUILT_IN,
    categoryID: '', // Will be set during initialization with platform category ID
    scopesAndPermissions: [
      {
        scope: 'Workloads',
        level: PERMISSION_LEVEL.OWNER,
      },
      {
        scope: 'Groupers',
        level: PERMISSION_LEVEL.OWNER,
      },
      {
        scope: 'Bridges',
        level: PERMISSION_LEVEL.OWNER,
      },
      {
        scope: 'Users',
        level: PERMISSION_LEVEL.OWNER,
      },
      {
        scope: 'Groups',
        level: PERMISSION_LEVEL.OWNER,
      },
      {
        scope: 'Roles',
        level: PERMISSION_LEVEL.OWNER,
      },
      {
        scope: 'Policies',
        level: PERMISSION_LEVEL.OWNER,
      },
    ],
    protection: {
      preventDeletion: true,
      preventModification: true,
      preventScopeChanges: true,
      lockName: true,
      lockCategory: true,
      softDelete: false,
    },
    status: STATUS.ACTIVE,
    validity: {
      type: ROLES_CONSTANTS.VALIDITY_TYPES.PERMANENT,
    },
    assignedTo: {
      groupIDs: [],
      userIDs: [],
    },
  },
  {
    name: 'Admin',
    description: 'Top-level authority, can override protections and manage everything in the scope',
    type: VALUES.ROLE_TYPE_BUILT_IN,
    categoryID: '', // Will be set during initialization with platform category ID
    scopesAndPermissions: [
      {
        scope: 'ALL',
        level: PERMISSION_LEVEL.ADMIN,
      },
    ],
    protection: {
      preventDeletion: true,
      preventModification: true,
      preventScopeChanges: true,
      lockName: true,
      lockCategory: true,
      softDelete: false,
    },
    status: STATUS.ACTIVE,
    validity: {
      type: ROLES_CONSTANTS.VALIDITY_TYPES.PERMANENT,
    },
    assignedTo: {
      groupIDs: [],
      userIDs: [],
    },
  },
];
