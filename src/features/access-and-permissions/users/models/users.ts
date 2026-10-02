export interface UserAvatar {
  style: string;
  seed: string;
}

export interface UserSettings {
  timezone?: string;
  region?: string;
  theme?: string;
}

export type UserAccountState = 'active' | 'suspended';

// Written by auth while an enroll link is pending; expiresAt is for display, auth enforces it.
export interface UserInvite {
  issuedAt: string;
  expiresAt: string;
  issuedBy?: string;
}

export interface UserStatus {
  phase: UserAccountState;
  lastLoginAt?: string;
  invite?: UserInvite;
  inviteAcceptedAt?: string;
}

export interface ManageUserStateFormValues {
  phase: UserAccountState;
}

export interface User {
  id: string;
  username: string;
  fullname: string;
  email: string;
  roleRefs: string[];
  groupRefs: string[];
  creationDate: string;
  status: UserStatus;
  avatar?: UserAvatar;
  settings?: UserSettings;
  // Set by the backend (omitted when false) for admins the chart creates and owns.
  bootstrap?: boolean;
}

export type UserFormBaseFields = Pick<User, 'username' | 'fullname' | 'email'>;

export type CreateUserFormValues = UserFormBaseFields & {
  avatar?: UserAvatar;
  roleRefs?: string[];
  groupRefs?: string[];
};

export interface UsersState {
  users: User[];
  details: User | null;
  loading: boolean;
  // Set once the list has arrived: `loading` is false both before the first fetch and after it.
  loaded: boolean;
  error: string | null;
  deletingIds: string[];
}

export interface UsersTableProps {
  users: User[];
  onView?: (user: User) => void;
  onEdit?: (user: User) => void;
  onUsersChange?: (next: User[]) => void;
}
