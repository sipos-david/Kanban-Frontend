import { Column } from './column.model';

export interface Table {
  id: string;
  name: string;
  columns: Column[];
}
