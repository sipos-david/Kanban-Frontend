import { User } from './user.model';

export interface Comment {
  id: string;
  text: string;
  author: User;
}
