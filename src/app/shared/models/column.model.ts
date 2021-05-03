import { Task } from './task.model';

export interface Column {
  id: number;
  tableid: number;
  name: string;
  tasks: Task[];
}
