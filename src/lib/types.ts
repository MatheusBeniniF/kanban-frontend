
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
  color: string;
  tasks: Task[];
}

export type ResponsibleOption = {
  id: string;
  name: string;
};

export const COLUMN_COLORS = {
  'ideias': '#7B61FF',   // Purple
  'a-fazer': '#FFCB1F',  // Yellow
  'fazendo': '#49AAFF',  // Blue
  'feito': '#55B938',    // Green
};
