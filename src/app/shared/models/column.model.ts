import { Task } from './task.model';

export interface Column {
  id: number | undefined;
  tableId: number | undefined;
  number: number;
  name: string;
  tasks: Task[];
}
