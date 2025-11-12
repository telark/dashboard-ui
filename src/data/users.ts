import type { User } from '../interfaces/users';

export const STATIC_USERS: User[] = [
  {
    id: 'usr-1',
    username: 'john.doe',
    fullname: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Admin',
    creationDate: '2024-01-15T09:00:00Z',
    avatar: {
      style: 'avataaars',
      seed: 'john-doe',
    },
  },
  {
    id: 'usr-2',
    username: 'jane.smith',
    fullname: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'Viewer',
    creationDate: '2024-02-20T10:30:00Z',
    avatar: {
      style: 'lorelei',
      seed: 'jane-smith',
    },
  },
  {
    id: 'usr-3',
    username: 'bob.wilson',
    fullname: 'Bob Wilson',
    email: 'bob.wilson@example.com',
    role: 'Contributor',
    creationDate: '2024-03-10T14:15:00Z',
    avatar: {
      style: 'adventurer',
      seed: 'bob-wilson',
    },
  },
  {
    id: 'usr-4',
    username: 'alice.brown',
    fullname: 'Alice Brown',
    email: 'alice.brown@example.com',
    role: 'Ops Engineer',
    creationDate: '2024-04-05T11:20:00Z',
    avatar: {
      style: 'micah',
      seed: 'alice-brown',
    },
  },
];
