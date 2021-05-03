import { User } from 'src/app/shared/models/user.model';

export class AddUserDialogData {
  title = '';
  users: User[] = [];
  addedUsers: User[] = [];
}
