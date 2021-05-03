import { Column } from './column.model';

export interface Table {
  id: number;
  projectid: number;
  name: string;
  columns: Column[];
}
