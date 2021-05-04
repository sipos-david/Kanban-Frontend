import { User } from './user.model';

export interface Comment {
  id: number | undefined;
  taskId: number | undefined;
  text: string;
  date: Date | undefined;
  editedDate: Date | undefined;
  author: User;
}
