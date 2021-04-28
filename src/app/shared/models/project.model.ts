import { Table } from './table.model';
import { User } from './user.model';

export interface Project {
  id: string;
  name: string;
  tables: Table[];
  users: User[];
}
