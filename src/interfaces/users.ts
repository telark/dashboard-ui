export interface UserAvatar {
  style: string;
  seed: string;
}

export interface User {
  id: string;
  username: string;
  fullname: string;
  email: string;
  role: string;
  creationDate: string;
  avatar?: UserAvatar;
}

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

