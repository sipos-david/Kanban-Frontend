import { User } from './user.model';

export interface Task {
  id: number | undefined;
  columnid: number | undefined;
  name: string;
  number: number;
  description: string;
  comments: Comment[];
  users: User[];
}
