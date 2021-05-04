import { User } from 'src/app/shared/models/user.model';

export class AddTaskDialogData {
  name = '';
  description = '';
  users: User[] = [];
  addedUsers: User[] = [];
}
