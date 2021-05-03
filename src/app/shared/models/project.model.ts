import { Table } from './table.model';
import { User } from './user.model';

export interface Project {
  id: number | undefined;
  name: string;
  tables: Table[];
  users: User[];
}
