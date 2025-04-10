
export interface Task {
  id: string;
  title: string;
  description: string;
  responsible: string;
  date: string;
  status: 'ideias' | 'a-fazer' | 'fazendo' | 'feito';
}

export type ColumnType = 'ideias' | 'a-fazer' | 'fazendo' | 'feito';

export interface ColumnData {
  id: ColumnType;
  title: string;
  tasks: Task[];
}

export type ResponsibleOption = {
  id: string;
  name: string;
};
