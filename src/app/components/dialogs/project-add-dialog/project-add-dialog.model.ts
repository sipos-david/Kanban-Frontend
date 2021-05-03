import { Project } from 'src/app/shared/models/project.model';
import { User } from 'src/app/shared/models/user.model';

export class ProjectAddDialogData {
  users: User[] = [];
  project: Project | undefined;
}
