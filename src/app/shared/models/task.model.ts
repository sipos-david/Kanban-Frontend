import { User } from './user.model';

export interface Task {
  id: number;
  columnid: number;
  name: string;
  description: string;
  comments: Comment[];
  users: User[];
}
