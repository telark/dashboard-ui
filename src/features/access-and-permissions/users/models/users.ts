export interface UserAvatar {
  style: string;
  seed: string;
}

export interface UserStatus {
  phase: string;
  lastLoginAt?: string;
}

export interface User {
  id: string;
  username: string;
  fullname: string;
  email: string;
  assignedRolesIDs: string[];
  assignedGroupsIDs: string[];
  creationDate: string;
  status: UserStatus;
  avatar?: UserAvatar;
}

export type UserFormBaseFields = Pick<User, 'username' | 'fullname' | 'email'>;

export type CreateUserFormValues = UserFormBaseFields & {
  avatar?: UserAvatar;
  assignedRolesIDs?: string[];
  assignedGroupsIDs?: string[];
};

export interface UsersState {
  users: User[];
  details: User | null;
  loading: boolean;
  error: string | null;
}

export interface UsersTableProps {
  users: User[];
  onView?: (user: User) => void;
  onEdit?: (user: User) => void;
  onUsersChange?: (next: User[]) => void;
}
