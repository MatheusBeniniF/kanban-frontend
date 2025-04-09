import React, { createContext, useState, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ColumnData, ColumnType, Task } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

// Initial column data
const initialColumns: ColumnData[] = [
  {
    id: 'ideias',
    title: 'Ideias',
    color: '#7B61FF',
    tasks: []
  },
  {
    id: 'a-fazer',
    title: 'A Fazer',
    color: '#FFCB1F',
    tasks: []
  },
  {
    id: 'fazendo',
    title: 'Fazendo',
    color: '#49AAFF',
    tasks: []
  },
  {
    id: 'feito',
    title: 'Feito',
    color: '#55B938',
    tasks: []
  }
];

interface KanbanContextType {
  columns: ColumnData[];
  activeId: string | null;
  isSubmitting: boolean;
  setActiveId: (id: string | null) => void;
  setColumns: React.Dispatch<React.SetStateAction<ColumnData[]>>;
  handleCreateTask: (taskData: Omit<Task, "id" | "status">) => Promise<void>;
  moveTask: (
    taskId: string,
    sourceColumnId: ColumnType,
    targetColumnId: ColumnType
  ) => void;
  reorderTask: (
    columnId: ColumnType,
    fromIndex: number,
    toIndex: number
  ) => void;
}

const KanbanContext = createContext<KanbanContextType | undefined>(undefined);

export const KanbanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [columns, setColumns] = useState<ColumnData[]>(initialColumns);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleCreateTask = async (taskData: Omit<Task, 'id' | 'status'>) => {
    setIsSubmitting(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newTask: Task = {
      ...taskData,
      id: uuidv4(),
      status: 'ideias' // New tasks always go to the "Ideias" column
    };
    
    // Add the new task to the "Ideias" column
    const newColumns = columns.map(column => {
      if (column.id === 'ideias') {
        return {
          ...column,
          tasks: [...column.tasks, newTask]
        };
      }
      return column;
    });
    
    setColumns(newColumns);
    setIsSubmitting(false);
    toast({
      title: "Tarefa criada",
      description: "Sua nova tarefa foi criada com sucesso!",
      duration: 3000
    });
  };

  const reorderTask = (
    columnId: ColumnType,
    fromIndex: number,
    toIndex: number
  ) => {
    setColumns((prevColumns) =>
      prevColumns.map((col) => {
        if (col.id !== columnId) return col;

        const updatedTasks = [...col.tasks];
        const [movedTask] = updatedTasks.splice(fromIndex, 1);
        updatedTasks.splice(toIndex, 0, movedTask);

        return {
          ...col,
          tasks: updatedTasks,
        };
      })
    );
  };

  const moveTask = (
    taskId: string,
    sourceColumnId: ColumnType,
    targetColumnId: ColumnType
  ) => {
    console.log(sourceColumnId, targetColumnId);
    if (sourceColumnId === targetColumnId) return; // Evita duplicação desnecessária
    const sourceColumn = columns.find((col) => col.id === sourceColumnId);
    const targetColumn = columns.find((col) => col.id === targetColumnId);
    if (!sourceColumn || !targetColumn) return;

    const taskToMove = sourceColumn.tasks.find((task) => task.id === taskId);
    if (!taskToMove) return;

    const updatedTask: Task = {
      ...taskToMove,
      status: targetColumnId,
    };

    const updatedColumns = columns.map((col) => {
      if (col.id === sourceColumnId) {
        return {
          ...col,
          tasks: col.tasks.filter((task) => task.id !== taskId),
        };
      }

      if (col.id === targetColumnId) {
        return {
          ...col,
          tasks: [...col.tasks, updatedTask],
        };
      }

      return col;
    });

    setColumns(updatedColumns);

    toast({
      title: "Tarefa movida",
      description: `A tarefa foi movida para "${targetColumn.title}".`,
      duration: 3000
    });
  };

  return (
    <KanbanContext.Provider
      value={{
        columns,
        setColumns,
        activeId,
        setActiveId,
        isSubmitting,
        handleCreateTask,
        moveTask,
        reorderTask,
      }}
    >
      {children}
    </KanbanContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useKanban = (): KanbanContextType => {
  const context = useContext(KanbanContext);
  if (context === undefined) {
    throw new Error('useKanban must be used within a KanbanProvider');
  }
  return context;
};
