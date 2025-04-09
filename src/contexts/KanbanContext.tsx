
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
  handleCreateTask: (taskData: Omit<Task, 'id' | 'status'>) => Promise<void>;
  moveTask: (taskId: string, sourceColumnId: ColumnType, targetColumnId: ColumnType) => void;
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
    });
  };

  const moveTask = (taskId: string, sourceColumnId: ColumnType, targetColumnId: ColumnType) => {
    // Find the task in the source column
    let sourceTask: Task | null = null;
    
    for (const column of columns) {
      if (column.id === sourceColumnId) {
        const task = column.tasks.find(t => t.id === taskId);
        if (task) {
          sourceTask = task;
          break;
        }
      }
    }
    
    if (!sourceTask) return;
    
    // Update task status
    const updatedTask = { ...sourceTask, status: targetColumnId };
    
    // Update columns state
    const newColumns = columns.map(col => {
      // Remove from source column
      if (col.id === sourceColumnId) {
        return {
          ...col,
          tasks: col.tasks.filter(t => t.id !== taskId)
        };
      }
      
      // Add to target column
      if (col.id === targetColumnId) {
        return {
          ...col,
          tasks: [...col.tasks, updatedTask]
        };
      }
      
      return col;
    });
    
    setColumns(newColumns);
    
    toast({
      title: "Tarefa movida",
      description: `A tarefa foi movida para ${columns.find(col => col.id === targetColumnId)?.title}.`,
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
        moveTask
      }}
    >
      {children}
    </KanbanContext.Provider>
  );
};

export const useKanban = (): KanbanContextType => {
  const context = useContext(KanbanContext);
  if (context === undefined) {
    throw new Error('useKanban must be used within a KanbanProvider');
  }
  return context;
};
