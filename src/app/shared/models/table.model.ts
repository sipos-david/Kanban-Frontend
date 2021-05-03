import { Column } from './column.model';

export interface Table {
  id: number | undefined;
  projectid: number | undefined;
  name: string;
  columns: Column[];
}
