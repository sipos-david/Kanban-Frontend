import { User } from './user.model';

export interface Comment {
  id: number;
  taskid: number;
  text: string;
  author: User;
}
