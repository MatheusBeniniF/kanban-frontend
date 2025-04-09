
import { DragEndEvent, DragStartEvent, closestCorners } from '@dnd-kit/core';
import { useKanban } from '@/contexts/KanbanContext';
import { ColumnType } from '@/lib/types';

export const useKanbanDnd = () => {
  const { columns, setActiveId, moveTask } = useKanban();

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveId(null);
    
    if (!over) return;
    
    // Find over column id (could be a task card or column)
    let overColumnId: ColumnType | undefined;
    
    // Check if over.id is a column id
    if (columns.find(col => col.id === over.id)) {
      overColumnId = over.id as ColumnType;
    } else {
      // If over a task, find which column that task belongs to
      for (const column of columns) {
        if (column.tasks.find(task => task.id === over.id)) {
          overColumnId = column.id;
          break;
        }
      }
    }
    
    if (!overColumnId) return;
    
    // Get the task ID
    const taskId = active.id as string;
    
    // Find which column contains the task
    let sourceColumnId: ColumnType | null = null;
    
    for (const column of columns) {
      const task = column.tasks.find(t => t.id === taskId);
      if (task) {
        sourceColumnId = column.id;
        break;
      }
    }
    
    if (!sourceColumnId) return;
    
    // Skip if dropping in same column
    if (sourceColumnId === overColumnId) return;
    
    console.log(`Moving task ${taskId} from ${sourceColumnId} to ${overColumnId}`);
    
    // Move the task between columns
    moveTask(taskId, sourceColumnId, overColumnId);
  };

  return {
    handleDragStart,
    handleDragEnd,
    collisionDetection: closestCorners
  };
};
