export interface UserAvatar {
  style: string;
  seed: string;
}

export interface UserStatus {
  phase: string;
}

export interface User {
  id: string;
  username: string;
  fullname: string;
  email: string;
  roleID: string;
  groupID: string;
  creationDate: string;
  status: UserStatus;
  avatar?: UserAvatar;
}

// Form value types derived from User interface to avoid duplication
export type UserFormBaseFields = Pick<User, 'username' | 'fullname' | 'email' | 'roleID'>;

export type CreateUserFormValues = UserFormBaseFields &
  Pick<User, 'groupID'> & {
    avatar?: UserAvatar;
    group?: string;
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
