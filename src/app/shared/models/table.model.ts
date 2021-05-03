import { Column } from './column.model';

export interface Table {
  id: number | undefined;
  projectId: number | undefined;
  name: string;
  columns: Column[];
}
