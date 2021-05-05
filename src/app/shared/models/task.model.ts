import { User } from './user.model';
import { Comment } from './comment.model';

export interface Task {
  id: number | undefined;
  columnId: number | undefined;
  name: string;
  number: number;
  description: string;
  comments: Comment[];
  users: User[];
}
