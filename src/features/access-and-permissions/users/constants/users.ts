import type { FormFieldConfig } from '../../../../interfaces/layout/modal';

export const USERS_CONSTANTS = {
  LABELS: {
    HEADER_TITLE: 'Users',
    HEADER_SUBTITLE: 'Manage existing users',
    VIEW_SUBTITLE: 'View user details',
    EDIT_SUBTITLE: 'Edit user details',
    CREATE_SUBTITLE: 'Create a new user',
    NOT_FOUND: 'User not found',
    UPDATE_BUTTON: 'Update User',
    CREATE_BUTTON: 'Add User',
    CREATE_BUTTON_TEXT: 'Create User',
    BREADCRUMBS: {
      USERS: 'Users',
      EDIT: 'Edit',
      CREATE: 'Create User',
    },
    MESSAGES: {
      CREATED: (name: string) => `User "${name}" created`,
      UPDATED: (name: string) => `User "${name}" updated`,
      CREATE_FAILED: 'Failed to create user',
      NO_USERS_TITLE: 'No users yet',
      NO_USERS_DESCRIPTION: 'Get started by adding your first user to the system.',
    },
    COLUMNS: {
      USERNAME: 'Username',
      FULLNAME: 'Full Name',
      EMAIL: 'Email',
      ROLE: 'Role ID',
      CREATED: 'Creation Date',
    },
    VIEW_LABELS: {
      USERNAME: 'Username',
      FULLNAME: 'Full Name',
      EMAIL: 'Email',
      ROLE_ID: 'Role ID',
      GROUP_ID: 'Group ID',
      STATUS: 'Status',
      CREATION_DATE: 'Creation Date',
    },
    ACTIONS: {
      VIEW: 'View',
      EDIT: 'Edit',
      DELETE: 'Delete',
      DELETE_MODAL_TITLE: 'Delete User',
      DELETE_MODAL_CONTENT: (name: string) => `Are you sure you want to delete "${name}"?`,
      DELETE_MODAL_OK: 'Delete',
    },
    FORM: {
      TITLE: 'Create User',
      SUBTITLE: 'Add a new user',
      SECTION_TITLE: 'User Details',
      SECTION_SUBTITLE: 'Provide the user information.',
      BUTTON_TEXT: 'Create User',
      FIELDS: {
        USERNAME_LABEL: 'Username',
        USERNAME_PLACEHOLDER: 'e.g. john.doe',
        FULLNAME_LABEL: 'Full Name',
        FULLNAME_PLACEHOLDER: 'e.g. John Doe',
        EMAIL_LABEL: 'Email',
        EMAIL_PLACEHOLDER: 'e.g. john.doe@example.com',
        ROLE_LABEL: 'Role',
        ROLE_PLACEHOLDER: 'Select a role',
        GROUP_LABEL: 'Group',
        GROUP_PLACEHOLDER: 'Select a group',
      },
    },
    PANELS: {
      VIEW: {
        TITLE: 'User Details',
      },
      EDIT: {
        TITLE: 'Edit User',
        SUBTITLE: (name: string) => `Edit information for ${name}`,
        SUBMIT_BUTTON: 'Update User',
      },
      CREATE: {
        TITLE: 'Create User',
        SUBTITLE: 'Add a new user to the system',
        SUBMIT_BUTTON: 'Create User',
      },
    },
    TOOLBAR: {
      SEARCH: {
        PLACEHOLDER: 'Search users by name, email...',
        BUTTON_LABEL: 'Search',
      },
      CREATE: {
        BUTTON_LABEL: 'Add User',
      },
    },
    EMPTY: {
      NO_USERS_FOUND: 'No Users Found',
    },
    PAGINATION: {
      SHOW_ROWS: 'Show rows',
    },
    MODAL: {
      CANCEL: 'Cancel',
    },
    LOGS: {
      FETCH_USERS: 'Fetching users',
    },
  },
  KEYS: {
    USERNAME: 'username',
    FULLNAME: 'fullname',
    EMAIL: 'email',
    ROLE: 'roleID',
    CREATION_DATE: 'creationDate',
    ACTIONS: 'actions',
  } as const,
  SIZES: {
    ROW_HEIGHT: 32,
    HEADER_ICON: 14,
    CHIP_FONT: 12,
    COLUMNS: {
      USERNAME: 150,
      FULLNAME: 180,
      EMAIL: 220,
      ROLE: 120,
      CREATED: 120,
      ACTIONS: 50,
    },
    MODAL_WIDTH: 360,
  },
  FORM: {
    FIELDS: [
      {
        type: 'input',
        name: 'username',
        label: 'Username',
        placeholder: 'e.g. john.doe',
        required: true,
        marginBottom: 18,
      },
      {
        type: 'input',
        name: 'fullname',
        label: 'Full Name',
        placeholder: 'e.g. John Doe',
        required: true,
        marginBottom: 18,
      },
      {
        type: 'input',
        name: 'email',
        label: 'Email',
        placeholder: 'e.g. john.doe@example.com',
        required: true,
        marginBottom: 18,
      },
      {
        type: 'select',
        name: 'role',
        label: 'Role',
        placeholder: 'Select a role',
        required: true,
        options: [
          { label: 'Admin', value: 'Admin' },
          { label: 'Viewer', value: 'Viewer' },
          { label: 'Contributor', value: 'Contributor' },
          { label: 'Ops Engineer', value: 'Ops Engineer' },
          { label: 'Platform Admin', value: 'Platform Admin' },
        ],
        marginBottom: 6,
      },
    ] as FormFieldConfig[],
    INITIAL_VALUES: {
      role: 'Viewer',
    },
  },
} as const;

export type UsersConstants = typeof USERS_CONSTANTS;
