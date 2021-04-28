import { User } from './user.model';

export interface Task {
  id: string;
  name: string;
  description: string;
  comments: Comment[];
  users: User[];
}
